import { Container, Content, List, ListItem, Text, View } from 'native-base';
import React from 'react';
import { useSelector } from 'react-redux';
import ScreenHeader from '../common/components/ScreenHeader';
import getAbilityModifier from '../common/functions/getAbilityModifier';
import renderPlusOrMinus from '../common/functions/renderPlusOrMinus';
import { JustUrl } from '../common/models/models';
import { spellStyle } from '../common/styles/styles';
import { StoreProps } from '../redux/store';

export default function AttacksScreen() {
  const profBonus = useSelector((store: StoreProps) => store.basicInfo.proficiencyBonus);
  const abilityScores = useSelector((store: StoreProps) => store.abilityScores);
  const proficiencies = useSelector((store: StoreProps) => store.proficiencies);
  const equipped = useSelector((store: StoreProps) => store.equipped);
  const items = useSelector((store: StoreProps) => store.items);

  function getRollModifier(item: string) {
    const splittedID = item.split('_');
    const pureItem = splittedID[splittedID.length - 1];

    const hasProf = JSON.stringify(Object.keys(proficiencies)).includes(pureItem) || JSON.stringify(Object.keys(proficiencies).includes(items[item].weapon_category));
    const STR = getAbilityModifier(abilityScores['STR'].score);
    const DEX = getAbilityModifier(abilityScores['DEX'].score);

    let rollModifier = 0;
    if (hasProf) rollModifier += profBonus;

    if (items[item].weapon_range === 'Ranged') return rollModifier + DEX;
    if (items[item].properties.some(prop => prop.index === 'finesse')) return rollModifier + determineHigherMod();
    return rollModifier + STR
  }

  function determineHigherMod() {
    const STR = getAbilityModifier(abilityScores['STR'].score);
    const DEX = getAbilityModifier(abilityScores['DEX'].score);
    return (STR > DEX) ? STR : DEX
  }

  function getDamage(item: string) {

    const dmgRoll = items[item].damage

    return `${dmgRoll.damage_dice} + ${items[item].properties.some(prop => prop.index === 'finesse') ? determineHigherMod() : getAbilityModifier(abilityScores['STR'].score)} ${dmgRoll.damage_type.name}`
  }

  function getUnarmedMod(a: number, b: number) {
    return a + b;
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title="WEAPON ATTACKS" />
        <List>
          <ListItem>
            <Text style={spellStyle.columnNames}>Weapon</Text>
            <Text style={spellStyle.columnNames}>Modifier</Text>
            <Text style={spellStyle.columnNames}>Damage</Text>
            <Text style={spellStyle.columnNames}>Range</Text>
          </ListItem>
          <ListItem>
            <Text style={spellStyle.spellMain}>Unarmed strikes</Text>
            <Text style={spellStyle.spellMain}>{renderPlusOrMinus(getUnarmedMod(profBonus, getAbilityModifier(abilityScores['STR'].score)))}</Text>
            <Text style={spellStyle.spellMain}>{1 + getAbilityModifier(abilityScores['STR'].score)} Bludgeoning</Text>
            <Text style={spellStyle.spellMain}>Melee</Text>
          </ListItem>
          {
            equipped.filter(item => items[item].equipment_category.index === 'weapon').map((item: string, index: number) =>
              <View key={index}>
                <ListItem>
                  <Text style={spellStyle.spellMain}>{items[item].name}</Text>
                  <Text style={spellStyle.spellMain}>{renderPlusOrMinus(getRollModifier(item))}</Text>
                  <Text style={spellStyle.spellMain}>{getDamage(item)}</Text>
                  <Text style={spellStyle.spellMain}>{items[item].weapon_range === 'Melee' ? items[item].weapon_range : `${items[item].range.normal} / ${items[item].range.long}`}</Text>
                </ListItem>
                <ListItem>
                  {
                    items[item].properties.map((property: JustUrl, index: number) =>
                      <Text style={spellStyle.spellSub} key={index}>{property.name}</Text>
                    )
                  }
                </ListItem>
              </View>
            )
          }
        </List>
      </Content>
    </Container>
  )
}