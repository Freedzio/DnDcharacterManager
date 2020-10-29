import getEquipmentList from './common/getEquipmentList';
import { JustUrl, EqItem, FinalItem } from '../../common/models/models';
import ChoiceWrapper from './common/ChoiceWrapper';
import React, { useState, useEffect } from 'react';
import StyledButton from './common/StyledButton';
import { StoreProps } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import EqPicker from './common/EqPicker';
import { View, Text } from 'native-base';
import Or from './common/Or';
import { addItems } from '../../redux/items';
import { ApiConfig } from '../../common/constants/ApiConfig';
import apiWrapper from '../../common/functions/apiWrapper';
import GoNextButton from './common/GoNextButton';

export default function Cleric({ onNextPress, navigation }: any) {
  const items: FinalItem[] = require('../../database/Equipment.json');

  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosen3, setChosen3] = useState<string>('');
  const [chosen4, setChosen4] = useState<string>('');
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([]);
  const [holySymbols, setHolySymbols] = useState<Array<JustUrl>>([]);
  const [chosenSymbol, setChosenSymbol] = useState<string>('choose');
  const [chosenSimple, setChosenSimple] = useState<string>('choose');

  const proficiencies = Object.keys(useSelector((store: StoreProps) => store.proficiencies));

  const dispatch = useDispatch();
  const dispatchItems = (items: Array<FinalItem>) => dispatch(addItems(items));


  const choice1 = {
    a: {
      index: "mace",
      name: "Mace",
    },
    b: {
      index: "warhammer",
      name: "Warhammer",
    }
  };

  const choice2 = {
    a: {
      index: "scale-mail",
      name: "Scale Mail",
    },
    b: {
      index: "leather",
      name: "Leather",
    },
    c: {
      index: "chain-mail",
      name: "Chain Mail",
    }
  }

  const choice3 = {
    a: {
      index: "crossbow-light",
      name: "Crossbow, light, 20 bolts",
    },
    b: {
      index: "simple-weapons",
      name: "1 Simple Weapon",
    }
  };

  const choice4 = {
    a: {
      index: "priests-pack",
      name: "Priest's Pack",
    },
    b: {
      index: "explorers-pack",
      name: "Explorer's Pack",
    }
  }

  function getItem(item: string) {
    if (item !== '' && item !== 'choose') dispatchItems(items.filter(eq => eq.index === item))
  }

  function getChosenData() {
    getItem(chosen1)
    getItem(chosen2)
    if (chosen3 === 'simple-weapons') getItem(chosenSimple)
    else {
      getItem('crossbow-light')
      getItem('crossbow-bolt')
    }
    getItem(chosen4)
    getItem(chosenSymbol)
  }

  useEffect(() => {
    setHolySymbols(items.filter(item => item.gear_category).filter(item => item.gear_category.index === 'holy-symbols'))

    setSimpleWeapons(items.filter(item => item.weapon_category === 'Simple'))
  }, []);


  function goNext() {
    onNextPress();
    getChosenData();
  }
  return (
    <View>
      <ChoiceWrapper>
        <StyledButton title={choice1.a.name} onButtonPress={() => setChosen1(choice1.a.index)} bordered={chosen1 !== choice1.a.index} />
        <Or />
        <StyledButton title={choice1.b.name} onButtonPress={() => setChosen1(choice1.b.index)} bordered={chosen1 !== choice1.b.index} />
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice2.a.name} onButtonPress={() => setChosen2(choice2.a.index)} bordered={chosen2 !== choice2.a.index} />
        <Or />
        <StyledButton title={choice2.b.name} onButtonPress={() => setChosen2(choice2.b.index)} bordered={chosen2 !== choice2.b.index} />
        <Or />
        <StyledButton title={choice2.c.name} onButtonPress={() => setChosen2(choice2.c.index)} bordered={chosen2 !== choice2.c.index} />
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice3.a.name} onButtonPress={() => setChosen3(choice3.a.index)} bordered={chosen3 !== choice3.a.index} />
        <Or />
        <StyledButton title={choice3.b.name} onButtonPress={() => setChosen3(choice3.b.index)} bordered={chosen3 !== choice3.b.index} />
        {
          chosen3 === choice3.b.index &&
          <EqPicker selectedValue={chosenSimple} data={simpleWeapons} onChange={setChosenSimple} />
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice4.a.name} onButtonPress={() => setChosen4(choice4.a.index)} bordered={chosen4 !== choice4.a.index} />
        <Or />
        <StyledButton title={choice4.b.name} onButtonPress={() => setChosen4(choice4.b.index)} bordered={chosen4 !== choice4.b.index} />
      </ChoiceWrapper>
      <ChoiceWrapper>
        <Text>Choose holy symbol</Text>
        <EqPicker selectedValue={chosenSymbol} data={holySymbols} onChange={setChosenSymbol} />
      </ChoiceWrapper>
      <GoNextButton goNext={goNext} navigation={navigation} />
    </View>
  )
}