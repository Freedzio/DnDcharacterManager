import { ItemData } from "../../CharacterCreation/ConfirmRaceScreen/Section";

export default function resolveDescription(itemData: ItemData) {
    if (itemData.desc) return itemData.desc;
    if (itemData.type === 'Weapons') return ['On attack rolls, add your proficiency bonus'];
    return ['']
}