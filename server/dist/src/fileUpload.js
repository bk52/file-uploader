"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const localUpload_1 = __importDefault(require("./localUpload"));
const s3Upload_1 = __importDefault(require("./s3Upload"));
const uuid_1 = require("uuid");
const getFilename = (filename, random) => {
    if (!random)
        return filename;
    const extension = filename.includes('.') && filename.split('.')[1];
    return `${(0, uuid_1.v4)()}.${extension}`;
};
const isLimitExceed = (fileList, maximumTotalSize) => {
    let total = 0;
    for (let item in fileList) {
        const file = fileList[item];
        total += file.size;
    }
    return total > maximumTotalSize;
};
const fileUpload = (fileList, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (options.totalUploadByte)
            if (isLimitExceed(fileList, options.totalUploadByte))
                return {
                    code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: `The total size of the files to be uploaded must be less than ${options.totalUploadByte} bytes`
                };
        let result = [];
        for (let item in fileList) {
            let fileRes = {};
            const file = fileList[item];
            const filename = getFilename(file.name, options.randomFileName);
            fileRes.name = filename;
            if (options.uploadLocal && options.uploadPath) {
                yield (0, localUpload_1.default)(file, filename, options.uploadPath);
                fileRes.localPath = `${process.env.SERVER_URL}static/${filename}`;
            }
            if (options.uploadS3Bucket) {
                let s3result = yield (0, s3Upload_1.default)(file, filename);
                fileRes.s3Path = s3result.Location;
            }
            result.push(fileRes);
        }
        return {
            code: http_status_codes_1.StatusCodes.OK,
            message: 'Upload Successfull',
            result
        };
    }
    catch (e) {
        return {
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error'
        };
    }
});
exports.default = fileUpload;
