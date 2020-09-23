import { Card, CardItem, Text, List, ListItem, Body, Row, Accordion } from "native-base";
import React, { useState } from "react";
import { JustUrl, ChoosingOptions, Proficiency, Trait, Feature } from "../common/models/models";
import { Picker } from '@react-native-community/picker'
import { View } from "react-native";
import { Drake, drakes } from "./draconicAncestry";
import { spellStyle } from "../common/styles/styles";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Section({ title, description, listedData, options, dragonborn, selectedVal, setterCallback, chosenListItem, listItemCallback, spellcastingData }: Section) {
    function onListItemPress(item: string) {
        if (chosenListItem === item) listItemCallback('')
        else listItemCallback(item)
    }

    return (
        <Card>
            <View>
                <Text style={{ margin: 10, fontWeight: "bold", fontSize: 24 }}>
                    {title}
                </Text>
            </View>
            <View>
                <Text style={spellStyle.desc}>
                    {description}
                </Text>
            </View>
            {
                listedData &&
                <List>
                    {
                        Object.keys(listedData).map((entry: string, index: number) =>
                            <TouchableOpacity key={index} onPress={() => onListItemPress(entry)}>
                                <ListItem>
                                    <Text style={spellStyle.spellMain}>{listedData[entry].name}</Text>
                                </ListItem>
                                <View>
                                    {
                                        chosenListItem === entry && listedData[entry].desc &&
                                        listedData[entry].desc.map((desc: string, index: number) =>
                                            <Text key={index} style={spellStyle.desc}>{desc}</Text>
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </List>
            }
            {
                spellcastingData &&
                <List>
                    {
                        spellcastingData.map((entry: { name: string, desc: string[] }, index: number) =>
                            <TouchableOpacity onPress={() => onListItemPress(entry.name)} key={index}>
                                <ListItem>
                                    <Text style={spellStyle.spellMain}>{entry.name} </Text>
                                </ListItem>
                                {
                                    chosenListItem === entry.name &&
                                    <View>
                                        {
                                            entry.desc.map((descPart: string, index: number) =>
                                                <Text style={spellStyle.desc} key={index}>{descPart}</Text>
                                            )
                                        }
                                    </View>
                                }
                            </TouchableOpacity>
                        )
                    }
                </List>
            }
            {
                options && setterCallback &&
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: "bold" }}>Choose {options.choose}</Text>
                    <Picker
                        selectedValue={selectedVal}
                        style={{ width: 200 }}
                        onValueChange={(v: any) => setterCallback(v as string)}
                    >
                        <Picker.Item label={`--Choose ${title.toLowerCase()}--`} value='choose' />
                        {
                            options.from.map((item: JustUrl, index: number) =>
                                <Picker.Item label={item.name} value={item.name} key={index} />
                            )
                        }
                    </Picker>
                </View>

            }
            {
                dragonborn &&
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: "bold" }}>Choose draconic ancestry</Text>
                    <Picker
                        style={{ width: 360 }}
                        selectedValue={selectedVal}
                        onValueChange={v => setterCallback(v as string)}
                    >
                        {
                            drakes.map((drake: Drake, index: number) =>
                                <Picker.Item
                                    value={drake.dragon}
                                    label={`${drake.dragon} dragon, ${drake.damageType} damage, ${drake.breathWeapon}`} 
                                    key={index}
                                    />
                            )
                        }
                    </Picker>
                </View>
            }
        </Card >
    )
}

interface Section {
    title: string,
    description?: string,
    listedData?: { [index: string]: Trait | Proficiency | Feature },
    options?: ChoosingOptions,
    selectedVal?: string,
    setterCallback?: any,
    listItemCallback?: any,
    baseResourceUrl?: string,
    dragonborn?: boolean,
    chosenListItem?: string
    spellcastingData?: Array<{ name: string, desc: string[] }>
}