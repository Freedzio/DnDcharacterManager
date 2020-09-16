export interface Race {
    _id: string,
    index: string,
    name: string,
    speed: number,
    alignment: string,
    age: string,
    size: string,
    size_description: string,
    starting_proficiencies: Array<JustUrl>,
    starting_proficiency_options: ChoosingOptions,
    ability_bonuses: Array<AbilitySimple>,
    ability_bonus_options: ChoosingOptions,
    languages: Array<JustUrl>,
    language_desc: string,
    language_options: ChoosingOptions
    traits: Array<JustUrl>,
    trait_options: ChoosingOptions,
    subraces: Array<JustUrl>
    url: string
}

export interface CharacterClass {
    index: string,
    name: string,
    hit_die: number,
    proficiency_choices: Array<ChoosingOptions>,
    proficiencies: Array<JustUrl>,
    saving_throws: Array<JustUrl>
    starting_equpiment: JustUrl,
    class_levels: JustUrl,
    subclasses: Array<JustUrl>
    url: string,
    spellcasting: JustUrl
}

export interface Subrace {
    index: string,
    name: string,
    race: JustUrl,
    ability_bonuses: Array<AbilitySimple>
    starting_proficiencies: Array<JustUrl>
    languages: Array<any>
    racial_traits: Array<JustUrl>
    desc: string
}

export interface EqItem {
    index: string,
    name: string,
    equipment_category: JustUrl,
    weight: number,
    cost: {
        quantity: number,
        unit: string
    },
    url: string
};

export interface Armor extends EqItem {
    armor_category: string,
    armor_class: {
        base: number,
        dex_bonus: boolean,
        max_bonus: number
    },
    str_minimum: number,
    stealth_disadvantage: boolean
}

export interface Weapon extends EqItem {
    weapon_category: string,
    weapon_range: string,
    category_range: string,
    damage: Damage,
    range: {
        normal: number,
        long: number | null
    },
    properties: JustUrl,
    '2h_damage': Damage
}

export interface AdventuringGear extends EqItem {
    gear_category: JustUrl,
    quantity: number
    contents: Array<{ item_url: string, quantity: number }>
}

export interface Damage {
    damage_dice: string,
    damage_type: JustUrl
}

export interface JustUrl {
    name: string,
    url: string,
    bonus?: number,
    index?: string
}

export interface AbilitySimple {
    name: string,
    url: string,
    bonus: number
}

export interface ChoosingOptions {
    choose: number,
    type: string,
    from: Array<JustUrl>
}

export interface Proficiency {
    _id: string,
    index: string,
    type: string,
    name: string
    classes: Array<JustUrl>
    races: Array<JustUrl>,
    url: string,
    references: Array<{
        url: string
        type: string
        name: string
    }>
}

export interface Results {
    count: number,
    results: Array<JustUrl>
}

export interface Trait {
    index: string,
    name: string,
    desc: Array<string>,
    races: Array<JustUrl>
}

export interface AbilityScores {
    [key: string]: {
        score: number
        proficiency?: boolean
    }

}

export interface Spellcasting {
    index: string,
    class: JustUrl,
    level: number,
    spellcasting_ability: JustUrl,
    info: Array<{
        name: string,
        desc: Array<string>
    }>
    url: string
}

export interface EquipmentEntrySimple {
    equipment: {
        index: string,
        name: string,
        url: string,
    },
    quantity: number
}

export interface StartingEquipment {
    index: string,
    class: JustUrl,
    url: string,
    starting_equipment: Array<EquipmentEntrySimple>
    starting_equipment_options: Array<ChooseEquipmentOptions>
}

export interface ChooseEquipmentOptions {
    choose: number,
    type: string,
    from: Array<EquipmentEntrySimple & ChooseEquipmentFromList> | {
        equipment_category: JustUrl
    }
}

export interface ChooseFromCategory {
    choose: number,
    type: string,
    from: {
        equipment_category: JustUrl
    }
}

export interface ChooseEquipmentFromList {
    equipment_option: {
        choose: number,
        type: string,
        from: {
            equipment_category: JustUrl
        } & JustUrl
    }
}

export interface Features {
    level: number
    ability_score_bonuses: number
    prof_bonus: number
    features: Array<JustUrl>
    feature_choices: Array<JustUrl>
    spellcasting: {
        cantrips_known?: number
        spell_slots_level_1?: number
        spell_slots_level_2?: number
        spell_slots_level_3?: number
        spell_slots_level_4?: number
        spell_slots_level_5?: number
        spell_slots_level_6?: number
        spell_slots_level_7?: number
        spell_slots_level_8?: number
        spell_slots_level_9?: number
    }
    class_specific: any
    index: string
    class: JustUrl
    url: string
};

export interface Feature {
    index: string
    class: JustUrl,
    name: string,
    level: number,
    desc: Array<string>
    url: string
    choice: ChoosingOptions
};

export interface Character {
    id: string
    name: string
    race: string
    class: string
    abilityScores: {
        [key: string]: {
            score: number
            proficiency: boolean
        }
    }
    basciInfo: {
        speed: number
        size: string
    }
    languages: Array<string>
    proficiencies: {
        [key: string]: Proficiency
    }
    traits: {
        [key: string]: Trait
    }
    features: {
        [key: string]: Feature
    }
    items: {
        [key: string]: Armor | Weapon | AdventuringGear
    }
    skills: Array<string>
    expertise: Array<string>
    equipped: {
        [key: string]: Armor | Weapon
    }
}

export interface AbilityBonuses extends AbilityScores { }