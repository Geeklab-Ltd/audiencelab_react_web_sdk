// src/types.ts
export interface CustomPurchaseEvent {
  item_id: string
  item_name: string
  value: number
  currency: string
  status: string
}

export interface CustomAdEvent {
  ad_id: string
  name: string
  source: string
  watch_time: number
  reward: boolean
  media_source: string
  channel: string
  value: number
  currency: string
}
