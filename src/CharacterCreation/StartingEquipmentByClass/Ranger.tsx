import React, { useState, useEffect } from 'react'
import { View } from 'native-base';
import { JustUrl } from '../../common/models/models';
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import EqPicker from './common/EqPicker';
import getEquipmentList from './common/getEquipmentList';

export default function Ranger() {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosen3, setChosen3] = useState<string>('');
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([]);
  const [chosenSimple1, setChosenSimple1] = useState<string>('choose')
  const [chosenSimple2, setChosenSimple2] = useState<string>('choose')

  const choice1 = {
    a: {
      index: "scale-mail",
      name: "Scale Mail",
    },
    b: {
      index: "leather",
      name: "Leather",
    }
  }

  const choice2 = {
    a: {
      index: "shortsword",
      name: "2 Shortswords"
    },
    b: {
      index: "simple-melee-weapons",
      name: "2 Simple Melee Weapons",
    }
  }

  const choice3 = {
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
    getEquipmentList('simple-melee-weapons')
      .then(data => setSimpleWeapons(data))
  }, [])

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
        {
          chosen2 === choice2.b.index &&
          <>
            <EqPicker data={simpleWeapons} selectedValue={chosenSimple1} onChange={setChosenSimple1} />
            <EqPicker data={simpleWeapons} selectedValue={chosenSimple2} onChange={setChosenSimple2} />
          </>
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice3.a.name} bordered={chosen3 !== choice3.a.index} onButtonPress={() => setChosen3(choice3.a.index)} />
        <Or />
        <StyledButton title={choice3.b.name} bordered={chosen3 !== choice3.b.index} onButtonPress={() => setChosen3(choice3.b.index)} />
      </ChoiceWrapper>
    </View>
  )
}