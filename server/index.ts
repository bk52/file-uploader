import dotenv from 'dotenv';
dotenv.config();
import express, {Express} from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import fileupload from 'express-fileupload';
import { StatusCodes } from 'http-status-codes';
import UploadFiles from './src/fileUpload';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_FOLDER='uploads';
const UPLOAD_PATH= `${__dirname}/${UPLOAD_FOLDER}/`;

const Init = async () => {
  try {
      if (!fs.existsSync(`./dist/${UPLOAD_FOLDER}`))
        fs.mkdirSync(`./dist/${UPLOAD_FOLDER}`);
      
      app.use(cors());
      app.use(fileupload({
        uriDecodeFileNames:true,
        safeFileNames:true,
        preserveExtension:true
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use('/static', express.static(path.join(__dirname, `/${UPLOAD_FOLDER}`)))
      app.post("/upload", async (req,res)=>{
        try{       

          if (!req.files || Object.keys(req.files).length === 0) 
            return res.status(StatusCodes.BAD_REQUEST).send('No files were uploaded.');
      
            const result=await UploadFiles(req.files,{
                uploadLocal:true,
                uploadS3Bucket:false,
                uploadPath:UPLOAD_PATH,
                randomFileName:false,
            });
         
            return res.status(result.code).send({ message: result.message, files:result.result});
        }
        catch(e){
          console.error('Error Uploads -> ' + e);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "File upload failed" });
        }
      })
   
      app.listen(PORT, () => { console.log("Server started port : " + PORT); });
  }
  catch (e) {
     console.error(`Server couldn't start`);
     console.error(e);
  }
}

Init();