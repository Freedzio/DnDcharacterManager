import React, { useState } from 'react'
import { Container, Content, Input, Button, Text } from 'native-base'
import ScreenHeader from '../common/components/ScreenHeader'

export default function NameCharacterScreen() {
  const [name, setName] = useState<string>('');

  return (
    <Container>
      <Content>
        <ScreenHeader title='FINALLY' subtitle='name your character' />
        <Input value={name} onChangeText={setName} style={{marginVertical: 40, borderColor: 'lightgray', borderWidth: 1}} />
        <Button block>
          <Text>Finish</Text>
        </Button>
      
      </Content>
    </Container>
  )
}