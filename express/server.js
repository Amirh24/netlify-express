'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var libra_core_1 = require("libra-core");
var express = require('express');
var cors = require('cors');
var serverless = require('serverless-http');
var bodyParser = require('body-parser');
var app = express();
var client = new libra_core_1.LibraClient({ network: libra_core_1.LibraNetwork.Testnet });
var mintToAddress = function (amount, address) { return __awaiter(_this, void 0, void 0, function () {
    var amountInLibraCoins, txNumber, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                amountInLibraCoins = amount * 1000000;
                txNumber = '0';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.mintWithFaucetService(address, amountInLibraCoins)];
            case 2:
                txNumber = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log("Could not mint " + amountInLibraCoins + " libra coins to address " + address + " due to " + e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, txNumber];
        }
    });
}); };
var getAddressBalance = function (address) { return __awaiter(_this, void 0, void 0, function () {
    var formattedBalance, accountState, balance, afterPointNumbers, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                formattedBalance = '0';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.getAccountState(address)];
            case 2:
                accountState = _a.sent();
                balance = accountState.balance.toString();
                afterPointNumbers = balance.length - 6;
                formattedBalance = balance.substring(0, afterPointNumbers) + '.' + balance.substring(afterPointNumbers);
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                console.log("Could not get address balance of " + address + " due to " + e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, formattedBalance];
        }
    });
}); };
var router = express.Router();
router.get('/', function (req, res) {
    console.log("here");
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Libra Faucet Server</h1>');
    res.end();
});
router.get('/another', function (req, res) { return res.json({ route: req.originalUrl }); });
router.post('/', function (req, res) { return res.json({ postBody: req.body }); });
app.post('/faucet', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var amount, address, txNumber;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                amount = req.body.amount;
                address = req.body.address;
                return [4 /*yield*/, mintToAddress(amount, address)];
            case 1:
                txNumber = _a.sent();
                res.json({ txNumber: txNumber });
                return [2 /*return*/];
        }
    });
}); });
app.post('/balance', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var address, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = req.body.address;
                return [4 /*yield*/, getAddressBalance(address)];
            case 1:
                balance = _a.sent();
                res.json({ balance: balance });
                return [2 /*return*/];
        }
    });
}); });
app.use(cors());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless(app);
