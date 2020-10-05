import { JustUrl, Race, Proficiency, Trait, AbilityScores, Subrace } from '../common/models/models';
import { Card, Text, Container, Content, CardItem, Body, List, ListItem, View, H1 } from 'native-base'
import { addProficiencies, resetProficiencies } from '../redux/proficiencies';
import { setAbilityScore, resetAbilityScores } from '../redux/abilityScores';
import { CONFIRM_RACE_SCREEN } from '../common/constants/routeNames';
import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BasicInfo, setBasicInfo } from '../redux/basicInfo';
import { useFocusEffect } from '@react-navigation/native';
import { addTraits, resetTraits } from '../redux/traits';
import apiWrapper from '../common/functions/apiWrapper';
import { setDescription } from '../redux/description';
import { setLanguages } from '../redux/languages';
import { ApiConfig } from '../common/constants/ApiConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setRace } from '../redux/race';
import _ from 'lodash'
import mapProficiencies from '../common/functions/mapProficiencies';
import mapTraits from '../common/functions/mapTraits';
import ScreenHeader from '../common/components/ScreenHeader';
import { StoreProps } from '../redux/store';
import { takeSnapshot } from '../redux/snapshot';
import { setSubrace } from '../redux/subrace';
import reactotron from '../../ReactotronConfig';

export default function ChooseRaceScreen({ navigation }: any) {
    const races: Race[] = require('../database/Races.json');
    const subraces: Subrace[] = require('../database/Subraces.json');

    const [selectedRaceIndex, setSelectedRaceIndex] = useState<number | null>();
    const [selectedRace, setSelectedRace] = useState<string>('')

    const store = useSelector((store: StoreProps) => store);

    const dispatchAbilityScores = (abilityScores: Partial<AbilityScores>) => dispatch(setAbilityScore(abilityScores));
    const dispatchProficiencies = (proficiencies: Array<Proficiency>) => dispatch(addProficiencies(proficiencies));
    const dispatchDescription = (description: string) => dispatch(setDescription(description));
    const dispatchLanguages = (languages: Array<string>) => dispatch(setLanguages(languages));
    const dispatchBasicInfo = (basicInfo: BasicInfo) => dispatch(setBasicInfo(basicInfo));
    const dispatchTraits = (traits: Array<Trait>) => dispatch(addTraits(traits));
    const dispatchSubrace = (subrace: string) => dispatch(setSubrace(subrace))
    const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
    const dispatchRace = (race: string) => dispatch(setRace(race));
    const dispatch = useDispatch();

    async function onRacePress(race: string, index: number) {
        const areSubraces = races.filter(item => item.index === race)[0].subraces.length > 0;

        setSelectedRace(race);

        dispatchTakeSnapshot();

        if (areSubraces) {
            setSelectedRaceIndex(index)
        } else {
            injectRaceData(races.filter(item => item.index === race)[0]);
            navigation.navigate(CONFIRM_RACE_SCREEN)
        }
    }

    async function onSubracePress(subrace: string) {
        const subraceObj = subraces.filter(item => item.index === subrace)[0]
        injectRaceData(races.filter(item => item.index === subraceObj.race.index)[0])
        injectSubraceData(subraceObj)

        navigation.navigate(CONFIRM_RACE_SCREEN)
    }

    async function injectSubraceData(subraceData: Subrace) {
        dispatchSubrace(subraceData.name);
        dispatchDescription(subraceData.desc);
        dispatchTraits(mapTraits(subraceData.racial_traits))
        dispatchAbilityScores(mapAbilityBonuses(subraceData.ability_bonuses))
        dispatchProficiencies(mapProficiencies(subraceData.starting_proficiencies))
    }

    async function injectRaceData(raceData: Race) {
        dispatchProficiencies(mapProficiencies(raceData.starting_proficiencies))
        dispatchAbilityScores(mapAbilityBonuses(raceData.ability_bonuses));
        dispatchLanguages(mapLanguages(raceData.languages));
        dispatchTraits((mapTraits(raceData.traits)))
        dispatchRace(raceData.name);
        dispatchBasicInfo({
            speed: raceData.speed,
            size: raceData.size,
            proficiencyBonus: 2,
            alignment: raceData.alignment,
            age: raceData.age,
            languagesDesc: raceData.language_desc
        });
    }

    function mapLanguages(languages: Array<any>) {
        return Array.from(languages).reduce((arr: Array<any>, language: JustUrl) => {
            arr.push(language.name);

            return arr
        }, [])
    }

    function mapAbilityBonuses(bonusesArr: Array<any>) {
        return bonusesArr.reduce((obj: Object, ability: JustUrl) => {
            return obj = {
                ...obj,
                [ability.name as string]: {
                    score: ability.bonus
                }
            }
        }, {});
    }

    useFocusEffect(
        useCallback(() => {
            setSelectedRaceIndex(null)
        }, [])
    );

    return (
        <Container>
            <Content>
                <ScreenHeader title='CHOOSE RACE' />
                <List>
                    {
                        races.map((race: any, index: number) => {
                            const selected = index === selectedRaceIndex
                            return (
                                <View key={index}>
                                    <TouchableOpacity onPress={() => onRacePress(race.index, index)}>
                                        <ListItem selected={selected}>
                                            <Body>
                                                <Text style={{ fontWeight: selected ? 'bold' : 'normal' }}>
                                                    {race.name}
                                                </Text>
                                            </Body>
                                        </ListItem>
                                    </TouchableOpacity>
                                    <View style={{ marginHorizontal: 30 }}>
                                        <List>
                                            {
                                                subraces.filter((subrace: Subrace) => subrace.race.index === selectedRace).map((subrace: Subrace) => selected &&
                                                    <TouchableOpacity key={subrace.name} onPress={() => onSubracePress(subrace.index)}>
                                                        <ListItem>
                                                            <Text>
                                                                {subrace.name}
                                                            </Text>
                                                        </ListItem>
                                                    </TouchableOpacity>
                                                )}
                                        </List>
                                    </View>
                                </View>
                            )
                        })
                    }
                </List>
            </Content>
        </Container>
    )
}