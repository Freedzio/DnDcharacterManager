import AsyncStorage from '@react-native-community/async-storage';
import { Button, Container, Content, List, ListItem, Text, View } from 'native-base'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ScreenHeader from '../common/components/ScreenHeader';
import { equipItem, unequipItem } from '../redux/equipped';
import { decreaseQuantity, DECREASE_QUANTITY, increaseQuantity, INCREASE_QUANTITY } from '../redux/items';
import { StoreProps } from '../redux/store'

export default function ItemsScreen() {
  const equipped = useSelector((store: StoreProps) => store.equipped);
  const name = useSelector((store: StoreProps) => store.name);
  const items = useSelector((store: StoreProps) => store.items)
  const id = useSelector((store: StoreProps) => store.id);
  const store = useSelector((store: StoreProps) => store);

  const dispatch = useDispatch();
  const dispatchEquip = (item: string) => dispatch(equipItem(item));
  const dispatchUnequip = (item: string) => dispatch(unequipItem(item));
  const dispatchIncrease = (item: string) => dispatch(increaseQuantity(item))
  const dispatchDecrease = (item: string) => dispatch(decreaseQuantity(item))

  async function onItemPress(item: string) {
    if (equipped.includes(item)) {
      dispatchUnequip(item)
      let temp = [...equipped];
      await AsyncStorage.setItem(id, JSON.stringify({
        ...store,
        equipped: temp.filter(eqItem => eqItem !== item)
      }))
    }
    else {
      dispatchEquip(item);
      let temp = [...equipped];
      temp.push(item);
      await AsyncStorage.setItem(id, JSON.stringify({
        ...store,
        equipped: temp
      }))
    }
  }

  async function onQuantityChange(plusOrMinus: string, item: string) {
    let newQuan = items[item].quantity;

    switch (plusOrMinus) {
      case INCREASE_QUANTITY:
        newQuan++;
        dispatchIncrease(item)
        break;

      case DECREASE_QUANTITY:
        newQuan--;
        dispatchDecrease(item)
    }

    await AsyncStorage.setItem(id, JSON.stringify({
      ...store,
      items: {
        ...store.items,
        [item]: {
          ...store.items[item],
          quantity: newQuan
        }
      }
    }))
  }

  return (
    <Container>
      <Content padder>
        <ScreenHeader title="ITEMS" subtitle={name} />
        <Text style={{ fontSize: 30 }}>Equipped</Text>
        <List>
          <ListItem>
            <Text style={{ flex: 1.5, fontWeight: "bold" }}>Name</Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>Type</Text>
            <View style={{ flex: 1 }} />
          </ListItem>
          {
            equipped.map((item: string, index: number) =>
              <ListItem>
                <Text style={{ flex: 1.5 }}>{items[item].name}</Text>
                <Text style={{ flex: 1 }}>{items[item].equipment_category.name}</Text>
                <View style={{ flex: 1 }} />
              </ListItem>
            )
          }
        </List>
        <Text style={{ fontSize: 30 }}>Backpack</Text>
        <List>
          <ListItem>
            <Text style={{ flex: 1.5, fontWeight: "bold" }}>Name</Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>Type</Text>
            <View style={{ flex: 1 }} />
          </ListItem>
          {
            Object.keys(items).map((item: string, index: number) =>
              <ListItem key={index}>
                <Text style={{ flex: 1.5 }}>{items[item].name} {items[item].quantity ? `(${items[item].quantity})` : ''} </Text>
                <Text style={{ flex: 1 }}>{items[item].equipment_category.name}</Text>
                <View style={{ flex: 1, justifyContent: "space-around", flexDirection: 'row' }} >
                  {
                    (items[item].equipment_category.index === 'armor' || items[item].equipment_category.index === 'weapon') &&
                    <Button bordered={!equipped.includes(item)} onPress={() => onItemPress(item)}>
                      <Text>{equipped.includes(item) ? 'unequip' : 'equip'}</Text>
                    </Button>
                  }
                  {
                    items[item].quantity &&
                    <>
                      <Button onPress={() => onQuantityChange(DECREASE_QUANTITY, item)}>
                        <Text>-</Text>
                      </Button>
                      <Button onPress={() => onQuantityChange(INCREASE_QUANTITY, item)}>
                        <Text>+</Text>
                      </Button>
                    </>
                  }
                </View>
              </ListItem>
            )
          }
        </List>
      </Content>
    </Container>
  )
}