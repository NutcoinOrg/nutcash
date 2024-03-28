import path from 'path';
import fs from 'fs';
import { FixedNumber, BigNumber } from 'ethers'

///////////////////////////////////////////////////
// NCASH Airdop for NUT, NUTS, NUTS404, WEN holders
///////////////////////////////////////////////////

// Exclude contract & exchange addresses for NUT ecosystem assets (NUT, NUTS, NUTS404, WEN)
const excludedAddresses = [
  "0x36708B774E902cd86Ab0970B0F0cfB6c41Dc8Fb5",
  "0xd813E7ac5bb5067Ca548e4D9bA441d95003D074f",
  "0x75e89d5979E4f6Fba9F97c104c2F0AFB3F1dcB88",
  "0x0ef625418Eb5ef7dA8Caf57f9E68a9fB49Fec900",
  "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC",
  "0x88266f9eb705F5282a2507A9c418821a2AC9f8BD",
  "0x6666827E8f2220dDf718193544889F3B482ED072",
  "0x000000d40B595B94918a28b27d1e2C66F43A51d3",
  "0x00000047bB99ea4D791bb749D970DE71EE0b1A34",
  "0x25559f0aBBaf2A928239D2F419181147Cc2dAd74",
  "0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE",
  "0x02108AE6B0320f7A67a7C8f064c5E2dB24A1f103",
  "0xCf4d1C0470c8E2ae8BF8160DC1c0Ac25f00BB702",
  "0xCAE7A9d478Ea404210de26952015B8F5D3B4194A"
];

// Process excluded addresses (to lower case) to make them compatible to input addresses
excludedAddresses.forEach((element, index) => excludedAddresses[index] = element.toLowerCase());

const ncashAirdropSupply = FixedNumber.from("2100000000000000000000000"); // 20% of initial suply of 10.5M 


// Get balances for a given asset
function getAssetBalances(csv: string, minAsset: string) {

  const lines = csv.split("\r\n");

  var balances = new Map<string, string>();
  var balancesTotal = FixedNumber.from(0);

  // Ignore header and last empty lines
  for (var i = 1; i < lines.length - 1; i++) {

    var currentlineArr = lines[i].split(";");
    var address = currentlineArr[0].replaceAll("\"\"\"", "\"",);

    // Ignore excluded addresses
    if (!excludedAddresses.includes(address.replaceAll("\"", ""))) {
      var balance = currentlineArr[1].replaceAll("\"\"\"", "");

      // Ignore balances too low
      if (BigNumber.from(balance).gte(BigNumber.from(minAsset))) {

        balances.set(address.toLowerCase(), balance);
        balancesTotal = balancesTotal.addUnsafe(FixedNumber.from(balance));
      }
    }

  }

  return { balances, balancesTotal };
}

// Load CSV files: balances for NUT, NUTS, NUTS404 & WEN holders
const dirname = path.resolve();
const nut = fs.readFileSync(path.join(dirname, "../nut.csv"));
const nuts = fs.readFileSync(path.join(dirname, "../nuts.csv"));
const nuts404 = fs.readFileSync(path.join(dirname, "../nuts404.csv"));
const wen = fs.readFileSync(path.join(dirname, "../wen.csv"));

// Get balances for Nutcoin (NUT) 
var nutBalancesObj = getAssetBalances(nut.toString(), "100000000000000000000000000");
var nutBalances = nutBalancesObj.balances;
var nutBalancesTotal = nutBalancesObj.balancesTotal;

// Get balances for Nuts (NUTS) 
var nutsBalancesObj = getAssetBalances(nuts.toString(), "1");
var nutsBalances = nutsBalancesObj.balances;
var nutsBalancesTotal = nutsBalancesObj.balancesTotal;

// Get balances for Nuts404 (NUTS404) 
var nuts404BalancesObj = getAssetBalances(nuts404.toString(), "1000000000000000000");
var nuts404Balances = nuts404BalancesObj.balances;
var nuts404BalancesTotal = nuts404BalancesObj.balancesTotal;

// Get balances for Wencash (WEN) 
var wenBalancesObj = getAssetBalances(wen.toString(), "1000000000000000000000");
var wenBalances = wenBalancesObj.balances;
var wenBalancesTotal = wenBalancesObj.balancesTotal;


// Update NCASH airdrop distribution from asset balances
var ncashAirdrop = new Map<string, string>();

function updateNcashAirdropFromBalances(balances: Map<string, string>, balancesTotal: FixedNumber) {

  var ncashAddresses = new Set(ncashAirdrop.keys()); // NB: can be located outside the loop as we use the update function for each set of unique addresses 

  for (const [address, balance] of balances.entries()) {

    var ncash = ncashAirdropSupply.mulUnsafe(FixedNumber.from(balance).divUnsafe(balancesTotal));

    if (!ncashAddresses.has(address)) {
      ncashAirdrop.set(address, ncash.toString());
    } else {
      var existingNcash: FixedNumber = FixedNumber.from(ncashAirdrop.get(address));
      ncashAirdrop.set(address, existingNcash.addUnsafe(ncash).toString());
    }
  }
}

updateNcashAirdropFromBalances(nutBalances, nutBalancesTotal);
updateNcashAirdropFromBalances(nutsBalances, nutsBalancesTotal);
updateNcashAirdropFromBalances(nuts404Balances, nuts404BalancesTotal);
updateNcashAirdropFromBalances(wenBalances, wenBalancesTotal);


///////////////////////////////////////////////////////
// NCASH Airdop for a large set of other tokens holders 
///////////////////////////////////////////////////////


// Get addresses for a given asset
function getAssetAddresses(csv: string) {

  const lines = csv.split("\r\n");
  var addresses = [];

  // Ignore header and last empty lines
  for (var i = 1; i < lines.length - 1; i++) {

    var currentlineArr = lines[i].split(",");
    addresses.push(currentlineArr[0].toLowerCase());
  }
  return addresses;
}

// Update NCASH airdrop distribution for a large set of addresses
const ncashAirdropUnit = FixedNumber.from("2100000000000000000000000").divUnsafe(FixedNumber.from("2000000")); // 20% of initial suply of 10.5M / 100k*20 addresses
const ncashAirdropUnitStr = ncashAirdropUnit.toString(); // for perf purposes

function updateNcashAirdropFromAddresses(addresses: string[]) {

  var ncashAddresses = new Set(ncashAirdrop.keys()); // NB: can be located outside the loop as we use the update function for each set of unique addresses 

  for (var i = 0; i < addresses.length; i++) {

    if (!ncashAddresses.has(addresses[i])) {
      ncashAirdrop.set(addresses[i], ncashAirdropUnitStr);

    } else {
      var existingNcash: FixedNumber = FixedNumber.from(ncashAirdrop.get(addresses[i]));
      ncashAirdrop.set(addresses[i], existingNcash.addUnsafe(ncashAirdropUnit).toString());
    }
  }
}


// Load CSV files: balances for a large set of other tokens holders (20 exports of 100k addresses each)
const usdt = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xdAC17F958D2ee523a2206206994597C13D831ec7-usdt.csv"));
const lpt = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x58b6A8A3302369DAEc383334672404Ee733aB239-lpt.csv"));
const usdc = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48-usdc.csv"));
const iov = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x0E69D0A2bbB30aBcB7e5CfEA0E4FDe19C00A8d47-iov.csv"));
const shib = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE-shib.csv"));
const meme = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74-meme.csv"));
const gcre = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xa3EE21C306A700E682AbCdfe9BaA6A08F3820419-g-cre.csv"));
const xnn = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xab95E915c123fdEd5BDfB6325e35ef5515F1EA69-xnn.csv"));
const link = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x514910771AF9Ca656af840dff83E8264EcF986CA-link.csv"));
const omg = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xd26114cd6EE289AccF82350c8d8487fedB8A0C07-omg.csv"));
const dai = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x6B175474E89094C44Da98b954EedeAC495271d0F-dai.csv"));
const bat = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x0D8775F648430679A709E98d2b0Cb6250d2887EF-bat.csv"));
const steth = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84-steth.csv"));
const uni = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984-uni.csv"));
const amb = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x4DC3643DbC642b72C158E7F3d2ff232df61cb6CE-amb.csv"));
const hex = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39-hex.csv"));
const ucash = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0x92e52a1A235d9A103D970901066CE910AAceFD37-ucash.csv"));
const cro = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b-cro.csv"));
const gse = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xe530441f4f73bDB6DC2fA5aF7c3fC5fD551Ec838-gse.csv"));
const weth = fs.readFileSync(path.join(dirname, "../export-tokenholders-for-contract-0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2-weth.csv"));

const csvs = [usdt, lpt, usdc, iov, shib, meme, gcre, xnn, link, omg, dai, bat, steth, uni, amb, hex, ucash, cro, gse, weth];

for (var i = 0; i < csvs.length; i++) {
  console.log(i);
  var addresses = getAssetAddresses(csvs[i].toString());
  console.log("getAssetAddresses end");
  updateNcashAirdropFromAddresses(addresses);
  console.log("updateNcashAirdropFromAddresses end");
}

// Convert ncashAirdrop to json
var json = "{";
ncashAirdrop.forEach((value, key) => json = json + "\r\n" + key + ":" + "\"" + value.substring(0, value.length - 2) + "\"" + ",");
json = json.substring(0, json.length - 1) + "\r\n" + "}";

fs.writeFileSync(path.join(dirname, "../ncash-airdrop.json"), json); // size file: 121Mo


