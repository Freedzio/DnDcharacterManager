export default function getAbilityModifier(score: number) {
  return Math.floor((score - 10) / 2)
}