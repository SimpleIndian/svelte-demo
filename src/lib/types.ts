export interface StockData {
    Ticker: string;
    Date: string;
    Time: string;
    LTP: number;
    BuyPrice: number;
    BuyQty: number;
    SellPrice: number;
    SellQty: number;
    LTQ: number;
    OpenInterest: number;
}

export type NumericFields = 'LTP' | 'BuyPrice' | 'SellPrice' | 'BuyQty' | 'SellQty' | 'LTQ' | 'OpenInterest';