import { Card, CheckBox, Col, Container, Content, ListItem, Row, Text, View } from 'native-base'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Tile from '../CharacterCreation/Tile'
import ScreenHeader from '../common/components/ScreenHeader'
import getAbilityModifier from '../common/functions/getAbilityModifier'
import store, { StoreProps } from '../redux/store'

export default function BasicInfoScreen() {
  const [success1, setSuccess1] = useState<boolean>(false);
  const [success2, setSuccess2] = useState<boolean>(false);
  const [success3, setSuccess3] = useState<boolean>(false);
  const [fail1, setFail1] = useState<boolean>(false)
  const [fail2, setFail2] = useState<boolean>(false)
  const [fail3, setFail3] = useState<boolean>(false)

  const abilityScores = useSelector((store: StoreProps) => store.abilityScores);
  const basicInfo = useSelector((store: StoreProps) => store.basicInfo);
  const name = useSelector((store: StoreProps) => store.name);
  const maxHP = useSelector((store: StoreProps) => store.maxHP);

  return (
    <Container>
      <Content>
        <ScreenHeader title="BASIC INFO" subtitle={name} />
        <Row>
          <Col>
            <Tile property='Armor class' amount={10 + getAbilityModifier(abilityScores['DEX'].score)} />
          </Col>
          <Col>
            <Tile property='Initiative' amount={getAbilityModifier(abilityScores['DEX'].score)} />
          </Col>
          <Col>
            <Tile property="Speed" amount={basicInfo.speed} />
          </Col>
          <Col>
            <Tile property="Passive perception" amount={10 + getAbilityModifier(abilityScores['WIS'].score)} />
          </Col>
        </Row>
        <Card>
          <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", padding: 10 }}>HP</Text>
          <Row>
            <Col>
              <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Current</Text>
              <Text style={{ textAlign: "center", fontSize: 20 }}>{maxHP}</Text>
            </Col>
            <Col>
              <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Max</Text>
              <Text style={{ textAlign: "center", fontSize: 20 }}>{maxHP}</Text>
            </Col>
          </Row>
        </Card>
        <Card>
          <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", padding: 10 }}>Death rolls</Text>
          <View style={{ padding: 30, paddingTop: 0 }}>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <View style={{flex: 1}}>
                <Text>Success</Text>

              </View>
              <View style={{flex: 4, flexDirection: 'row'}}>
                <CheckBox style={{ marginHorizontal: 20, width:30, height: 30 }} onPress={() => setSuccess1(!success1)} checked={success1} />
                <CheckBox style={{ marginHorizontal: 20, width:30, height: 30 }} onPress={() => setSuccess2(!success2)} checked={success2} />
                <CheckBox style={{ marginHorizontal: 20, width:30, height: 30 }} onPress={() => setSuccess3(!success3)} checked={success3} />

              </View>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <View style={{flex: 1}}> 
                <Text>Failure</Text>

              </View>
              <View style={{flex: 4, flexDirection: 'row'}}>
                <CheckBox style={{ marginHorizontal: 20, width:30, height: 30 }} onPress={() => setFail1(!fail1)} checked={fail1} />
                <CheckBox style={{ marginHorizontal: 20, width:30, height: 30 }} onPress={() => setFail2(!fail2)} checked={fail2} />
                <CheckBox style={{ marginHorizontal: 20, width:30, height: 30 }} onPress={() => setFail3(!fail3)} checked={fail3} />

              </View>
            </View>
          </View>

        </Card>
      </Content>
    </Container>
  )
}