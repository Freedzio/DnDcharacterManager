import React, { useState, useEffect } from 'react'
import { CardItem, Button, View, Text } from 'native-base'
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import { JustUrl, EqItem } from '../../common/models/models';
import EqPicker from './common/EqPicker';
import ChoiceWrapper from './common/ChoiceWrapper';
import getEquipmentList from './common/getEquipmentList';
import GoNextButton from './common/GoNextButton';
import apiWrapper from '../../common/functions/apiWrapper';
import { ApiConfig } from '../../common/constants/ApiConfig';
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/items';

export default function Barbarian({ onNextPress, navigation }: any) {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosenMartial, setChosenMartial] = useState<string>('choose');
  const [chosenSimple, setChosenSimple] = useState<string>('choose');
  const [martialMeleeWeapons, setMartialMeleeWeapons] = useState<Array<JustUrl>>([]);
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([]);

  const dispatch = useDispatch();
  const dispatchItems = (items: Array<EqItem>) => dispatch(addItems(items));

  const choice1 = {
    a: {
      index: 'greataxe',
      name: 'Greataxe'
    },
    b: {
      index: 'martial-melee-weapons',
      name: '1 Martial melee weapon'
    }
  };

  const choice2 = {
    a: {
      index: "handaxe",
      name: "Handaxe",
    },
    b: {
      index: "simple-weapons",
      name: "1 Simple Weapon",
    }
  };

  useEffect(() => {
    getEquipmentList('martial-melee-weapons')
      .then(data => setMartialMeleeWeapons(data));

    getEquipmentList('simple-weapons')
      .then(data => setSimpleWeapons(data));
  }, []);

  function getItem(item: string) {
    if (item !== '' && item !== 'choose') apiWrapper(ApiConfig.item(item)).then(data => dispatchItems([data]))
  }

  function getChosenData() {
    if (chosen1 === 'martial-melee-weapons') getItem(chosenMartial);
    else getItem(chosen1);

    if (chosen2 === 'simple-weapons') getItem(chosenSimple);
    else getItem(chosen2)
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
          <EqPicker selectedValue={chosenMartial} data={martialMeleeWeapons} onChange={setChosenMartial} />
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice2.a.name} bordered={chosen2 !== choice2.a.index} onButtonPress={() => setChosen2(choice2.a.index)} />
        <Or />
        <StyledButton title={choice2.b.name} bordered={chosen2 !== choice2.b.index} onButtonPress={() => setChosen2(choice2.b.index)} />
        {
          chosen2 === choice2.b.index &&
          <EqPicker selectedValue={chosenSimple} data={simpleWeapons} onChange={setChosenSimple} />
        }
      </ChoiceWrapper>
      <GoNextButton goNext={goNext} navigation={navigation} />
    </View>
  )
}