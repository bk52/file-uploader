import { UploadedFile } from 'express-fileupload';

const LocalUpload=(file:UploadedFile, filename:string, path:string)=>{
    return new Promise((resolve,reject)=>{
        file.mv(`${path}${filename}`, (e:Error) => {
            if (e) reject(e);
            resolve(filename);
        });
    })
}

export default LocalUpload;