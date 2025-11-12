// src/types.ts
export interface CustomPurchaseEvent {
  item_id: string
  item_name: string
  value: number
  currency: string
  status: string
  total_purchase_value: number
  tr_id?: string
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
  total_ad_value: number
}

export interface CustomEventParams {
  value: string
  id?: string
  key?: string
}

export interface CustomEvent {
  event_name: string
  params: CustomEventParams
}
