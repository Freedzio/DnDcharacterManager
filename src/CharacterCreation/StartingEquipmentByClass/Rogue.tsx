import React, { useState } from 'react'
import { View } from 'native-base'
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';

export default function Rogue() {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosen3, setChosen3] = useState<string>('');

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
    </View>
  )
}