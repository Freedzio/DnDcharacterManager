import { CharacterClass, Proficiency, ChoosingOptions, JustUrl, Spellcasting, StartingEquipment, EquipmentEntrySimple, EqItem, Feature, Weapon, AdventuringGear, Armor, LevelFeatures, SpellcastingByLevel, FinalItem } from '../common/models/models';
import { Container, Content, Card, CardItem, Text, View, List, ListItem, Body } from 'native-base';
import EquipmentOptionsSwitcher from './StartingEquipmentByClass/EquipmentOptionsSwitcher';
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
import { setSpellcastingData } from '../redux/spellcasting';
import reactotron from 'reactotron-react-native';

export default function ConfirmClassScreen({ navigation, route }: any) {
  const classes: CharacterClass[] = require('../database/Classes.json');
  const startingEq: StartingEquipment[] = require('../database/StartingEquipment.json');
  const spellcastingJSON: Spellcasting[] = require('../database/Spellcasting.json');
  const levels: LevelFeatures[] = require('../database/Levels.json');
  const featuresJSON: Feature[] = require('../database/Features.json');
  const itemsJSON: FinalItem[] = require('../database/Equipment.json');
  const proficienciesJSON: Proficiency[] = require('../database/Proficiencies.json')

  const [startingEquipment, setStartingEquipment] = useState<StartingEquipment>({} as StartingEquipment);
  const [chosenProficiencies, setChosenProficiencies] = useState<Chooser>({});
  const [featureData, setFeatureData] = useState<LevelFeatures>({} as LevelFeatures);
  const [chosenFeatures, setChosenFeatures] = useState<Chooser>({});
  const [spellcasting, setSpellcasting] = useState<Spellcasting>();
  const [classData, setClassData] = useState<CharacterClass>();
  const [featuresToChooseFrom, setFeaturesToChooseFrom] = useState<Array<Feature>>([]);
  const [chosenListItem, setChosenListItem] = useState<string>('');

  const classId = route.params.class

  const proficiencies = useSelector((store: StoreProps) => store.proficiencies)
  const snapshot = useSelector((store: StoreProps) => store.snapshot);
  const features = useSelector((store: StoreProps) => store.features);
  const className = useSelector((store: StoreProps) => Object.keys(store.classes)[0]);
  const store = useSelector((store: StoreProps) => store);

  const filteredProficiencies = filterProficiencies(proficiencies);

  const dispatch = useDispatch();
  const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
  const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
  const dispatchItems = (items: Array<FinalItem>) => dispatch(addItems(items));
  const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
  const dispatchFeatures = (features: Array<Feature>) => dispatch(addFeatures(features))
  const dispatchProficiencies = (proficiencies: Array<Proficiency>) => dispatch(addProficiencies(proficiencies));
  const dispatchSpellcastingData = (data: Partial<SpellcastingByLevel>) => dispatch(setSpellcastingData({ classId: className.toLowerCase(), spellcasting: data }));

  function getChosenData(chosenData: Chooser, traitOrProficiency: 'feature' | 'proficiency', dispatcher: (data: any) => void) {
    const values = Object.values(chosenData);
    let arr = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== 'choose') {
        let data;
        if (traitOrProficiency === 'feature') {
          data = featuresJSON.filter(item => item.index === values[i])[0];
        } else {
          data = proficienciesJSON.filter(item => item.index === values[i])[0];
        }
        arr.push(data)
      }
    }

    dispatcher(arr);
  };

  function getItemsData() {
    let arr = [];
    for (let i = 0; i < startingEquipment?.starting_equipment.length; i++) {
      const entry = startingEquipment?.starting_equipment[i];

      const data = itemsJSON.filter(item => item.index === entry?.equipment.index)[0];
      arr.push(data);
    }

    dispatchItems(arr);
  }

  function goNext() {
    dispatchTakeSnapshot();

    getItemsData();
    getChosenData(chosenProficiencies, 'proficiency', dispatchProficiencies);
    getChosenData(chosenFeatures, 'feature', dispatchFeatures);
  }

  function filterProficiencies(proficiencies: { [key: string]: Proficiency }) {
    const keys = Object.keys(proficiencies);

    let temp: { [key: string]: Proficiency } = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const item = proficiencies[key]

      if (item.classes) {
        if (getArrayOfNames(item.classes).includes(className)) {
          temp = {
            ...temp,
            [key]: item
          }
        }
      }
    }
    return temp
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

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      dispatchLoading(false);
      dispatchSnapshot();
    })

    return () => navigation.removeListener('beforeRemove')
  }, []);

  useEffect(() => {
    const tempClassData = classes.filter(item => item.index === classId)[0]

    setClassData(tempClassData);

    let obj = {};
    for (let i = 0; i < tempClassData.proficiency_choices.length; i++) {
      for (let j = 0; j < tempClassData.proficiency_choices[i].choose; j++) {
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

    setStartingEquipment(startingEq.filter(item => item.class.index === classId)[0]);

    if (tempClassData.spellcasting) {
      const spellcastingData = spellcastingJSON.filter(item => item.index === classId)[0];
      setSpellcasting(spellcastingData);
      dispatchSpellcastingData({ spellcasting_ability: spellcastingData.spellcasting_ability.name });
    }

    const tempFeatureData = levels.filter(item => item.index === `${classId}-1`)[0]

    setFeatureData(tempFeatureData);
    if (tempFeatureData.spellcasting) dispatchSpellcastingData({ spells_known: tempFeatureData.spellcasting?.spells_known })

    if (tempFeatureData.feature_choices.length > 0) {
      getChoosingFeatureData(tempFeatureData.feature_choices)
    }

  }, []);

  function getChoosingFeatureData(featureChoices: Array<JustUrl>) {
    let obj = {};
    let arr = [];

    for (let i = 0; i < featureChoices.length; i++) {
      const data: Feature = featuresJSON.filter(item => item.index === featureChoices[i].index)[0]
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
        <ScreenHeader title='YOU CHOSE' subtitle={className} />
        <Section
          title={`Hit die: d${classData?.hit_die}`}
        />
        <Section
          title='Saving throws'
          description={`Add your proficiency bonus on ${classData?.saving_throws.map(item => item.name).join(', ')} saving throws`} />
        <Section
          title='Class proficiencies'
          listedData={filteredProficiencies}
          chosenListItem={chosenListItem}
          listItemCallback={setChosenListItem}
        />
        {
          classData && classData.proficiency_choices.map((setOfChoices: ChoosingOptions, index1: number) =>
            renderPickersForSegment(setOfChoices, index1, chosenProficiencies, setChosenProficiencies, 'Choose class proficiencies')
          )}
        <Section title='Class features'
          listedData={features}
          chosenListItem={chosenListItem}
          listItemCallback={setChosenListItem}
        />
        {
          featuresToChooseFrom.length > 0 && featureData.feature_choices?.map((choice: JustUrl, index: number) =>
            renderPickersForSegment(featuresToChooseFrom.filter(item => item.index === choice.index)[0].choice, index, chosenFeatures, setChosenFeatures, 'Choose class features')
          )
        }
        {
          spellcasting &&
          <Section
            title='Spellcasting'
            spellcastingData={spellcasting.info}
            chosenListItem={chosenListItem}
            listItemCallback={setChosenListItem}
          />
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
      </Content>
    </Container>

  )
}

interface Chooser {
  [key: string]: string
}