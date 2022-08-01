import AWS from 'aws-sdk';
import { UploadedFile } from 'express-fileupload';

const S3Upload=async (file:UploadedFile, filename:string):Promise<AWS.S3.ManagedUpload.SendData>=>{
    const s3 = new AWS.S3({
        region:process.env.AWS_BUCKET_REGION,
            credentials:{
                accessKeyId:process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
            }
    });

    const res = await s3.upload({
        Body:file.data, 
        Bucket: process.env.AWS_BUCKET_NAME, 
        Key: filename
    }).promise();

    return res;
}

export default S3Upload;