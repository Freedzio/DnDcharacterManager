import { Card, CardItem, Text, List, ListItem, Body, Row } from "native-base";
import React, { useState } from "react";
import { JustUrl, ChoosingOptions } from "../../common/models/models";
import { baseForDescriptionSake } from "../../common/ApiConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import LoadingContainer from "../../common/LoadingContainer";
import { Picker } from '@react-native-community/picker'
import apiWrapper from "../../common/functions/apiWrapper";
import { View } from "react-native";
import { Drake, drakes } from "./draconicAncestry";

export default function Section({ title, description, listedData, options, dragonborn, selectedVal, setterCallback }: Section) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>();
    const [itemDescription, setItemDescription] = useState<Array<string>>([])

    async function getItemData(item: JustUrl) {
        const data = await apiWrapper(`${baseForDescriptionSake}${item.url}`);
        return data;
    }

    function resolveDescription(itemData: ItemData) {
        if (itemData.desc) return itemData.desc;
        if (itemData.type === 'Weapons') return ['On attack rolls, add your proficiency bonus'];
        return ['']
    }

    async function onItemPress(item: JustUrl, index: number) {
        setItemDescription([]);
        setSelectedIndex(index === selectedIndex ? null : index);
        const itemData = await getItemData(item);
        const desc = resolveDescription(await itemData)
        setItemDescription(await desc);
    }

    return (
        <Card>
            <CardItem>
                <Body>
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
                    <View>
                        <List>
                            {
                                listedData?.map((item: any, index: number) => {
                                    const showDescription = index === selectedIndex
                                    return (
                                        <>
                                            <TouchableOpacity key={index} onPress={() => onItemPress(item, index)}>
                                                <ListItem key={index}>
                                                    <Text style={{ fontWeight: showDescription ? 'bold' : 'normal' }}>
                                                        {item.name}
                                                    </Text>
                                                </ListItem>
                                            </TouchableOpacity>
                                            {
                                                showDescription &&
                                                <View>
                                                    <LoadingContainer ready={itemDescription !== []}>
                                                        <Text>
                                                            {
                                                                itemDescription.map((desc: string, index: number) =>
                                                                    <Text>
                                                                        {desc}
                                                                    </Text>
                                                                )
                                                            }
                                                        </Text>
                                                    </LoadingContainer>
                                                </View>
                                            }
                                        </>
                                    )
                                }
                                )}
                        </List>
                    </View>
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
                                style={{ width: 300 }}
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
                </Body>
            </CardItem>
        </Card >
    )
}

interface Section {
    title: string,
    description?: string,
    listedData?: Array<JustUrl>,
    options?: ChoosingOptions,
    selectedVal?: string,
    setterCallback?: any,
    baseResourceUrl?: string,
    dragonborn?: boolean
}

interface ItemData {
    index: string,
    type: string,
    name: string,
    desc?: Array<string>
}