import { Col, Container, Content, Row } from 'native-base'
import React from 'react'
import { useSelector } from 'react-redux'
import Tile from '../CharacterCreation/Tile'
import ScreenHeader from '../common/components/ScreenHeader'
import { StoreProps } from '../redux/store'

export default function BasicInfoScreen() {

  const abilityScores = useSelector((store: StoreProps) => store.abilityScores);

  return (
    <Container>
      <Content>
        <ScreenHeader title="BASIC INFO" />
        <Row>
          <Col>
            <Tile property='Armor class' amount={10} />
          </Col>
          <Col>
            <Tile property='Initiative' amount={Math.floor((10 - abilityScores['DEX'].score) / 2)} />
          </Col>
          <Col>
            <Tile property="Speed" amount={30} />
          </Col>
        </Row>
      </Content>
    </Container>
  )
}