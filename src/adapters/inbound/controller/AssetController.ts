import AssetAppService from "@application/service/Asset";
import { FastifyRequest } from "fastify";

export default class AssetController {
    static async GetAssetById(request: FastifyRequest) {
        const { asset_id } = request.query as { asset_id: number };
        const asset = await AssetAppService.GetAssetById(asset_id);

        return { message: asset };
    }
}