import { Col, Row } from 'native-base'
import React from 'react'
import Tile from '../../CharacterCreation/Tile'
import { Money } from '../../common/models/models'

export const units = ['cp', 'sp', 'ep', 'gp', 'pp']

export default function MoneyDisplayer({ money}: Props) {

  return (
    <Row>
      {
        units.map((unit: string, index: number) =>
          <Col key={unit + index}>
            <Tile property={unit.toUpperCase()} amount={money[unit]} />
          </Col>
        )
      }
    </Row>
  )
}

interface Props {
  money: Money
}