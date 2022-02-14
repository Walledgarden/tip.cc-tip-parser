export interface ITip {
  valid: boolean,
  currency: string,
  sender: string,
  receiver: string,
  value: number,
  usd: number|null
}

export function parseTip(
    tip_message: string
): ITip;