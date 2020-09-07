import React, { useState, useEffect } from 'react'
import { View, Text } from 'native-base';
import { JustUrl } from '../../common/models/models';
import ChoiceWrapper from './common/ChoiceWrapper';
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import EqPicker from './common/EqPicker';
import getEquipmentList from './common/getEquipmentList';

export default function Paladin() {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosen3, setChosen3] = useState<string>('');
  const [martialWithShield, setMartialWithShield] = useState<string>('choose');
  const [chosenMartial1, setChosenMartial1] = useState<string>('choose');
  const [chosenMartial2, setChosenMartial2] = useState<string>('choose');
  const [chosenSimple, setChosenSimple] = useState<string>('choose');
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([]);
  const [martialWeapons, setMartialWeapons] = useState<Array<JustUrl>>([]);
  const [chosenSymbol, setChosenSymbol] = useState<string>('choose')
  const [holySymbols, setHolySymbols] = useState<Array<JustUrl>>([])

  const choice1 = {
    a: {
      index: "shield",
      name: "Shield and 1 martial weapon",
    },
    b: {
      name: "2 Martial Weapons",
      index: "martial-weapons",
    }
  };

  const choice2 = {
    a: {
      "index": "javelin",
      "name": "5 Javelins",
    },
    b: {
      "index": "simple-weapons",
      "name": "1 Simple Weapon",
    }
  }

  const choice3 = {
    a: {
      "index": "priests-pack",
      "name": "Priest's Pack",
    },
    b: {
      "index": "explorers-pack",
      "name": "Explorer's Pack",
    }
  }

  useEffect(() => {
    getEquipmentList('holy-symbols')
      .then(data => setHolySymbols(data))

    getEquipmentList('simple-weapons')
      .then(data => setSimpleWeapons(data))

    getEquipmentList('martial-weapons')
      .then(data => setMartialWeapons(data))
  }, [])

  return (
    <View>
      <ChoiceWrapper>
        <StyledButton title={choice1.a.name} bordered={chosen1 !== choice1.a.index} onButtonPress={() => setChosen1(choice1.a.index)} />
        {
          chosen1 === choice1.a.index &&
          <EqPicker data={martialWeapons} selectedValue={martialWithShield} onChange={setMartialWithShield} />

        }
        <Or />
        <StyledButton title={choice1.b.name} bordered={chosen1 !== choice1.b.index} onButtonPress={() => setChosen1(choice1.b.index)} />
        {
          chosen1 === choice1.b.index &&
          <>
            <EqPicker data={martialWeapons} selectedValue={chosenMartial1} onChange={setChosenMartial1} />
            <EqPicker data={martialWeapons} selectedValue={chosenMartial2} onChange={setChosenMartial2} />
          </>
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice2.a.name} bordered={chosen2 !== choice2.a.index} onButtonPress={() => setChosen2(choice2.a.index)} />
        <Or />
        <StyledButton title={choice2.b.name} bordered={chosen2 !== choice2.b.index} onButtonPress={() => setChosen2(choice2.b.index)} />
        {
          chosen2 === choice2.b.index &&
          <EqPicker data={simpleWeapons} selectedValue={chosenSimple} onChange={setChosenSimple} />
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton title={choice3.a.name} bordered={chosen3 !== choice3.a.index} onButtonPress={() => setChosen3(choice3.a.index)} />
        <Or />
        <StyledButton title={choice3.b.name} bordered={chosen3 !== choice3.b.index} onButtonPress={() => setChosen3(choice3.b.index)} />
      </ChoiceWrapper>
      <ChoiceWrapper>
        <Text>Choose holy symbol</Text>
        <EqPicker data={holySymbols} selectedValue={chosenSymbol} onChange={setChosenSymbol} />
      </ChoiceWrapper>
    </View>
  )
}