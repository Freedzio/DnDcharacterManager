import { Container, Content } from 'native-base'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ScreenHeader from '../../common/components/ScreenHeader'
import { ApiConfig } from '../../common/constants/ApiConfig';
import { hitDieByClass } from '../../common/constants/hitDieByClass';
import apiWrapper from '../../common/functions/apiWrapper';
import { Feature, ClassSpecific, SpellcastingByLevel, LevelFeatures, CharacterClass } from '../../common/models/models';
import { updateBasicInfo } from '../../redux/basicInfo';
import { levelClass } from '../../redux/class';
import { setSpecifics } from '../../redux/classSpecific';
import { addFeatures } from '../../redux/features';
import { addHitDie } from '../../redux/hitDie';
import { setSpellcastingData } from '../../redux/spellcasting';
import { StoreProps } from '../../redux/store';

export default function ConfirmLevelUpScreen({  }: any) {

  const profBonus = useSelector((store: StoreProps) => store.basicInfo.proficiencyBonus);
  const classes = useSelector((store:StoreProps) => store.classes);

  const dispatch = useDispatch();
  const dispatchLevelUp = (className: string) => dispatch(levelClass(className))
  const dispatchProfBonus = (bonus: number) => dispatch(updateBasicInfo({ proficiencyBonus: bonus }));
  const dispatchFeatures = (feats: Feature[]) => dispatch(addFeatures(feats));
  const dispatchClassSpecific = (data: { [className: string]: Partial<ClassSpecific> }) => dispatch(setSpecifics(data))
  const dispatchSpellcasting = (data: { classId: string, spellcasting: Partial<SpellcastingByLevel> }) => dispatch(setSpellcastingData(data));
  const dispatchHitDie = (className: string) => dispatch(addHitDie(hitDieByClass[className]));

  // async function getLevelData() {
  //   const className = Object.keys(classes)[0]

  //   dispatchLevelUp(className);
  //   dispatchHitDie(className);

  //   // if add new class => get class proficiencies and shit

  //   const data: LevelFeatures = await apiWrapper(ApiConfig.levelFeaturesByClass(classObj.index as string, level));

  //   dispatchClassSpecific({ [classObj.name]: data.class_specific });
  //   if (data.prof_bonus > profBonus) dispatchProfBonus(data.prof_bonus);
  //   if (data.spellcasting) dispatchSpellcasting({ classId: data.class.index as string, spellcasting: data.spellcasting });

  //   if (level === 1) {
  //     const newClassData: CharacterClass = await apiWrapper(ApiConfig.class(classObj.index));

  //   }

  //   let features: Feature[] = [];

  //   for (let i = 0; i < data.features.length; i++) {
  //     const feat = await apiWrapper(ApiConfig.feature(data.features[i].index as string));
  //     features.push(feat);
  //   }

  //   dispatchFeatures(features);
  // }

  return (
    <Container>
      <Content>
        <ScreenHeader title="LEVEL UP!" subtitle='You gain:' />
      </Content>
    </Container>
  )
}