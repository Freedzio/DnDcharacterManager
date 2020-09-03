import React, { useEffect, useState } from 'react';
import DummyView from '../common/components/DummyView';
import { useDispatch, useSelector } from 'react-redux';
import { applySnapshot } from '../redux/snapshot';
import store, { StoreProps } from '../redux/store';
import { Container, Content, Row, Card, CardItem, Text, View, List, ListItem, Body } from 'native-base';
import ScreenHeader from '../common/components/ScreenHeader';
import { CharacterClass, Proficiency, ChoosingOptions, JustUrl, Spellcasting, StartingEquipment, EquipmentEntrySimple } from '../common/models/models';
import apiWrapper from '../common/functions/apiWrapper';
import { ApiConfig } from '../common/constants/ApiConfig';
import LoadingContainer from '../common/components/LoadingContainer';
import Section from './Section';
import mapForAccordionSake from '../common/functions/mapForAccordionSake';
import getArrayOfNames from '../common/functions/getArrayOfNames';
import { Picker } from '@react-native-community/picker';
import _ from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context';
import { setLoading } from '../redux/loading';

export default function ConfirmClassScreen({ navigation, route }: any) {
  const [chosenProficiencies, setChosenProficiencies] = useState<Chooser>({})
  const [classData, setClassData] = useState<CharacterClass>();
  const [ready, setReady] = useState<boolean>(false);
  const [spellcasting, setSpellcasting] = useState<Spellcasting>();
  const [startingEquipment, setStartingEquipment] = useState<StartingEquipment>();
  const [chosenEquipment, setChosenEquipment] = useState()

  const classId = route.params.class

  const proficiencies = useSelector((store: StoreProps) => store.proficiencies)
  const snapshot = useSelector((store: StoreProps) => store.snapshot);
  const className = useSelector((store: StoreProps) => store.class);
  const hitDie = useSelector((store: StoreProps) => store.hitDie);

  console.log(chosenProficiencies)

  const filteredProficiencies = filterProficiencies(proficiencies);
  const mappedProficiencies = mapForAccordionSake(filteredProficiencies);

  const dispatch = useDispatch();
  const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
  const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading))

  function filterProficiencies(proficiencies: { [key: string]: Proficiency }) {
    const keys = Object.keys(proficiencies);

    let temp: { [key: string]: Proficiency } = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const item = proficiencies[key]

      if (getArrayOfNames(item.classes).includes(className)) {
        temp = {
          ...temp,
          [key]: item
        }
      }
    }
    return temp
  }

  async function getClassData(id: string) {
    return await apiWrapper(ApiConfig.class(id));
  }

  async function getSpellcasting(data: CharacterClass) {
    if (!data.spellcasting) return;
    return await apiWrapper(ApiConfig.spellcastingClass(data.index))
  }

  async function getStartingEquipment(id: string) {
    return await apiWrapper(ApiConfig.startingEquipment(id))
  }

  async function onProficienciesChange(key: string, value: string) {
    const obj = {
      ...chosenProficiencies,
      [key]: value
    }

    setChosenProficiencies(obj)
  }

  function renderPickersForSegment(setOfChoices: ChoosingOptions, index1: number) {
    const howMany = setOfChoices.choose;

    let arr = [];

    for (let index2 = 0; index2 < howMany; index2++) {
      const key = index1.toString() + index2.toString();

      arr.push(
        <Picker
          style={{ width: 360 }}
          selectedValue={chosenProficiencies[key]}
          onValueChange={v => onProficienciesChange(key, v as string)}>
          <Picker.Item value='chose' label='--Choose proficiency--' />
          {
            setOfChoices.from.map((item: JustUrl) =>
              <Picker.Item label={item.name} value={item.name} />
            )
          }
        </Picker>
      )
    }

    return (
      <Card>
        <CardItem>
          <View>
            <View>
              <Text>
                Choose class proficiencies
              </Text>
            </View>
            <SafeAreaView>
              {arr}
            </SafeAreaView>
          </View>
        </CardItem>
      </Card>
    )
  }

  function mapDescription(arr: Array<{ name: string, desc: Array<string> }>) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      newArr.push({
        title: arr[i].name,
        content: arr[i].desc.join(' ')
      })
    }
    return newArr
  }

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      dispatchLoading(false);
      dispatchSnapshot();
    })
  }, []);

  useEffect(() => {

    getClassData(classId)
      .then((classData: CharacterClass) => {
        setClassData(classData);

        let obj = {};
        for (let i = 0; i < classData.proficiency_choices.length; i++) {
          for (let j = 0; j < classData.proficiency_choices[i].choose; j++) {
            const a = i.toString();
            const b = j.toString();
            const key = a + b;
            console.log(key)
            obj = {
              ...obj,
              [key as string]: 'choose'
            }
          }
        }

        setChosenProficiencies(obj);

        getStartingEquipment(classData.index)
          .then((equipmentData: StartingEquipment) => {
            setStartingEquipment(equipmentData)


          })

        getSpellcasting(classData)
          .then((spellcastingData: any) => setSpellcasting(spellcastingData))
      })
      .then(() => setReady(true))


  }, [])

  return (
    <Container>
      <Content>
        <LoadingContainer ready={ready}>
          <ScreenHeader title='YOU CHOSE' subtitle={className} />
          <Section
            title={`Hit die: d${hitDie}`}
          />
          <Section
            title='Saving throws'
            description={`Add your proficiency bonus on ${classData?.saving_throws.map(item => item.name).join(', ')} saving throws`} />
          <Section
            title='Class proficiencies'
            listedData={mappedProficiencies}
          />
          {
            classData && classData.proficiency_choices.map((setOfChoices: ChoosingOptions, index1: number) =>
              renderPickersForSegment(setOfChoices, index1)
            )}
          {
            spellcasting &&
            <Section title='Spellcasting' listedData={mapDescription(spellcasting.info)} />
          }
          {
            startingEquipment &&
            <Card>
              <CardItem>
                <Body>

                  <View>
                    <Text>Starting equipment</Text>
                  </View>
                  <View>
                    <List>
                      {
                        startingEquipment.starting_equipment.map((eq: EquipmentEntrySimple, index: number) =>
                          <ListItem>
                            <Text>{eq.equipment.name} - {eq.quantity}</Text>
                          </ListItem>
                        )
                      }
                    </List>
                  </View>
                </Body>
              </CardItem>
            </Card>
          }


        </LoadingContainer>
      </Content>
    </Container>

  )
}

interface Chooser {
  [key: string]: string
}