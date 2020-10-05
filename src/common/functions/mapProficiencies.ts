import { JustUrl, Proficiency } from "../models/models";
import resolveDescription from "./resolveDescription";

export default function mapProficiencies(proficiencies: Array<JustUrl>) {
    const proficienciesJSON: Proficiency[] = require('../../database/Proficiencies.json')

    let arr: Array<Proficiency> = [];

    for (let i = 0; i < proficiencies.length; i++) {
        let data = proficienciesJSON.filter(item => item.name === proficiencies[i].name)[0]
        if (!data.desc) data = { ...data, desc: resolveDescription(data) }

        arr.push(data)
    }

    return arr
}