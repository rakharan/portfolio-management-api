import AssetRepository from "@adapters/outbound/repository/AssetRepository";

export default class AssetDomainService {
    static async CreateAssetDomain(asset: any, query_runner: any): Promise<void> {
        if (!query_runner?.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        return await AssetRepository.DBCreateAsset(asset, query_runner);
    }

    static async GetAssetByIdDomain(asset_id: number, query_runner?: any) {
        if (!query_runner?.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        return await AssetRepository.DBGetAssetById(asset_id, query_runner);
    }
}