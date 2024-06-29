import { formatUnits } from "@ethersproject/units";
import tablemark from "tablemark";
import { getData, Result } from "./utils";

(async () => {
  const {
    config: { token, decimals, prizes },
    readmeFile,
    resultFile,
  } = await getData();
  const result: Result = JSON.parse(resultFile.value!);
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  });

  readmeFile.value = `# Stakeland ${token} lottery\n`;

  for (let i = 0; i < prizes.length; i++) {
    const { name, tokens, display, total } = prizes[i];
    readmeFile.value += `## ${name} (${total})\n`;
    const rows = [];
    for (const [wallet, data] of Object.entries(result)) {
      const count = data.prizes[i] ?? 0;
      if (!count) continue;
      const amount = formatUnits(display ?? tokens * BigInt(count), decimals);
      rows.push({ wallet, count, amount: formatter.format(Number(amount)) });
    }
    readmeFile.value += tablemark(rows, {
      columns: ["Wallet", "Prize", token],
    });
  }
})();
