import { map } from 'lodash';
import { Button, Col, Container, Content, Input, List, ListItem, Text, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux'
import ScreenHeader from '../../common/components/ScreenHeader'
import { hitDieByClass } from '../../common/constants/hitDieByClass';
import { createObjectForChoosing } from '../../common/functions/createObjectForChoosing';
import getAbilityModifier from '../../common/functions/getAbilityModifier';
import { preventNaN } from '../../common/functions/preventNaN';
import { renderPickersForSegment } from '../../common/functions/renderPickersForSegment';
import renderPlusOrMinus from '../../common/functions/renderPlusOrMinus';
import { Feature, ClassSpecific, SpellcastingByLevel, LevelFeatures, CharacterClass, Chooser, Multiclassing, JustUrl, ChoosingOptions } from '../../common/models/models';
import { spellStyle } from '../../common/styles/styles';
import { updateBasicInfo } from '../../redux/basicInfo';
import { levelClass } from '../../redux/class';
import { setSpecifics } from '../../redux/classSpecific';
import { addFeatures } from '../../redux/features';
import { addHitDie } from '../../redux/hitDie';
import { setSpellcastingData } from '../../redux/spellcasting';
import { StoreProps } from '../../redux/store';

export default function ConfirmLevelUpScreen({ route }: any) {
  const multiclassing: Multiclassing[] = require('../../database/Multiclassing.json');
  const classesJSON: CharacterClass[] = require('../../database/Classes.json');
  const featuresJSON: Feature[] = require('../../database/Features.json');
  const featuresByLevel: LevelFeatures[] = require('../../database/Levels.json');

  const [chosenProficiencies, setChosenProficiencies] = useState<Chooser>({});
  const [chosenFeatures, setChosenFeatures] = useState<Chooser>({});
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [choosersData, setChoosersData] = useState<ChoosingOptions[]>([]);
  const [maxHPIncreaseType, setMaxHPIncreaseType] = useState<'roll' | 'custom' | ''>('');
  const [HP, setHP] = useState<string>('')

  const { classObj, level } = route.params;

  const profBonusThresholds = {
    1: 2,
    5: 3,
    9: 4,
    13: 5,
    17: 6
  }

  const classes = useSelector((store: StoreProps) => store.classes);
  const profBonus = useSelector((store: StoreProps) => store.basicInfo.proficiencyBonus);
  const abilityScores = useSelector((store: StoreProps) => store.abilityScores);

  const dispatch = useDispatch();
  const dispatchLevelUp = (className: string) => dispatch(levelClass(className))
  const dispatchProfBonus = (bonus: number) => dispatch(updateBasicInfo({ proficiencyBonus: bonus }));
  const dispatchFeatures = (feats: Feature[]) => dispatch(addFeatures(feats));
  const dispatchClassSpecific = (data: { [className: string]: Partial<ClassSpecific> }) => dispatch(setSpecifics(data))
  const dispatchSpellcasting = (data: { classId: string, spellcasting: Partial<SpellcastingByLevel> }) => dispatch(setSpellcastingData(data));
  const dispatchHitDie = (className: string) => dispatch(addHitDie(hitDieByClass[className]));

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

  function getLevelData() {
    return featuresByLevel.filter(item => item.index === `${classObj.index}-${level}`)[0]
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

  function onHPIncreasyTypePress(customOrRoll: 'custom' | 'roll') {
    setMaxHPIncreaseType(customOrRoll);

    if (customOrRoll === 'roll') setHP(Math.ceil(Math.random() * classesJSON.filter(item => item.index === classObj.index)[0].hit_die).toString())
  }

  function onHPChange(v: string) {
    setHP(preventNaN(v).toString())
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
        </List>
      </Content>
    </Container>
  )
}