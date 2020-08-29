import { Card, CardItem, View, Text, List, ListItem, Body } from "native-base";
import React, { useState } from "react";
import { JustUrl, ChoosingOptions } from "../../common/models/models";
import { baseForDescriptionSake } from "../../common/ApiConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import LoadingContainer from "../../common/LoadingContainer";
import { Picker } from '@react-native-community/picker'

export default function Section({ title, description, listedData, options, selectedVal, setterCallback, baseResourceUrl }: Section) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>();
    const [itemDescription, setItemDescription] = useState<string>('')

    async function getItemData(item: JustUrl) {
        const response = await fetch(`${baseForDescriptionSake}${item.url}`);
        const data = await response.json();
        return data
    }

    async function onItemPress(item: JustUrl, index: number) {
        setItemDescription('');
        setSelectedIndex(index === selectedIndex ? null : index);
        const itemData = await getItemData(item);
        setItemDescription(await itemData.desc[0]);
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
                                                    <LoadingContainer ready={itemDescription !== ''}>
                                                        <Text>
                                                            {itemDescription}
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
                                <Picker.Item label="--Choose language--" value='choose' />
                                {
                                    options.from.map((item: JustUrl, index: number) =>
                                        <Picker.Item label={item.name} value={item.name} key={index} />
                                    )
                                }
                            </Picker>
                        </View>
                    }
                </Body>
            </CardItem>
        </Card>
    )
}

interface Section {
    title: string,
    description?: string,
    listedData?: Array<JustUrl>,
    options?: ChoosingOptions,
    selectedVal?: string,
    setterCallback?: any,
    baseResourceUrl?: string
}