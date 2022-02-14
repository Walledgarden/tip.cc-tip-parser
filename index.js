const TIP_REGEX = /^(\<a?\:.+\:\d{17,}\>|\:.+\:)\s<@!?(\d{17,})>\ssent\s<@!?(\d{17,})>\s([\d\.\,]+)\s([A-Za-z\d\s]+)\s?(.+\s\$([\d\.]+)\)\.|\.)$/;

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
 * @property {string} sender User ID from the Tip Sender
 * @property {string} receiver User ID from the Tip Receiver
 * @property {number} value Value of the Tip as a Number
 * @property {string} currency Currency of the Tip 
 * @property {number|null} usd USD Value from the Tip, null if it has no value for tip.cc
 */

/**
 * 
 * @param {string} tip_message Tip Message, providen from tip.cc
 * @returns {Tip}
 */
module.exports.parseTip = (tip_message) => {
    tip_message = tip_message.replaceAll(/[\*]/g, '');
    let result = { valid: false, currency: '', sender: '', receiver: '', value: 0, currency: '', usd: 0 }
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

module.exports.parseLog = (log_embed) => {

}
