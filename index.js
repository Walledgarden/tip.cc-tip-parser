const TIP_REGEX = /^(\<a?\:.+\:\d{17,}\>|\:.+\:)\s<@!?(\d{17,})>\ssent\s<@!?(\d{17,})>\s([\d\.\,]+)\s([A-Za-z\d\s]+)(\s.+\s\$([\d\.]+)\)\.|\.)$/;

const PREFIXES = [
    { name: 'XNO', value: 'Ӿ' }
];

const SUFFIXES = [
    { name: 'DOGE', value: 'Ð' },
    { name: 'PPC', value: 'Ᵽ' },
    { name: 'XTZ', value: 'ꜩ' },
    { name: 'ADA', value: '₳' },
    { name: 'BTC', value: '₿' }
];

const ALIASES = {
    'wei': {
        name: 'ETH',
        divisor: 1000000000000000000
    },
    'gwei': {
        name: 'ETH',
        divisor: 1000000000
    },
    'satoshi': {
        name: 'BTC',
        divisor: 100000000
    },
    'mbtc': {
        name: 'BTC',
        divisor: 1000
    },
    'piconero': {
        name: 'XMR',
        divisor: 1000000000000
    },
    'lovelaces': {
        name: 'ADA',
        divisor: 1000000
    },
    'satoshi cash': {
        name: 'BCH',
        divisor: 100000000
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
module.exports.parseTip = (tip_message) => {
    tip_message = tip_message.replaceAll(/[\*]/g, '');
    let result = { valid: false, currency: '', emote: '', sender: '', receiver: '', value: 0, usd: 0 }
    tip_message = tip_message.replaceAll(new RegExp(`(${PREFIXES.map(r => r.value).join("|")})\s?([0-9\.,]+)?`, "gi"), (o, prefix = '$1', value = '$2') => { return `${value} ${PREFIXES.find(r => r.value === prefix).name}` }).replaceAll(new RegExp(`(${SUFFIXES.map(r => r.value).join("|")})`, "gi"), (o, f = '$1') => { return SUFFIXES.find(r => r.value === f).name; });
    if (!TIP_REGEX.test(tip_message)) return result;
    const tip = tip_message.match(TIP_REGEX);
    result.valid = true;
    result.emote = tip[1];
    result.sender = tip[2];
    result.receiver = tip[3];
    result.value = parseFloat(tip[4].replaceAll(/[^0-9\.]/g, ''));
    result.currency = tip[5];
    result.usd = typeof tip[7] === "undefined" ? null : parseFloat(tip[7].replaceAll(/[^0-9\.]/g, ''));
    if (typeof ALIASES[result.currency.toLowerCase()] !== "undefined") {
        const n = ALIASES[result.currency.toLowerCase()];
        result.currency = n.name;
        result.value /= n.divisor;
    }
    return result;
}

/**
 * 
 * @param {object} tip_message Embed
 * @returns {Tip}
 */
module.exports.parseLog = (log_embed) => {
    const SUFFIXES = {
        'Ð': 'DOGE',
        'Ᵽ': 'PPC',
        'ꜩ': 'XTZ',
    };

    const PREFIXES = {
        'Ӿ': 'NANO',
    };

    const PREFIX_SUFFIX_REGEX = new RegExp(`(([${[...Object.keys(PREFIXES)].join('')}])\\s?(\\d+\\.?\\d*)|(\\d+\\.?\\d*)\\s?([${[...Object.keys(SUFFIXES)].join('')}]))`);

    const amount_field = log_embed.fields.find(f => f.name === "Amount").value.replaceAll(/[\*\,]/g, '');
    const from_field = log_embed.fields.find(f => f.name === "From").value;
    const to_field = log_embed.fields.find(f => f.name === "Recipient(s)").value;

    const parsed_amount = amount_field.match(/(<a?:.+:\d+>)\s([\d\,\.]+)\s([A-Za-z\d\s]+)\s(\(\≈\s\$([\,\.\d]+)\))?/);

    let result = {
        valid: true,
        currency: parsed_amount[3],
        emote: parsed_amount[1],
        sender: from_field.match(/<@!?(\d+)>/)[1],
        receiver: to_field.match(/<@!?(\d+)>/)[1],
        value: parseFloat(parsed_amount[2].replaceAll(/[^0-9\.]/g, '')),
        usd: typeof parsed_amount[5] === "undefined" ? null : parseFloat(parsed_amount[5].replaceAll(/[^0-9\.]/g, ''))
    }

    if (PREFIX_SUFFIX_REGEX.test(amount_field)) {
        const [, , prefix, prefixedValue, suffixedValue, suffix] = text.match(PREFIX_SUFFIX_REGEX);
        if (prefix) return { value: prefixedValue, currency: PREFIXES[prefix] };
        if (prefix) {
            result.value = prefixedValue;
            result.currency = PREFIXES[prefix];
            result.usd = amount_field.match(/\(≈\s\$([\d\.]+)\)/)[1];
        }
        if (suffix) {
            result.value = suffixedValue;
            result.currency = SUFFIXES[suffix];
            result.usd = amount_field.match(/\(≈\s\$([\d\.]+)\)/)[1];
        }
    }

    return result;
}
