import React from 'react'
import { Button, Text } from 'native-base'
import { SET_ATTRIBUTES_SCREEN } from '../../../common/constants/routeNames'

export default function GoNextButton(props: any) {
  function goNext() {
    props.goNext()
    props.navigation.navigate(SET_ATTRIBUTES_SCREEN)
  }

  return <Button block onPress={goNext}>
    <Text>next</Text>
  </Button>
}