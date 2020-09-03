import { Card, View, Text } from "native-base";
import React from 'react';

export const tileHeight = 80;

export default function Tile({ property, amount }: Tile) {
  return (
    <Card style={{ padding: 10, height: tileHeight }}>
      <View style={{ flex: 1, justifyContent: "space-around" }}>
        <Text style={{ textAlign: "center" }}>
          {property}
        </Text>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          {amount}
        </Text>
      </View>
    </Card>
  )
}

interface Tile {
  property?: string,
  amount?: string | number
}