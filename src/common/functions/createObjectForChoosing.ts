import { ChoosingOptions } from "../models/models";

export function createObjectForChoosing(choices: ChoosingOptions[]) {
  let obj = {};
  for (let i = 0; i < choices.length; i++) {
    for (let j = 0; j < choices[i].choose; j++) {
      const a = i.toString();
      const b = j.toString();
      const key = a + b;

      obj = {
        ...obj,
        [key as string]: 'choose'
      }
    }
  }

  return obj
}