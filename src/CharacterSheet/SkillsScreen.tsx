import AsyncStorage from '@react-native-community/async-storage'
import { Body, Button, Card, Container, Content, Fab, Icon, List, ListItem, Row, Text, View } from 'native-base'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ScreenHeader from '../common/components/ScreenHeader'
import { abilities } from '../common/constants/abilitiesArray'
import { ACROBATICS, allSkills, ANIMAL_HANDLING, ARCANA, ATHLETICS, DECEPTION, HISTORY, INSIGHT, INTIMIDATION, INVESTIGATION, MEDICNE, NATURE, PERCEPTION, PERFORMANCE, PERSUASION, RELIGION, SLEIGHT_OF_HAND, STEALTH, SURVIVAL } from '../common/constants/skillNames'
import getAbilityModifier from '../common/functions/getAbilityModifier'
import getDimensions from '../common/functions/getDimensions'
import { addExpertises, deleteExpertises } from '../redux/expertises'
import { addSkills, deleteSkills } from '../redux/skills'
import { StoreProps } from '../redux/store'
import _ from 'lodash'
import renderPlusOrMinus from '../common/functions/renderPlusOrMinus'
import { useFocusEffect } from '@react-navigation/native'
import { spellStyle } from '../common/styles/styles'

export default function SkillsScreen() {
  const [editing, setEditing] = useState<boolean>(false);

  const name = useSelector((store: StoreProps) => store.name);
  const skills = useSelector((store: StoreProps) => store.skills);
  const expertises = useSelector((store: StoreProps) => store.expertises);
  const abilityScores = useSelector((store: StoreProps) => store.abilityScores);
  const basicInfo = useSelector((store: StoreProps) => store.basicInfo);
  const id = useSelector((store: StoreProps) => store.id);
  const store = useSelector((store: StoreProps) => store);
  const features = useSelector((store: StoreProps) => store.features);
  const proficiencies = useSelector((store:StoreProps) => store.proficiencies);

  const dispatch = useDispatch();
  const dispatchSkills = (skills: Array<string>) => dispatch(addSkills(skills));
  const dispatchExpertises = (expertises: Array<string>) => dispatch(addExpertises(expertises))
  const dispatchDeleteSkills = (skills: Array<string>) => dispatch(deleteSkills(skills));
  const dispatchDeleteExpertises = (expertises: Array<string>) => dispatch(deleteExpertises(expertises))

  function resolveModifier(skill: string) {
    let baseAbility = 'CON';

    if (skill === ATHLETICS) baseAbility = 'STR';
    if (skill === ACROBATICS || skill === SLEIGHT_OF_HAND || skill === STEALTH) baseAbility = 'DEX';
    if (skill === ANIMAL_HANDLING || skill === INSIGHT || skill === MEDICNE || skill === PERCEPTION || skill === SURVIVAL) baseAbility = 'WIS';
    if (skill === ARCANA || skill === HISTORY || skill === INVESTIGATION || skill === NATURE || skill === RELIGION) baseAbility = 'WIS';
    if (skill === DECEPTION || skill === INTIMIDATION || skill === PERFORMANCE || skill === PERSUASION) baseAbility = 'CHA'

    const baseModifier = getAbilityModifier(abilityScores[baseAbility].score);
    let bonus = 0;
    if (expertises.includes(skill)) bonus = basicInfo.proficiencyBonus * 2
    else if (skills.includes(skill)) bonus = basicInfo.proficiencyBonus
    else if (Object.keys(features).includes('jack-of-all-trades')) bonus = Math.floor(basicInfo.proficiencyBonus / 2)

    return renderPlusOrMinus(baseModifier + bonus)
  }

  function parseSkillName(skill: string) {
    const firstLetter = skill[0];
    const restOfName = skill.substr(1);

    return firstLetter.toUpperCase() + restOfName.split('-').join(' ');
  };

  function onSkillPress(skill: string, profOrExp: 'proficiency' | 'expertise', has: boolean) {
    switch (profOrExp) {
      case 'proficiency':
        if (has) dispatchDeleteSkills([skill])
        else dispatchSkills([skill])
        break;

      case 'expertise':
        if (has) dispatchDeleteExpertises([skill])
        else dispatchExpertises([skill])
        break;
    }

    AsyncStorage.setItem(id, JSON.stringify(store))
  }

  async function onFabPress() {
    if (editing) {
      AsyncStorage.setItem(id, JSON.stringify(store))
      setEditing(false)
    } else setEditing(true)
  };

  useFocusEffect(
    useCallback(() => {
      return onFabPress
    }, [])
  )


  return (
    <Container>
      <Content>
        <ScreenHeader title="SKILLS" subtitle={name} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {
            abilities.map((ability: string, index: number) => {
              const modifier = getAbilityModifier(abilityScores[ability].score);
              return (
                <Card style={{ width: getDimensions().width / 3 - 10, height: 90 }} key={index}>
                  <Text style={{ fontWeight: 'bold', textAlign: "center", fontSize: 20 }}>{ability}</Text>
                  <Text style={{ textAlign: "center", fontSize: 30 }}>{abilityScores[ability].score}</Text>
                  <Text style={{ textAlign: 'center', fontSize: 20 }}>{renderPlusOrMinus(modifier)}</Text>
                </Card>
              )
            })
          }
        </View>
        <List>
          <ListItem>
            <Text style={{ flex: 1.5, fontWeight: "bold" }}>Ability</Text>
            <Text style={{ flex: 2, fontWeight: "bold" }}>Proficiency</Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>Modifier</Text>
          </ListItem>
          {
            abilities.map((ability: string, index: number) => {
              const hasProf = abilityScores[ability].proficiency
              return (
                <ListItem key={index}>
                  <Text style={{ flex: 1.5 }}>{ability}</Text>
                  <Text style={{ flex: 2, fontWeight: hasProf ? 'bold' : 'normal' }}>{abilityScores[ability].proficiency ? 'YES' : 'NO'}</Text>
                  <Text style={{ flex: 1, fontWeight: 'bold' }}>{renderPlusOrMinus(getAbilityModifier(abilityScores[ability].score) + (abilityScores[ability].proficiency ? basicInfo.proficiencyBonus : 0))}</Text>
                </ListItem>
              )
            })
          }
        </List>
        <List>
          <ListItem>
            <Text style={{ flex: 1.5, fontWeight: 'bold' }}>Skill</Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>Proficiency</Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>Expertise</Text>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>Modifier</Text>
          </ListItem>
          {
            allSkills.map((skill: string, index: number) => {
              const hasProf = skills.includes(skill);
              const hasExpertise = expertises.includes(skill);
              return (
                <ListItem key={index}>
                  <Text style={{ flex: 1.5 }}>{parseSkillName(skill)}</Text>
                  {
                    editing ?
                      <>
                        <View style={{ flex: 1, justifyContent: "space-around" }}>
                          <Button small onPress={() => onSkillPress(skill, 'proficiency', hasProf)} bordered={!hasProf}><Text>{hasProf ? 'delete' : 'add'}</Text></Button>
                        </View>
                        <View style={{ flex: 1, justifyContent: "space-around" }}>
                          <Button small onPress={() => onSkillPress(skill, 'expertise', hasExpertise)} bordered={!hasExpertise}><Text>{hasExpertise ? 'delete' : 'add'}</Text></Button>
                        </View>
                      </> : <>
                        <Text style={{ flex: 1, fontWeight: hasProf ? "bold" : 'normal' }}>{hasProf ? 'YES' : 'NO'}</Text>
                        <Text style={{ flex: 1, fontWeight: hasExpertise ? "bold" : 'normal' }}>{hasExpertise ? 'YES' : 'NO'}</Text>
                      </>
                  }
                  <Text style={{ flex: 1, fontWeight: 'bold' }}>{resolveModifier(skill)}</Text>
                </ListItem>
              )
            })
          }
        </List>
        <Text style={[spellStyle.spellMain, {fontSize: 20, marginVertical: 20}]}>Other proficiencies</Text>
        <List>
          {
            Object.keys(proficiencies).map((prof: string, index: number) => 
            <ListItem key={index}>
              <Text style={spellStyle.spellSub}>{proficiencies[prof].name}</Text>
            </ListItem>
            )
          }
        </List>
      </Content>
      <Fab onPress={onFabPress}>
        <Icon />
      </Fab>
    </Container>
  )
}