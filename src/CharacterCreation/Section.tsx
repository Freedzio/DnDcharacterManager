import { Card, CardItem, Text, List, ListItem, Body, Row, Accordion } from "native-base";
import React, { useState } from "react";
import { JustUrl, ChoosingOptions } from "../common/models/models";
import { Picker } from '@react-native-community/picker'
import { View } from "react-native";
import { Drake, drakes } from "./draconicAncestry";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Section({ title, description, listedData, options, dragonborn, selectedVal, setterCallback }: Section) {
    return (
        <Card>
            <CardItem>
                <SafeAreaView>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {title}
                        </Text>
                    </View>
                    <View>
                        <Text>
                            {description}
                        </Text>
                    </View>
                    {
                        listedData &&
                        <View>
                            <Accordion dataArray={listedData} style={{ width: 350 }} />
                        </View>
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
                                            label={`${drake.dragon} dragon, ${drake.damageType} damage, ${drake.breathWeapon}`} />
                                    )
                                }
                            </Picker>
                        </View>
                    }
                </SafeAreaView>
            </CardItem>
        </Card >
    )
}

interface Section {
    title: string,
    description?: string,
    listedData?: Array<{ title: string, content: string }>,
    options?: ChoosingOptions,
    selectedVal?: string,
    setterCallback?: any,
    baseResourceUrl?: string,
    dragonborn?: boolean
}

export interface ItemData {
    index: string,
    type?: string,
    name: string,
    desc?: Array<string>
}