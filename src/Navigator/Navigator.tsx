import { NavigationContainer } from "@react-navigation/native";
import { HOME_SCREEN, CHOOSE_RACE_SCREEN, CONFIRM_RACE_SCREEN, CHOOSE_CLASS_SCREEN, CONFIRM_CLASS_SCREEN, SET_ATTRIBUTES_SCREEN, NAME_CHARACTER_SCREEN } from "../common/constants/routeNames";
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../HomeScreen/HomeScreen";
import React from 'react'
import ChooseRaceScreen from "../CharacterCreation/ChooseRaceScreen";
import ConfirmRaceScreen from "../CharacterCreation/ConfirmRaceScreen";
import ChooseClassScreen from "../CharacterCreation/ChooseClassScreen";
import ConfirmClassScreen from "../CharacterCreation/ConfirmClassScreen";
import SetAttributesScreen from "../CharacterCreation/SetAttributesScreen";
import NameCharacterScreen from "../CharacterCreation/NameCharacterScreen";


const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={HOME_SCREEN} screenOptions={{ header: () => null }}>
        <Stack.Screen name={HOME_SCREEN} component={HomeScreen} />
        <Stack.Screen name={CHOOSE_RACE_SCREEN} component={ChooseRaceScreen} />
        <Stack.Screen name={CONFIRM_RACE_SCREEN} component={ConfirmRaceScreen} />
        <Stack.Screen name={CHOOSE_CLASS_SCREEN} component={ChooseClassScreen} />
        <Stack.Screen name={CONFIRM_CLASS_SCREEN} component={ConfirmClassScreen} />
        <Stack.Screen name={SET_ATTRIBUTES_SCREEN} component={SetAttributesScreen} />
        <Stack.Screen name={NAME_CHARACTER_SCREEN} component={NameCharacterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}