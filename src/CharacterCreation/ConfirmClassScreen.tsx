import { CharacterClass, Proficiency, ChoosingOptions, JustUrl, Spellcasting, StartingEquipment, EquipmentEntrySimple, EqItem } from '../common/models/models';
import { Container, Content, Card, CardItem, Text, View, List, ListItem, Body } from 'native-base';
import EquipmentOptionsSwitcher from './StartingEquipmentByClass/EquipmentOptionsSwitcher';
import mapForAccordionSake from '../common/functions/mapForAccordionSake';
import LoadingContainer from '../common/components/LoadingContainer';
import getArrayOfNames from '../common/functions/getArrayOfNames';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../common/components/ScreenHeader';
import { ApiConfig } from '../common/constants/ApiConfig';
import { Picker } from '@react-native-community/picker';
import apiWrapper from '../common/functions/apiWrapper';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { applySnapshot, takeSnapshot } from '../redux/snapshot';
import { setLoading } from '../redux/loading';
import { StoreProps } from '../redux/store';
import Section from './Section';
import _ from 'lodash'
import { addProficiencies } from '../redux/proficiencies';
import { addItems } from '../redux/items';
import filterList from '../common/functions/filterList';

export default function ConfirmClassScreen({ navigation, route }: any) {
  const [startingEquipment, setStartingEquipment] = useState<StartingEquipment>();
  const [chosenProficiencies, setChosenProficiencies] = useState<Chooser>({});
  const [spellcasting, setSpellcasting] = useState<Spellcasting>();
  const [classData, setClassData] = useState<CharacterClass>();
  const [ready, setReady] = useState<boolean>(false);

  const classId = route.params.class

  const proficiencies = useSelector((store: StoreProps) => store.proficiencies)
  const snapshot = useSelector((store: StoreProps) => store.snapshot);
  const className = useSelector((store: StoreProps) => store.class);
  const hitDie = useSelector((store: StoreProps) => store.hitDie);
  const store = useSelector((store: StoreProps) => store);

  const filteredProficiencies = filterProficiencies(proficiencies);
  const mappedProficiencies = mapForAccordionSake(filteredProficiencies);

  const dispatch = useDispatch();
  const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
  const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
  const dispatchItems = (items: Array<EqItem>) => dispatch(addItems(items));
  const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
  const dispatchProficiencies = (proficiencies: Array<Proficiency>) => dispatch(addProficiencies(proficiencies));

  async function getChosenProficiencies() {
    const values = Object.values(chosenProficiencies);
    let arr = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== 'choose') {
        const data = await apiWrapper(ApiConfig.proficiency(values[i]));
        arr.push(await data)
      }
    }

    dispatchProficiencies(arr);
  }

  async function getItemsData() {
    let arr = [];
    for (let i = 0; i < startingEquipment?.starting_equipment.length; i++) {
      const entry = startingEquipment?.starting_equipment[i];

      const data = await apiWrapper(ApiConfig.item(entry?.equipment.index as string));
      arr.push(await data);
    }

    dispatchItems(arr);
  }

  function goNext() {
    dispatchTakeSnapshot();

    getItemsData();
    getChosenProficiencies();
  }

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
            setOfChoices.from.filter(item => filterList(item.index, chosenProficiencies, key)).map((item: JustUrl) =>
              <Picker.Item label={item.name} value={item.index as string} />
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

    return () => navigation.removeListener('beforeRemove')
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

            obj = {
              ...obj,
              [key as string]: 'choose'
            }
          }
        }

        setChosenProficiencies(obj);

        getStartingEquipment(classData.index)
          .then((equipmentData: StartingEquipment) => setStartingEquipment(equipmentData))

        getSpellcasting(classData)
          .then((spellcastingData: any) => setSpellcasting(spellcastingData))
      })
      .then(() => setReady(true));
  }, []);

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
            <>
              {
                startingEquipment.starting_equipment &&
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
                              <ListItem key={index}>
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
              <Card>
                <CardItem>
                  <Text style={{ fontSize: 20, marginVertical: 15, marginLeft: 8 }}>
                    Choose starting equipment
                  </Text>
                </CardItem>
                <EquipmentOptionsSwitcher className={classId} onNextPress={goNext} navigation={navigation}/>
              </Card>
            </>
          }
        </LoadingContainer>
      </Content>
    </Container>

  )
}

interface Chooser {
  [key: string]: string
}