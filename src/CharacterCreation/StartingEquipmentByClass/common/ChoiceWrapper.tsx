import React from 'react'
import { Card, View } from 'native-base'

export default function ChoiceWrapper({ children }: any) {
  return (
    <Card style={{ marginVertical: 5, paddingHorizontal: 30, paddingVertical: 15 }}>
      <View>
        {children}
      </View>
    </Card>
  )
}