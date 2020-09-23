import React, { useState, useEffect } from 'react'
import { View, Text } from 'native-base'
import { JustUrl, EqItem, FinalItem } from '../../common/models/models';
import getEquipmentList from './common/getEquipmentList';
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import EqPicker from './common/EqPicker';
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/items';
import apiWrapper from '../../common/functions/apiWrapper';
import { ApiConfig } from '../../common/constants/ApiConfig';
import GoNextButton from './common/GoNextButton';

export default function Warlock({ onNextPress, navigation }: any) {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosen3, setChosen3] = useState<string>('');
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([])
  const [foci, setFoci] = useState<Array<JustUrl>>([]);
  const [chosenSimpleStandalone, setChosenSimpleStandalone] = useState<string>('choose')
  const [chosenFocus, setChosenFocus] = useState<string>('choose')
  const [chosenSimple, setChosenSimple] = useState<string>('choose')

  const dispatch = useDispatch();
  const dispatchItems = (items: Array<FinalItem>) => dispatch(addItems(items));

  const choice1 = {
    a: {
      index: "crossbow-light",
      name: "Crossbow and 20 bolts",
    },
    b: {
      index: "simple-weapons",
      name: "1 Simple Weapon",
    }
  };

  const choice2 = {
    a: {
      index: "component-pouch",
      name: "Component pouch",
    },
    b: {
      index: "arcane-foci",
      name: "Arcane focus",
    }
  };

  const choice3 = {
    a: {
      index: "scholars-pack",
      name: "Scholar's Pack",
    },
    b: {
      index: "dungeoneers-pack",
      name: "Dungeoneer's Pack",
    }
  }

  function getItem(item: string) {
    if (item !== '' && item !== 'choose') apiWrapper(ApiConfig.item(item)).then(data => dispatchItems([data]))
  }

  function getChosenData() {
    if (chosen1 === 'simple-weapons') getItem(chosenSimple)
    else {
      getItem(chosen1)
      getItem('crossbow-bolt')
    }

    if (chosen2 === 'arcane-foci') getItem(chosenFocus)
    else getItem(chosen2)

    getItem(chosen3)
  }

  useEffect(() => {
    getEquipmentList('simple-weapons')
      .then(data => setSimpleWeapons(data))

    getEquipmentList('arcane-foci')
      .then(data => setFoci(data))
  }, []);


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
          <EqPicker data={simpleWeapons} selectedValue={chosenSimple} onChange={setChosenSimple} />
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice2.a.name} bordered={chosen2 !== choice2.a.index} onButtonPress={() => setChosen2(choice2.a.index)} />
        <Or />
        <StyledButton title={choice2.b.name} bordered={chosen2 !== choice2.b.index} onButtonPress={() => setChosen2(choice2.b.index)} />
        {
          chosen2 === choice2.b.index &&
          <EqPicker data={foci} selectedValue={chosenFocus} onChange={setChosenFocus} />
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice3.a.name} bordered={chosen3 !== choice3.a.index} onButtonPress={() => setChosen3(choice3.a.index)} />
        <Or />
        <StyledButton title={choice3.b.name} bordered={chosen3 !== choice3.b.index} onButtonPress={() => setChosen3(choice3.b.index)} />
      </ChoiceWrapper>
      <ChoiceWrapper>
        <Text>Choose simple weapon</Text>
        <EqPicker data={simpleWeapons} selectedValue={chosenSimpleStandalone} onChange={setChosenSimpleStandalone} />
      </ChoiceWrapper>
      <GoNextButton goNext={goNext} navigation={navigation} />
    </View>
  )
}