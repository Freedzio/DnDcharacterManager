import AsyncStorage from '@react-native-community/async-storage';
import { Button, Container, Content, List, ListItem, Text, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ScreenHeader from '../../common/components/ScreenHeader';
import { ApiConfig } from '../../common/constants/ApiConfig';
import apiWrapper from '../../common/functions/apiWrapper';
import { JustUrl, Spell } from '../../common/models/models';
import { addSpell, deleteSpell } from '../../redux/spells';
import { StoreProps } from '../../redux/store';
import _ from 'lodash'
import { spellcastingAbilityByClass } from './spellcastingAbilityByClass';

export default function ChooseSpellsScreen() {
  const spellcasting = useSelector((store: StoreProps) => store.spellcasting);

  const [chosenLevel, setChosenLevel] = useState<number>(0);
  const [chosenClass, setChosenClass] = useState<string>(Object.keys(spellcasting)[0] || 'bard')
  const [spellsToChooseFrom, setSpellsToChooseFrom] = useState<Array<JustUrl>>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const spells = useSelector((store: StoreProps) => store.spells);
  const store = useSelector((store: StoreProps) => store);
  const id = useSelector((store: StoreProps) => store.id)

  const dispatch = useDispatch();
  const dispatchSpell = (spell: Spell) => dispatch(addSpell(spell));
  const dispatchDeleteSpell = (spell: string) => dispatch(deleteSpell(spell));

  function renderLevelButtons() {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(
        <Button bordered={chosenLevel !== i} style={{ flex: 1 }} onPress={() => setChosenLevel(i)} key={i}>
          <Text>{i}</Text>
        </Button>
      )
    }
    return arr
  }

  async function getSpellsByTheirLevelForClass(className: string, level: number) {
    return await apiWrapper(ApiConfig.spellsByClassAndItsLevel(className, level));
  }

  async function getAllSpellsData(level: number, className: string) {
    const spells = await getSpellsByTheirLevelForClass(className, level);
    setSpellsToChooseFrom(spells.results);
  };

  async function onSpellPress(spell: string) {
    setLoading(true)
    if (Object.keys(spells).includes(spell)) {
      dispatchDeleteSpell(spell);

      let temp = _.cloneDeep(spells)
      delete temp[spell]

      await AsyncStorage.setItem(id, JSON.stringify(temp))
    } else {
      const spellData = await apiWrapper(ApiConfig.spell(spell))
      dispatchSpell({
        ...spellData,
        spellcasting_ability: spellcastingAbilityByClass.filter(item => item.class.toLowerCase() === chosenClass)[0].ability
      });

      await AsyncStorage.setItem(id, JSON.stringify({
        ...store,
        spells: {
          ...spells,
          [spellData.index]: spell
        }
      }))
    }
    setLoading(false)
  }

  useEffect(() => {
    getAllSpellsData(chosenLevel, chosenClass)
  }, [chosenLevel, chosenClass])

  return (
    <Container>
      <Content>
        <ScreenHeader title='CHOOSE SPELLS' />
        <View style={{ flexDirection: "row" }}>
          {renderLevelButtons()}
        </View>
        <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {spellcastingAbilityByClass.map((set: { class: string, ability: string }, index: number) =>
            <Button bordered={chosenClass !== set.class.toLowerCase()} onPress={() => setChosenClass(set.class.toLowerCase())} key={index}>
              <Text>{set.class}</Text>
            </Button>
          )}
        </View>
        <List>
          {
            spellsToChooseFrom.map((spell: JustUrl, index: number) =>
              <ListItem key={index}>
                <Text style={{ flex: 3 }}>{spell.name}</Text>
                <Button disabled={loading} bordered={!Object.keys(spells).includes(spell.index as string)} style={{ flex: 1 }} onPress={() => onSpellPress(spell.index as string)}>
                  <Text>{Object.keys(spells).includes(spell.index as string) ? 'REMOVE' : 'ADD'} </Text>
                </Button>
              </ListItem>
            )
          }
        </List>
      </Content>
    </Container>
  )
}