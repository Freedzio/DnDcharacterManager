import React, { useState, useEffect } from 'react';
import { Container, Header, Body, Text, Content, Card, CardItem, Button, Grid, Row, Col, View } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage'
import { StyleSheet } from 'react-native';
import { CHOOSE_RACE_SCREEN } from '../common/constants/routeNames';
var uuid = require('react-native-uuid');

export default function HomeScreen({ navigation }: any) {
    const [allCharacters, setAllCharacters] = useState<Array<string>>([])

    async function getAllCharacters() {
        const data = await AsyncStorage.getAllKeys();

        setAllCharacters(await data)
    };

    async function clearStorage() {
        await AsyncStorage.clear()

        getAllCharacters();
    }

    function startCreation() {
        navigation.navigate(CHOOSE_RACE_SCREEN)
    }

    useEffect(() => {
        getAllCharacters();
    }, []);

    return (
        <>
            <View style={{ flex: 6 }}>
                {
                    allCharacters.map((character: string, index: number) =>
                        <Card key={index}>
                            <CardItem>
                                <Body>
                                    <Text>
                                        {character}
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    )
                }
            </View>
            <View style={{ flex: 1 }}>
                <Button block onPress={startCreation} style={styles.addButton}>
                    <Text>yad</Text>
                </Button>
                <Button block onPress={clearStorage}>
                    <Text>Wyczyść</Text>
                </Button>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    addButton: {
        marginVertical: 10
    }
})