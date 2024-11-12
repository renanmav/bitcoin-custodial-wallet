#!/bin/sh
set -e

# Wait for Bitcoin Core to start
sleep 5

# Create a wallet if it doesn't exist
bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar createwallet "default" || true

# Load the wallet
bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar loadwallet "default"

# Ensure the wallet is not encrypted
bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar walletlock || true
bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar walletpassphrase "" 0 || true

# Keep the container running
tail -f /dev/null
