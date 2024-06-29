import { formatUnits } from "@ethersproject/units";
import seedrandom from "seedrandom";

import { getData, Result, shuffle } from "./utils";

(async () => {
  const {
    config: { decimals, seed, prizes, redrawable },
    walletTickets,
    resultFile,
  } = await getData();
  const random = seedrandom(seed);

  const result: Result = {};

  let allTickets: string[] = [];

  for (const data of walletTickets.sort()) {
    const [wallet, tickets] = data as [string, number];
    [...Array(tickets)].map((_) => allTickets.push(wallet));
    result[wallet] = {
      tickets,
      tokens: "0",
      prizes: {
        ...[...Array(prizes.length).keys()].map((_) => 0),
      },
    };
  }

  allTickets = shuffle(allTickets, random);

  let index = 0;

  for (let i = 0; i < prizes.length; i++) {
    let { tokens, total } = prizes[i];
    for (let j = 0; j < total; j++) {
      const winner = allTickets[index] ?? null;
      if (!winner) break;
      if (!redrawable && result[winner].prizes[0]) {
        index++;
        total++;
        continue;
      }
      result[winner].tokens = `${BigInt(result[winner].tokens) + tokens}`;
      result[winner].prizes[i] += 1;
      index++;
    }
  }

  for (const [wallet, data] of Object.entries(result)) {
    const { tickets, tokens, prizes } = data;
    console.log(
      `${wallet}\t${tickets}\t${formatUnits(tokens, decimals)}\t${Object.values(prizes).join("\t")}`,
    );
  }

  resultFile.value = JSON.stringify(result, null, 2);
})();
