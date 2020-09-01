import React from 'react'
import { View, Text } from 'native-base'
import { header } from '../styles/styles'

export default function ScreenHeader({ title, subtitle }: Props) {
    return (
        <View>
            <Text style={header.main}>{title}</Text>
            <Text style={header.sub}>{subtitle}</Text>
        </View>
    )
}

interface Props {
    title: string,
    subtitle?: string
}