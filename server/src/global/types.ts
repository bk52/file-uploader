import { StatusCodes } from 'http-status-codes';

export interface IUploadOptions{
    uploadLocal:boolean;
    uploadPath?:string;
    uploadS3Bucket?:boolean;
    randomFileName?:boolean;
    resizeImage?:boolean;
    totalUploadByte?:number;
}

export interface IUploadedFile{
    name?:string,
    localPath?:string,
    s3Path?:string
}

export interface IUploadResult{
    code:StatusCodes,
    message?:string,
    result?:IUploadedFile[]
}