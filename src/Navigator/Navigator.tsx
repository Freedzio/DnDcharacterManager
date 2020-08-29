import { NavigationContainer } from "@react-navigation/native";
import { HOME_SCREEN, CHOOSE_RACE_SCREEN, CONFIRM_RACE_SCREEN } from "../common/constants/routeNames";
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../HomeScreen/HomeScreen";
import React from 'react'
import ChooseRaceScreen from "../CharacterCreation/ChooseRaceScreen";
import ConfirmRaceScreen from "../CharacterCreation/ConfirmRaceScreen/ConfirmRaceScreen";

const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={HOME_SCREEN} screenOptions={{ header: () => null }}>
        <Stack.Screen name={HOME_SCREEN} component={HomeScreen} />
        <Stack.Screen name={CHOOSE_RACE_SCREEN} component={ChooseRaceScreen} />
        <Stack.Screen name={CONFIRM_RACE_SCREEN} component={ConfirmRaceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}