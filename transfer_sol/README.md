# Transfer SOL

Simple example of transferring lamports (SOL).

### Creating the example keypairs:

```shell
solana-keygen new --no-bip39-passphrase -o accounts/ringo.json
```

### Viewing their public keys:

```shell
solana-keygen pubkey accounts/george.json
```

```shell
Ringo:      3Mow77v5biYkbz4TytPxdak3eqSF8c64yHqr6pS4YvHt
George:     5bcN5iZvBmpzUeagjg2chcDuRG7N7g1kd1WG9Anc7zeP
Paul:       91eJX7Q4UJ5r5ntfcBXV3wu8g7ds1iUCkmAsoJXryHjM
John:       3Mow77v5biYkbz4TytPxdak3eqSF8c64yHqr6pS4YvHt
```

### Airdropping:

```shell
solana airdrop --keypair transfer-sol/accounts/john.json 1
```

### Viewing their balances:

```shell
solana account <pubkey> 
```

## Run the example:

In one terminal:
```shell
npm run reset-and-build
npm run simulation
```

In another terminal:
```shell
solana logs | grep "<program id> invoke" -A 7
```