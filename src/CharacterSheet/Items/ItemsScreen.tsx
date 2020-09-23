import AsyncStorage from '@react-native-community/async-storage';
import { Button, Container, Content, Fab, Icon, List, ListItem, Text, View } from 'native-base'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ScreenHeader from '../../common/components/ScreenHeader';
import { ADD_ITEMS_SCREEN } from '../../common/constants/routeNames';
import { spellStyle } from '../../common/styles/styles';
import { equipItem, unequipItem } from '../../redux/equipped';
import { decreaseQuantity, DECREASE_QUANTITY, deleteItem, DELETE_ITEM, increaseQuantity, INCREASE_QUANTITY } from '../../redux/items';
import { StoreProps } from '../../redux/store'

export default function ItemsScreen({ navigation }: any) {
  const equipped = useSelector((store: StoreProps) => store.equipped);
  const name = useSelector((store: StoreProps) => store.name);
  const items = useSelector((store: StoreProps) => store.items)
  const id = useSelector((store: StoreProps) => store.id);
  const store = useSelector((store: StoreProps) => store);

  const dispatch = useDispatch();
  const dispatchEquip = (item: string) => dispatch(equipItem(item));
  const dispatchUnequip = (item: string) => dispatch(unequipItem(item));
  const dispatchIncrease = (item: string) => dispatch(increaseQuantity(item));
  const dispatchDecrease = (item: string) => dispatch(decreaseQuantity(item));
  const dispatchDeleteItem = (item: string) => dispatch(deleteItem(item));

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
  };

  async function onDeleteItem(item: string) {
    dispatchDeleteItem(item);
    dispatchUnequip(item);

    let newItems = store.items;
    delete newItems[item]

    await AsyncStorage.setItem(id, JSON.stringify({
      ...store,
      items: {
        ...newItems
      },
      equipped: store.equipped.filter(eq => eq !== item)
    }))
  }

  return (
    <Container>
      <Content padder>
        <ScreenHeader title="ITEMS" subtitle={name} />
        <Text style={{ fontSize: 30 }}>Equipped</Text>
        <List>
          <ListItem>
            <Text style={spellStyle.columnNames}>Name</Text>
            <Text style={spellStyle.columnNames}>Type</Text>
            <View style={{ flex: 1 }} />
          </ListItem>
          {
            equipped.map((item: string, index: number) =>
              <ListItem key={index}>
                <Text style={spellStyle.spellSub}>{items[item].name}</Text>
                <Text style={spellStyle.spellSub}>{items[item].equipment_category.name}</Text>
                {
                  items[item].armor_class &&
                  <Text style={spellStyle.spellSub}>{items[item].armor_class.base + (items[item].armor_class.dex_bonus ? '+ DEX' : '')} </Text>
                }
                {
                  items[item].damage &&
                  <Text style={spellStyle.spellSub}>{items[item].damage.damage_dice + (items[item].properties.some(p => p.index === 'finesse') ? ' + STR or DEX ' : '+ STR ') + items[item].damage.damage_type.name} </Text>
                }
              </ListItem>
            )
          }
        </List>
        <Text style={{ fontSize: 30 }}>Backpack</Text>
        <List>
          <ListItem>
            <Text style={spellStyle.columnNames}>Name</Text>
            <Text style={spellStyle.columnNames}>Type</Text>
            <View style={{ flex: 2 }} />
          </ListItem>
          {
            Object.keys(items).filter(item => items[item].equipment_category.index === 'armor').map((item: string, index: number) =>
              <ListItem key={index}>
                <Text style={spellStyle.spellSub}>{items[item].name} </Text>
                <Text style={spellStyle.spellSub}>{items[item].equipment_category.name}</Text>
                <View style={{ flex: 1, justifyContent: "space-around", flexDirection: 'row' }} >
                  <Button bordered={!equipped.includes(item)} onPress={() => onItemPress(item)} small>
                    <Text>{equipped.includes(item) ? 'unequip' : 'equip'}</Text>
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button onPress={() => onDeleteItem(item)} style={{ padding: 0 }} small>
                    <Text>delete</Text>
                  </Button>
                </View>
              </ListItem>
            )
          }
          {
            Object.keys(items).filter(item => items[item].equipment_category.index === 'weapon').map((item: string, index: number) =>
              <ListItem key={index}>
                <Text style={spellStyle.spellSub}>{items[item].name} </Text>
                <Text style={spellStyle.spellSub}>{items[item].equipment_category.name}</Text>
                <View style={{ flex: 1, justifyContent: "space-around", flexDirection: 'row' }}>
                  <Button bordered={!equipped.includes(item)} onPress={() => onItemPress(item)} small>
                    <Text>{equipped.includes(item) ? 'unequip' : 'equip'}</Text>
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button onPress={() => onDeleteItem(item)} style={{ padding: 0 }} small>
                    <Text>delete</Text>
                  </Button>
                </View>
              </ListItem>
            )
          }
          {
            Object.keys(items).filter(item => items[item].gear_category).filter(item => items[item].gear_category.index === 'ammunition').map((item: string, index: number) =>
              <ListItem key={index}>
                <Text style={spellStyle.spellSub}>{items[item].name + (items[item].quantity ? ` (${items[item].quantity})` : '')} </Text>
                <Text style={spellStyle.spellSub}>{items[item].equipment_category.name}</Text>
                <View style={{ flex: 1, justifyContent: "space-around", flexDirection: 'row' }} >
                  {
                    items[item].quantity &&
                    <>
                      <Button onPress={() => onQuantityChange(DECREASE_QUANTITY, item)} small>
                        <Text>-</Text>
                      </Button>
                      <Button onPress={() => onQuantityChange(INCREASE_QUANTITY, item)} small>
                        <Text>+</Text>
                      </Button>
                    </>
                  }
                </View>
                <View style={{ flex: 1 }}>
                  <Button onPress={() => onDeleteItem(item)} style={{ padding: 0 }} small>
                    <Text>delete</Text>
                  </Button>
                </View>
              </ListItem>
            )
          }
          {
            Object.keys(items).filter(item => items[item].gear_category).filter(item => items[item].gear_category.index !== 'ammunition').map((item: string, index: number) =>
              <ListItem key={index}>
                <Text style={spellStyle.spellSub}>{items[item].name + (items[item].quantity ? ` (${items[item].quantity})` : '')} </Text>
                <Text style={spellStyle.spellSub}>{items[item].equipment_category.name}</Text>
                <View style={{ flex:1, justifyContent: "space-around", flexDirection: 'row' }} >

                </View>
                <View style={{ flex: 1 }}>
                  <Button onPress={() => onDeleteItem(item)} style={{ padding: 0 }} small>
                    <Text>delete</Text>
                  </Button>
                </View>
              </ListItem>
            )
          }
        </List>
      </Content>
      <Fab onPress={() => navigation.navigate(ADD_ITEMS_SCREEN)}>
        <Icon name='add' />
      </Fab>
    </Container>
  )
}