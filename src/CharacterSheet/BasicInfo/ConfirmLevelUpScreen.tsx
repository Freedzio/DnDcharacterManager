import { Picker } from '@react-native-community/picker';
import { Button, Col, Container, Content, Input, List, ListItem, Text, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux'
import ScreenHeader from '../../common/components/ScreenHeader'
import { abilities } from '../../common/constants/abilitiesArray';
import { hitDieByClass } from '../../common/constants/hitDieByClass';
import { createObjectForChoosing } from '../../common/functions/createObjectForChoosing';
import getAbilityModifier from '../../common/functions/getAbilityModifier';
import { preventNaN } from '../../common/functions/preventNaN';
import { renderPickersForSegment } from '../../common/functions/renderPickersForSegment';
import renderPlusOrMinus from '../../common/functions/renderPlusOrMinus';
import { Feature, ClassSpecific, SpellcastingByLevel, LevelFeatures, CharacterClass, Chooser, Multiclassing, JustUrl, ChoosingOptions, Proficiency, AbilityScores, Spellcasting } from '../../common/models/models';
import { spellStyle } from '../../common/styles/styles';
import { updateBasicInfo } from '../../redux/basicInfo';
import { levelClass } from '../../redux/class';
import { setSpecifics } from '../../redux/classSpecific';
import { addFeatures } from '../../redux/features';
import { addHitDie } from '../../redux/hitDie';
import { addProficiencies } from '../../redux/proficiencies';
import { addSkills } from '../../redux/skills';
import { setSpellcastingData } from '../../redux/spellcasting';
import { StoreProps } from '../../redux/store';
import _ from 'lodash'
import reactotron from '../../../ReactotronConfig';
import { setAllAbilityScores } from '../../redux/abilityScores';
import { increaseMaxHP } from '../../redux/maxHP';

const initialAbilityScores = {
  'STR': {
    score: 0,
    proficiency: false
  },
  'DEX': {
    score: 0,
    proficiency: false
  },
  'CON': {
    score: 0,
    proficiency: false
  },
  'WIS': {
    score: 0,
    proficiency: false
  },
  'INT': {
    score: 0,
    proficiency: false
  },
  'CHA': {
    score: 0,
    proficiency: false
  }
}

export default function ConfirmLevelUpScreen({ route, navigation }: any) {
  const multiclassing: Multiclassing[] = require('../../database/Multiclassing.json');
  const classesJSON: CharacterClass[] = require('../../database/Classes.json');
  const featuresJSON: Feature[] = require('../../database/Features.json');
  const featuresByLevel: LevelFeatures[] = require('../../database/Levels.json');
  const proficeinciesJSON: Proficiency[] = require('../../database/Proficiencies.json');

  const [chosenProficiency, setChosenProficiency] = useState<string>('');
  const [chosenInstrument, setChosenInstrument] = useState<string>('');
  const [chosenFeatures, setChosenFeatures] = useState<Chooser>({});
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [choosersData, setChoosersData] = useState<ChoosingOptions[]>([]);
  const [maxHPIncreaseType, setMaxHPIncreaseType] = useState<'roll' | 'custom' | ''>('');
  const [HP, setHP] = useState<string>('');
  const [localAbilityScores, setLocalAbilityScores] = useState<AbilityScores>(initialAbilityScores);
  const [scoreUpCounter, setScoreUpCounter] = useState<number>(0);

  const classObj: JustUrl = route.params.classObj;
  const level: number = route.params.level;

  const profBonusThresholds = {
    1: 2,
    5: 3,
    9: 4,
    13: 5,
    17: 6
  }

  const classes = useSelector((store: StoreProps) => store.classes);
  const subclasses = useSelector((store: StoreProps) => store.subclasses);
  const skills = useSelector((store: StoreProps) => store.skills);
  const profBonus = useSelector((store: StoreProps) => store.basicInfo.proficiencyBonus);
  const abilityScores = useSelector((store: StoreProps) => store.abilityScores);

  const dispatch = useDispatch();
  const dispatchProficiencies = (proficiencies: Proficiency[]) => dispatch(addProficiencies(proficiencies))
  const dispatchLevelUp = (className: string) => dispatch(levelClass(className))
  const dispatchSkill = (skill: string) => dispatch(addSkills([skill]))
  const dispatchProfBonus = (bonus: number) => dispatch(updateBasicInfo({ proficiencyBonus: bonus }));
  const dispatchFeatures = (feats: Feature[]) => dispatch(addFeatures(feats));
  const dispatchClassSpecific = (data: { [className: string]: Partial<ClassSpecific> }) => dispatch(setSpecifics(data))
  const dispatchSpellcasting = (data: { classId: string, spellcasting: Partial<SpellcastingByLevel> }) => dispatch(setSpellcastingData(data));
  const dispatchHitDie = (className: string) => dispatch(addHitDie(hitDieByClass[className]));
  const dispatchAbilityScores = (scores: {[key: string]: {score: number, proficiency?: boolean}}) => dispatch(setAllAbilityScores(scores))
  const dispatchMaxHP = (hp: number) => dispatch(increaseMaxHP(hp));

  function getNewProfBonus() {
    const totalLevels = Object.values(classes).reduce((total, current) => {
      return total + current
    }, 0);

    const thresholds = Object.keys(profBonusThresholds);

    for (let i = 0; i < thresholds.length; i++) {
      if (parseInt(thresholds[i]) > totalLevels + 1) return parseInt(thresholds[i - 1])
    }

    return 2
  };

  function getLevelData(): LevelFeatures {
    const subclassData = featuresByLevel.find(item => item.index === `${subclasses[classObj.index as string]}-${level}`);
    const classData = featuresByLevel.find(item => item.index === `${classObj.index}-${level}`) as LevelFeatures;
    
    const newInfo = _.merge(_.cloneDeep(subclassData), _.cloneDeep(classData));
    
    return newInfo
  }

  function onItemPress(item: string) {
    if (selectedItem === item) setSelectedItem('')
    else setSelectedItem(item);
  }

  useEffect(() => {
    let arr: ChoosingOptions[] = [];
    const choices = getLevelData().feature_choices;
    for (let i = 0; i < choices.length; i++) {
      arr.push(featuresJSON.filter(feat => feat.index === choices[i].index)[0].choice)
    }

    setChoosersData(arr);

    const featureObj = createObjectForChoosing(arr);
    setChosenFeatures(featureObj);
  }, []);

  useEffect(() => {
    setLocalAbilityScores(abilityScores);
    setScoreUpCounter(0)
  }, [])

  function getMulticlassingData() {
    return multiclassing.find(item => item.index === classObj.index);
  }

  function onHPIncreasyTypePress(customOrRoll: 'custom' | 'roll') {
    setMaxHPIncreaseType(customOrRoll);

    if (customOrRoll === 'roll') setHP(Math.ceil(Math.random() * classesJSON.filter(item => item.index === classObj.index)[0].hit_die).toString())
  }

  function onHPChange(v: string) {
    setHP(preventNaN(v).toString())
  }

  function onAbilityScoreChange(ability: string, action: 'up' | 'down') {
    let newScore = { ...localAbilityScores };
    if (action === 'up') {
      setScoreUpCounter(scoreUpCounter + 1);

      newScore = {
        ...newScore,
        [ability]: {
          ...newScore[ability],
          score: newScore[ability].score + 1
        }
      };
    } else {
      setScoreUpCounter(scoreUpCounter - 1);

      newScore = {
        ...newScore,
        [ability]: {
          ...newScore[ability],
          score: newScore[ability].score - 1
        }
      }
    }

    setLocalAbilityScores(newScore)
  }

  function dispatchNewStuff() {
    dispatchLevelUp(classObj.name);
    dispatchProficiencies(proficeinciesJSON.filter(item => item.index === chosenInstrument));
    dispatchSkill(chosenProficiency);
    if (getNewProfBonus() !== profBonus) dispatchProfBonus(getNewProfBonus());

    let feats: Feature[] = [];
    for (let i = 0; i < getLevelData().features.length; i++) {
      const feat = getLevelData().features[i];
      feats.push(featuresJSON.find(item => item.index === feat.index) as Feature)
    }

    for (let i = 0; i < Object.keys(chosenFeatures).length; i++) {
      const key = Object.keys(chosenFeatures)[i];
      if (chosenFeatures[key] !== 'choose') feats.push(featuresJSON.find(item => item.index === chosenFeatures[key]) as Feature);
    }

    dispatchFeatures(feats);
    dispatchClassSpecific({[classObj.name]: getLevelData().class_specific});
    if (getLevelData().spellcasting) dispatchSpellcasting({classId: classObj.index as string, spellcasting: getLevelData().spellcasting as SpellcastingByLevel}) 
    dispatchHitDie(classObj.name);
    dispatchAbilityScores(localAbilityScores);
    dispatchMaxHP(parseInt(HP))

    navigation.goBack()
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title="LEVEL UP!" subtitle='You gain:' />
        <List>
          <ListItem>
            <Text style={spellStyle.levelHeader}>Features:</Text>
          </ListItem>
          {
            getLevelData().features.map((feat: JustUrl, index: number) =>
              <>
                <TouchableOpacity key={index} onPress={() => onItemPress(feat.index as string)}>
                  <ListItem>
                    <Text style={spellStyle.spellMain}>{feat.name}</Text>
                  </ListItem>
                  {
                    selectedItem === feat.index &&
                    <View>
                      {
                        featuresJSON.filter(item => item.index === selectedItem)[0].desc.map((desc: string, index: number) =>
                          <Text key={index} style={spellStyle.desc}>{desc}</Text>
                        )
                      }
                    </View>
                  }
                </TouchableOpacity>
                {
                  feat.index?.includes('ability-score-improvement') &&
                  abilities.map((ability: string, index: number) =>
                    <ListItem style={{ flexDirection: "row", justifyContent: "space-around" }} key={index}>
                      <Text style={{ flex: 1 }}>{ability}{abilityScores[ability].proficiency ? '*' : ''} </Text>
                      <Text style={{ flex: 1 }}>{localAbilityScores[ability].score}</Text>
                      <Text style={{ flex: 1 }}>{renderPlusOrMinus(getAbilityModifier(localAbilityScores[ability].score))}</Text>
                      <Button style={{ marginHorizontal: 20 }} onPress={() => onAbilityScoreChange(ability, 'down')} small disabled={localAbilityScores[ability].score === abilityScores[ability].score}>
                        <Text>-</Text>
                      </Button>
                      <Button style={{ marginHorizontal: 20 }} onPress={() => onAbilityScoreChange(ability, 'up')} small disabled={scoreUpCounter >= 2}>
                        <Text>+</Text>
                      </Button>
                    </ListItem>
                  )
                }
              </>
            )
          }
          {
            getLevelData().feature_choices.map((feat: JustUrl, index: number) =>
              <TouchableOpacity key={index} onPress={() => onItemPress(feat.index as string)}>
                <ListItem>
                  <Text style={spellStyle.spellMain}>{feat.name}</Text>
                </ListItem>
                {
                  selectedItem === feat.index &&
                  <View>
                    {
                      featuresJSON.filter(item => item.index === selectedItem)[0].desc.map((desc: string, index: number) =>
                        <Text key={index} style={spellStyle.desc}>{desc}</Text>
                      )
                    }
                  </View>
                }
              </TouchableOpacity>
            )
          }
          {
            choosersData.map((setOfChoices: ChoosingOptions, index: number) =>
              renderPickersForSegment(setOfChoices, index, chosenFeatures, setChosenFeatures, 'Choose')
            )
          }
          {
            getNewProfBonus() > profBonus &&
            <>
              <ListItem>
                <Text style={spellStyle.levelHeader}>Proficiency bonus up!</Text>
              </ListItem>
              <ListItem>
                <Text style={spellStyle.desc}>New bonus: {getNewProfBonus()}</Text>
              </ListItem>
            </>
          }
          <ListItem>
            <Text style={spellStyle.levelHeader}>Max HP increase:</Text>
          </ListItem>
          <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
            <Button bordered={maxHPIncreaseType !== 'custom'} onPress={() => onHPIncreasyTypePress('custom')}>
              <Text>custom</Text>
            </Button>
            <Button bordered={maxHPIncreaseType !== 'roll'} onPress={() => onHPIncreasyTypePress('roll')}>
              <Text>roll</Text>
            </Button>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
            <Col size={7}>
              <Input
                value={HP}
                onChangeText={v => onHPChange(v)}
                disabled={maxHPIncreaseType === 'roll'}
                keyboardType='decimal-pad'
                style={
                  {
                    textAlign: "center",
                    borderWidth: 1,
                    margin: 5
                  }
                }
              />
            </Col>
            <Col size={5}>
              <Text style={{ fontSize: 30, textAlign: "center", marginVertical: 15 }}>{renderPlusOrMinus(getAbilityModifier(abilityScores['CON'].score))} </Text>
            </Col>
          </View>
          {
            ['rogue', 'bard', 'ranger'].includes(classObj.index as string) && level === 1 &&
            <>
              <ListItem>
                <Text style={spellStyle.levelHeader}>By multiclassing you gain:</Text>
              </ListItem>
              <ListItem>
                <Text>A proficiency</Text>
              </ListItem>
              <Picker
                style={{ width: 360 }}
                selectedValue={chosenProficiency}
                onValueChange={chosenValue => setChosenProficiency(chosenValue as string)}>
                <Picker.Item value='' label='--Choose--' />
                {
                  getMulticlassingData()?.proficiency_choices.find(choice => choice.type === 'proficiencies')?.from.filter(item => !skills.includes(item.index?.replace('skill-', '') as string)).map((item: JustUrl, index: number) =>
                    <Picker.Item value={item.index as string} label={item.name} />
                  )
                }
              </Picker>
              {
                classObj.index === 'bard' &&
                <>
                  <ListItem>
                    <Text>Also, a proficiency in one musical instrument</Text>
                  </ListItem>
                  <Picker
                    style={{ width: 360 }}
                    selectedValue={chosenInstrument}
                    onValueChange={chosenValue => setChosenInstrument(chosenValue as string)}>
                    <Picker.Item value='' label='--Choose--' />
                    {
                      getMulticlassingData()?.proficiency_choices.find(choice => choice.type === 'instruments')?.from.map((item: JustUrl, index: number) =>
                        <Picker.Item value={item.index as string} label={item.name} />
                      )
                    }
                  </Picker>
                </>
              }
            </>
          }
        </List>
        <Button block onPress={() => dispatchNewStuff()}>
          <Text>FUCK YEAH</Text>
        </Button>
      </Content>
    </Container>
  )
}