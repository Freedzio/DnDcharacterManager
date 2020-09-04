import React, { useEffect, useState } from 'react';
import DummyView from '../common/components/DummyView';
import { useDispatch, useSelector } from 'react-redux';
import { applySnapshot } from '../redux/snapshot';
import store, { StoreProps } from '../redux/store';
import { Container, Content, Row, Card, CardItem, Text, View, List, ListItem, Body, Col, Button } from 'native-base';
import ScreenHeader from '../common/components/ScreenHeader';
import { CharacterClass, Proficiency, ChoosingOptions, JustUrl, Spellcasting, StartingEquipment, EquipmentEntrySimple, ChooseEquipmentOptions, ChooseEquipmentFromList, ChooseFromCategory } from '../common/models/models';
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
import { Dimensions } from 'react-native';
import reactotron from 'reactotron-react-native';

const dimensions = Dimensions.get('screen');

export default function ConfirmClassScreen({ navigation, route }: any) {
  const [chosenProficiencies, setChosenProficiencies] = useState<Chooser>({})
  const [classData, setClassData] = useState<CharacterClass>();
  const [ready, setReady] = useState<boolean>(false);
  const [spellcasting, setSpellcasting] = useState<Spellcasting>();
  const [startingEquipment, setStartingEquipment] = useState<StartingEquipment>();
  const [chosenEquipment, setChosenEquipment] = useState<Array<Array<EquipmentChooser> & string>>()

  const classId = route.params.class

  const proficiencies = useSelector((store: StoreProps) => store.proficiencies)
  const snapshot = useSelector((store: StoreProps) => store.snapshot);
  const className = useSelector((store: StoreProps) => store.class);
  const hitDie = useSelector((store: StoreProps) => store.hitDie);

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
            setStartingEquipment(equipmentData);

            let rootArr = [];
            for (let x = 0; x < equipmentData.starting_equipment_options.length; x++) {
              const set = equipmentData.starting_equipment_options[x];

              if (_.isArray(set.from)) {
                let arr = []
                for (let y = 0; y < set.from.length; y++) {
                  const entry = set.from[y];

                  if (entry.equipment) {
                    arr.push({
                      value: entry.equipment.name,
                      chosen: false
                    })
                  } else if (_.isArray(entry)) {
                    let nameArr = [];
                    for (let z = 0; z < entry.length; z++) {
                      if (entry[z].equipment) {
                        nameArr.push(`${entry[z].quantity}x ${entry[z].equipment.name}`)
                      } else nameArr.push('choose')
                    }
                    arr.push({
                      value: nameArr,
                      chosen: false
                    })

                  } else {
                    const howMany = entry.equipment_option.choose;

                    let subArr = [];

                    for (let z = 0; z < howMany; z++) {
                      subArr.push('choose')
                    };

                    arr.push({
                      value: subArr,
                      chosen: false
                    })
                  }
                }
                rootArr.push(arr)
              } else rootArr.push('choose')

            }
            setChosenEquipment(rootArr as Array<Array<EquipmentChooser> & string>)
          })

        getSpellcasting(classData)
          .then((spellcastingData: any) => setSpellcasting(spellcastingData))
      })
      .then(() => setReady(true))
  }, []);

  function onEquipmentPress(rowIndex: number, choiceIndex: number) {
    let newArr = _.cloneDeep(chosenEquipment);

    newArr[rowIndex][choiceIndex].chosen = true;
    newArr[rowIndex][choiceIndex === 1 ? 0 : 1].chosen = false;

    setChosenEquipment(newArr)
  }


  function renderRowOfEquipmentOptions(eqOptions: Array<EquipmentEntrySimple & ChooseEquipmentFromList> & ChooseFromCategory, index: number) {
    let arr = [];
    if (_.isArray(eqOptions)) {
      for (let i = 0; i < eqOptions.length; i++) {
        const entry = eqOptions[i]

        if (entry.equipment) {
          arr.push(
            <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
              <Button bordered={!chosenEquipment[index][i].chosen} onPress={() => onEquipmentPress(index, i)}>
                <Text style={{ textAlign: "center" }}>{`${entry.quantity}x ${entry.equipment.name}`}</Text>
              </Button>
            </View>
          )
        } else if (_.isArray(entry)) {
          let nameArr = [];
          let picker;
          for (let x = 0; x < entry.length; x++) {
            if (entry[x].equipment) {

              nameArr.push(`${entry[x].quantity}x ${entry[x].equipment.name}`)
            } else {
              nameArr.push('Choose from the list');

              picker = <View>
                {
                  chosenEquipment[index][i].chosen &&
                  <Picker selectedValue={chosenEquipment[index][i].value[x]}>
                    <Picker.Item label='1' value='chosdfose' />
                    <Picker.Item label='2' value='2' />
                    <Picker.Item label='3' value='choose' />
                  </Picker>
                }
              </View>
            }
          }
          console.log(chosenEquipment[index][i].value)

          arr.push(
            <>
              <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
                <Button bordered={!chosenEquipment[index][i].chosen} onPress={() => onEquipmentPress(index, i)}>
                  <Text style={{ textAlign: "center" }}>{nameArr.join(', ')}</Text>
                </Button>
              </View>          

                {picker}

            </>
          )

        } else {
          const howMany = entry.equipment_option.choose;

          let pickers = [];

          for (let j = 0; j < howMany; j++) {
            pickers.push(
              <Picker style={{ width: 360 }}>
                <Picker.Item label='yadayada' value='' />
              </Picker>
            )
          }

          arr.push(<>
            <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
              <Button bordered={!chosenEquipment[index][i].chosen} onPress={() => onEquipmentPress(index, i)}>
                <Text style={{ textAlign: "center" }}>Choose from list</Text>
              </Button>
            </View>
            {
              chosenEquipment[index][i].chosen &&
              <View style={{ paddingLeft: 30 }}>
                {pickers}
              </View>
            }
          </>
          )
        }

        if (i !== eqOptions.length - 1) arr.push(
          <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>OR</Text>
          </View>
        )
      }
    } else {
      arr.push(
        <>
          <View>
            <Text>Choose from list</Text>
            <Picker style={{ width: 360 }}>
              <Picker.Item label='sdfsdf' value='' />
            </Picker>
          </View>
        </>
      )
    }

    return arr
  }

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
              <Card>
                <CardItem>
                  <Text style={{ fontSize: 20, marginVertical: 15, marginLeft: 8 }}>
                    Choose starting equipment
                  </Text>
                </CardItem>
                {
                  startingEquipment.starting_equipment_options.map((choice: ChooseEquipmentOptions, index: number) =>

                    <View style={{ width: dimensions.width, marginVertical: 10 }}>

                      {chosenEquipment && renderRowOfEquipmentOptions(choice.from, index)}
                    </View>

                  )
                }
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

interface EquipmentChooser {
  value: string & Array<string>,
  chosen: boolean
}