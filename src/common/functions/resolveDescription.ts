import { ItemData } from "../../CharacterCreation/Section";

export default function resolveDescription(itemData: ItemData) {
    if (itemData.desc) return itemData.desc;
    if (itemData.type === 'Weapons') return ['On attack rolls, add your proficiency bonus'];
    if (itemData.type === "Artisan's Tools") return [`You know how to use ${itemData.name.toLowerCase()}`]
    return ['']
}