# Nutcash (NCASH)

**Nutcash is a staking platform with Nutcash (NCASH) rewards**

**Max Supply**: 21,000,000 NCASH

**Initial Supply (Airdrop)**: 10,500,000 NCASH

NCASH is an ERC-20 token deployed with OpenZeppelin and Remix on Aribtrum: [0x88266f9eb705f5282a2507a9c418821a2ac9f8bd](https://arbiscan.io/token/0x88266f9eb705f5282a2507a9c418821a2ac9f8bd#code) allowing staking of the following assets: 

- **Nutcoin (NUT) on Arbitrum**: [0x8697841b82c71fcbd9e58c15f6de68cd1c63fd02](https://arbiscan.io/token/0x8697841b82c71fcbd9e58c15f6de68cd1c63fd02#code)
- **Nuts (NUTS) on Arbitrum**: [0xa844cb1b558625c8a6214d460f2fcfa599eb464a](https://arbiscan.io/address/0xa844cb1b558625c8a6214d460f2fcfa599eb464a#code)
- **Nuts404 (NUTS404) on Arbitrum**: [0x37b2f564971d3bf986dc9e46ec587f42b75bde76](https://arbiscan.io/token/0x37b2f564971d3bf986dc9e46ec587f42b75bde76#code)
- **Wencash (WEN) on Arbitrum**: [0x860ea9299e9c297fbde64143cab2a3cb01945a27](https://arbiscan.io/token/0x860ea9299e9c297fbde64143cab2a3cb01945a27#code)
- **Nutcash (NCASH) on Arbitrum**: [0x88266f9eb705f5282a2507a9c418821a2ac9f8bd](https://arbiscan.io/token/0x88266f9eb705f5282a2507a9c418821a2ac9f8bd#code)

More details in the following readme files: 

- [arbitrum-erc20-bridge/README.md](arbitrum-erc20-bridge/README.md)
- [arbitrum-erc721-wormhole-bridge/README.md](arbitrum-erc721-wormhole-bridge/README.md)
- [airdrop/README.md](airdrop/README.md)
- [airdrop/uniswap-merkle-distributor-25a79e8/README.md](airdrop/uniswap-merkle-distributor-25a79e8/README.md)

**NB:** Staking implementation has been inspired from solidity contracts available in [andreitoma8 Github Repository](https://github.com/andreitoma8/Synthetix-ERC721-Staking)

## Staking Details

- Every 1 NUTS or 1 NUTS404 or 10B NUT or 1M WEN or 1k NCASH staked gives: ~1 NCASH / week

- 4 halving every ~4years (meaning that rewards will be divided by 2 every 4 year during the first 16 years of Nutcash deployment)

- **First MAX Yearly Issuance Simulation**: ~Max 1st year - 2024 (approx. without compounding/burning): 52.14*(10k/1+21T/10B+100M/1M+10.5M/1k)= ~+1.18M / year

- **Last MAX Yearly Issuance Simulation**: ~Max 16th year - 2040 (approx. without compounding/burning): 52.14*(1/2**4)*(10k/1+21T/10B+100M/1M+10.5M/1k)= 73.75k / year

- When/if NCASH supply reaches 21M max supply, staking rewards are paused and resumed when/if supply decreases due to NCASH burning (NB: NCASH might never reach max supply of 21M if burning activity is high enough due to use cases built around NCASH, like burning fees granting access to dapps)