# file-uploader
Full stack file uploader project.
![intro](https://user-images.githubusercontent.com/24523985/182175584-b0f20b69-3ab1-4dfd-b7e5-0263d1b8df9d.png)

- [Client Side](#client-side)
- [Server Side](#server-side)
- [Installation](#installation)

<h2 id='client-side'>Client Side</h2>

![1](https://user-images.githubusercontent.com/24523985/182175751-219380eb-a22a-415d-8f80-24959188af47.PNG)

- Click or drag and drop for select file.
- Show upload progress
<img src='https://user-images.githubusercontent.com/24523985/182177167-06d05712-9d0f-4fdb-97be-a4b9c349b02d.PNG' width=300/>

- Set maximum file size
- Set allowed file types
<img src='https://user-images.githubusercontent.com/24523985/182183264-ba2e7aee-e69f-447b-b7bb-31c092439c77.PNG' width=300/>

- Single or multiple file upload
- Developed with Typescript
- Unit test with react-testing-library
- Show files as a list or chip style

List Style             |  Chip Style
:-------------------------:|:-------------------------:
![2](https://user-images.githubusercontent.com/24523985/182176769-d70b85a6-7d3d-4c5e-99f5-fcdd925d48ed.PNG)  |  ![3](https://user-images.githubusercontent.com/24523985/182176810-e687948f-fdc8-430e-af2a-fa95d87fa737.PNG)

```js
import React, { useState } from 'react';
import UploadController from './components/UploadController';
import { UploadStatus } from './global/types';

const App = () => {
  const [files,setFiles]=useState<File[]>([]);
  const [status, setStatus]=useState<UploadStatus>("Waiting");

  const StartUpload=async ()=>{
    // Send Files
  }

  const CancelUpload=()=>{
    // Cancel Upload
  }

  return <UploadController 
            onStartUpload={StartUpload} 
            onCancelUpload={CancelUpload}
            onFileChange={(file)=>setFiles(file)}
            status={status} />
}

export default App
```

### Props

```js
  export interface IUploadController{
      /** Name of input field. */
      name?:string;
      /** Upload status of files. Default value is "Waiting" */
      status?:UploadStatus;
      /** Multiple or single file upload. Default value is true. */
      allowMultiple?:boolean;
      /** Maximum total file size in byte. Default value is 1048576. */
      allowedTotalByteSize?:number;
      /** Accepted file types. Default value is ".jgp, .jpeg, .gif, .png" */
      acceptedFileTypes?: string;
      /** File list type. Default value is "List" */
      fileListType?: "Chip"|"List";
      /** Upload text under the icon. */
      uploadText?:string;
      /** Allow file extensions text */
      fileExtentionText?: string;
      /** Upload file percentage */
      uploadPercentage?:number;
      /** Trigger when file selected or removed. Return file list. */
      onFileChange?:(files:File[])=>void;
      /** Trigger when clicked start upload button */
      onStartUpload?:()=>void;
      /** Trigger when clicked stop upload button */
      onCancelUpload?:()=>void;
  }
```

<h2 id='server-side'>Server Side</h2>

- Set maximum file size
- Developed with Typescript
- Upload files to local folder or S3 Bucket or both.

```js

  const UPLOAD_PATH= `${__dirname}/uploads/`;
  
  const options:IUploadOptions={
      uploadLocal:true,
      uploadPath:UPLOAD_PATH,
      uploadS3Bucket:true,
      randomFileName:false,
      totalUploadByte:1024*1024,
  }
  
  const result=await UploadFiles(req.files, options);
```

<h2 id='installation'>Installation</h2>

<ul>
  <li>Clone repository</li>
  <i>git clone https://github.com/bk52/file-uploader.git</i>
  <li>Install server side</li>
    <ul>
      <li>Enter server folder</li>
      <i>cd server</i>
      <li>Change .env.development to .env and fill credentials</li>
      <li>Install packages</li>
      <i>npm install</i>
      <li>Run server</li>
      <i>npm run dev</i>
    </ul>
  <li>Install client side</li>
   <ul>
      <li>Enter client folder</li>
      <i>cd client</i>
      <li>Install packages</li>
      <i>yarn install</i>
      <li>Run server</li>
      <i>yarn start</i>
    </ul>
</ul>
