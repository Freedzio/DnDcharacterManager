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

export default function EquipmentOptionsSwitcher({ className, onNextPress, navigation }: Props) {
  switch (className) {
    case 'barbarian':
      return <Barbarian onNextPress={onNextPress} navigation={navigation} />

    case 'bard':
      return <Bard onNextPress={onNextPress} navigation={navigation} />

    case 'cleric':
      return <Cleric onNextPress={onNextPress} navigation={navigation} />

    case 'druid':
      return <Druid onNextPress={onNextPress} navigation={navigation} />

    case 'fighter':
      return <Fighter onNextPress={onNextPress} navigation={navigation} />

    case 'monk':
      return <Monk onNextPress={onNextPress} navigation={navigation} />

    case 'paladin':
      return <Paladin onNextPress={onNextPress} navigation={navigation} />

    case 'ranger':
      return <Ranger onNextPress={onNextPress} navigation={navigation} />

    case 'rogue':
      return <Rogue onNextPress={onNextPress} navigation={navigation} />

    case 'sorcerer':
      return <Sorcerer onNextPress={onNextPress} navigation={navigation} />

    case 'warlock':
      return <Warlock onNextPress={onNextPress} navigation={navigation} />

    case 'wizard':
      return <Wizard onNextPress={onNextPress} navigation={navigation} />

    default:
      return <View><Text>Whoopsie daisy, I wasnt ready</Text></View>
  }
}

interface Props {
  className: string,
  onNextPress: () => void,
  navigation: any
}