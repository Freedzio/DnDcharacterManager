import React from 'react'
import { View } from 'native-base'

export default function ChoiceWrapper({ children }: any) {
  return (
    <View style={{ marginVertical: 5, paddingHorizontal: 30 }}>
      {children}
    </View>
  )
}