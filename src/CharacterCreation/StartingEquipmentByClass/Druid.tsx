import React, { useState, useEffect } from 'react'
import { JustUrl } from '../../common/models/models';
import { View } from 'native-base';
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import EqPicker from './common/EqPicker';
import getEquipmentList from './common/getEquipmentList';

export default function Druid() {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosenFocus, setChosenFocus] = useState<string>('choose');
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([]);
  const [chosenSimple1, setChosenSimple1] = useState<string>('choose');
  const [chosenSimple2, setChosenSimple2] = useState<string>('choose');
  const [foci, setFoci] = useState<Array<JustUrl>>([]);

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
    getEquipmentList('simple-weapons')
      .then(data => setSimpleWeapons(data))

    getEquipmentList('druidic-foci')
      .then(data => setFoci(data))
  }, [])


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
        <EqPicker data={foci} selectedValue={chosenFocus} onChange={setChosenFocus} />
      </ChoiceWrapper>
    </View>
  )


}