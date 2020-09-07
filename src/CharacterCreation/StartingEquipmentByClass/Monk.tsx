import React, { useState, useEffect } from 'react'
import { View } from 'native-base'
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import { JustUrl } from '../../common/models/models';
import EqPicker from './common/EqPicker';
import getEquipmentList from './common/getEquipmentList';

export default function Monk() {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([]);
  const [chosenSimple, setChosenSimple] = useState<string>('choose')

  const choice1 = {
    a: {
      index: "shortsword",
      name: "Shortsword",
    },
    b: {
      index: "simple-weapons",
      name: "1 Simple Weapon",
    }
  };

  const choice2 = {
    a: {
      index: "dungeoneers-pack",
      name: "Dungeoneer's Pack"
    },
    b: {
      index: "explorers-pack",
      name: "Explorer's Pack",
    }
  };

  useEffect(() => {
    getEquipmentList('simple-weapons')
      .then(data => setSimpleWeapons(data))
  }, [])

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
      </ChoiceWrapper>
    </View>
  )
}