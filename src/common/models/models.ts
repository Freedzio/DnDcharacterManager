export interface Race {
    _id: string,
    index: string,
    name: string,
    speed: number,
    alignment: string,
    age: string,
    size: string,
    size_description: string,
    starting_proficiences: Array<JustUrl>,
    starting_proficiency_options: ChoosingOptions,
    ability_bonuses: Array<AbilitySimple>,
    languages: Array<JustUrl>,
    language_desc: string,
    language_options: ChoosingOptions
    traits: Array<JustUrl>,
    trait_options: ChoosingOptions,
    subraces: Array<JustUrl>
    url: string
}

export interface JustUrl {
    name: string,
    url: string
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
    races: [],
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

export interface NamedJustUrl extends JustUrl {
    name: string
}