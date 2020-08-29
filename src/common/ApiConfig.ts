const base = 'https://www.dnd5eapi.co/api';

export const baseForDescriptionSake = 'https://www.dnd5eapi.co'

export const ApiConfig = {
    races: `${base}/races`,
    race: (race: string) => `${base}/races/${race}`,
    subraces: (race: string) => `${base}/races/${race}/subraces`,
    traits: `${base}/traits`,
    trait: (trait: string) => `${base}/traits/${trait}`
}