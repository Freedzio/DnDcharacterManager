import React from 'react'
import { View, Button, Text } from 'native-base'

export default function StyledButton({ bordered, onButtonPress, title, disabled }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
      <Button bordered={bordered} onPress={onButtonPress} disabled={disabled}>
        <Text style={{ textAlign: "center" }}>{title}</Text>
      </Button>
    </View>
  )
}

interface Props {
  bordered: boolean,
  onButtonPress: () => void,
  title: string,
  disabled?: boolean
}