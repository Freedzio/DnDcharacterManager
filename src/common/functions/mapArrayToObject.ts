import uuid from "react-native-uuid"

export default function mapArrayToObject(arr: Array<any>) {
    return Array.from(arr).reduce((obj, item) => {
        const id = uuid.v4();

        return obj = {
            ...obj,
            [id + '_' + item.index]: item
        }
    }, {})
}