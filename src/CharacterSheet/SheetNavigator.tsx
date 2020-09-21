import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { ATTACKS_SCREEN, BASIC_INFO_SCREEN, ITEMS_NAVIGATOR, ITEMS_SCREEN, SKILLS_SCREEN, SPELLS_NAVIGATOR, SPELLS_SCREEN } from '../common/constants/routeNames'
import AttacksScreen from './AttacksScreen'
import BasicInfoScreen from './BasicInfoScreen'
import ItemsNavigator from './Items/ItemsNavigator'
import SkillsScreen from './SkillsScreen'
import SpellsNavigator from './Spells/SpellsNavigator'

export default function SheetNavigator() {

  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator initialRouteName={BASIC_INFO_SCREEN}>
      <Tab.Screen name={BASIC_INFO_SCREEN} component={BasicInfoScreen} />
      <Tab.Screen name={SKILLS_SCREEN} component={SkillsScreen} />
      <Tab.Screen name={ITEMS_NAVIGATOR} component={ItemsNavigator} />
      <Tab.Screen name={ATTACKS_SCREEN} component={AttacksScreen} />
      <Tab.Screen name={SPELLS_NAVIGATOR} component={SpellsNavigator} />
    </Tab.Navigator>
  )
}