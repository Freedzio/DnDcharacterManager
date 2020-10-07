import React, { useState, useEffect } from 'react'
import apiWrapper from '../common/functions/apiWrapper';
import { ApiConfig } from '../common/constants/ApiConfig';
import getArrayOfNames from '../common/functions/getArrayOfNames';
import { Container, Content, Body, List, ListItem, Text } from 'native-base';
import ScreenHeader from '../common/components/ScreenHeader';
import LoadingContainer from '../common/components/LoadingContainer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CharacterClass, Proficiency, AbilityScores, Feature, LevelFeatures, ClassSpecific, Spellcasting, SpellcastingByLevel } from '../common/models/models';
import { useDispatch, useSelector } from 'react-redux';
import { StoreProps } from '../redux/store';
import { applySnapshot, takeSnapshot } from '../redux/snapshot';
import { addHitDie } from '../redux/hitDie';
import { addProficiencies } from '../redux/proficiencies';
import { setAbilityProficiencies } from '../redux/abilityScores';
import mapProficiencies from '../common/functions/mapProficiencies';
import { CONFIRM_CLASS_SCREEN } from '../common/constants/routeNames';
import { setLoading } from '../redux/loading';
import { addFeatures } from '../redux/features';
import { increaseMaxHP } from '../redux/maxHP';
import { setSpecifics } from '../redux/classSpecific';
import { setSpellcastingData } from '../redux/spellcasting';
import { levelClass } from '../redux/class';

export default function ChooseClassScreen({ navigation }: any) {
    const classes: CharacterClass[] = require('../database/Classes.json');
    const levels: LevelFeatures[] = require('../database/Levels.json');
    const features: Feature[] = require('../database/Features.json')

    const store = useSelector((store: StoreProps) => store);
    const snapshot = useSelector((store: StoreProps) => store.snapshot);

    const dispatch = useDispatch();
    const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
    const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
    const dispatchHitDie = (hitDie: number) => dispatch(addHitDie(hitDie));
    const dispatchMaxHP = (maxHP: number) => dispatch(increaseMaxHP(maxHP));
    const dispatchClass = (className: string) => dispatch(levelClass(className));
    const dispatchFeatures = (features: Array<Feature>) => dispatch(addFeatures(features));
    const dispatchProficiencies = (proficiencies: Array<Proficiency>) => dispatch(addProficiencies(proficiencies));
    const dispatchAbilityProficiencies = (savingThrows: Partial<AbilityScores>) => dispatch(setAbilityProficiencies(savingThrows));
    const dispatchClassSpecifics = (data: { [classId: string]: ClassSpecific }) => dispatch(setSpecifics(data));
    const dispatchSpellcasting = (payload: { classId: string, spellcasting: Partial<SpellcastingByLevel> }) => dispatch(setSpellcastingData(payload))

    async function onClassPress(className: string) {
        const classId = className.toLowerCase();
        dispatchTakeSnapshot();

        injectClassData(classes.filter(item => item.name === className)[0])

        const levelOneData = levels.filter(item => item.index === `${classId}-1`)[0];

        if (levelOneData.spellcasting) dispatchSpellcasting({ classId: classId, spellcasting: levelOneData.spellcasting });
        dispatchClassSpecifics({ [className]: levelOneData.class_specific })

        for (let i = 0; i < levelOneData.features.length; i++) {
            dispatchFeatures([features.filter(item => item.index === levelOneData.features[i].index)[0]])
        }

        navigation.navigate(CONFIRM_CLASS_SCREEN, { class: classId })
    }

    function injectClassData(classData: CharacterClass) {
        dispatchProficiencies(mapProficiencies(classData.proficiencies))
        dispatchClass(classData.name)
        dispatchHitDie(classData.hit_die);
        dispatchMaxHP(classData.hit_die);

        let savingThrows: Partial<AbilityScores> = {};

        for (let i = 0; i < classData.saving_throws.length; i++) {
            savingThrows = {
                ...savingThrows,
                [classData.saving_throws[i].name]: {
                    score: 0,
                    proficiency: true
                }
            }
        }

        dispatchAbilityProficiencies(savingThrows);
    }

    useEffect(() => {
        navigation.addListener('beforeRemove', () => {
            dispatchSnapshot();
        })
    }, [])

    return (
        <Container>
            <Content>
                <ScreenHeader title='CHOOSE CLASS' />
                <List>
                    {
                        classes.map((charClass: CharacterClass, index: number) =>
                            <TouchableOpacity key={index} onPress={() => onClassPress(charClass.name)}>
                                <ListItem>
                                    <Text>
                                        {charClass.name}
                                    </Text>
                                </ListItem>
                            </TouchableOpacity>
                        )
                    }
                </List>
            </Content>
        </Container>
    )
}