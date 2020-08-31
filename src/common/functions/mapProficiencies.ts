import { JustUrl, Proficiency } from "../models/models";
import apiWrapper from "./apiWrapper";
import { ApiConfig } from "../ApiConfig";

export default async function mapProficiencies(proficiencies: Array<JustUrl>) {
    let arr: Array<Proficiency> = [];

    for (let i = 0; i < proficiencies.length; i++) {
        const data = await apiWrapper(ApiConfig.proficiency(proficiencies[i].url.replace('/api/proficiencies', '')))
        arr.push(data)
    }

    return arr
}