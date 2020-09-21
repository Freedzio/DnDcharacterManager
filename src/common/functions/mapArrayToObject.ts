import uuid from "react-native-uuid"

export  function mapArrayToObject(arr: Array<any>) {
    return Array.from(arr).reduce((obj, item) => {
        const id = uuid.v4();

        return obj = {
            ...obj,
            [id + '_' + item.index]: item
        }
    }, {})
}

export  function mapArrayToObjectButNotUniqueIds(arr: Array<any>) {
    return Array.from(arr).reduce((obj, item) => {
    
        return obj = {
            ...obj,
            [item.index]: item
        }
    }, {})

}