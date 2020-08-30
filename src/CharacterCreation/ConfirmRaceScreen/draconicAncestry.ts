export const drakes: Drake[] = [
    {
        dragon: 'Black',
        damageType: 'Acid',
        breathWeapon: '5 by 30 ft. line (Dex. save)'
    },
    {
        dragon: 'Blue',
        damageType: 'Lightning',
        breathWeapon: '5 by 30 ft. line (Dex. save)'
    },
    {
        dragon: 'Brass',
        damageType: 'Fire',
        breathWeapon: '5 by 30 ft. line (Dex. save)'
    },
    {
        dragon: 'Bronze',
        damageType: 'Lightning',
        breathWeapon: '5 by 30 ft. line (Dex. save)'
    },
    {
        dragon: 'Copper',
        damageType: 'Acid',
        breathWeapon: '5 by 30 ft. line (Dex. save)'
    },
    {
        dragon: 'Gold',
        damageType: 'Fire',
        breathWeapon: '15 ft. cone (Dex. save)'
    },
    {
        dragon: 'Green',
        damageType: 'Poison',
        breathWeapon: '15 ft. cone (Con. save)'
    },
    {
        dragon: 'Red',
        damageType: 'Fire',
        breathWeapon: '15 ft. cone (Dex. save)'
    },
    {
        dragon: 'Silver',
        damageType: 'Cold',
        breathWeapon: '15 ft. cone (Con. save)'
    },
    {
        dragon: 'White',
        damageType: 'Cold',
        breathWeapon: '15 ft. cone (Con. save)'
    }
];

export interface Drake {
    dragon: string,
    damageType: string,
    breathWeapon: string
}