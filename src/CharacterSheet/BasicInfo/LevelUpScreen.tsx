import { Button, Container, Content, List, ListItem, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ScreenHeader from '../../common/components/ScreenHeader'
import { CONFIRM_LEVEL_UP_SCREEN } from '../../common/constants/routeNames';
import { CharacterClass, JustUrl } from '../../common/models/models';
import { StoreProps } from '../../redux/store';

export default function LevelUpScreen({ navigation }: any) {
  const classesJSON: CharacterClass[] = require('../../database/Classes.json')

  const classes = useSelector((store: StoreProps) => store.classes);

  function onLevelUpPress(classObj: JustUrl) {
    let level = 1;
    if (Object.keys(classes).includes(classObj.name)) level = classes[classObj.name] + 1;

    navigation.navigate(CONFIRM_LEVEL_UP_SCREEN, { classObj: classObj, level: level })
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title='LEVEL UP' subtitle='Choose a class to level' />
        <List>
          {
            classesJSON.map((item: CharacterClass, index: number) =>
              <ListItem key={index}>
                <Text style={{ fontWeight: 'bold', flex: 1 }}>{item.name} (current level: {classes[item.name] || 0}) </Text>
                <Button small onPress={() => onLevelUpPress(item)}>
                  <Text>level up!</Text>
                </Button>
              </ListItem>
            )
          }
        </List>
      </Content>
    </Container>
  )
}