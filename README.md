# Introduction

This package is a tip.cc compatible Tip Parser. It does not support rains and works with the message the bot sent.
<br>

# How to install?
This package is available with the Node Package Manager (npm)
```
npm install tip.cc-tip-parser
```
<br>

# How to use?
You can import this package using require or import. TypeScript Declartions are on-board.

**Common JS Import**
```js
const { parseTip } = require('tip.cc-tip-parser');
```

**TypeScript Import**
```ts
import { parseTip } from 'tip.cc-tip-parser';
```

The Tip Content can be passed as the bot sends it. The Parser only works if this condition is met. It will return whether its valid or not.
<br>

# Example Usage

**Common JS**
```js
const { parseTip } = require('tip.cc-tip-parser');

const tip = parseTip(`<:ETH:938830391844954173> <@!1> sent <@!2> 1 wei (≈ $0.00).`);

console.log(tip);
```

**TypeScript**
```js
import { parseTip, ITip } from 'tip.cc-tip-parser';

const tip: ITip = parseTip(`<:ETH:938830391844954173> <@!846623302818201600> sent <@!617037497574359050> 1 wei (≈ $0.00).`);

console.log(tip);
```
***This will result:***
```json
{
    "valid": true,
    "currency": "wei",
    "emote_id": "938830391844954173",
    "emote_name": "ETH",
    "sender": "846623302818201600",
    "receiver": "617037497574359050",
    "value": 1,
    "usd": 0
}
```

> The author is not responsible for any loss which has been made through possible vulnerabilities.
> If you find one open a Github Issue!

> Special thanks to [oknu#7863](https://discord.com/users/350270174462607360) who made most of the log parser and the [tip.cc](https://tip.cc) discord bot, which makes it really easy to use crypto currency on discord, with having a wallet connected to your user account 🐻