export interface ITip {
  valid: boolean,
  currency: string,
  emote_id: string,
  emote_name: string,
  sender: string,
  receiver: string,
  value: number,
  usd: number|null
}

export function parseTip(
    tip_message: string
): ITip;