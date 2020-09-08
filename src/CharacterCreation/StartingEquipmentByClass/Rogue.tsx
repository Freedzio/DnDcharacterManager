import React, { useState } from 'react'
import { View } from 'native-base'
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import { useDispatch } from 'react-redux';
import { EqItem } from '../../common/models/models';
import { addItems } from '../../redux/items';
import apiWrapper from '../../common/functions/apiWrapper';
import { ApiConfig } from '../../common/constants/ApiConfig';
import GoNextButton from './common/GoNextButton';

export default function Rogue({onNextPress, navigation}: any) {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosen3, setChosen3] = useState<string>('');

  const dispatch = useDispatch();
  const dispatchItems = (items: Array<EqItem>) => dispatch(addItems(items));

  const choice1 = {
    a: {
      index: "rapier",
      name: "Rapier",
    },
    b: {
      index: "shortsword",
      name: "Shortsword",
    }
  }

  const choice2 = {
    a: {
      index: "shortsword",
      name: "Shortsword",
    },
    b: {
      index: "shortbow",
      name: "Shortbow and 20 arrows",
    }
  };

  const choice3 = {
    a: {
      index: "burglars-pack",
      name: "Burglar's Pack",
    },
    b: {
      index: "dungeoneers-pack",
      name: "Dungeoneer's Pack",
    },
    c: {
      index: "explorers-pack",
      name: "Explorer's Pack",
    }
  }

  function getChoseNData() {
    getItem(chosen1)
    getItem(chosen2)
    if (chosen2 === 'shortbow') getItem('arrows')
    getItem(chosen3)
  }

  function getItem(item: string) {
    if (item !== '' && item !== 'choose') apiWrapper(ApiConfig.item(item)).then(data => dispatchItems([data]))
  }

  function goNext() {
    onNextPress();
    getChoseNData();
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
        <Or />
        <StyledButton title={choice2.b.name} bordered={chosen2 !== choice2.b.index} onButtonPress={() => setChosen2(choice2.b.index)} />
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice3.a.name} bordered={chosen3 !== choice3.a.index} onButtonPress={() => setChosen3(choice3.a.index)} />
        <Or />
        <StyledButton title={choice3.b.name} bordered={chosen3 !== choice3.b.index} onButtonPress={() => setChosen3(choice3.b.index)} />
        <Or />
        <StyledButton title={choice3.c.name} bordered={chosen3 !== choice3.c.index} onButtonPress={() => setChosen3(choice3.c.index)} />
      </ChoiceWrapper>
      <GoNextButton goNext={goNext} navigation={navigation} />
    </View>
  )
}