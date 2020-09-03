import { Proficiency, Trait } from "../models/models";
import resolveDescription from "./resolveDescription";

export default function mapForAccordionSake(items: { [index: string]: Proficiency | Trait }) {
  if (items === undefined) return
  
  const keys = Object.keys(items)

  let arr: Array<{ title: string, content: string }> = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const item = items[key]

    const obj = {
      title: item.name,
      content: resolveDescription(item).join(' ')
    }
    arr.push(obj)
  }

  return arr
}