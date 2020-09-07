import React from 'react'
import { Picker } from '@react-native-community/picker'
import { JustUrl } from '../../../common/models/models'

export default function EqPicker({ selectedValue, data, onChange }: Props) {
  return (
    <Picker selectedValue={selectedValue} onValueChange={v => onChange(v as string)} >
      <Picker.Item label='--Choose--' value='choose' />
      {
        data.map((item: JustUrl, index: number) =>
          <Picker.Item label={item.name} value={item.index as string} />
        )
      }
    </Picker>
  )
};

interface Props {
  selectedValue: string,
  data: Array<JustUrl>,
  onChange: (v: string) => void
};