import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../common/ApiConfig';
import { Container, Content, H1, Text, View, Card, CardItem, Body, Row, Col } from 'native-base';
import { StyleSheet } from 'react-native';
import LoadingContainer from '../common/LoadingContainer';
import { Picker } from '@react-native-community/picker'
import { Race, AbilitySimple, JustUrl } from '../common/models/models';

function Tile({ property, amount }: Tile) {
    return (
        <Card style={{ padding: 10, height: 60 }}>
            <View style={{ flex: 1, justifyContent: 'space-around' }}>
                <Text style={{ flex: 1, textAlign: "center" }}>
                    {property}
                </Text>
                <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>
                    {amount}
                </Text>
            </View>
        </Card>
    )
}

export default function ConfirmRaceScreen({ navigation, route }: any) {
    const [raceData, setRaceData] = useState<Race>();
    const [ready, setReady] = useState(false);
    const [language, setLanguage] = useState('choose')

    const raceId = route.params.raceId;

    async function getRaceData() {
        const response = await fetch(ApiConfig.race(raceId));
        const data = await response.json();

        return data
    }

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
                        <Col>
                            <Tile property={'Speed'} amount={raceData?.speed} />
                        </Col>
                        <Col>
                            <Tile property="Size" amount={raceData?.size} />
                        </Col>
                    </Row>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text>
                                    {raceData?.alignment}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text>
                                    {raceData?.age}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text>
                                    {raceData?.language_desc}
                                </Text>
                                {
                                    raceData?.language_options &&
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={{ fontWeight: "bold" }}>Choose {raceData.language_options.choose}</Text>

                                        <Picker
                                            selectedValue={language}
                                            style={{ width: 300 }}
                                            onValueChange={v => setLanguage(v as string)}
                                        >
                                            <Picker.Item label="--Choose language--" value='choose' />
                                            {
                                                raceData?.language_options.from.map((item: JustUrl, index: number) =>
                                                    <Picker.Item label={item.name} value={item.name} key={index} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                }
                            </Body>
                        </CardItem>
                    </Card>
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