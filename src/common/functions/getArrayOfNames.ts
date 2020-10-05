import { Results, JustUrl } from "../models/models";

export default function getArrayOfNames(dupa: Array<JustUrl>) {
    let arr: string[] = [];

    if (dupa.length > 0) {

        for (let i = 0; i < dupa.length; i++) {
            arr.push(dupa[i].name)
        }
    }

    return arr
}