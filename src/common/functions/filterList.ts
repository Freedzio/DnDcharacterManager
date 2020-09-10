export default function filterList(item: any, values: any, key: string) {
  return !Object.values(values).includes(item as string) || values[key] === item
}