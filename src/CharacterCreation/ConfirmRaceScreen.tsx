import { Container, Content, H1, Text, View, Card, CardItem, Body, Row, Col, List, ListItem, Button } from 'native-base';
import { Race, AbilitySimple, JustUrl, Proficiency, Trait, AbilityScores } from '../common/models/models';
import resolveDescription from '../common/functions/resolveDescription';
import LoadingContainer from '../common/components/LoadingContainer';
import { addProficiencies } from '../redux/proficiencies';
import { setAbilityScore } from '../redux/abilityScores';
import apiWrapper from '../common/functions/apiWrapper';
import { Picker } from '@react-native-community/picker';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguages } from '../redux/languages';
import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../common/constants/ApiConfig';
import { StoreProps } from '../redux/store';
import { addTraits, handleDraconic } from '../redux/traits';
import Section from './Section';
import mapProficiencies from '../common/functions/mapProficiencies';
import { CHOOSE_CLASS_SCREEN } from '../common/constants/routeNames';
import { header } from '../common/styles/styles';
import ScreenHeader from '../common/components/ScreenHeader';
import { drakes, Drake } from './draconicAncestry';
import { applySnapshot, takeSnapshot } from '../redux/snapshot';
import Tile, { tileHeight } from './Tile';
import { setLoading } from '../redux/loading';

export default function ConfirmRaceScreen({ navigation, route }: any) {
    const [drake, setDrake] = useState<string>(drakes[0].dragon);
    const [tempRaceData, setTempRaceData] = useState<Race>()
    const [language, setLanguage] = useState<string>('choose');
    const [abilityBonus, setAbilityBonus] = useState<string>('');
    const [proficiency, setProficiency] = useState<string>('choose');
    const [chosenListItem, setChosenListItem] = useState<string>('');

    const proficiencies = useSelector((store: StoreProps) => store.proficiencies);
    const traits = useSelector((store: StoreProps) => store.traits);
    const abilityBonuses = useSelector((store: StoreProps) => store.abilityScores);
    const basicInfo = useSelector((store: StoreProps) => store.basicInfo);
    const snapshot = useSelector((store: StoreProps) => store.snapshot);
    const loading = useSelector((store: StoreProps) => store.loading);
    const race = useSelector((store: StoreProps) => store.race);
    const store = useSelector((store: StoreProps) => store);

    const dispatch = useDispatch();
    const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
    const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
    const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
    const dispatchHandleDraconic = (title: string) => dispatch(handleDraconic(title));
    const dispatchLanguages = (languages: Array<string>) => dispatch(setLanguages(languages));
    const dispatchProficiencies = (proficiencies: Array<Proficiency>) => dispatch(addProficiencies(proficiencies));
    const dispatchAbilityBonuses = (abilityBonuses: Partial<AbilityScores>) => dispatch(setAbilityScore(abilityBonuses));

    async function getRaceData() {
        return await apiWrapper(`${ApiConfig.race(race.toLowerCase())}`);
    };

    async function onNavigatingToNext() {
        dispatchLoading(true);
        dispatchTakeSnapshot();

        if (language !== 'choose') dispatchLanguages([language])
        if (abilityBonus !== '') {
            const payload = {
                [abilityBonus]: {
                    score: tempRaceData?.ability_bonus_options.from.filter(item => item.name === abilityBonus)[0].bonus as number,
                    proficiency: false
                }
            }

            dispatchAbilityBonuses(payload)
        }
        if (proficiency !== 'choose') dispatchProficiencies(await mapProficiencies(tempRaceData?.starting_proficiency_options.from.filter(item => item.name === proficiency) as JustUrl[]))
        if (race === 'Dragonborn') dispatchHandleDraconic(Object.values(drakes.filter(item => item.dragon === drake)[0]).join(', '))

        navigation.navigate(CHOOSE_CLASS_SCREEN)
    }

    useEffect(() => {
        navigation.addListener('beforeRemove', (e: any) => {
            dispatchSnapshot();
            dispatchLoading(false);

            return () => navigation.removeListener('beforeRemove')
        })
    }, [])

    useEffect(() => {
        getRaceData()
            .then(data => setTempRaceData(data)).then(() => dispatchLoading(false))
    }, [])

    return (
        <Container>
            <Content padder>
                <LoadingContainer ready={!loading}>
                    <ScreenHeader title='YOU CHOSE' subtitle={race} />
                    <Row>
                        {
                            race.toLowerCase() === 'human' ?
                                <Col>
                                    <Tile property="All" amount="+1" />
                                </Col>
                                : Object.keys(abilityBonuses).filter((ability: string) => abilityBonuses[ability].score !== 0).map((ability: string, index: number) =>
                                    <Col key={ability}>
                                        <Tile property={ability} amount={`+${abilityBonuses[ability].score}`} />
                                    </Col>
                                )
                        }
                        {
                            tempRaceData?.ability_bonus_options &&
                            <Col>
                                <Card style={{ height: tileHeight }}>
                                    <View style={{ flex: 1, justifyContent: "space-between" }}>
                                        <View>
                                            <Picker style={{ width: '100%' }} selectedValue={abilityBonus} onValueChange={v => setAbilityBonus(v as string)}>
                                                <Picker.Item value='' label='------' />
                                                {
                                                    tempRaceData?.ability_bonus_options.from.map((ability: JustUrl, index: number) =>
                                                        <Picker.Item key={index} value={ability.name} label={ability.name} />
                                                    )}
                                            </Picker>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                                                {abilityBonus !== '' && '+' + tempRaceData.ability_bonus_options.from.filter(item => item.name === abilityBonus)[0].bonus}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </Col>
                        }
                        <Col>
                            <Tile property='Speed' amount={basicInfo.speed} />
                        </Col>
                        <Col>
                            <Tile property="Size" amount={basicInfo.size} />
                        </Col>
                    </Row>
                    <Section
                        title='Alignment'
                        description={tempRaceData?.alignment}
                    />
                    <Section
                        title='Age'
                        description={tempRaceData?.age}
                    />
                    <Section
                        title='Size'
                        description={tempRaceData?.size_description}
                    />
                    <Section
                        title='Languages'
                        description={tempRaceData?.language_desc}
                        selectedVal={language}
                        setterCallback={setLanguage}
                        options={tempRaceData?.language_options}
                    />
                    {Object.keys(traits).length > 0 &&
                        <Section
                            title='Racial traits'
                            listedData={traits}
                            dragonborn={tempRaceData?.name === 'Dragonborn'}
                            setterCallback={setDrake}
                            selectedVal={drake}
                            chosenListItem={chosenListItem}
                            listItemCallback={setChosenListItem}
                            />
                        }
                    {Object.keys(proficiencies).length > 0 &&
                        <Section
                        title='Racial proficiencies'
                        listedData={proficiencies}
                        options={tempRaceData?.starting_proficiency_options}
                        setterCallback={setProficiency}
                        selectedVal={proficiency}
                        chosenListItem={chosenListItem}
                        listItemCallback={setChosenListItem}
                        />
                    }
                    <Button block onPress={onNavigatingToNext}>
                        <Text>
                            NEXT
                        </Text>
                    </Button>
                </LoadingContainer>
            </Content>
        </Container>
    )
}