import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';
import { Button, Card, Col, Container, Content, Input, List, ListItem, Row, Text, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';
import { tileHeight } from '../../CharacterCreation/Tile';
import LoadingContainer from '../../common/components/LoadingContainer';
import ScreenHeader from '../../common/components/ScreenHeader'
import calculateMoney from '../../common/functions/calculateMoney';
import { preventNaN } from '../../common/functions/preventNaN';
import { FinalItem, JustUrl, Money } from '../../common/models/models'
import { addItems, addSingleItem } from '../../redux/items';
import { setMoney, spendMoney } from '../../redux/money';
import { StoreProps } from '../../redux/store';
import MoneyDisplayer, { units } from './MoneyDisplayer';

export default function AddItemsScreen() {
  const itemsJSON: FinalItem[] = require('../../database/Equipment.json');
  const categories: Category[] = require('../../database/Equipment-Categories.json')

  const [chosenCategory, setChosenCategory] = useState<string>('armor');
  const [itemsToChooseFrom, setItemsToChooseFrom] = useState<Array<JustUrl>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonsLoading, setButtonsLoading] = useState<boolean>(false);
  const [localMoney, setLocalMoney] = useState<Money>({});
  const [editingMoney, setEditingMoney] = useState<boolean>(false);

  const items = useSelector((store: StoreProps) => store.items);
  const money = useSelector((store: StoreProps) => store.money)
  const id = useSelector((store: StoreProps) => store.id);

  const dispatch = useDispatch();
  const dispatchSpendMoney = (cost: { unit: string, quantity: number }) => dispatch(spendMoney(cost));
  const dispatchMoney = (money: Money) => dispatch(setMoney(money));
  const dispatchItem = (item: { [key: string]: FinalItem }) => dispatch(addSingleItem(item))

  useEffect(() => {
    setLoading(true);
    setItemsToChooseFrom(categories.filter(cat => cat.index === chosenCategory)[0].equipment)
    setLoading(false)
  }, [chosenCategory]);

  useEffect(() => {
    setLocalMoney(money);
  }, [money])

  async function addItem(item: string, method: 'buy' | 'find') {
    setButtonsLoading(true);

    let newMoney = { ...money };

    const itemData: FinalItem = itemsJSON.filter(eq => eq.index === item)[0];
    if (method === 'buy') {
      dispatchSpendMoney(itemData.cost);
      newMoney = calculateMoney({ ...money }, itemData.cost, 'buy');
    };

    const itemId = uuid.v4() + '_' + itemData.index
    dispatchItem({ [itemId]: itemData })

    await AsyncStorage.mergeItem(id, JSON.stringify({
      items: {
        ...items,
        [itemId]: itemData
      },
      money: newMoney
    }))

    setButtonsLoading(false);
  }

  async function onEditMoneyTrigger() {
    if (!editingMoney) setEditingMoney(true);
    else {
      AsyncStorage.mergeItem(id, JSON.stringify({
        money: localMoney
      }));
      dispatchMoney(localMoney);
      setEditingMoney(false);
    }
  }

  function onMoneyEdit(unit: string, amount: string) {
    let v = preventNaN(amount);

    setLocalMoney({
      ...localMoney,
      [unit]: v
    })
  };

  return (
    <Container>
      <Content>
        <ScreenHeader title="CHOOSE ITEMS" />
        {
          editingMoney ?
            <Row>
              {
                units.map((unit: string, index: number) =>
                  <Col key={index}>
                    <Card style={{ padding: 10, height: tileHeight, justifyContent: "space-around" }}>
                      <Text style={{ textAlign: "center" }}>{unit.toUpperCase()}</Text>
                      <Input
                        keyboardType='decimal-pad'
                        style={
                          {
                            textAlign: "center",
                            borderWidth: 1
                          }
                        }
                        value={localMoney[unit].toString()}
                        onChangeText={v => onMoneyEdit(unit, v as string)}
                      />
                    </Card>
                  </Col>
                )
              }
            </Row> :
            <MoneyDisplayer money={localMoney} />
        }
        <Button block onPress={onEditMoneyTrigger}>
          <Text>{editingMoney ? 'save $$$' : 'edit $$$'} </Text>
        </Button>
        <Picker selectedValue={chosenCategory} onValueChange={v => setChosenCategory(v as string)}>
          {
            categories.filter(cat => cat.index !== 'adventuring-gear').map((cat: JustUrl, index: number) =>
              <Picker.Item value={cat.index as string} label={cat.name} key={index} />
            )
          }
        </Picker>
        <LoadingContainer ready={!loading}>
          <SafeAreaView>

            {/* <VirtualizedList
              data={itemsToChooseFrom}
              initialNumToRender={4}
              getItemCount={itemsToChooseFrom => itemsToChooseFrom.length}
              getItem={(itemsToChooseFrom, index) => itemsToChooseFrom[index]}
              keyExtractor={item => item.index as string}
              renderItem={({ item, index }: { item: JustUrl, index: number }) =>
                <View style={{ flexDirection: 'row', padding: 10 }} key={index}>
                  <Button small onPress={() => addItem(item.index as string, 'buy')} disabled={buttonsLoading}>
                    <Text>$</Text>
                  </Button>
                  <Text style={{ flex: 1, textAlign: 'center' }}>{item.name}</Text>
                  <Button onPress={() => addItem(item.index as string, 'find')} disabled={buttonsLoading} small>
                    <Text>Add</Text>
                  </Button>
                </View >
              }
            /> */}

            <List>
              {
                itemsToChooseFrom.map((item: JustUrl, index: number) =>
                  <ListItem key={index}>
                    <Button small onPress={() => addItem(item.index as string, 'buy')} disabled={buttonsLoading}>
                      <Text>$</Text>
                    </Button>
                    <Text style={{ flex: 1, textAlign: 'center' }}>{item.name}</Text>
                    <Button onPress={() => addItem(item.index as string, 'find')} disabled={buttonsLoading} small>
                      <Text>Add</Text>
                    </Button>
                  </ListItem>
                )
              }
            </List>
          </SafeAreaView>
        </LoadingContainer>
      </Content>
    </Container>
  )
}

interface Category extends JustUrl {
  equipment: JustUrl[]
}