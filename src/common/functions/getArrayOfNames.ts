import { Results, JustUrl } from "../models/models";

export default function getArrayOfNames(data: Array<JustUrl>) {
    let arr: string[] = [];

    for (let i = 0; i < data.length; i++) {
        arr.push(data[i].name)
    }

    return arr
}