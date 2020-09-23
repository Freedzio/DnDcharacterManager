import { Col, Container, Content, Row, Text, View } from 'native-base'
import React from 'react'
import { useSelector } from 'react-redux'
import Tile from '../CharacterCreation/Tile'
import ScreenHeader from '../common/components/ScreenHeader'
import { spellStyle } from '../common/styles/styles'
import { StoreProps } from '../redux/store'

export default function ClassSpecificScreen() {
  const classResources = useSelector((store: StoreProps) => store.classSpecifics);
  const classes = useSelector((store: StoreProps) => store.classes)

  function parseResName(name: string) {
    let temp = name.replace(/_/g, ' ');
    const newName = temp[0].toUpperCase() + temp.substr(1)
    return newName
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title='CLASS RESOURCES' />
        {
          Object.keys(classResources).map((className: string, index: number) =>
            <View key={index}>
              <Text style={[spellStyle.columnNames, { fontSize: 20 }]}>{className}</Text>
              <Row style={{ flexWrap: 'wrap' }}>
                {
                  Object.entries(classResources[className]).map((res: [string, number | { dice_count: number, dice_value: number }], index: number) =>
                    <Col key={index}>
                      <Tile property={parseResName(res[0] as string)} amount={typeof res[1] === "number" ? res[1] : `${res[1].dice_count}d${res[1].dice_value}`} />
                    </Col>
                  )
                }
                {
                  classResources['Cleric'] &&
                  <Col>
                    <Tile property='Lay on hands' amount={classes['Cleric'] * 5} />
                  </Col>
                }
                {
                  classResources['Paladin'] &&
                  <Col>
                    <Tile property='Lay on hands' amount={classes['Paladin'] * 5} />
                  </Col>
                }
                {
                  classResources['Fighter'] &&
                  <Col>
                    <Tile property='Second wind' amount={`1d10 + ${classes['Fighter']}`} />
                  </Col>
                }
              </Row>
            </View>
          )
        }


      </Content>
    </Container>
  )
}