# Arbitrum ERC-20 Bridge

The canonical token bridge from Arbitrum (OffchainLabs) has been used to bridge the following ERC-20 tokens of NUT Ecosystem deployed on Ethereum: 

- **Nutcoin (NUT)**: [0x473F4068073Cd5b2aB0E4Cc8E146F9EDC6fb52CC](https://etherscan.io/token/0x473f4068073cd5b2ab0e4cc8e146f9edc6fb52cc#code)
- **Nuts404 (NUTS404)**: [0x25559f0aBBaf2A928239D2F419181147Cc2dAd74](https://etherscan.io/token/0x25559f0abbaf2a928239d2f419181147cc2dad74#code)
- **Wencash (WEN)**: [0xEBA6145367b33e9FB683358E0421E8b7337D435f](https://etherscan.io/token/0xeba6145367b33e9fb683358e0421e8b7337d435f#code)

All ERC-20 bridged contracts on Arbitrum use a proxy (**ClonableBeaconProxy.sol**) that currently (17.03.2024) implements the following contract under Apache License 2.0 (available here):

- **StandardArbERC20.sol**: [0x3f770ac673856f105b586bb393d122721265ad46](https://arbiscan.io/address/0x3f770ac673856f105b586bb393d122721265ad46#code)

**Sources:**
- [Arbitrum Bridge](https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum)
- [Aribtrum Github](https://github.com/OffchainLabs) 

## Nutcoin (NUT) on Arbitrum 

Nutcoin (NUT) has been bridged on Arbitrum via the following proxy (available here): 

- **ClonableBeaconProxy.sol**: [0x8697841b82c71fcbd9e58c15f6de68cd1c63fd02](https://arbiscan.io/token/0x8697841b82c71fcbd9e58c15f6de68cd1c63fd02#code)

## Nuts404 (NUTS404) on Arbitrum 

Nuts404 (NUTS404) has been bridged on Arbitrum via the following proxy (available here):  

- **ClonableBeaconProxy.sol**: [0x37b2f564971d3bf986dc9e46ec587f42b75bde76](https://arbiscan.io/token/0x37b2f564971d3bf986dc9e46ec587f42b75bde76#code)

## Wencash (WEN) on Arbitrum 

Wencash (WEN) has been bridged on Arbitrum via the following proxy (available here):  

- **ClonableBeaconProxy.sol**: [0x860ea9299e9c297fbde64143cab2a3cb01945a27](https://arbiscan.io/token/0x860ea9299e9c297fbde64143cab2a3cb01945a27#code)