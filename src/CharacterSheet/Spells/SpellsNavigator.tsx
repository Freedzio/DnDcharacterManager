import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { SPELLS_CHOOSE_SCREEN, SPELLS_SCREEN } from '../../common/constants/routeNames';
import ChooseSpellsScreen from './ChooseSpellsScreen';
import SpellsScreen from './SpellsScreen';

export default function SpellsNavigator() {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={SPELLS_SCREEN} screenOptions={{ header: () => null }}>
      <Stack.Screen name={SPELLS_SCREEN} component={SpellsScreen} />
      <Stack.Screen name={SPELLS_CHOOSE_SCREEN} component={ChooseSpellsScreen} />
    </Stack.Navigator>
  )
}