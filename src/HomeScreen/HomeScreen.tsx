import React, { useState, useEffect, useCallback } from 'react';
import { Body, Text, Card, CardItem, Button, View, Fab, Icon, Container, Content } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native';
import { CREATION_SCREEN, SHEET_SCREEN } from '../common/constants/routeNames';
import { useDispatch, useSelector } from 'react-redux';
import { Character } from '../common/models/models';
import { applyCharacter, resetStore, StoreProps } from '../redux/store';
import LoadingContainer from '../common/components/LoadingContainer';
import { setLoading } from '../redux/loading';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }: any) {
    const [allCharacters, setAllCharacters] = useState<Array<string>>([]);
    const [fabActive, setFabActive] = useState<boolean>(false);
    const [charToDelete, setCharToDelete] = useState<string>('');

    const loading = useSelector((store: StoreProps) => store.loading)

    const dispatch = useDispatch();
    const dispatchResetStore = () => dispatch(resetStore())
    const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
    const dispatchCharacter = (character: Character) => dispatch(applyCharacter(character))

    async function getAllCharacters() {
        const data = await AsyncStorage.getAllKeys();

        setAllCharacters(await data)
    };

    async function deleteCharacter(id: string) {
        await AsyncStorage.removeItem(id);

        getAllCharacters();
    }

    function startCreation() {
        dispatchLoading(true)
        navigation.push(CREATION_SCREEN)
    }

    async function onCharacterPress(id: string) {
        const data = await AsyncStorage.getItem(id);
        const character = JSON.parse(await data as string);

        dispatchCharacter(character)

        navigation.navigate(SHEET_SCREEN)
    }

    useFocusEffect(
        useCallback(() => {
            dispatchResetStore()
        }, [])
    );

    useEffect(() => {
        getAllCharacters().then(() => dispatchLoading(false));
    }, []);

    return (
        <Container>
            <Content>
                <LoadingContainer ready={!loading}>
                    <View style={{ flex: 6 }}>
                        {
                            allCharacters.map((character: string, index: number) =>
                                <TouchableOpacity key={index} onPress={() => onCharacterPress(character)}>
                                    <Card>
                                        <CardItem style={{ justifyContent: "space-between" }}>
                                            <Text>{character.split('_')[1]}</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                {
                                                    charToDelete === character ?
                                                        <>
                                                            <Text style={{ textAlignVertical: "center", marginHorizontal: 10 }}>Are you sure?</Text>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Button danger style={{marginHorizontal: 3}} onPress={() => deleteCharacter(character)}>
                                                                    <Text>yes</Text>
                                                                </Button>
                                                                <Button success style={{marginHorizontal: 3}} onPress={() => setCharToDelete('')}>
                                                                    <Text>no</Text>
                                                                </Button>
                                                            </View>
                                                        </>
                                                        :
                                                        <Button danger onPress={() => setCharToDelete(character)}>
                                                            <Text>X</Text>
                                                        </Button>
                                                }
                                            </View>
                                        </CardItem>
                                    </Card>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                    </View>
                </LoadingContainer>
            </Content>
            <Fab active={fabActive} onPress={() => setFabActive(!fabActive)} direction='up'>
                <Icon type='Ionicons' name='egg' />
                <Button onPress={startCreation}>
                    <Icon name='add' />
                </Button>               
            </Fab>
        </Container>
    )
}