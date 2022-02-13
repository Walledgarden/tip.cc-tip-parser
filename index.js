const TIP_REGEX = /^<:(.+):(\d{17,})>\s<@!?(\d{17,})>\ssent\s<@!?(\d{17,})>\s([\d\.\,]+)\s([A-Za-z0-9\s]+)(\s(.+\s\$([\d\.]+)\)\.)|\.)$/;

/**
 * @typedef {Object} Tip
 * @property {boolean} valid Whether the tip is valid or not
 * @property {string} currency The tipped currency
 * @property {string} emote_id The ID from the Emote in the Tip
 * @property {string} emote_name The Name from the Emote in the Tip
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
    let result = { valid: false, currency: '', emote_id: '', emote_name: '', sender: '', receiver: '', value: 0, currency: '', usd: 0 }
    if (!TIP_REGEX.test(tip_message)) return result;
    const tip = tip_message.match(TIP_REGEX);
    result.valid = true;
    result.emote_id = tip[2];
    result.emote_name = tip[1];
    result.sender = tip[3];
    result.receiver = tip[4];
    result.value = parseFloat(tip[5].replaceAll(/[^0-9\.]/g, ''));
    result.currency = tip[6];
    result.usd = typeof tip[9] === "undefined" ? null : parseFloat(tip[9].replaceAll(/[^0-9\.]/g, ''));
    return result;
}