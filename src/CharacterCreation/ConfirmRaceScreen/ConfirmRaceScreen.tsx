import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../../common/ApiConfig';
import { Container, Content, H1, Text, View, Card, CardItem, Body, Row, Col, List, ListItem } from 'native-base';
import { StyleSheet } from 'react-native';
import LoadingContainer from '../../common/LoadingContainer';
import { Race, AbilitySimple, JustUrl, Proficiency, Trait } from '../../common/models/models';
import Section from './Section';
import apiWrapper from '../../common/functions/apiWrapper';
import { Picker } from '@react-native-community/picker';
import { useSelector } from 'react-redux';
import { StoreProps } from '../../redux/store';
import resolveDescription from '../../common/functions/resolveDescription';

const tileHeight = 80;

function Tile({ property, amount }: Tile) {
    return (
        <Card style={{ padding: 10, height: tileHeight }}>
            <View style={{ flex: 1, justifyContent: "space-around" }}>
                <Text style={{ textAlign: "center" }}>
                    {property}
                </Text>
                <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {amount}
                </Text>
            </View>
        </Card>
    )
}

export default function ConfirmRaceScreen({ navigation, route }: any) {
    const [tempRaceData, setTempRaceData] = useState<Race>();
    const [ready, setReady] = useState(false);
    const [language, setLanguage] = useState<string>('choose');
    const [drake, setDrake] = useState<string>('choose');
    const [proficiency, setProficiency] = useState<string>('choose');
    const [abilityBonus, setAbilityBonus] = useState<string>('')

    const raceId = route.params.raceId;

    const race = useSelector((store: StoreProps) => store.race);
    const abilityBonuses = useSelector((store: StoreProps) => store.abilityScores);
    const basicInfo = useSelector((store: StoreProps) => store.basicInfo);
    const traits = useSelector((store: StoreProps) => mapForAccordionSake(store.traits));
    const proficiencies = useSelector((store: StoreProps) => mapForAccordionSake(store.proficiencies))

    function mapForAccordionSake(items: { [index: string]: Proficiency | Trait }) {
        const keys = Object.keys(items)

        let arr: Array<{ title: string, content: string }> = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const obj = {
                title: items[key].name,
                content: resolveDescription(items[key]).join(' ')
            }
            arr.push(obj)
        }

        return arr
    }

    async function getRaceData() {
        const data = await apiWrapper(`${ApiConfig.race(raceId)}`);
        return data
    };

    useEffect(() => {
        getRaceData()
            .then(data => setTempRaceData(data)).then(() => setReady(true))
    }, [])

    return (
        <Container>
            <Content padder>
                <LoadingContainer ready={ready}>
                    <Text style={styles.header}>YOU CHOSE</Text>
                    <Text style={styles.subHeader}>{race}</Text>
                    <Row>
                        {
                            race.toLowerCase() === 'human' ?
                                <Col>
                                    <Tile property="All" amount="+1" />
                                </Col>
                                : Object.keys(abilityBonuses).filter((ability: string) => abilityBonuses[ability] !== 0).map((ability: string, index: number) =>
                                    <Col key={ability}>
                                        <Tile property={ability} amount={`+${abilityBonuses[ability]}`} />
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
                            <Tile property={'Speed'} amount={basicInfo.speed} />
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
                    {tempRaceData?.traits.length !== 0 &&
                        <Section
                            title='Traits'
                            listedData={traits}
                            dragonborn={tempRaceData?.name === 'Dragonborn'}
                            setterCallback={setDrake}
                            selectedVal={drake}
                        />
                    }
                    {tempRaceData?.starting_proficiencies.length !== 0 &&
                        <Section
                            title='Proficiencies'
                            listedData={proficiencies}
                            options={tempRaceData?.starting_proficiency_options}
                            setterCallback={setProficiency}
                            selectedVal={proficiency}
                        />
                    }
                </LoadingContainer>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    header: {
        textAlign: "center",
        fontSize: 48,
        fontWeight: "bold"
    },
    subHeader: {
        fontSize: 36,
        textAlign: "center"
    }
})

interface Tile {
    property?: string,
    amount?: string | number
}