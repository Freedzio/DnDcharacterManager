import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ADD_ITEMS_SCREEN, ITEMS_SCREEN } from '../../common/constants/routeNames';
import AddItemsScreen from './AddItemsScreen';
import ItemsScreen from './ItemsScreen';

const Stack = createStackNavigator();

export default function ItemsNavigator() {
  return (
    <Stack.Navigator initialRouteName={ITEMS_SCREEN} screenOptions={{header: () => null}}>
      <Stack.Screen name={ITEMS_SCREEN} component={ItemsScreen} />
      <Stack.Screen name={ADD_ITEMS_SCREEN} component={AddItemsScreen} />
    </Stack.Navigator>
  )
}