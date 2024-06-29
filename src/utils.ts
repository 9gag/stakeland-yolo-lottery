import { resolve } from "node:path";
import { useFile } from "@vue-reactivity/fs";
import { parseUnits } from "@ethersproject/units";

export type Result = Record<
  string,
  {
    tickets: number;
    tokens: string;
    prizes: Record<number, number>;
  }
>;

export const getData = async () => {
  const lottery = process.argv.slice(2)[0] ?? "";
  if (!lottery) throw Error("Invalid lottery");

  const readFile = (path: string) =>
    useFile(resolve(__dirname, path)).waitForReady();
  const configFile = await readFile(`../${lottery}/config.json`);
  const ticketsFile = await readFile(`../${lottery}/tickets.json`);
  const resultFile = await readFile(`../${lottery}/result.json`);
  const readmeFile = await readFile(`../${lottery}/README.md`);

  const config: {
    token: string;
    decimals: number;
    seed: string;
    prizes: {
      name: string;
      tokens: string;
      display?: string;
      total: number;
    }[];
    redrawable: boolean;
  } = JSON.parse(configFile.value!);
  const walletTickets: any[] = JSON.parse(ticketsFile.value!);

  return {
    config: {
      ...config,
      prizes: config.prizes.map((prize) => ({
        ...prize,
        tokens: BigInt(`${parseUnits(prize.tokens, config.decimals)}`),
        display: prize.display
          ? BigInt(`${parseUnits(prize.display, config.decimals)}`)
          : undefined,
      })),
      redrawable: lottery === "yologames",
    },
    walletTickets,
    resultFile,
    readmeFile,
  };
};

export const shuffle = (array: any[], random: () => number) => {
  array = [...array];

  for (let index = array.length - 1; index > 0; index--) {
    const newIndex = Math.floor(random() * (index + 1));
    [array[index], array[newIndex]] = [array[newIndex], array[index]];
  }

  return array;
};
