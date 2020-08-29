import { Results } from "../models/models";

export default function getArrayOfNames(data: Results) {
    let arr: string[] = [];

    for (let i = 0; i < data.results.length; i++) {
        arr.push(data.results[i].name)
    }

    return arr
}