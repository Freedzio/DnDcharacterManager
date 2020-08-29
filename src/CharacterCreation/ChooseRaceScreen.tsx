import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../common/ApiConfig';
import { Card, Text, Container, Content, CardItem, Body } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CONFIRM_RACE_SCREEN } from '../common/constants/routeNames';
import LoadingContainer from '../common/LoadingContainer';

export default function ChooseRaceScreen({navigation}: any) {
    const [races, setRaces] = useState<Array<string>>([]);


    async function getRaces() {
        const response = await fetch(ApiConfig.races);
        const data = await response.json();

        return data
    };

    async function onRacePress(race: string) {
        navigation.navigate(CONFIRM_RACE_SCREEN, {raceId: race})
    }

    useEffect(() => {
        getRaces()
            .then(data => {
                let arr: string[] = [];

                for (let i = 0; i < data.results.length; i++) {
                    arr.push(data.results[i].name)
                }

                setRaces(arr)
            });
    }, [])

    return (
        <Container>
            <Content>
                <LoadingContainer ready={races.length !== 0}>

                {
                    races.map((item, index) =>
                    <TouchableOpacity key={index} onPress={() => onRacePress(item.toLowerCase())}>
                            <Card>
                                <CardItem>
                                    <Body>
                                        <Text>
                                            {item}
                                        </Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </TouchableOpacity>
                    )
                }
                </LoadingContainer>
            </Content>
        </Container>
    )
}