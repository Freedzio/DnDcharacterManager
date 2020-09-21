import { JustUrl, Race, Proficiency, Trait, AbilityScores, Subrace } from '../common/models/models';
import { Card, Text, Container, Content, CardItem, Body, List, ListItem, View, H1 } from 'native-base'
import { addProficiencies, resetProficiencies } from '../redux/proficiencies';
import { setAbilityScore, resetAbilityScores } from '../redux/abilityScores';
import { CONFIRM_RACE_SCREEN } from '../common/constants/routeNames';
import getArrayOfNames from '../common/functions/getArrayOfNames';
import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BasicInfo, setBasicInfo } from '../redux/basicInfo';
import LoadingContainer from '../common/components/LoadingContainer';
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
import { setLoading } from '../redux/loading';

export default function ChooseRaceScreen({ navigation }: any) {
    const [races, setRaces] = useState<Array<string>>([]);
    const [subraces, setSubraces] = useState<Array<JustUrl>>([]);
    const [selectedRaceIndex, setSelectedRaceIndex] = useState<number | null>();
    const [selectedRace, setSelectedRace] = useState<string>('')

    const store = useSelector((store: StoreProps) => store);
    const loading = useSelector((store: StoreProps) => store.loading);

    const dispatchAbilityScores = (abilityScores: Partial<AbilityScores>) => dispatch(setAbilityScore(abilityScores));
    const dispatchProficiencies = (proficiencies: Array<Proficiency>) => dispatch(addProficiencies(proficiencies));
    const dispatchDescription = (description: string) => dispatch(setDescription(description));
    const dispatchLanguages = (languages: Array<string>) => dispatch(setLanguages(languages));
    const dispatchBasicInfo = (basicInfo: BasicInfo) => dispatch(setBasicInfo(basicInfo));
    const dispatchTraits = (traits: Array<Trait>) => dispatch(addTraits(traits));
    const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
    const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
    const dispatchRace = (race: string) => dispatch(setRace(race));
    const dispatch = useDispatch();

    async function getRaces() {
        return await apiWrapper(ApiConfig.races)
    };

    async function getRaceData(race: string) {
        return await apiWrapper(ApiConfig.race(race));
    }

    async function getSubraceData(subrace: string) {
        return await apiWrapper(ApiConfig.subrace(subrace));
    }

    async function getSubraces(race: string) {
        const data = await apiWrapper(ApiConfig.subraces(race));
        const results = await data.results
        return results
    }

    async function onRacePress(race: string, index: number) {
        dispatchRace(race);
        dispatchLoading(true);
        setSelectedRace(race);
        getRaceData(race).then(data => injectRaceData(data))

        const areSubraces = await checkForSubraces(race);

        dispatchTakeSnapshot();

        if (areSubraces) {
            setSubraces([])
            setSelectedRaceIndex(index)
            setSubraces(await getSubraces(race));
            dispatchLoading(false)

        } else {
            navigation.navigate(CONFIRM_RACE_SCREEN)
        }
    }

    async function onSubracePress(subrace: string) {
        dispatchLoading(true);
        getSubraceData(subrace).then(data => injectSubraceData(data));

        navigation.navigate(CONFIRM_RACE_SCREEN)
    }

    async function injectSubraceData(subraceData: Subrace) {
        dispatchRace(subraceData.name);
        dispatchDescription(subraceData.desc);
        dispatchTraits(await mapTraits(subraceData.racial_traits))
        dispatchAbilityScores(mapAbilityBonuses(subraceData.ability_bonuses))
        dispatchProficiencies(await mapProficiencies(subraceData.starting_proficiencies))
    }

    async function injectRaceData(raceData: Race) {
        dispatchProficiencies(await mapProficiencies(raceData.starting_proficiencies))
        dispatchAbilityScores(mapAbilityBonuses(raceData.ability_bonuses));
        dispatchLanguages(mapLanguages(raceData.languages));
        dispatchTraits(await (mapTraits(raceData.traits)))
        dispatchRace(raceData.name);
        dispatchBasicInfo({
            speed: raceData.speed,
            size: raceData.size,
            proficiencyBonus: 2
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

    async function checkForSubraces(race: string) {
        const data = await apiWrapper(ApiConfig.subraces(race))
        const thereAreSubraces = await data.count !== 0;

        return await thereAreSubraces
    }

    useEffect(() => {
        getRaces()
            .then(data => setRaces(getArrayOfNames(data.results))).then(() => dispatchLoading(false))
    }, []);

    useFocusEffect(
        useCallback(() => {
            setSelectedRaceIndex(null)
        }, [])
    )

    return (
        <Container>
            <Content>
                <ScreenHeader title='CHOOSE RACE' />
                <LoadingContainer ready={!loading}>
                    <List>
                        {
                            races.map((race, index) => {
                                const selected = index === selectedRaceIndex
                                return (
                                    <View key={index}>
                                        <TouchableOpacity onPress={() => onRacePress(race.toLowerCase(), index)}>
                                            <ListItem selected={selected}>
                                                <Body>
                                                    <Text style={{ fontWeight: selected ? 'bold' : 'normal' }}>
                                                        {race}
                                                    </Text>
                                                </Body>
                                            </ListItem>
                                        </TouchableOpacity>
                                        <View style={{ marginHorizontal: 30 }}>
                                            <List>
                                                {
                                                    subraces.map((subrace: JustUrl) => selected &&
                                                        <TouchableOpacity key={subrace.name} onPress={() => onSubracePress(subrace.index as string)}>
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
                </LoadingContainer>
            </Content>
        </Container>
    )
}