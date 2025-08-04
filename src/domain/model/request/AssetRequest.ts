export type AssetType = 'stock' | 'bond' | 'etf' | 'mutual_fund' | 'commodity' | 'crypto'

export type CreateAssetRequest = {
    symbol: string
    name: string
    asset_type: AssetType
    sector: string
    currency: string
    current_price: number
}