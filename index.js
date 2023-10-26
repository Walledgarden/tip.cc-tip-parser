const EMOJI = String.raw`(?<emoji>\<[^>]+\>|\:[^:]+\:)`
const SENDER = String.raw`<@!?(?<sender>[^>]+)>`
const RECEIVER = String.raw`<@!?(?<receiver>[^>]+)>`
const SYMBOL = String.raw`(?<symbol>\D*)?`
const AMOUNT = String.raw`(?<amount>[\d.,]+)`
const CODE = String.raw`(?<code>[^\s]+)?`
const VALUE = String.raw`(?<value>[\d.,]+)`
const TIP = String.raw`${SYMBOL}\s?${AMOUNT}\s?${CODE}(?:\s\(≈.\$${VALUE}\))?`
const TIP_REGEX = new RegExp(
    String.raw`^${EMOJI}\s${SENDER}\ssent\s${RECEIVER}\s${TIP}\.$`
);
const LOG_REGEX = new RegExp(String.raw`^${EMOJI}\s${TIP}`);

const SYMBOLS = {
    '₳': 'ADA',
    '₿': 'BTC', // not from tip.cc
    'Ð': 'DOGE',
    'Ᵽ': 'PPC',
    'Ӿ': 'XNO',
    'ꜩ': 'XTZ',
};

const ALIASES = {
    'Bytes?': {
        name: 'GBytes',
        decimals: 1e9
    },
    'gwei': {
        name: 'ETH',
        decimals: 1e9
    },
    'mBTC': {
        name: 'BTC',
        decimals: 1e3
    },
    'nanoRyo': {
        name: 'RYO',
        decimals: 1e9
    },
    'piconeros?': {
        name: 'XMR',
        decimals: 1e12
    },
    'satoshis?': {
        name: 'BTC',
        decimals: 1e8
    },
    'satoshis? cash': {
        name: 'BCH',
        decimals: 1e8
    },
    'satoshis? gold': {
        name: 'BTG',
        decimals: 1e8
    },
    'satoshis? sv': {
        name: 'BSV',
        decimals: 1e8
    },
    'wei': {
        name: 'ETH',
        decimals: 1e18
    }
}

/**
 * @typedef {Object} Tip
 * @property {boolean} valid Whether the tip is valid or not
 * @property {string} currency The tipped currency
 * @property {string} emote The emote used to tip
 * @property {string} sender User ID from the Tip Sender
 * @property {string} receiver User ID from the Tip Receiver
 * @property {number} value Value of the Tip as a Number
 * @property {number|null} usd USD Value from the Tip, null if it has no value for tip.cc
 */

/**
 * 
 * @param {string} tip_message Tip Message, providen from tip.cc
 * @returns {Tip}
 */
parseTip = (tip_message) => {
    tip_message = tip_message.replaceAll(/\*/g, '');
    let result = {
        valid: false,
        emote: '',
        sender: '',
        receiver: '',
        value: 0,
        currency: '',
        usd: 0
    }
    if (!TIP_REGEX.test(tip_message)) return result;
    const tip = tip_message.match(TIP_REGEX);
    result = {
        valid: true,
        emote: tip.groups.emoji,
        sender: tip.groups.sender,
        receiver: tip.groups.receiver,
        value: parseFloat(tip.groups.amount.replaceAll(/[^\d.]/g, '')),
        currency: (tip.groups.code || tip.groups.symbol).replace(
            new RegExp(String.raw`(${Object.keys(SYMBOLS).join('|')})`, 'gi'),
            (_, symbol = '$1') => SYMBOLS[symbol]
        ),
        usd: parseFloat(tip.groups.value?.replaceAll(/[^\d.]/g, '') || 0) || null,
    };
    const matching_alias = result.currency.match(
        new RegExp(`^${Object.keys(ALIASES).map(key => `(${key})`).join('|')}$`, 'i')
    );
    if (matching_alias !== null) {
        const alias = Object.keys(ALIASES)[matching_alias.slice(1).indexOf(matching_alias[0])];
        result.currency = alias.name;
        result.value /= alias.decimals;
    }
    return result;
}

/**
 * 
 * @param {object} tip_message Embed
 * @returns {Tip}
 */
parseLog = (log_embed) => {
    const amount_field = log_embed.fields.find(f => f.name === 'Amount').value.replaceAll(/[*,]/g, '');
    const from_field = log_embed.fields.find(f => f.name === 'From').value;
    const to_field = log_embed.fields.find(f => f.name === 'Recipient(s)').value;
    const tip = amount_field.match(LOG_REGEX);
    return {
        valid: true,
        emote: tip.groups.emoji,
        sender: from_field.match(SENDER)[1],
        receiver: to_field.match(RECEIVER)[1],
        value: parseFloat(tip.groups.amount.replaceAll(/[^\d.]/g, '')),
        currency: (tip.groups.code || tip.groups.symbol).replace(
            new RegExp(String.raw`(${Object.keys(SYMBOLS).join('|')})`, 'gi'),
            (_, symbol = '$1') => SYMBOLS[symbol]
        ),
        usd: parseFloat(tip.groups.value?.replaceAll(/[^\d.]/g, '') || 0) || null,
    }
}
