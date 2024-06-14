import { formatEther } from "@ethersproject/units";
import tablemark from "tablemark";

import result from "../data/result.json";

import { prizes } from "./prizes";

const formatter = new Intl.NumberFormat("en-US");

console.log(`# Stakeland $YOLO lottery\n`);

for (let i = 0; i < prizes.length; i++) {
  const { name, token, total } = prizes[i];
  console.log(`## ${name} (${total})\n`);
  const rows = [];
  for (const [wallet, data] of Object.entries(result)) {
    const count = data.prizes[i] ?? 0;
    if (!count) continue;
    const amount = formatEther((token * BigInt(count)).toString());
    rows.push({ wallet, count, amount: formatter.format(Number(amount)) });
  }
  console.log(tablemark(rows, { columns: ["Wallet", "Prize", "$YOLO"] }));
}
