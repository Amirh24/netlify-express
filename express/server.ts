'use strict';

import { LibraClient, LibraNetwork } from 'libra-core';

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');

const app = express();
const client = new LibraClient({ network: LibraNetwork.Testnet });

const mintToAddress = async (amount, address) => {

  const amountInLibraCoins = amount * 1000000;

  let txNumber = '0';

  try {
      txNumber = await client.mintWithFaucetService(address, amountInLibraCoins);
  }

  catch (e) {
      console.log(`Could not mint ${amountInLibraCoins} libra coins to address ${address} due to ${e}`);
  }

  return txNumber;
}

const getAddressBalance = async (address) => {

  let formattedBalance = '0';

  try {

      const accountState = await client.getAccountState(address);
      const balance = accountState.balance.toString();
      const afterPointNumbers = balance.length - 6;

      formattedBalance = balance.substring(0, afterPointNumbers) + '.' + balance.substring(afterPointNumbers);
  }

  catch (e) {
      console.log(`Could not get address balance of ${address} due to ${e}`);
  }

  return formattedBalance;
}

const router = express.Router();
router.get('/', (req, res) => {
  console.log("here");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Libra Faucet Server</h1>');
  res.end();
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.post('/faucet', async (req, res, next) => {

  const amount = req.body.amount;
  const address = req.body.address;

  const txNumber = await mintToAddress(amount, address);

  res.json({ txNumber });
});

app.post('/balance', async (req, res, next) => {

  const address = req.body.address;
  const balance = await getAddressBalance(address);

  res.json({ balance });
});

app.use(cors());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
