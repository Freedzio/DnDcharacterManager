import { HOME_SCREEN, CHOOSE_RACE_SCREEN, CONFIRM_RACE_SCREEN, CHOOSE_CLASS_SCREEN, CONFIRM_CLASS_SCREEN, SET_ATTRIBUTES_SCREEN, NAME_CHARACTER_SCREEN, CHOOSE_CLASS_FEATURES } from "../common/constants/routeNames";
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../HomeScreen/HomeScreen";
import React from 'react'
import ChooseRaceScreen from "./ChooseRaceScreen";
import ConfirmRaceScreen from "./ConfirmRaceScreen";
import ChooseClassScreen from "./ChooseClassScreen";
import ConfirmClassScreen from "./ConfirmClassScreen";
import SetAttributesScreen from "./SetAttributesScreen";
import NameCharacterScreen from "./NameCharacterScreen";

const Stack = createStackNavigator();

export default function CreationNavigator() {
  return (
    <Stack.Navigator initialRouteName={CHOOSE_RACE_SCREEN} screenOptions={{ header: () => null }}>
      <Stack.Screen name={CHOOSE_RACE_SCREEN} component={ChooseRaceScreen} />
      <Stack.Screen name={CONFIRM_RACE_SCREEN} component={ConfirmRaceScreen} />
      <Stack.Screen name={CHOOSE_CLASS_SCREEN} component={ChooseClassScreen} />
      <Stack.Screen name={CONFIRM_CLASS_SCREEN} component={ConfirmClassScreen} />
      <Stack.Screen name={SET_ATTRIBUTES_SCREEN} component={SetAttributesScreen} />
      <Stack.Screen name={NAME_CHARACTER_SCREEN} component={NameCharacterScreen} />
    </Stack.Navigator>
  )
}