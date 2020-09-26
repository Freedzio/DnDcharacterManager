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
  const features = useSelector((store: StoreProps) => store.features);
  const classSpecifics = useSelector((store: StoreProps) => store.classSpecifics);

  function getRollModifier(item: string) {
    const splittedID = item.split('_');
    const pureItem = splittedID[splittedID.length - 1];

    const hasProf = JSON.stringify(Object.keys(proficiencies)).includes(pureItem) || JSON.stringify(Object.keys(proficiencies).includes(items[item].weapon_category));
    const STR = getAbilityModifier(abilityScores['STR'].score);
    const DEX = getAbilityModifier(abilityScores['DEX'].score);

    let rollModifier = 0;
    if (hasProf) rollModifier += profBonus;

    if (isMartialApplicable()) return rollModifier + determineHigherMod();
    if (items[item].properties.some(prop => prop.index === 'finesse')) return rollModifier + determineHigherMod();
    if (items[item].weapon_range === 'Ranged') return rollModifier + DEX;
    return rollModifier + STR
  }

  function determineHigherMod() {
    const STR = getAbilityModifier(abilityScores['STR'].score);
    const DEX = getAbilityModifier(abilityScores['DEX'].score);
    return (STR > DEX) ? STR : DEX
  }

  function getDamage(item: string) {
    const dmgRoll = items[item].damage;

    if (isMartialApplicable()) return `${dmgRoll.damage_dice} + ${determineHigherMod()} ${dmgRoll.damage_type.name}`
    return `${dmgRoll.damage_dice} + ${items[item].properties.some(prop => prop.index === 'finesse') ? determineHigherMod() : getAbilityModifier(abilityScores['STR'].score)} ${dmgRoll.damage_type.name}`
  }

  function isMartialApplicable() {
    return (
      Object.keys(features).includes('martial-arts') &&
      !equipped.filter(eq => items[eq].equipment_category.index === 'weapon').some(eq => items[eq].weapon_range === 'Ranged') &&
      !equipped.filter(eq => items[eq].equipment_category.index === 'weapon').some(eq => !items[eq].properties.some(x => x.index !== 'monk')) &&
      !equipped.some(eq => items[eq].equipment_category.index === 'armor')
    )
  }

  function getUnarmedMod() {
    if (isMartialApplicable()) return determineHigherMod() + profBonus
    else return getAbilityModifier(abilityScores['STR'].score) + profBonus
  }

  function getUnarmedDamage() {
    if (isMartialApplicable()) return `${1 + determineHigherMod()} or ${classSpecifics['Monk'].martial_arts.dice_count}d${classSpecifics['Monk'].martial_arts.dice_value}`
    else return 1 + profBonus + getAbilityModifier(abilityScores['STR'].score)
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
            <Text style={spellStyle.spellMain}>{renderPlusOrMinus(getUnarmedMod())}</Text>
            <Text style={spellStyle.spellMain}>{getUnarmedDamage()} Bludgeoning</Text>
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