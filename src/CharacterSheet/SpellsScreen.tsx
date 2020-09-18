import { Container, Content, List, Text } from 'native-base'
import React from 'react'
import { useSelector } from 'react-redux'
import ScreenHeader from '../common/components/ScreenHeader'
import { StoreProps } from '../redux/store'

export default function SpellsScreen() {
  const spellcasting = useSelector((store: StoreProps) => store.spellcasting);

  return (
    <Container>
      <Content>
        <ScreenHeader title="SPELLS" />
        {
          spellcasting === {} ? <Text style={{ fontSize: 30, textAlign: "center" }}>You cannot cast spells!</Text> :
            <List>

            </List>

        }
      </Content>
    </Container>
  )
}