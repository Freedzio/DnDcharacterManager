import { CharacterClass, Proficiency, ChoosingOptions, JustUrl, Spellcasting, StartingEquipment, EquipmentEntrySimple, EqItem, Features, Feature } from '../common/models/models';
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
import { addFeatures } from '../redux/features';
import reactotron from '../../ReactotronConfig';

export default function ConfirmClassScreen({ navigation, route }: any) {
  const [startingEquipment, setStartingEquipment] = useState<StartingEquipment>({} as StartingEquipment);
  const [chosenProficiencies, setChosenProficiencies] = useState<Chooser>({});
  const [featureData, setFeatureData] = useState<Features>({} as Features);
  const [chosenFeatures, setChosenFeatures] = useState<Chooser>({});
  const [spellcasting, setSpellcasting] = useState<Spellcasting>();
  const [classData, setClassData] = useState<CharacterClass>();
  const [ready, setReady] = useState<boolean>(false);
  const [featuresToChooseFrom, setFeaturesToChooseFrom] = useState<Array<Feature>>([]);

  reactotron.log(featuresToChooseFrom)

  const classId = route.params.class

  const proficiencies = useSelector((store: StoreProps) => store.proficiencies)
  const snapshot = useSelector((store: StoreProps) => store.snapshot);
  const features = useSelector((store: StoreProps) => store.features);
  const className = useSelector((store: StoreProps) => Object.keys(store.classes)[0]);
  const store = useSelector((store: StoreProps) => store);

  const filteredProficiencies = filterProficiencies(proficiencies);
  const mappedProficiencies = mapForAccordionSake(filteredProficiencies);

  const dispatch = useDispatch();
  const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
  const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
  const dispatchItems = (items: Array<EqItem>) => dispatch(addItems(items));
  const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
  const dispatchFeatures = (features: Array<Feature>) => dispatch(addFeatures(features))
  const dispatchProficiencies = (proficiencies: Array<Proficiency>) => dispatch(addProficiencies(proficiencies));

  async function getChosenData(chosenData: Chooser, baseUrl: string, dispatcher: (data: any) => void) {
    const values = Object.values(chosenData);
    let arr = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== 'choose') {
        const data = await apiWrapper(`${baseUrl}/${values[i]}`);
        arr.push(await data)
      }
    }

    dispatcher(arr);
  };

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
    getChosenData(chosenProficiencies, ApiConfig.proficiencies, dispatchProficiencies);
    getChosenData(chosenFeatures, ApiConfig.features, dispatchFeatures);
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

  async function onChooserChange(key: string, value: string, chooserObject: Chooser, setter: (v: any) => void) {
    const obj = {
      ...chooserObject,
      [key]: value
    }

    setter(obj)
  }

  function renderPickersForSegment(setOfChoices: ChoosingOptions, index1: number, chooserObject: Chooser, setter: (v: any) => void, title: string) {
    const howMany = setOfChoices.choose;

    let arr = [];

    for (let index2 = 0; index2 < howMany; index2++) {
      const key = index1.toString() + index2.toString();

      arr.push(
        <Picker
          style={{ width: 360 }}
          selectedValue={chooserObject[key]}
          onValueChange={v => onChooserChange(key, v as string, chooserObject, setter)}>
          <Picker.Item value='chose' label='--Choose--' />
          {
            setOfChoices.from.filter(item => filterList(item.index, chooserObject, key)).map((item: JustUrl) =>
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
                {title}
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
  };

  function mapFeaturesDescription(features: { [index: string]: Feature }) {
    let arr: Array<{ title: string, content: string }> = [];

    const keys = Object.keys(features);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const obj = {
        title: features[key].name,
        content: features[key].desc.join(' ')
      }

      arr.push(obj);
    }

    return arr;
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
          .then((spellcastingData: any) => setSpellcasting(spellcastingData));

        apiWrapper(ApiConfig.levelFeaturesByClass(classId, 1))
          .then((data: Features) => {
            setFeatureData(data);
            if (data.feature_choices.length > 0) {
              getChoosingFeatureData(data.feature_choices)
            }
          }).then(() => setChosenFeatures(obj));
      })
      .then(() => setReady(true));
  }, []);

  async function getChoosingFeatureData(featureChoices: Array<JustUrl>) {
    let obj = {};
    let arr = [];

    for (let i = 0; i < featureChoices.length; i++) {
      const data: Feature = await apiWrapper(ApiConfig.feature(featureChoices[i].index as string))
      arr.push(data);

      const howMany = data.choice.choose;

      for (let j = 0; j < howMany; j++) {
        const a = i.toString();
        const b = j.toString();
        const key = a + b;
        obj = {
          ...obj,
          [key as string]: 'choose'
        }
      }
    }
    setFeaturesToChooseFrom(arr)
    setChosenFeatures(obj)
  }

  return (
    <Container>
      <Content>
        <LoadingContainer ready={ready}>
          <ScreenHeader title='YOU CHOSE' subtitle={className} />
          <Section
            title={`Hit die: d${classData?.hit_die}`}
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
              renderPickersForSegment(setOfChoices, index1, chosenProficiencies, setChosenProficiencies, 'Choose class proficiencies')
            )}
          <Section title='Class features' listedData={mapFeaturesDescription(features)} />
          {
            featuresToChooseFrom.length > 0 && featureData.feature_choices?.map((choice: JustUrl, index: number) =>
              renderPickersForSegment(featuresToChooseFrom.filter(item => item.index === choice.index)[0].choice, index, chosenFeatures, setChosenFeatures, 'Choose class features')
            )
          }
          {
            spellcasting &&
            <Section title='Spellcasting' listedData={mapDescription(spellcasting.info)} />
          }
          {
            startingEquipment &&
            <>
              {
                startingEquipment.starting_equipment?.length > 0 &&
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
                <EquipmentOptionsSwitcher className={classId} onNextPress={goNext} navigation={navigation} />
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