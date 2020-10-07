import React, { useState, useEffect } from 'react'
import { JustUrl, EqItem, FinalItem } from '../../common/models/models';
import { View } from 'native-base';
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import EqPicker from './common/EqPicker';
import getEquipmentList from './common/getEquipmentList';
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/items';
import apiWrapper from '../../common/functions/apiWrapper';
import { ApiConfig } from '../../common/constants/ApiConfig';
import GoNextButton from './common/GoNextButton';
import { Text } from 'native-base'

export default function Druid({ onNextPress, navigation }: any) {
  const items: FinalItem[] = require('../../database/Equipment.json');

  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosenFocus, setChosenFocus] = useState<string>('choose');
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([]);
  const [chosenSimple1, setChosenSimple1] = useState<string>('choose');
  const [chosenSimple2, setChosenSimple2] = useState<string>('choose');
  const [foci, setFoci] = useState<Array<JustUrl>>([]);

  const dispatch = useDispatch();
  const dispatchItems = (items: Array<FinalItem>) => dispatch(addItems(items));

  const choice1 = {
    a: {
      "index": "shield",
      "name": "Shield",
    },
    b: {
      "index": "simple-weapons",
      "name": "1 Simple Weapon",
    }
  }

  const choice2 = {
    a: {
      "index": "scimitar",
      "name": "Scimitar",
    },
    b: {
      "index": "simple-weapons",
      "name": "1 Simple Weapon",
    }
  }

  useEffect(() => {
    setSimpleWeapons(items.filter(item => item.weapon_category === 'Simple'))

    setFoci(items.filter(item => item.gear_category).filter(item => item.gear_category.index === 'druidic-foci'))
  }, [])

  function getItem(item: string) {
    if (item !== '' && item !== 'choose') dispatchItems(items.filter(eq => eq.index === item))
  }

  function getChosenData() {
    if (chosen1 === 'simple-weapons') getItem(chosenSimple1);
    else getItem(chosen1);

    if (chosen2 === 'simple-weapons') getItem(chosenSimple2);
    else getItem(chosen2)

    getItem(chosenFocus)
  }


  function goNext() {
    onNextPress();
    getChosenData();
  }

  return (
    <View>
      <ChoiceWrapper>
        <StyledButton title={choice1.a.name} bordered={chosen1 !== choice1.a.index} onButtonPress={() => setChosen1(choice1.a.index)} />
        <Or />
        <StyledButton title={choice1.b.name} bordered={chosen1 !== choice1.b.index} onButtonPress={() => setChosen1(choice1.b.index)} />
        {
          chosen1 === choice1.b.index &&
          <EqPicker data={simpleWeapons} selectedValue={chosenSimple1} onChange={setChosenSimple1} />
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice2.a.name} bordered={chosen2 !== choice2.a.index} onButtonPress={() => setChosen2(choice2.a.index)} />
        <Or />
        <StyledButton title={choice2.b.name} bordered={chosen2 !== choice2.b.index} onButtonPress={() => setChosen2(choice2.b.index)} />
        {
          chosen2 === choice2.b.index &&
          <EqPicker data={simpleWeapons} selectedValue={chosenSimple2} onChange={setChosenSimple2} />
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <Text>Choose druidic focus</Text>
        <EqPicker data={foci} selectedValue={chosenFocus} onChange={setChosenFocus} />
      </ChoiceWrapper>
      <GoNextButton goNext={goNext} navigation={navigation} />
    </View>
  )
}