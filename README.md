# Renan Mav's BTC wallet

Bitcoin custodial wallet written as a code challenge for a crypto exchange.

Table of contents:

1. [Get started](#get-started)
1. [Project structure](#project-structure)
1. [Running the server locally](#running-the-server-locally)
1. [Running the client locally](#running-the-client-locally)
1. [API Usage](#api-usage)
   1. [Sign-up a new user](#sign-up-a-new-user)
   1. [Sign-in an existing user](#sign-in-an-existing-user)
   1. [Get user information](#get-user-information)
   1. [Create a Plaid link token](#create-a-plaid-link-token)
   1. [Exchange a Plaid public token](#exchange-a-plaid-public-token)
   1. [Read Plaid account balance](#read-plaid-account-balance)
   1. [Generate a Bitcoin address](#generate-a-bitcoin-address)
   1. [Purchase Bitcoin](#purchase-bitcoin)
   1. [Get Bitcoin balance](#get-bitcoin-balance)
   1. [Get Bitcoin price](#get-bitcoin-price)
1. [Plaid](#plaid)
   1. [Sandbox credentials](#sandbox-credentials)
1. [To-do's](#to-dos)

## Get started

We're using [Bun](https://bun.sh) for this project, if you don't have it installed, run this command:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then, install dependencies with:

```bash
cd bitcoin-custodial-wallet && bun i
```

## Project structure

This project is using [workspaces](https://bun.sh/guides/install/workspaces) as the monorepo management tool. It's organized as follows:

```
bitcoin-custodial-wallet/
├── package.json 👉 Root of monorepo
└── packages
    ├── eslint-config 👉 Unified linting configuration
    ├── server 👉 Express backend application
    └── client 👉 Expo frontend application
```

## Running the server locally

The server uses environment variables for configuration. Create a `.env` file in the `packages/server` directory based on `.env.example`.

To run the server, you'll need [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose) installed on your machine. From the workspace root, run the following command to build and start the containers:

```bash
docker-compose up -d --build
```

This will start both the server and MongoDB containers. The server will be accessible at `http://localhost:8080`.

## Running the client locally

To run the client app _(you can test it on iOS and Android platforms)_, you can cd into `packages/client` folder and call a script from package.json with `bun run <script>`. Alternatively, from the workspace root:

```bash
# iOS
bun run --filter client ios
# Android
bun run --filter client android
```

## API Usage

### Sign-up a new user

To sign-up a new user, you can use the following curl command:

```bash
curl -X POST http://localhost:8080/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

This command sends a POST request to the `/signup` endpoint with the user's name, email, and password. If successful, it will return a JSON response with a success message, a JWT token and the new user's ID.

### Sign-in an existing user

To sign-in an existing user, you can use the following curl command:

```bash
curl -X POST http://localhost:8080/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

This command sends a POST request to the `/signin` endpoint with the user's email and password. If successful, it will return a JSON response with a success message, a JWT token and the user's ID.

### Get user information

To retrieve information about the currently authenticated user, you can use the following curl command:

```bash
curl -X GET http://localhost:8080/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN"
```

This command sends a GET request to the `/me` endpoint. You need to replace `JWT_TOKEN` with a valid JWT token obtained from the sign-in or sign-up process. If successful, it will return a JSON response with the user's information, like this:

```json
{
  "message": "User fetched successfully",
  "data": {
    "user": {
      "id": "670b574fe04560073075c472",
      "name": "John Doe",
      "email": "user@example.com",
      "bitcoinAddress": "bcrt1qeqs3es2zpzy3daljhvh40h3qk2thn34023hhsx"
    }
  }
}
```

### Create a Plaid link token

To [create a Plaid link token](https://plaid.com/docs/api/link/#linktokencreate), you can use the following curl command:

```bash
curl -X POST http://localhost:8080/plaid/link/token/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN"
```

This command sends a POST request to the `/plaid/link/token/create` endpoint. You need to replace `JWT_TOKEN` with a valid JWT token obtained from the sign-in or sign-up process. If successful, it will return a JSON response with the link token, like this:

```json
{
  "message": "Link token created successfully",
  "data": {
    "linkToken": {
      "expiration": "2024-10-12T23:39:15Z",
      "link_token": "link-sandbox-e888a731-8395-4a16-8ea8-a8ce678a956f",
      "request_id": "TFZ0zSKUbzib05A"
    }
  }
}
```

We can use this link token to initialize Plaid Link in our client application.

### Exchange a Plaid public token

Once the user linked their bank account using Plaid Link, we can [exchange an ephemeral public token for a non-expiring access token](https://plaid.com/docs/api/items/#itempublic_tokenexchange).

```bash
curl -X POST http://localhost:8080/plaid/item/public_token/exchange \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{
    "publicToken": "public-sandbox-d8fe6954-a206-41c1-8c8a-5a7f401e4c00"
  }'
```

This command sends a POST request to the `/plaid/item/public_token/exchange` endpoint with the public token received from Plaid Link. You need to replace `JWT_TOKEN` with a valid JWT token obtained from the sign-in or sign-up process, and `publicToken` with the actual public token you received. If successful, it will return a JSON response like this:

```json
{
  "message": "Public token exchanged successfully",
  "data": {
    "accessToken": {
      "access_token": "access-sandbox-cf452a0f-90a7-4164-8729-4e8fca3f3963",
      "item_id": "mRAeMXooEkCqBX4n5mKbSdD74V4MoVcLApbrz",
      "request_id": "bozsnlU8ExSjurW"
    }
  }
}
```

We can use this access token to make authenticated requests to Plaid's API endpoints on behalf of the user's bank account. For example, we can retrieve account and transaction data, initiate payments, or perform other financial operations supported by Plaid. The access token should be securely stored and associated with the user's account in our application.

### Read Plaid account balance

To retrieve the balance of the user's linked Plaid account, you can use the following curl command:

```bash
curl -X GET http://localhost:8080/plaid/account/balance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN"
```

This command sends a GET request to the `/plaid/account/balance` endpoint. You need to replace `JWT_TOKEN` with a valid JWT token obtained from the sign-in or sign-up process. If successful, it will return a JSON response with the account balance information, like this:

```json
{
  "message": "Account balance read successfully",
  "data": { "balance": 100 }
}
```

Note that this endpoint requires authentication and will only work if the user has successfully linked their bank account using Plaid.

### Generate a Bitcoin address

To generate a new Bitcoin address for a user, you can use the following curl command:

```bash
curl -X POST http://localhost:8080/bitcoin/generate_address \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN"
```

This command sends a POST request to the `/bitcoin/generate_address` endpoint. You need to replace `JWT_TOKEN` with a valid JWT token obtained from the sign-in or sign-up process. If successful, it will return a JSON response with the newly generated Bitcoin address, like this:

```json
{
  "message": "Bitcoin address generated successfully",
  "data": {
    "bitcoinAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  }
}
```

Note that this endpoint requires authentication. A new Bitcoin address will only be generated if the user doesn't already have one associated with their account. If the user already has a Bitcoin address, the API will return an error.

### Purchase Bitcoin

To purchase Bitcoin for a user, you can use the following curl command:

```bash
curl -X POST http://localhost:8080/bitcoin/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{
    "amountUSD": 100
  }'
```

This command sends a POST request to the `/bitcoin/purchase` endpoint. You need to replace `JWT_TOKEN` with a valid JWT token obtained from the sign-in or sign-up process. The `amountUSD` in the request body specifies the amount in USD to spend on purchasing Bitcoin.

If the purchase is successful, you'll receive a JSON response like this:

```json
{
  "message": "Bitcoin purchase successful",
  "data": {
    "transaction": "fb28a7ff107a72d0bc31bcc976db296e6db265a2a3f9cdbc1e64c2dbd9736e62",
    "amountBTC": 0.00159234
  }
}
```

The response includes the transaction ID and the amount of Bitcoin purchased based on the current exchange rate.

### Get Bitcoin balance

To retrieve the Bitcoin balance for a user, you can use the following curl command:

```bash
curl -X GET http://localhost:8080/bitcoin/balance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN"
```

This command sends a GET request to the `/bitcoin/balance` endpoint. You need to replace `JWT_TOKEN` with a valid JWT token obtained from the sign-in or sign-up process. If successful, it will return a JSON response with the user's Bitcoin balance, like this:

```json
{
  "message": "Bitcoin balance retrieved successfully",
  "data": {
    "balance": 0.00123456
  }
}
```

Note that this endpoint requires authentication and will only work if the user has a Bitcoin address associated with their account.

### Get Bitcoin price

To retrieve the current Bitcoin price, you can use the following curl command:

```bash
curl -X GET http://localhost:8080/bitcoin/price \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN"
```

This command sends a GET request to the `/bitcoin/price` endpoint. You need to replace `JWT_TOKEN` with a valid JWT token obtained from the sign-in or sign-up process. If successful, it will return a JSON response with the current Bitcoin price, like this:

```json
{
  "message": "Bitcoin price fetched successfully",
  "data": {
    "price": 62794.8068
  }
}
```

Note that this endpoint requires authentication. The price returned is in USD.

## Plaid

- Quickstart docs: https://plaid.com/docs/quickstart
- API reference: https://plaid.com/docs/api
- Link docs: https://plaid.com/docs/link
- Get API keys: https://dashboard.plaid.com/developers/keys
- React Native SDK docs: https://plaid.com/docs/link/react-native
- Integrate Plaid SDK to React Native using Expo Config Plugins: https://www.aronberezkin.com/posts/how-to-integrate-plaid-sdk-to-react-native-using-expo-config-plugins

### Sandbox credentials

- username: user_good
- password: pass_good
- 2FA code: 1234

## To-do's

- [x] expo-asset - BTC and NFT image
- [x] expo-router on web, it's not showing anything
- [x] Data fetching with react-query
- [x] Setup root imports on frontend
- [x] Setup root imports on backend
- [x] Setup ESLint on client
- [x] Setup ESLint on server
- [x] Replace @/ for ~/
- [x] ThemedText and ThemedInput components
- [x] @expo-google-fonts/inter
- [x] Learn more about expo-router
- [x] Define app structure and screens, unauthed vs authed, link them
- [x] Add unit tests
- [x] Add passkeys to sign up
- [x] Customize app icon and splash screen
- [x] Remove ios and android folders from git with Expo CNG
- [ ] Run on physical device
- [ ] Record demo
- [ ] useForm wrapper API?
- [ ] Add input validation on the frontend with Yup + react hook form
- [ ] Add input validation on the backend with Zod
- [ ] Try gluestack UI?
  - From the creators of NativeBase
  - https://gluestack.io/ui/docs/home/overview/introduction
  - https://github.com/gluestack/gluestack-ui-starter-kits
- [ ] Or maybe antd?
- [ ] Offline support?
- [ ] Plaid web support?
