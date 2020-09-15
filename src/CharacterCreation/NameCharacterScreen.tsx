import { Container, Content, Input, Button, Text } from 'native-base';
import ScreenHeader from '../common/components/ScreenHeader';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { applySnapshot } from '../redux/snapshot';
import { setLoading } from '../redux/loading';
import { resetStore, StoreProps } from '../redux/store';
import uuid from 'react-native-uuid';
import { addSkills } from '../redux/skills';
import _ from 'lodash'
import { addName } from '../redux/name';
import AsyncStorage from '@react-native-community/async-storage';
import { HOME_SCREEN } from '../common/constants/routeNames';

export default function NameCharacterScreen({ navigation }: any) {
  const [name, setName] = useState<string>('');

  const snapshot = useSelector((store: StoreProps) => store.snapshot);
  const store = useSelector((store: StoreProps) => store);
  const proficiencies = useSelector((store: StoreProps) => store.proficiencies);
  const features = useSelector((store: StoreProps) => store.features);

  const dispatch = useDispatch();
  const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
  const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
  const dispatchName = (name: string) => dispatch(addName(name));
  
  const dispatchSkills = (skills: Array<string>) => dispatch(addSkills(skills));
  const dispatchExpertise = (expertise: Array<string>) => dispatch(addSkills(expertise));
  const dispatchResetStore = () => dispatch(resetStore());

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      dispatchLoading(false);
      dispatchSnapshot();
    })

    return () => navigation.removeListener('beforeRemove')
  }, []);

  function filterProficiencies(criteria: string) {
    const proficienciesKeys = Object.keys(proficiencies).concat(Object.keys(features));
    const filtered = proficienciesKeys.filter(item => item.includes(criteria));

    let tempArr = [];

    for (let i = 0; i < filtered.length; i++) {
      let splitted = filtered[i].split('-')
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
    const id = uuid.v4();

    dispatchName(name);

    const skills = filterProficiencies('skill');
    const expertises = filterProficiencies('expertise');
    const filteredProficiencies = filterOutSkills(proficiencies);
    const filteredFeatures = filterOutSkills(features);

    let obj = {
      name: name,
      class: store.classes,
      race: store.race,
      abilityScores: store.abilityScores,
      basicInfo: store.basicInfo,
      languages: store.languages,
      traits: store.traits,
      features: filteredFeatures,
      skills: skills,
      expertises: expertises,
      proficiencies: filteredProficiencies,
      items: store.items
    };

    await AsyncStorage.setItem(`${id}_${name}`, JSON.stringify(obj));


    navigation.push(HOME_SCREEN);
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title='FINALLY' subtitle='name your character' />
        <Input value={name} onChangeText={setName} style={{ marginVertical: 40, borderColor: 'lightgray', borderWidth: 1 }} />
        <Button block onPress={onFinish}>
          <Text>Finish</Text>
        </Button>
      </Content>
    </Container>
  )
}