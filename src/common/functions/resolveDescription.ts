import { ItemData } from "../../CharacterCreation/Section";

export default function resolveDescription(itemData: ItemData) {
    const item = itemData.name.toLowerCase()
    if (itemData.desc) return itemData.desc;
    if (itemData.type === 'Weapons') return [`On attack rolls using ${item}, add your proficiency bonus`];
    if (itemData.type === 'Armor') return [`You are able to wear ${item}`]
    if (itemData.type === "Artisan's Tools") return [`You know how to use ${item}`]
    if (itemData.type === '') return [`You know how to use ${item}`]
    return ['']
}