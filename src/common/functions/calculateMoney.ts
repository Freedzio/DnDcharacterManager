import { Cost, Money } from "../models/models";

export default function calculateMoney(money: Money, cost: Cost, buyOrSell: 'buy' | 'sell') {
  const totalCopper = money['cp'] + money['sp'] * 10 + money['ep'] * 50 + money['gp'] * 100 + money['pp'] * 1000;
  let costInCP = 0;
  if (cost.unit === 'cp') costInCP = cost.quantity;
  if (cost.unit === 'sp') costInCP = cost.quantity * 10;
  if (cost.unit === 'ep') costInCP = cost.quantity * 50;
  if (cost.unit === 'gp') costInCP = cost.quantity * 100;
  if (cost.unit === 'pp') costInCP = cost.quantity * 1000;

  const newSum = buyOrSell === 'buy' ? totalCopper - costInCP : totalCopper + costInCP
  const newPP = Math.trunc(newSum / 1000);
  const newGP = Math.trunc((newSum % 1000) / 100);
  const newEP = Math.trunc(((newSum % 1000) % 100) / 50);
  const newSP = Math.trunc((((newSum % 1000) % 100) % 50) / 10);
  const newCP = Math.trunc(((((newSum) % 1000) % 100) % 50) % 10);

  return {
    'cp': newCP,
    'sp': newSP,
    'ep': newEP,
    'gp': newGP,
    'pp': newPP
  }
}