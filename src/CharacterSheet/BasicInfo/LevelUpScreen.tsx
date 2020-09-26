import { Button, Container, Content, List, ListItem, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ScreenHeader from '../../common/components/ScreenHeader'
import { ApiConfig } from '../../common/constants/ApiConfig';
import { hitDieByClass } from '../../common/constants/hitDieByClass';
import apiWrapper from '../../common/functions/apiWrapper';
import { ClassSpecific, Feature, JustUrl, LevelFeatures, SpellcastingByLevel } from '../../common/models/models';
import { updateBasicInfo } from '../../redux/basicInfo';
import { levelClass } from '../../redux/class';
import { setSpecifics } from '../../redux/classSpecific';
import { addFeatures } from '../../redux/features';
import { addHitDie } from '../../redux/hitDie';
import { setSpellcastingData } from '../../redux/spellcasting';
import { StoreProps } from '../../redux/store';
import { triggerStore } from '../../redux/trigger';

export default function LevelUpScreen() {
  const [classesToLevel, setClasses] = useState<Array<JustUrl>>([]);

  const classes = useSelector((store: StoreProps) => store.classes);

  const dispatch = useDispatch();
  const dispatchLevelUp = (className: string) => dispatch(levelClass(className))
  const dispatchProfBonus = (bonus: number) => dispatch(updateBasicInfo({ proficiencyBonus: bonus }));
  const dispatchFeatures = (feats: Feature[]) => dispatch(addFeatures(feats));
  const dispatchClassSpecific = (data: { [className: string]: Partial<ClassSpecific> }) => dispatch(setSpecifics(data))
  const dispatchSpellcasting = (data: { classId: string, spellcasting: Partial<SpellcastingByLevel> }) => dispatch(setSpellcastingData(data));
  const dispatchTrigger = () => dispatch(triggerStore());
  const dispatchHitDie = (className: string) => dispatch(addHitDie(hitDieByClass[className]));

  async function onLevelUpPress(classObj: JustUrl) {
    let level = 1;
    if (Object.keys(classes).includes(classObj.name)) level = classes[classObj.name] + 1;

    dispatchLevelUp(classObj.name);
    dispatchHitDie(classObj.name)

    // if add new class => get class proficiencies and shit

    const data: LevelFeatures = await apiWrapper(ApiConfig.levelFeaturesByClass(classObj.index as string, level));

    dispatchProfBonus(data.prof_bonus);
    dispatchClassSpecific({ [classObj.name]: data.class_specific });
    if (data.spellcasting) dispatchSpellcasting({ classId: data.class.index as string, spellcasting: data.spellcasting });

    let features: Feature[] = [];

    for (let i = 0; i < data.features.length; i++) {
      const feat = await apiWrapper(ApiConfig.feature(data.features[i].index as string));
      features.push(feat);
    }

    dispatchFeatures(features);
    dispatchTrigger();

  }

  useEffect(() => {
    apiWrapper(ApiConfig.classes).then(data => setClasses(data.results))
  }, [])

  return (
    <Container>
      <Content>
        <ScreenHeader title='LEVEL UP' subtitle='Choose a class to level' />
        <List>
          {
            classesToLevel.map((item: JustUrl, index: number) =>
              <ListItem key={index}>
                <Text style={{ fontWeight: 'bold', flex: 1 }}>{item.name} (current level: {classes[item.name] || 0}) </Text>
                <Button small onPress={() => onLevelUpPress(item)}>
                  <Text>level up!</Text>
                </Button>
              </ListItem>
            )
          }
        </List>
      </Content>
    </Container>
  )
}