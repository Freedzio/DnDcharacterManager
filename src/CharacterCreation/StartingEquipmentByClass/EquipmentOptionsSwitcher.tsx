import React from 'react'
import Barbarian from './Barbarian'
import Bard from './Bard'
import { View, Text } from 'native-base'
import Cleric from './Cleric'
import Druid from './Druid'
import Fighter from './Fighter'
import Monk from './Monk'
import Paladin from './Paladin'
import Ranger from './Ranger'
import Rogue from './Rogue'
import Sorcerer from './Sorcerer'
import Warlock from './Warlock'
import Wizard from './Wizard'

export default function EquipmentOptionsSwitcher({ className }: Props) {
  switch (className) {
    case 'barbarian':
      return <Barbarian />

    case 'bard':
      return <Bard />

    case 'cleric':
      return <Cleric />

    case 'druid':
      return <Druid />

    case 'fighter':
      return <Fighter />

    case 'monk':
      return <Monk />

    case 'paladin':
      return <Paladin />

    case 'ranger':
      return <Ranger />

    case 'rogue':
      return <Rogue />

    case 'sorcerer':
      return <Sorcerer />

    case 'warlock':
      return <Warlock />

    case 'wizard':
      return <Wizard />

    default:
      return <View><Text>Whoopsie daisy, I wasnt ready</Text></View>
  }
}

interface Props {
  className: string
}