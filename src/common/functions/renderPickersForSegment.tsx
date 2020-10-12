import React from 'react'
import { Picker } from "@react-native-community/picker";
import { ChoosingOptions, Chooser, JustUrl } from "../models/models";
import filterList from "./filterList";
import { Card, CardItem, View, Text } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'

function onChooserChange(key: string, value: string, chooserObject: Chooser, setter: (v: any) => void) {
  const obj = {
    ...chooserObject,
    [key]: value
  }

  setter(obj)
}

export function renderPickersForSegment(setOfChoices: ChoosingOptions, index1: number, chooserObject: Chooser, setter: (v: any) => void, title: string) {
  const howMany = setOfChoices.choose;

  let arr = [];

  for (let index2 = 0; index2 < howMany; index2++) {
    const key = index1.toString() + index2.toString();

    arr.push(
      <Picker
        style={{ width: 360 }}
        selectedValue={chooserObject[key]}
        onValueChange={v => onChooserChange(key, v as string, chooserObject, setter)}>
        <Picker.Item value='chose' label='--Choose--' />
        {
          setOfChoices.from.filter(item => filterList(item.index, chooserObject, key)).map((item: JustUrl) =>
            <Picker.Item label={item.name} value={item.index as string} />
          )
        }
      </Picker>
    )
  }

  return (
    <Card>
      <CardItem>
        <View>
          <View>
            <Text>
              {title}
            </Text>
          </View>
          <SafeAreaView>
            {arr}
          </SafeAreaView>
        </View>
      </CardItem>
    </Card>
  )
}