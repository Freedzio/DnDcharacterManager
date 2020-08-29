const base = 'https://www.dnd5eapi.co/api';

export const ApiConfig = {
    races: `${base}/races`,
    race: (race: string) => `${base}/races/${race}`
}