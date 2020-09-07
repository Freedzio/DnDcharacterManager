import React from 'react'
import { View, Text } from 'native-base'

export default function Or() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>OR</Text>
    </View>
  )
}