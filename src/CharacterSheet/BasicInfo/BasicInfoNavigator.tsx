import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { BASIC_INFO_SCREEN, LEVEL_UP_SCREEN } from '../../common/constants/routeNames';
import BasicInfoScreen from './BasicInfoScreen';
import LevelUpScreen from './LevelUpScreen';

const Stack = createStackNavigator();

export default function BasicIngoNavigator() {
  return (
    <Stack.Navigator initialRouteName={BASIC_INFO_SCREEN} screenOptions={{header: () => null}}>
      <Stack.Screen name={BASIC_INFO_SCREEN} component={BasicInfoScreen} />
      <Stack.Screen name={LEVEL_UP_SCREEN} component={LevelUpScreen} />
    </Stack.Navigator>
  )
}