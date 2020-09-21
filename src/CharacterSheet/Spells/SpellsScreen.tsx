import { Container, Content, Fab, Icon, List, ListItem, Text, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ScreenHeader from '../../common/components/ScreenHeader'
import { SPELLS_CHOOSE_SCREEN } from '../../common/constants/routeNames'
import { Spell } from '../../common/models/models'
import store, { StoreProps } from '../../redux/store';
import _ from 'lodash'
import getAbilityModifier from '../../common/functions/getAbilityModifier'
import renderPlusOrMinus from '../../common/functions/renderPlusOrMinus'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { spellStyle } from '../../common/styles/styles'

const initialState = {
  '0': 0,
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  '6': 0,
  '7': 0,
  '8': 0,
  '9': 0,
}

export default function SpellsScreen({ navigation }: any) {
  const [spellSlots, setSpellSlots] = useState<{ [key: string]: number }>(initialState);
  const [chosenSpell, setChosenSpell] = useState<string>('');

  const spellcasting = useSelector((store: StoreProps) => store.spellcasting);
  const spells = useSelector((store: StoreProps) => store.spells);
  const classes = useSelector((store: StoreProps) => store.classes);
  const abilityScores = useSelector((store: StoreProps) => store.abilityScores)
  const profBonus = useSelector((store: StoreProps) => store.basicInfo.proficiencyBonus);

  function getCantripDamage(spell: Spell) {
    let values = Object.values(classes);
    let sum = values.reduce((a, b) => a + b, 0);

    const levelMilestones = Object.keys(spell.damage.damage_at_character_level);

    for (let i = 0; i < levelMilestones.length; i++) {
      if (parseInt(levelMilestones[i]) > sum) return spell.damage.damage_at_character_level[parseInt(levelMilestones[i - 1])]
    }
  }

  function onSpellPress(spell: string) {
    if (spell === chosenSpell) setChosenSpell('')
    else setChosenSpell(spell);
  }

  useEffect(() => {
    let temp = { ...spellSlots }

    const keys = Object.keys(spellcasting);

    for (let i = 0; i < keys.length; i++) {
      const classId = keys[i];
      let slotsForClass = _.cloneDeep(spellcasting[classId])
      delete slotsForClass.spells_known;
      delete slotsForClass.spellcasting_ability;
      const slotsByLevel = Object.values(slotsForClass)

      for (let j = 0; j < slotsByLevel.length; j++) {
        temp = {
          ...temp,
          [j]: temp[j] + slotsByLevel[j]
        }
      }

      setSpellSlots(temp)
    }

  }, [spellcasting]);

  return (
    <Container>
      <Content>
        <ScreenHeader title="SPELLS" />
        {
          spellcasting === {} ? <Text style={{ fontSize: 30, textAlign: "center" }}>You cannot cast spells!</Text> :
            <List>
              <ListItem>
                <Text style={spellStyle.columnNames}>Name</Text>
                <Text style={spellStyle.columnNames}>Modifier</Text>
                <Text style={spellStyle.columnNames}>Damage</Text>
                <Text style={spellStyle.columnNames}>Damage type</Text>
                <Text style={spellStyle.columnNames}>Range</Text>
              </ListItem>
              <ListItem>
                <Text style={spellStyle.columnNames}>Casting time</Text>
                <Text style={spellStyle.columnNames}>Duration</Text>
                <Text style={spellStyle.columnNames}>Components</Text>
                <Text style={spellStyle.columnNames}>DC</Text>
                <Text style={spellStyle.columnNames}>On save</Text>
              </ListItem>
              {
                Object.keys(spellSlots).map((level: string, index: number) =>
                  <View key={index}>
                    <ListItem>
                      <Text style={spellStyle.levelHeader}>{level === '0' ? `Cantrips (${spellSlots[level]} known)` : `Level ${level} spells (${spellSlots[level]} slots)`} </Text>
                    </ListItem>
                    {
                      Object.keys(spells).filter(spell => spells[spell].level === parseInt(level)).map((spell: string, index: number) =>
                        <TouchableOpacity onPress={() => onSpellPress(spell)} key={index}>
                          <ListItem style={{ borderTopWidth: 2 }}>
                            <Text style={spellStyle.spellMain}>{spells[spell].name}</Text>
                            <Text style={spellStyle.spellMain}>{spells[spell].attack_type ? renderPlusOrMinus(getAbilityModifier(abilityScores[spells[spell].spellcasting_ability].score) + profBonus) : '---'} </Text>
                            <Text style={spellStyle.spellMain}>{spells[spell].damage ? (spells[spell].level > 0 ? spells[spell].damage.damage_at_slot_level[parseInt(level)] : getCantripDamage(spells[spell])) : '---'}</Text>
                            <Text style={spellStyle.spellMain}>{spells[spell].damage ? spells[spell].damage.damage_type.name : '---'} </Text>
                            <Text style={spellStyle.spellMain}>{spells[spell].range} </Text>
                          </ListItem>
                          <ListItem style={{ borderBottomWidth: 2 }} >
                            <Text style={spellStyle.spellSub}>{spells[spell].casting_time}</Text>
                            <Text style={spellStyle.spellSub}>{spells[spell].duration}</Text>
                            <Text style={spellStyle.spellSub}>{spells[spell].components.join(', ')}</Text>
                            <Text style={spellStyle.spellSub}>{spells[spell].dc ? `${spells[spell].dc.dc_type.name} ${8 + profBonus + getAbilityModifier(abilityScores[spells[spell].spellcasting_ability].score)}` : '---'}</Text>
                            <Text style={spellStyle.spellSub}>{spells[spell].dc ? spells[spell].dc.dc_success : '---'}</Text>
                          </ListItem>
                          {
                            chosenSpell === spell &&
                            <View>
                              {
                                spells[spell].desc.map((desc: string, index: number) =>
                                  <Text style={spellStyle.desc}>{desc}</Text>
                                )
                              }
                              {
                                spells[spell].higher_level &&
                                <Text style={spellStyle.desc}>{spells[spell].higher_level}</Text>
                              }
                            </View>
                          }
                        </TouchableOpacity>
                      )
                    }
                  </View>
                )
              }
            </List>
        }
      </Content>
      <Fab onPress={() => navigation.navigate(SPELLS_CHOOSE_SCREEN)}>
        <Icon name='add' />
      </Fab>
    </Container>
  )
}