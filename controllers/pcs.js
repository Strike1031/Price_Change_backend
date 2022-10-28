import tx from "../models/tx.js";
import errorHandler from "../errorHandler.js";
import { getSupply, getDecimals } from "../components/nodeRequests.js";
import cron from "node-cron";

var timer = 0;
/**
 *
 * Aggregation : Distinct for all unique pairAddress
 *
 *
 */
export async function monitorChange() {
  var pairs = await tx.distinct("pairAddress");
  //cron jobs--token change prices It is running every 5 seconds
  cron.schedule("*/5 * * * * *", async () => {
    //console.log('running every 5 seconds:');
    if (timer == 0)  change(pairs);
  });
}

async function change(pairs) {
  timer = 1;
  console.log("change--{function} started!");
  for (let i = 0; i < pairs.length; i++) {
    await priceChange(pairs[i]).then((data) => {
      console.log("---------------------");
      console.log(data);
      console.log("---------------------");
    });
    if (i ==  pairs.length-1) timer = 0;
  }
  //   pairs.map((address) => {
  //     priceChange(address).then((data) => {
  //       console.log("---------------------");
  //       console.log(data);
  //       console.log("---------------------");
  //     });
  //  });
}

/**
 *
 * @param {string} address
 * @returns aggregated pair info
 */
async function priceChange(address) {
  const currentTime = parseInt((Date.now() / 1000).toFixed(0));
  let result = {
    token0Symbol: "",
    token1Symbol: "",
    price1: "$0",
    priceChange_5m: "0.00",
    priceChange_1h: "0.00",
    priceChange_6h: "0.00",
    priceChange_24h: "0.00",
    marketCap: "0",
    volume: "0",
    txns: "0",
    liquidity: "0",
  };

  /**
   *   24h_PriceChange Aggregation
   */
  let res = await tx.aggregate([
    {
      $match: {
        $and: [
          { pairAddress: address },
          { timestamp: { $gte: currentTime - 86400 } },
        ],
      },
    },

    {
      $group: {
        _id: "$pairAddress",
        reserves0Open: { $first: "$reserves0" },
        reserves1Open: { $first: "$reserves1" },
        reserves0Close: { $last: "$reserves0" },
        reserves1Close: { $last: "$reserves1" },
        amount0: {
          $sum: {
            $toDecimal: "$token0Amount",
          },
        },
        amount1: {
          $sum: {
            $toDecimal: "$token1Amount",
          },
        },
        pairAddress: { $last: "$pairAddress" },
        token0: { $last: "$token0" },
        token1: { $last: "$token1" },
        token0Symbol: { $last: "$symbol0" },
        token1Symbol: { $last: "$symbol1" },
        dex: { $last: "$DEX" },
        network: { $last: "$network" },
      },
    },
  ]);
  const {
    reserves0Close,
    reserves1Close,
    reserves0Open,
    reserves1Open,
    amount0,
    amount1,
    pairAddress,
    token0,
    token1,
    token0Symbol,
    token1Symbol,
    dex,
    network,
  } = res[0];

  const price0Open = reserves0Open / reserves1Open;
  const price0Close = reserves0Close / reserves1Close;

  const price1Open = reserves1Open / reserves0Open;
  const price1Close = reserves1Close / reserves0Close;

  const percDiff0 = (
    100 * Math.abs((price0Open - price0Close) / (price0Open + price0Close) / 2)
  ).toFixed(2);
  const percDiff1 = (
    100 * Math.abs((price1Open - price1Close) / (price1Open + price1Close) / 2)
  ).toFixed(2);

  const supply0 = await getSupply(token0, network);
  const supply1 = await getSupply(token1, network);

  const decimal0 = await getDecimals(token0, network);
  const decimal1 = await getDecimals(token1, network);

  result.token0Symbol = token0Symbol;
  result.token1Symbol = token1Symbol;
  result.price1 = "$" + price1Close;
  result.priceChange_24h =
    price1Open > price1Close ? `-${percDiff1}` : `+${percDiff1}`;
  result.volume = amount1 + "";
  result.marketCap = "";
  result.txns = "";
  result.liquidity = "";

  console.log("5m_PriceChange");
  /**
   *   5m_PriceChange Aggregation
   */

  let res1 = await tx.aggregate([
    {
      $match: {
        $and: [
          { pairAddress: address },
          { timestamp: { $gte: currentTime - 300 } },
        ],
      },
    },

    {
      $group: {
        _id: "$pairAddress",
        reserves0Open_5m: { $first: "$reserves0" },
        reserves1Open_5m: { $first: "$reserves1" },
        reserves0Close_5m: { $last: "$reserves0" },
        reserves1Close_5m: { $last: "$reserves1" },
      },
    },
  ]);

  if (res1.length != 0) {
    const {
      reserves1Close_5m,
      reserves1Open_5m,
      reserves0Open_5m,
      reserves0Close_5m,
    } = res1[0];

    const price1Open_5m = reserves1Open_5m / reserves0Open_5m;
    const price1Close_5m = reserves1Close_5m / reserves0Close_5m;

    const percDiff1_5m = (
      100 *
      Math.abs(
        (price1Open_5m - price1Close_5m) / (price1Open_5m + price1Close_5m) / 2
      )
    ).toFixed(2);

    result.priceChange_5m =
      price1Open_5m > price1Close_5m ? `-${percDiff1_5m}` : `+${percDiff1_5m}`;
  }

  console.log("1h_PriceChange");
  /**
   *   1h_PriceChange Aggregation
   */
  let res2 = await tx.aggregate([
    {
      $match: {
        $and: [
          { pairAddress: address },
          { timestamp: { $gte: currentTime - 3600 } },
        ],
      },
    },

    {
      $group: {
        _id: "$pairAddress",
        reserves0Open_1h: { $first: "$reserves0" },
        reserves1Open_1h: { $first: "$reserves1" },
        reserves0Close_1h: { $last: "$reserves0" },
        reserves1Close_1h: { $last: "$reserves1" },
      },
    },
  ]);

  if (res2.length != 0) {
    const {
      reserves1Close_1h,
      reserves1Open_1h,
      reserves0Open_1h,
      reserves0Close_1h,
    } = res2[0];

    const price1Open_1h = reserves1Open_1h / reserves0Open_1h;
    const price1Close_1h = reserves1Close_1h / reserves0Close_1h;

    const percDiff1_1h = (
      100 *
      Math.abs(
        (price1Open_1h - price1Close_1h) / (price1Open_1h + price1Close_1h) / 2
      )
    ).toFixed(2);

    result.priceChange_1h =
      price1Open_1h > price1Close_1h ? `-${percDiff1_1h}` : `+${percDiff1_1h}`;
  }

  console.log("6h_PriceChange");
  /**
   *   6h_PriceChange Aggregation
   */
  let res3 = await tx.aggregate([
    {
      $match: {
        $and: [
          { pairAddress: address },
          { timestamp: { $gte: currentTime - 21600 } },
        ],
      },
    },

    {
      $group: {
        _id: "$pairAddress",
        reserves0Open_6h: { $first: "$reserves0" },
        reserves1Open_6h: { $first: "$reserves1" },
        reserves0Close_6h: { $last: "$reserves0" },
        reserves1Close_6h: { $last: "$reserves1" },
      },
    },
  ]);

  if (res3.length != 0) {
    const {
      reserves1Close_6h,
      reserves1Open_6h,
      reserves0Open_6h,
      reserves0Close_6h,
    } = res3[0];

    const price1Open_6h = reserves1Open_6h / reserves0Open_6h;
    const price1Close_6h = reserves1Close_6h / reserves0Close_6h;

    const percDiff1_6h = (
      100 *
      Math.abs(
        (price1Open_6h - price1Close_6h) / (price1Open_6h + price1Close_6h) / 2
      )
    ).toFixed(2);

    result.priceChange_6h =
      price1Open_6h > price1Close_6h ? `-${percDiff1_6h}` : `+${percDiff1_6h}`;
  }

  return result;
}
