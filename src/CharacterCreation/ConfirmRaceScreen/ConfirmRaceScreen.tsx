import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../../common/ApiConfig';
import { Container, Content, H1, Text, View, Card, CardItem, Body, Row, Col, List, ListItem } from 'native-base';
import { StyleSheet } from 'react-native';
import LoadingContainer from '../../common/LoadingContainer';
import { Race, AbilitySimple, JustUrl } from '../../common/models/models';
import Section from './Section';
import apiWrapper from '../../common/functions/apiWrapper';
import { Picker } from '@react-native-community/picker';
import { drakes } from './draconicAncestry';

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
    const [raceData, setRaceData] = useState<Race>();
    const [ready, setReady] = useState(false);
    const [language, setLanguage] = useState<string>('choose');
    const [drake, setDrake] = useState<string>('choose');
    const [proficiency, setProficiency] = useState<string>('choose');
    const [abilityBonus, setAbilityBonus] = useState<string>('')

    const raceId = route.params.raceId;

    async function getRaceData() {
        const data = await apiWrapper(`${ApiConfig.race(raceId)}`);
        return data
    };

    useEffect(() => {
        getRaceData()
            .then(data => setRaceData(data)).then(() => setReady(true))
    }, [])

    return (
        <Container>
            <Content padder>
                <LoadingContainer ready={ready}>
                    <Text style={styles.header}>YOU CHOSE</Text>
                    <Text style={styles.subHeader}>{raceData?.name}</Text>
                    <Row>
                        {
                            raceData?.index === 'human' ?
                                <Col>
                                    <Tile property="All" amount="+1" />
                                </Col>
                                : raceData?.ability_bonuses.map((ability: AbilitySimple, index: number) =>
                                    <Col key={ability.name}>
                                        <Tile property={ability.name} amount={`+${ability.bonus}`} />
                                    </Col>
                                )
                        }
                        {
                            raceData?.ability_bonus_options &&
                            <Col>
                                <Card style={{ height: tileHeight }}>
                                    <View style={{ flex: 1, justifyContent: "space-between" }}>
                                        <View>

                                            <Picker style={{ width: '100%' }} selectedValue={abilityBonus} onValueChange={v => setAbilityBonus(v as string)}>
                                                <Picker.Item value='' label='------' />
                                                {
                                                    raceData?.ability_bonus_options.from.map((ability: JustUrl, index: number) =>
                                                        <Picker.Item key={index} value={ability.name} label={ability.name} />
                                                    )}
                                            </Picker>
                                        </View>
                                        <View style={{ flex: 1 }}>

                                            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                                                {abilityBonus !== '' && '+' + raceData.ability_bonus_options.from.filter(item => item.name === abilityBonus)[0].bonus}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </Col>
                        }
                        <Col>
                            <Tile property={'Speed'} amount={raceData?.speed} />
                        </Col>
                        <Col>
                            <Tile property="Size" amount={raceData?.size} />
                        </Col>
                    </Row>
                    <Section
                        title='Alignment'
                        description={raceData?.alignment}
                    />
                    <Section
                        title='Age'
                        description={raceData?.age}
                    />
                    <Section
                        title='Size'
                        description={raceData?.size_description}
                    />
                    <Section
                        title='Languages'
                        description={raceData?.language_desc}
                        selectedVal={language}
                        setterCallback={setLanguage}
                        options={raceData?.language_options}
                    />
                    {raceData?.traits.length !== 0 &&
                        <Section
                            title='Traits'
                            listedData={raceData?.traits}
                            dragonborn
                            setterCallback={setDrake}
                            selectedVal={drake}
                        />
                    }
                    {raceData?.starting_proficiencies.length !== 0 &&
                        <Section
                            title='Proficiencies'
                            listedData={raceData?.starting_proficiencies}
                            options={raceData?.starting_proficiency_options}
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