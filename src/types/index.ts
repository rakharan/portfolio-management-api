export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentExperience: 'beginner' | 'intermediate' | 'experienced';
    annualIncome?: number;
    netWorth?: number;
    investmentGoals?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Portfolio {
    id: number;
    clientId: number;
    name: string;
    portfolioType: 'retirement' | 'taxable' | 'education' | 'trust';
    targetAllocation?: Record<string, number>;
    cashBalance: number;
    totalValue: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Asset {
    id: number;
    symbol: string;
    name: string;
    assetType: 'stock' | 'bond' | 'etf' | 'mutual_fund' | 'commodity' | 'crypto';
    sector?: string;
    currency: string;
    currentPrice?: number;
    priceUpdatedAt?: Date;
}

export interface Holding {
    id: number;
    portfolioId: number;
    assetId: number;
    quantity: number;
    averageCost: number;
    currentValue?: number;
    unrealizedGainLoss?: number;
    lastUpdated: Date;
}

export interface Transaction {
    id: number;
    portfolioId: number;
    assetId: number;
    transactionType: 'buy' | 'sell' | 'dividend' | 'interest' | 'fee' | 'deposit' | 'withdrawal';
    quantity?: number;
    price?: number;
    amount: number;
    fee: number;
    transactionDate: Date;
    settlementDate?: Date;
    notes?: string;
}

export interface PerformanceMetrics {
    totalReturn: number;
    totalReturnPercent: number;
    annualizedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    alpha: number;
    beta: number;
}