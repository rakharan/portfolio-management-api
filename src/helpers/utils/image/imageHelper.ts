import path from "path"
import fs from "fs"
import { DeliveryType, ResourceType, ResponseCallback, UploadApiResponse, v2 as cloudinary } from "cloudinary"
import { File } from "fastify-multer/lib/interfaces"
import { BadInputError } from "@domain/model/Error/Error"
import dotenvFlow from "dotenv-flow"

//configuration for dotenv
dotenvFlow.config({ path: path.resolve(__dirname, `../../../../`) })

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

export async function UploadImage(request: File): Promise<UploadApiResponse> {
    // Get the file from the request
    const file = request
    // Define the destination path for the uploaded file
    const destPath = path.resolve(__dirname, "../../../uploads", file.filename)

    // Now that the file is saved locally, we can upload it to Cloudinary
    const buffer = fs.readFileSync(destPath)

    return new Promise((resolve, reject) => {
        //extracting filename and removing the file extension.
        const filename = file.filename.split(".")[0]
        cloudinary.uploader
            .upload_stream({ resource_type: "auto", folder: "tokopaedi/products", upload_preset: "tokopaedi", public_id: filename, overwrite: true, invalidate: true }, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    //will delete the file after every successful upload.
                    fs.unlinkSync(destPath)
                    resolve(result)
                }
            })
            .end(buffer)
    })
}

export async function DeleteImage(public_id: string, options?: { resource_type?: ResourceType; type?: DeliveryType; invalidate?: boolean }, callback?: ResponseCallback) {
    cloudinary.uploader.destroy(public_id, { ...options, invalidate: true }, callback).then(callback)
}

export const fileFilter = (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    if ((file.mimetype === "image/jpeg" || file.mimetype === "image/png") && (ext === ".jpg" || ext === ".png" || ext === ".jpeg")) {
        cb(null, true)
    } else {
        cb(new BadInputError("Only .jpg and .png format allowed!"), false)
    }
}
