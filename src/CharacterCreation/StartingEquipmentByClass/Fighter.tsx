import React, { useState, useEffect } from 'react'
import { View } from 'native-base';
import { JustUrl, EqItem, FinalItem } from '../../common/models/models';
import getEquipmentList from './common/getEquipmentList';
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import EqPicker from './common/EqPicker';
import _ from 'lodash'
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/items';
import apiWrapper from '../../common/functions/apiWrapper';
import { ApiConfig } from '../../common/constants/ApiConfig';
import GoNextButton from './common/GoNextButton';

export default function Fighter({ onNextPress, navigation }: any) {
  const items: FinalItem[] = require('../../database/Equipment.json');

  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosen3, setChosen3] = useState<string>('');
  const [chosen4, setChosen4] = useState<string>('');
  const [martialWeapons, setMartialWeapons] = useState<Array<JustUrl>>([]);
  const [chosenWithShield, setChosenWithShield] = useState<string>('choose');
  const [chosenMartial1, setChosenMartial1] = useState<string>('choose');
  const [chosenMartial2, setChosenMartial2] = useState<string>('choose');


  const dispatch = useDispatch();
  const dispatchItems = (items: Array<FinalItem>) => dispatch(addItems(items));


  const choice1 = {
    a: {
      index: "chain-mail",
      name: "Chain Mail",
    },
    b: {
      name: "Leather, longbow and 20 arrows",
      index: 'leather'
    }
  }

  const choice2 = {
    a: {
      name: "Shield and 1 martial weapon",
      index: 'shield'
    },
    b: {
      name: "2 martial weapons",
      index: 'choose 2 martials'
    }
  }

  const choice3 = {
    a: {
      index: "handaxe",
      name: "Handaxe",
    },
    b: {
      name: "Light crossbow, 20 bolts",
      index: 'crossbow-light'
    }
  };

  const choice4 = {
    a: {
      index: "dungeoneers-pack",
      name: "Dungeoneer's Pack",
    },
    b: {
      index: "explorers-pack",
      name: "Explorer's Pack",
    }
  }

  useEffect(() => {
    setMartialWeapons(items.filter(item => item.weapon_category === 'Martial'))
  }, []);

  function getItem(item: string) {
    if (item !== '' && item !== 'choose') dispatchItems(items.filter(eq => eq.index === item))
  }

  function getChosenData() {
    if (chosen1 === 'chain-mail') getItem(chosen1)
    else {
      getItem('leather')
      getItem('longbow')
      getItem('arrow')
    };

    if (chosen2 === 'shield') {
      getItem('shield')
      getItem(chosenWithShield)
    } else {
      getItem(chosenMartial1)
      getItem(chosenMartial2)
    };

    getItem(chosen3)
    if (chosen3 === 'crossbow-light') getItem('crossbow-bolt')

    getItem(chosen4)
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
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice2.a.name} bordered={chosen2 !== choice2.a.index} onButtonPress={() => setChosen2(choice2.a.index)} />
        {
          chosen2 === choice2.a.index &&
          <EqPicker data={martialWeapons} selectedValue={chosenWithShield} onChange={setChosenWithShield} />
        }
        <Or />
        <StyledButton title={choice2.b.name} bordered={chosen2 !== choice2.b.index} onButtonPress={() => setChosen2(choice2.b.index)} />
        {
          chosen2 === choice2.b.index &&
          <>
            <EqPicker data={martialWeapons} selectedValue={chosenMartial1} onChange={setChosenMartial1} />
            <EqPicker data={martialWeapons} selectedValue={chosenMartial2} onChange={setChosenMartial2} />
          </>
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice3.a.name} bordered={chosen3 !== choice3.a.index} onButtonPress={() => setChosen3(choice3.a.index)} />
        <Or />
        <StyledButton title={choice3.b.name} bordered={chosen3 !== choice3.b.index} onButtonPress={() => setChosen3(choice3.b.index)} />
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice4.a.name} bordered={chosen4 !== choice4.a.index} onButtonPress={() => setChosen4(choice4.a.index)} />
        <Or />
        <StyledButton title={choice4.b.name} bordered={chosen4 !== choice4.b.index} onButtonPress={() => setChosen4(choice4.b.index)} />
      </ChoiceWrapper>
      <GoNextButton goNext={goNext} navigation={navigation} />

    </View>
  )
}