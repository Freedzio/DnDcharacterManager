import React, { useState, useEffect } from 'react';
import { Body, Text, Card, CardItem, Button, View, Fab, Icon } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native';
import { CREATION_SCREEN, SHEET_SCREEN } from '../common/constants/routeNames';

export default function HomeScreen({ navigation }: any) {
    const [allCharacters, setAllCharacters] = useState<Array<string>>([]);
    const [fabActive, setFabActive] = useState<boolean>(false);

    async function getAllCharacters() {
        const data = await AsyncStorage.getAllKeys();

        setAllCharacters(await data)
    };

    async function clearStorage() {
        await AsyncStorage.clear()

        getAllCharacters();
    }

    function startCreation() {
        navigation.push(CREATION_SCREEN)
    }

    async function onCharacterPress(id: string) {
        const data = await AsyncStorage.getItem(id);

        navigation.navigate(SHEET_SCREEN)
    }

    function toggleFab() {
        setFabActive(!fabActive)
    }

    useEffect(() => {
        getAllCharacters();
    }, []);

    return (
        <>
            <View style={{ flex: 6 }}>
                {
                    allCharacters.map((character: string, index: number) =>
                        <TouchableOpacity key={index} onPress={() => onCharacterPress(character)}>
                            <Card >
                                <CardItem>
                                    <Body>
                                        <Text>
                                            {character.split('_')[1]}
                                        </Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </TouchableOpacity>
                    )
                }
            </View>
            <View style={{ flex: 1 }}>
                <Fab active={fabActive} onPress={toggleFab} direction='up'>
                    <Icon name='add-circle-outline' />
                    <Button onPress={startCreation}>
                        <Icon name='beaker' />
                    </Button>
                    <Button style={{ backgroundColor: 'red' }} onPress={clearStorage} >
                    </Button>
                </Fab>
            </View>
        </>
    )
}