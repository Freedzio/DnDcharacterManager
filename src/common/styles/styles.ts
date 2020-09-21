import { StyleSheet } from "react-native";

export const header = StyleSheet.create({
    main: {
        textAlign: "center",
        fontSize: 48,
        fontWeight: "bold"
    },
    sub: {
        fontSize: 36,
        textAlign: "center"
    }
})

export const spellStyle = StyleSheet.create({
    levelHeader: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    columnNames: {
      textAlign: "center",
      fontWeight: 'bold',
      flex: 1
    },
    spellMain: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: 'bold'
    },
    spellSub: {
      flex: 1,
      textAlign: "center",
      fontSize: 14
    },
    desc: {
      fontSize: 16,
      marginVertical: 5,
      marginHorizontal: 10
    }
  })

