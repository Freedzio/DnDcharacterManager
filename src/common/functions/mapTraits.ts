import { Trait, JustUrl } from "../models/models";
import apiWrapper from "./apiWrapper";
import { ApiConfig } from "../ApiConfig";

export default async function mapTraits(traits: Array<JustUrl>) {
    let arr: Array<Trait> = [];

    for (let i = 0; i < traits.length; i++) {
        const data = await apiWrapper(ApiConfig.trait(traits[i].url.replace('/api/traits/', '')))
        arr.push(data)
    }

    return arr
}