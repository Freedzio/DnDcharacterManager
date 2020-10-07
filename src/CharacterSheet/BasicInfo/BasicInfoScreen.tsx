import { Card, CheckBox, Col, Container, Content, Fab, Icon, List, ListItem, Row, Text, View } from 'native-base'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import Tile from '../../CharacterCreation/Tile'
import ScreenHeader from '../../common/components/ScreenHeader'
import { CONFIRM_LEVEL_UP_SCREEN, LEVEL_UP_SCREEN } from '../../common/constants/routeNames'
import getAbilityModifier from '../../common/functions/getAbilityModifier'
import { spellStyle } from '../../common/styles/styles'
import store, { StoreProps } from '../../redux/store'

export default function BasicInfoScreen({ navigation }: any) {
  const [success1, setSuccess1] = useState<boolean>(false);
  const [success2, setSuccess2] = useState<boolean>(false);
  const [success3, setSuccess3] = useState<boolean>(false);
  const [fail1, setFail1] = useState<boolean>(false);
  const [fail2, setFail2] = useState<boolean>(false);
  const [fail3, setFail3] = useState<boolean>(false);
  const [chosenTrait, setChosenTrait] = useState<string>('');

  const abilityScores = useSelector((store: StoreProps) => store.abilityScores);
  const classes = useSelector((store: StoreProps) => store.classes)
  const basicInfo = useSelector((store: StoreProps) => store.basicInfo);
  const name = useSelector((store: StoreProps) => store.name);
  const maxHP = useSelector((store: StoreProps) => store.maxHP);
  const equipped = useSelector((store: StoreProps) => store.equipped);
  const features = useSelector((store: StoreProps) => store.features);
  const items = useSelector((store: StoreProps) => store.items);
  const traits = useSelector((store: StoreProps) => store.traits);
  const hitDies = useSelector((store: StoreProps) => store.hitDies);
  const classSpecific = useSelector((store: StoreProps) => store.classSpecifics)

  function calculateArmorClass() {
    if (Object.keys(features).includes('monk-unarmored-defense') && !equipped.some(item => items[item].equipment_category.index === 'armor')) return 10 + getAbilityModifier(abilityScores['DEX'].score) + getAbilityModifier(abilityScores['WIS'].score);
    if (Object.keys(features).includes('barbarian-unarmored-defense') && !equipped.some(item => items[item].equipment_category.index === 'armor' && items[item].index !== 'shield')) return 10 + getAbilityModifier(abilityScores['DEX'].score) + getAbilityModifier(abilityScores['CON'].score);

    const equippedArmor = equipped.filter(item => items[item].equipment_category.index === 'armor' && items[item].index !== 'shield');

    if (equippedArmor.length === 0) return 10 + getAbilityModifier(abilityScores['DEX'].score) + (equipped.filter(item => items[item].index === 'shield').length > 0 ? 2 : 0)

    let ac = 0;

    if (equipped.some(item => items[item].index === 'shield')) ac += 2;
    if (Object.keys(features).some(feat => feat.includes('fighting-style-defense'))) ac += 1;

    for (let i = 0; i < equippedArmor.length; i++) {
      if (Object.keys(features).includes('fighting-style-defense')) ac++;

      const item = equippedArmor[i];

      ac += items[item].armor_class.base;

      const mod = getAbilityModifier(abilityScores['DEX'].score);

      if (items[item].armor_class.dex_bonus && mod > 0) {
        const maxBonus = items[item].armor_class.max_bonus
        if (maxBonus === null) ac += mod
        else ac += (mod > maxBonus ? maxBonus : mod);
      }
    }

    return ac
  }

  function onTraitPress(trait: string) {
    if (chosenTrait === trait) setChosenTrait('')
    else setChosenTrait(trait)
  }

  function getMovement() {
    const baseMov = basicInfo.speed;

    return baseMov + (Object.keys(features).toString().includes('unarmored-movement') ? classSpecific['Monk'].unarmored_movement : 0)
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title="BASIC INFO" subtitle={name} />
        <View style={{ padding: 10 }}>
          {
            Object.keys(classes).sort((a, b) => classes[a] - classes[b]).reverse().map((classId: string, index: number) =>
              <Text key={index} style={spellStyle.levelHeader}>{`Level ${classes[classId]} ${classId}`} </Text>
            )
          }
        </View>
        <Row>
          <Col>
            <Tile property='Armor class' amount={calculateArmorClass()} />
          </Col>
          <Col>
            <Tile property='Initiative' amount={getAbilityModifier(abilityScores['DEX'].score)} />
          </Col>
          <Col>
            <Tile property="Speed" amount={getMovement()} />
          </Col>
          <Col>
            <Tile property="Passive perception" amount={10 + getAbilityModifier(abilityScores['WIS'].score)} />
          </Col>
        </Row>
        <Card>
          <Text style={styles.sectionTitle}>HP</Text>
          <Row>
            <Col>
              <Tile property='Current' amount={maxHP} />
            </Col>
            <Col>
              <Tile property='Max' amount={maxHP} />
            </Col>

          </Row>
        </Card>
        <Card>
          <Card>
            <Text style={styles.sectionTitle}>Hit dies</Text>
            {
              Object.keys(hitDies).filter(die => hitDies[die] > 0).map((die: string, index: number) =>
                <View key={index}>
                  <Text style={spellStyle.spellMain}>{`d${die}`}</Text>
                  <Row>
                    <Col>
                      <Tile property='Current' amount={hitDies[die]} />
                    </Col>
                    <Col>
                      <Tile property='Max' amount={hitDies[die]} />
                    </Col>
                  </Row>
                </View>
              )
            }
          </Card>
          <Text style={styles.sectionTitle}>Death rolls</Text>
          <View style={{ padding: 30, paddingTop: 0 }}>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <View style={{ flex: 1 }}>
                <Text>Success</Text>
              </View>
              <View style={{ flex: 4, flexDirection: 'row' }}>
                <CheckBox style={{ marginHorizontal: 20, width: 30, height: 30 }} onPress={() => setSuccess1(!success1)} checked={success1} />
                <CheckBox style={{ marginHorizontal: 20, width: 30, height: 30 }} onPress={() => setSuccess2(!success2)} checked={success2} />
                <CheckBox style={{ marginHorizontal: 20, width: 30, height: 30 }} onPress={() => setSuccess3(!success3)} checked={success3} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <View style={{ flex: 1 }}>
                <Text>Failure</Text>
              </View>
              <View style={{ flex: 4, flexDirection: 'row' }}>
                <CheckBox style={{ marginHorizontal: 20, width: 30, height: 30 }} onPress={() => setFail1(!fail1)} checked={fail1} />
                <CheckBox style={{ marginHorizontal: 20, width: 30, height: 30 }} onPress={() => setFail2(!fail2)} checked={fail2} />
                <CheckBox style={{ marginHorizontal: 20, width: 30, height: 30 }} onPress={() => setFail3(!fail3)} checked={fail3} />
              </View>
            </View>
          </View>
        </Card>
        <Card>
          <Text style={styles.sectionTitle}>Features and traits</Text>
          <List>
            {
              Object.keys(traits).map((trait: string, index: number) =>
                <TouchableOpacity onPress={() => onTraitPress(trait)} key={index}>
                  <ListItem>
                    <Text style={[spellStyle.spellMain, { textAlign: 'left' }]}>{traits[trait].name} </Text>
                  </ListItem>
                  {
                    chosenTrait === trait &&
                    <View>
                      {
                        traits[trait].desc.map((desc: string, index: number) =>
                          <Text style={spellStyle.desc} key={index}>{desc}</Text>
                        )
                      }
                    </View>
                  }
                </TouchableOpacity>
              )
            }
            {
              Object.keys(features).map((feat: string, index: number) =>
                <TouchableOpacity onPress={() => onTraitPress(feat)} key={index}>
                  <ListItem>
                    <Text style={[spellStyle.spellMain, { textAlign: 'left' }]}>{features[feat].name} </Text>
                  </ListItem>
                  {
                    chosenTrait === feat &&
                    <View>
                      {
                        features[feat].desc && features[feat].desc.map((desc: string, index: number) =>
                          <Text style={spellStyle.desc}>{desc} </Text>
                        )
                      }
                    </View>
                  }
                </TouchableOpacity>
              )
            }
          </List>
        </Card>
      </Content>
      <Fab onPress={() => navigation.navigate(LEVEL_UP_SCREEN)}>
        <Icon name='add' />
      </Fab>
    </Container>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 10
  }
})