import { Trait, JustUrl } from "../models/models";

export default function mapTraits(traits: Array<JustUrl>) {
    const traitsJSON: Trait[] = require('../../database/Traits.json');

    let arr: Array<Trait> = [];

    for (let i = 0; i < traits.length; i++) {
        const data = traitsJSON.filter(trait => trait.index === traits[i].index)[0]
        arr.push(data)
    }

    return arr
}