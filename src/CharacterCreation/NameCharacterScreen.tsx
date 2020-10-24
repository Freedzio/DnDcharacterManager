import { Container, Content, Input, Button, Text } from 'native-base';
import ScreenHeader from '../common/components/ScreenHeader';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { applySnapshot } from '../redux/snapshot';
import { setLoading } from '../redux/loading';
import { resetStore, StoreProps } from '../redux/store';
import uuid from 'react-native-uuid';
import _ from 'lodash'
import { addName } from '../redux/name';
import AsyncStorage from '@react-native-community/async-storage';
import { HOME_SCREEN } from '../common/constants/routeNames';
import getAbilityModifier from '../common/functions/getAbilityModifier';
import { mapArrayToObject } from '../common/functions/mapArrayToObject';
import LoadingContainer from '../common/components/LoadingContainer';
import { FinalItem } from '../common/models/models';

export default function NameCharacterScreen({ navigation }: any) {
  const items: FinalItem[] = require('../database/Equipment.json');

  const [name, setName] = useState<string>('');

  const snapshot = useSelector((store: StoreProps) => store.snapshot);
  const store = useSelector((store: StoreProps) => store);
  const proficiencies = useSelector((store: StoreProps) => store.proficiencies);
  const features = useSelector((store: StoreProps) => store.features);
  const traits = useSelector((store: StoreProps) => store.traits);
  const loading = useSelector((store: StoreProps) => store.loading)

  const dispatch = useDispatch();
  const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
  const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
  const dispatchName = (name: string) => dispatch(addName(name));
  const dispatchResetStore = () => dispatch(resetStore());

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      dispatchLoading(false);
      dispatchSnapshot();
    })

    return () => navigation.removeListener('beforeRemove')
  }, []);

  useEffect(() => {
    dispatchLoading(false);
  }, [])

  function filterProficiencies(criteria: string) {
    const proficienciesKeys = Object.keys(proficiencies).concat(Object.keys(features)).concat(Object.keys(traits));
    const filtered = proficienciesKeys.filter(item => item.includes(criteria));

    let tempArr = [];

    for (let i = 0; i < filtered.length; i++) {
      let splitted = filtered[i].split(`${criteria}-`)
      tempArr.push(splitted[splitted.length - 1])
    }

    return tempArr
  }

  function filterOutSkills(data: any) {
    let clone = _.cloneDeep(data);
    let temp = {};

    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
      if (!keys[i].includes('skill') && !keys[i].includes('expertise')) {
        temp = {
          ...temp,
          [keys[i]]: clone[keys[i]]
        }
      }
    }

    return temp
  }

  async function onFinish() {
    dispatchLoading(true);

    const id = uuid.v4();

    dispatchName(name);

    const skills = filterProficiencies('skill');
    const expertises = filterProficiencies('expertise');
    const filteredProficiencies = filterOutSkills(proficiencies);
    const filteredFeatures = filterOutSkills(features);
    const filteredTraits = filterOutSkills(traits)
    const CON = getAbilityModifier(store.abilityScores['CON'].score);

    let packContents: any = [];
    const pack = Object.keys(store.items).filter(item => item.includes('pack'));

    let newItems = {}

    const tempItems = {
      ...store.items
    }

    if (pack.length > 0) {
      delete tempItems[pack[0]]

      packContents = store.items[pack[0]].contents;

      let arr = [];

      for (let i = 0; i < packContents.length; i++) {
        const item = items.filter(item => item.index === packContents[i].item_url.replace('/api/equipment/', ''))[0]

        arr.push(item)
      }

      newItems = mapArrayToObject(arr)
    }

    const storageID = `${id}_${name}`

    let obj = {
      id: storageID,
      name: name,
      classes: store.classes,
      subclasses: {},
      race: store.race,
      subrace: store.subrace,
      hitDies: store.hitDies,
      abilityScores: store.abilityScores,
      basicInfo: store.basicInfo,
      languages: store.languages,
      traits: filteredTraits,
      features: filteredFeatures,
      skills: skills,
      expertises: expertises,
      proficiencies: filteredProficiencies,
      equipped: [],
      items: {
        ...tempItems,
        ...newItems
      },
      money: {
        'cp': 0,
        'sp': 0,
        'ep': 0,
        'gp': 0,
        'pp': 0
      },
      spells: {},
      spellcasting: store.spellcasting,
      classSpecifics: store.classSpecifics,
      maxHP: store.maxHP + (CON < 0 ? 0 : CON)
    };

    await AsyncStorage.setItem(storageID, JSON.stringify(obj));

    dispatchResetStore();

    navigation.push(HOME_SCREEN);
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title='FINALLY' subtitle='name your character' />
        <LoadingContainer ready={!loading}>

          <Input value={name} onChangeText={setName} style={{ marginVertical: 40, borderColor: 'lightgray', borderWidth: 1 }} />
          <Button block onPress={onFinish}>
            <Text>Finish</Text>
          </Button>
        </LoadingContainer>
      </Content>
    </Container>
  )
}