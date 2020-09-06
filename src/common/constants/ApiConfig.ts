const base = 'https://www.dnd5eapi.co/api';

export const baseForDescriptionSake = 'https://www.dnd5eapi.co'

export const ApiConfig = {
    races: `${base}/races`,
    race: (race: string) => `${base}/races/${race}`,
    subraces: (race: string) => `${base}/races/${race}/subraces`,
    subrace: (subrace: string) => `${base}/subraces/${subrace}`,
    traits: `${base}/traits`,
    trait: (trait: string) => `${base}/traits/${trait}`,
    proficiencies: `${base}/proficiencies`,
    proficiency: (proficiency: string) => `${base}/proficiencies/${proficiency}`,
    classes: `${base}/classes`,
    class: (charClass: string) => `${base}/classes/${charClass}`,
    spellcasting: `${base}/spellcasting`,
    spellcastingClass: (className: string) => `${base}/spellcasting/${className}`,
    startingEquipment: (className: string) => `${base}/starting-equipment/${className}`,
    equipmentCategories: `${base}/equipment-categories`,
    equipmentCategory: (category: string) => `${base}/equipment-categories/${category}`
}