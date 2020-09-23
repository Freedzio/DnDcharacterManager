import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';
import { Button, Container, Content, List, ListItem, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';
import LoadingContainer from '../../common/components/LoadingContainer';
import ScreenHeader from '../../common/components/ScreenHeader'
import { ApiConfig } from '../../common/constants/ApiConfig';
import apiWrapper from '../../common/functions/apiWrapper';
import { FinalItem, JustUrl } from '../../common/models/models'
import { addItems, addSingleItem } from '../../redux/items';
import { spendMoney } from '../../redux/money';
import { StoreProps } from '../../redux/store';
import MoneyDisplayer from './MoneyDisplayer';

export default function AddItemsScreen() {
  const [categories, setCategories] = useState<Array<JustUrl>>([]);
  const [chosenCategory, setChosenCategory] = useState<string>('adventuring-gear');
  const [itemsToChooseFrom, setItemsToChooseFrom] = useState<Array<JustUrl>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonsLoading, setButtonsLoading] = useState<boolean>(false)

  const items = useSelector((store: StoreProps) => store.items);
  const id = useSelector((store: StoreProps) => store.id);
  const store = useSelector((store: StoreProps) => store);

  const dispatch = useDispatch();
  const dispatchSpendMoney = (cost: { unit: string, quantity: number }) => dispatch(spendMoney(cost))
  const dispatchItem = (item: { [key: string]: FinalItem }) => dispatch(addSingleItem(item))

  useEffect(() => {
    apiWrapper(ApiConfig.equipmentCategories).then(data => setCategories(data.results))
  }, []);

  useEffect(() => {
    setLoading(true);
    apiWrapper(ApiConfig.equipmentCategory(chosenCategory))
      .then(data => setItemsToChooseFrom(data.equipment))
      .then(() => setLoading(false))
  }, [chosenCategory]);

  async function addItem(item: string, method: 'buy' | 'find') {
    setButtonsLoading(true);

    const itemData: FinalItem = await apiWrapper(ApiConfig.item(item));
    if (method === 'buy') dispatchSpendMoney(itemData.cost);

    const itemId = uuid.v4() + '_' + itemData.index
    dispatchItem({ [itemId]: itemData });

    await AsyncStorage.setItem(id, JSON.stringify({
      ...store,
      items: {
        ...store.items,
        [itemId]: itemData
      }
    }))
    setButtonsLoading(false)
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title="CHOOSE ITEMS" />
        <MoneyDisplayer />
        <Picker selectedValue={chosenCategory} onValueChange={v => setChosenCategory(v as string)}>
          {
            categories.map((cat: JustUrl, index: number) =>
              <Picker.Item value={cat.index as string} label={cat.name} key={index} />
            )
          }
        </Picker>
        <LoadingContainer ready={!loading}>
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
        </LoadingContainer>
      </Content>
    </Container>
  )
}