export interface ITip {
  valid: boolean,
  currency: string,
  emote: string,
  sender: string,
  receiver: string,
  value: number,
  usd: number|null
}

export function parseTip(
    tip_message: string
): ITip;

export function parseLog(
    tip_message: any
): ITip;