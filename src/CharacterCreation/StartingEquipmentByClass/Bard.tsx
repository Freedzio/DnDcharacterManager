import React, { useState, useEffect } from 'react'
import { View } from 'native-base'
import ChoiceWrapper from './common/ChoiceWrapper'
import { JustUrl, EqItem, FinalItem } from '../../common/models/models'
import StyledButton from './common/StyledButton';
import Or from './common/Or';
import EqPicker from './common/EqPicker';
import getEquipmentList from './common/getEquipmentList';
import GoNextButton from './common/GoNextButton';
import apiWrapper from '../../common/functions/apiWrapper';
import { ApiConfig } from '../../common/constants/ApiConfig';
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/items';

export default function Bard({ onNextPress, navigation }: any) {
  const [chosen1, setChosen1] = useState<string>('');
  const [chosen2, setChosen2] = useState<string>('');
  const [chosen3, setChosen3] = useState<string>('');
  const [simpleWeapons, setSimpleWeapons] = useState<Array<JustUrl>>([]);
  const [instruments, setInstruments] = useState<Array<JustUrl>>([]);
  const [chosenInstrument, setChosenInstrument] = useState<string>('choose');
  const [chosenSimple, setChosenSimple] = useState<string>('choose');

  const dispatch = useDispatch();
  const dispatchItems = (items: Array<FinalItem>) => dispatch(addItems(items));

  const choice1 = {
    a: {
      index: "rapier",
      name: "Rapier"
    },
    b: {
      index: "longsword",
      name: "Longsword"
    },
    c: {
      index: "simple-weapons",
      name: "1 Simple Weapon"
    }
  };

  const choice2 = {
    a: {
      index: "diplomats-pack",
      name: "Diplomat's Pack",
    },
    b: {
      index: "entertainers-pack",
      name: "Entertainer's Pack",
    }
  }

  const choice3 = {
    a: {
      index: "lute",
      name: "Lute",
    },
    b: {
      index: "musical-instruments",
      name: "1 Musical Instrument",
    }
  }

  useEffect(() => {
    getEquipmentList('simple-weapons')
      .then(data => setSimpleWeapons(data));

    getEquipmentList('musical-instruments')
      .then(data => setInstruments(data))
  }, []);

  function getChosenData() {
    if (chosen1 === 'simple-weapons') getItem(chosenSimple)
    else getItem(chosen1);

    getItem(chosen2);

    if (chosen3 === 'musical-instruments') getItem(chosenInstrument)
    else getItem(chosen3)
  }

  function getItem(item: string) {
    if (item !== '' && item !== 'choose') apiWrapper(ApiConfig.item(item)).then(data => dispatchItems([data]))
  }

  function goNext() {
    onNextPress();
    getChosenData();
  }

  return (
    <View>
      <ChoiceWrapper>
        <StyledButton bordered={chosen1 !== choice1.a.index} title={choice1.a.name} onButtonPress={() => setChosen1(choice1.a.index)} />
        <Or />
        <StyledButton bordered={chosen1 !== choice1.b.index} title={choice1.b.name} onButtonPress={() => setChosen1(choice1.b.index)} />
        <Or />
        <StyledButton bordered={chosen1 !== choice1.c.index} title={choice1.c.name} onButtonPress={() => setChosen1(choice1.c.index)} />
        {
          chosen1 === choice1.c.index &&
          <EqPicker selectedValue={chosenSimple} data={simpleWeapons} onChange={setChosenSimple} />
        }
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton bordered={chosen2 !== choice2.a.index} title={choice2.a.name} onButtonPress={() => setChosen2(choice2.a.index)} />
        <Or />
        <StyledButton bordered={chosen2 !== choice2.b.index} title={choice2.b.name} onButtonPress={() => setChosen2(choice2.b.index)} />
      </ChoiceWrapper>
      <ChoiceWrapper>
        <StyledButton bordered={chosen3 !== choice3.a.index} title={choice3.a.name} onButtonPress={() => setChosen3(choice3.a.index)} />
        <Or />
        <StyledButton bordered={chosen3 !== choice3.b.index} title={choice3.b.name} onButtonPress={() => setChosen3(choice3.b.index)} />
        {
          chosen3 === choice3.b.index &&
          <EqPicker data={instruments} selectedValue={chosenInstrument} onChange={setChosenInstrument} />
        }
      </ChoiceWrapper>
      <GoNextButton goNext={goNext} navigation={navigation} />
    </View>
  )
}