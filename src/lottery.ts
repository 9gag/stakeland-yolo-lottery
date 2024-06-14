import seedrandom from "seedrandom";

import participants from "../data/participants.json";

import { prizes } from "./prizes";
import { shuffle } from "./shuffle";

// YOLO contract creation: https://blastscan.io/tx/0x8dd20f2c429ea979898c5484f9d80fde7ce527996f50b22035dc13a025862d5d
const YOLO_TOKEN_CREATION_TX =
  "0x8dd20f2c429ea979898c5484f9d80fde7ce527996f50b22035dc13a025862d5d";
const random = seedrandom(YOLO_TOKEN_CREATION_TX);

const result: Record<
  string,
  {
    tickets: number;
    tokens: string;
    prizes: Record<number, number>;
  }
> = {};

let allTickets: string[] = [];

for (const participant of participants.sort()) {
  const [wallet, tickets] = participant as [string, number];
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
  const { token, total } = prizes[i];
  for (let j = 0; j < total; j++) {
    const winner = allTickets[index] ?? null;
    if (!winner) break;
    result[winner].tokens = (token + BigInt(result[winner].tokens)).toString();
    result[winner].prizes[i] += 1;
    index++;
  }
}

console.log(JSON.stringify(result, null, 2));
