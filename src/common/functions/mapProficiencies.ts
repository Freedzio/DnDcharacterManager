import { JustUrl, Proficiency } from "../models/models";
import apiWrapper from "./apiWrapper";
import { ApiConfig } from "../constants/ApiConfig";
import resolveDescription from "./resolveDescription";

export default async function mapProficiencies(proficiencies: Array<JustUrl>) {
    let arr: Array<Proficiency> = [];

    for (let i = 0; i < proficiencies.length; i++) {
        let data = await apiWrapper(ApiConfig.proficiency(proficiencies[i].url.replace('/api/proficiencies/', '')));
        if (!data.desc) data = {...data, desc: resolveDescription(data)}

        arr.push(data)
    }

    return arr
}