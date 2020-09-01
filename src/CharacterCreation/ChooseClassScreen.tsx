import React, { useState, useEffect } from 'react'
import DummyView from '../common/components/DummyView'
import apiWrapper from '../common/functions/apiWrapper';
import { ApiConfig } from '../common/constants/ApiConfig';
import getArrayOfNames from '../common/functions/getArrayOfNames';
import { Container, Content, Body, List, ListItem, Text } from 'native-base';
import ScreenHeader from '../common/components/ScreenHeader';
import LoadingContainer from '../common/components/LoadingContainer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CharacterClass } from '../common/models/models';

export default function ChooseClassScreen({ navigation }: any) {
    const [classes, setClasses] = useState<Array<string>>([]);

    async function getClasses() {
        const data = await apiWrapper(ApiConfig.classes);
        return await data
    }

    async function getClassData(className: string) {
        const data = await apiWrapper(ApiConfig.class(className))
        return await data
    }

    async function onClassPress(className: string) {
        const classData = await getClassData(className);

    }

    async function injectClassData(classData: CharacterClass) {
        
    }

    useEffect(() => {
        getClasses().then(data => getArrayOfNames(data)).then(names => setClasses(names))
    }, [])

    return (
        <Container>
            <Content>
                <ScreenHeader title='CHOOSE CLASS' />
                <LoadingContainer ready={classes.length !== 0} >
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