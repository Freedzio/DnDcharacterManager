import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../common/ApiConfig';
import { Card, Text, Container, Content, CardItem, Body, List, ListItem } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CONFIRM_RACE_SCREEN } from '../common/constants/routeNames';
import LoadingContainer from '../common/LoadingContainer';
import getArrayOfNames from '../common/functions/getArrayOfNames';
import apiWrapper from '../common/functions/apiWrapper';
import { NamedJustUrl } from '../common/models/models';
import _ from 'lodash'

export default function ChooseRaceScreen({ navigation }: any) {
    const [races, setRaces] = useState<Array<string>>([]);
    const [subraces, setSubraces] = useState<Array<NamedJustUrl>>([]);
    const [selectedRaceIndex, setSelectedRaceIndex] = useState<number | null>()

    async function getRaces() {
        return await apiWrapper(ApiConfig.races)
    };

    async function getSubraces(race: string) {
        const data = await apiWrapper(ApiConfig.subraces(race));
        const results = await data.results
        console.log(results)
        return results
    }

    async function onRacePress(race: string, index: number) {
        const areSubraces = await checkForSubraces(race);

        if (areSubraces) {
            setSubraces([])
            setSelectedRaceIndex(index)

            setSubraces(await getSubraces(race));

        } else navigation.navigate(CONFIRM_RACE_SCREEN, { raceId: race })
    }

    async function checkForSubraces(race: string) {
        const data = await apiWrapper(ApiConfig.subraces(race))
        const thereAreSubraces = await data.count !== 0;

        return await thereAreSubraces
    }

    useEffect(() => {
        getRaces()
            .then(data => setRaces(getArrayOfNames(data)));
    }, [])

    return (
        <Container>
            <Content>
                <LoadingContainer ready={races.length !== 0}>
                    {
                        races.map((item, index) =>
                            <TouchableOpacity key={index} onPress={() => onRacePress(item.toLowerCase(), index)}>
                                <Card>
                                    <CardItem>
                                        <Body>
                                            <Text>
                                                {item}
                                            </Text>
                                            <List>
                                                {
                                                    subraces.map((subrace: NamedJustUrl, index2: number) => {
                                                        const showSubraces = index === selectedRaceIndex
                                                        return (showSubraces &&
                                                            <ListItem key={index2}>
                                                                <Text>
                                                                    {subrace.name}
                                                                </Text>
                                                            </ListItem>
                                                        )
                                                    })
                                                }
                                            </List>
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