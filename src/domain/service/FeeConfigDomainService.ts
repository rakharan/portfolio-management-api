export default class FeeConfigDomainService {
    static async GetFeeConfig(query_runner?: any): Promise<any> {
        if (query_runner && !query_runner?.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        // Mocked feeConfig data
        const feeConfig = [{ id: 1, fee: 100, description: "Mock Fee Config" }];
        if (feeConfig.length < 1) {
            throw new Error("NO_FEE_CONFIG_FOUND");
        }

        return feeConfig[0];
    }
}