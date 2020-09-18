import { Container, Content } from 'native-base'
import React from 'react'
import ScreenHeader from '../common/components/ScreenHeader'

export default function SpellsScreen() {
  return (
    <Container>
      <Content>
        <ScreenHeader title="SPELLS" />
      </Content>
    </Container>
  )
}