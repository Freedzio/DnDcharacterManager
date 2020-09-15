import React from 'react';
import 'react-native-gesture-handler';
import CreationNavigator from './src/CharacterCreation/CreationNavigator';
import { Provider as StoreProvider } from "react-redux";
import store from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CREATION_SCREEN, HOME_SCREEN, SHEET_SCREEN } from './src/common/constants/routeNames';
import HomeScreen from './src/HomeScreen/HomeScreen';
import SheetNavigator from './src/CharacterSheet/SheetNavigator';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

const Stack = createStackNavigator();

const App = () => {
  return (
    <StoreProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={HOME_SCREEN} screenOptions={{ header: () => null }}>
          <Stack.Screen name={HOME_SCREEN} component={HomeScreen} />
          <Stack.Screen name={CREATION_SCREEN} component={CreationNavigator} />
          <Stack.Screen name={SHEET_SCREEN} component={SheetNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
};

export default App;