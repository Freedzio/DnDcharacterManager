import { Container, Content, List, ListItem, Text } from 'native-base';
import React from 'react';
import { useSelector } from 'react-redux';
import ScreenHeader from '../common/components/ScreenHeader';
import getAbilityModifier from '../common/functions/getAbilityModifier';
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

    const hasProf = Object.keys(proficiencies).includes(pureItem) || Object.keys(proficiencies).includes(items[item].weapon_category);
    const STR = getAbilityModifier(abilityScores['STR'].score);
    const DEX = getAbilityModifier(abilityScores['DEX'].score);

    return hasProf ? profBonus : 0 + (items[item].properties.some(prop => prop.index === 'finesse') ? determineHigherMod() : STR)
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

  function renderPlusOrMinus(mod: number) {
    return mod > 0 ? `+${mod}` : mod

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
            <Text style={{ flex: 1 }}>Weapon</Text>
            <Text style={{ flex: 1 }}>Modifier</Text>
            <Text style={{ flex: 1 }}>Damage</Text>
          </ListItem>
          <ListItem>
            <Text style={{ flex: 1 }}>Unarmed strikes</Text>
            <Text style={{ flex: 1 }}>{renderPlusOrMinus(getUnarmedMod(profBonus, getAbilityModifier(abilityScores['STR'].score)))}</Text>
            <Text style={{ flex: 1 }}>{1 + getAbilityModifier(abilityScores['STR'].score)} Bludgeoning</Text>
          </ListItem>
          {
            equipped.filter(item => items[item].equipment_category.index === 'weapon').map((item: string) =>
              <ListItem>
                <Text style={{ flex: 1 }}>{items[item].name}</Text>
                <Text style={{ flex: 1 }}>{renderPlusOrMinus(getRollModifier(item))}</Text>
                <Text style={{ flex: 1 }}>{getDamage(item)}</Text>
              </ListItem>
            )
          }
        </List>
      </Content>
    </Container>
  )
}