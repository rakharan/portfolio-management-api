import AssetDomainService from "@domain/service/AssetDomainService";
import * as AssetSchema from "@helpers/JoiSchema/Asset"

export default class AssetAppService {
    static async GetAssetById(asset_id: number) {
        try {
            await AssetSchema.AssetId.validateAsync(asset_id);

            return await AssetDomainService.GetAssetByIdDomain(asset_id);
        } catch (error) {
            throw new Error("ASSET_NOT_FOUND");
        }
    }
}