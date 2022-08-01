import { FileArray, UploadedFile } from 'express-fileupload';
import { StatusCodes } from 'http-status-codes';
import { IUploadOptions, IUploadResult, IUploadedFile } from './global/types';
import LocalUpload from './localUpload';
import S3Upload from './s3Upload';
import { v4 as uuidv4 } from 'uuid'; 

const getFilename=(filename:string, random?:boolean):string=>{
    if(!random)
        return filename;
    
    const extension=filename.includes('.') && filename.split('.')[1];
    return `${uuidv4()}.${extension}`;
}

const isLimitExceed=(fileList:FileArray, maximumTotalSize:number):boolean=>{
    let total=0;

    for (let item in fileList){
        const file=fileList[item] as UploadedFile;
        total+=file.size;
    }

    return total>maximumTotalSize;
}

const fileUpload=async(fileList:FileArray, options:IUploadOptions):Promise<IUploadResult>=>{
    try{
        if(options.totalUploadByte)
            if(isLimitExceed(fileList,options.totalUploadByte))
                return {
                    code:StatusCodes.BAD_REQUEST,
                    message:`The total size of the files to be uploaded must be less than ${options.totalUploadByte} bytes`
                }

        let result:IUploadedFile[]=[];
        for (let item in fileList) {
            let fileRes:IUploadedFile={};

            const file=fileList[item] as UploadedFile;
            
            const filename= getFilename(file.name,options.randomFileName);
            fileRes.name=filename;

            if(options.uploadLocal && options.uploadPath)
            {
                await LocalUpload(file, filename, options.uploadPath);
                fileRes.localPath=`${process.env.SERVER_URL}static/${filename}`;
            }
            
            if(options.uploadS3Bucket)
            {
                let s3result=await S3Upload(file,filename);
                fileRes.s3Path=s3result.Location;
            }

            result.push(fileRes);
        }

        return {
            code:StatusCodes.OK,
            message:'Upload Successfull',
            result
        }
    }
    catch(e){
        return {
            code:StatusCodes.INTERNAL_SERVER_ERROR,
            message:'Internal Server Error'
        }
    }
}

export default fileUpload;