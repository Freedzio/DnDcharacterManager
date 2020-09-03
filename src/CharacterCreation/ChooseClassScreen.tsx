import React, { useState, useEffect } from 'react'
import DummyView from '../common/components/DummyView'
import apiWrapper from '../common/functions/apiWrapper';
import { ApiConfig } from '../common/constants/ApiConfig';
import getArrayOfNames from '../common/functions/getArrayOfNames';
import { Container, Content, Body, List, ListItem, Text } from 'native-base';
import ScreenHeader from '../common/components/ScreenHeader';
import LoadingContainer from '../common/components/LoadingContainer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CharacterClass, Proficiency, JustUrl, AbilityScores, ChoosingOptions } from '../common/models/models';
import { useDispatch, useSelector } from 'react-redux';
import { StoreProps } from '../redux/store';
import { applySnapshot, takeSnapshot } from '../redux/snapshot';
import { setHitDie } from '../redux/hitDie';
import { addProficiencies } from '../redux/proficiencies';
import { setAbilityProficiencies } from '../redux/abilityScores';
import mapProficiencies from '../common/functions/mapProficiencies';
import { CONFIRM_CLASS_SCREEN } from '../common/constants/routeNames';
import { setClass } from '../redux/class';
import { setLoading } from '../redux/loading';

export default function ChooseClassScreen({ navigation }: any) {
    const [classes, setClasses] = useState<Array<string>>([]);

    const store = useSelector((store: StoreProps) => store);
    const loading = useSelector((store: StoreProps) => store.loading);
    const snapshot = useSelector((store: StoreProps) => store.snapshot);

    const dispatch = useDispatch();
    const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
    const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
    const dispatchHitDie = (hitDie: number) => dispatch(setHitDie(hitDie));
    const dispatchClass = (className: string) => dispatch(setClass(className));
    const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
    const dispatchProficiencies = (proficiencies: Array<Proficiency>) => dispatch(addProficiencies(proficiencies));
    const dispatchAbilityProficiencies = (savingThrows: Partial<AbilityScores>) => dispatch(setAbilityProficiencies(savingThrows));

    async function getClasses() {
        const data = await apiWrapper(ApiConfig.classes);
        return await data
    }

    async function getClassData(className: string) {
        const data = await apiWrapper(ApiConfig.class(className))
        return await data
    }

    async function onClassPress(className: string) {
        dispatchTakeSnapshot();
        dispatchLoading(true);

        getClassData(className)
            .then(data => injectClassData(data))
            .then(() => navigation.navigate(CONFIRM_CLASS_SCREEN, { class: className }))
    }

    function injectClassData(classData: CharacterClass) {
        mapProficiencies(classData.proficiencies).then(data => dispatchProficiencies(data))
        dispatchClass(classData.name)
        dispatchHitDie(classData.hit_die);

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
        getClasses().then(data => setClasses(getArrayOfNames(data.results))).then(() => dispatchLoading(false))
    }, [])

    useEffect(() => {
        navigation.addListener('beforeRemove', () => {
            dispatchSnapshot();
        })
    }, [])

    return (
        <Container>
            <Content>
                <ScreenHeader title='CHOOSE CLASS' />
                <LoadingContainer ready={!loading} >
                    <List>
                        {
                            classes.map((className: string, index: number) =>
                                <TouchableOpacity key={index} onPress={() => onClassPress(className.toLowerCase())}>
                                    <ListItem>
                                        <Text>
                                            {className}
                                        </Text>
                                    </ListItem>
                                </TouchableOpacity>
                            )
                        }
                    </List>
                </LoadingContainer>
            </Content>
        </Container>
    )
}