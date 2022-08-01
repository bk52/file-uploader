import React, { useState } from 'react';
import Card from '@mui/material/Card';
import UploadController from './components/UploadController';
import { UploadStatus } from './global/types';
import axios from 'axios';

const App = () => {
  const [files,setFiles]=useState<File[]>([]);
  const [status, setStatus]=useState<UploadStatus>("Waiting");
  const [progress,setProgress]=useState<number>(0);

  const StartUpload=async ()=>{
    try{
      if(files && files.length>0){
          const formData:any= new FormData();
          files.map(file=> formData.append(file.name, file));
          setStatus('Uploading');
          await axios.post("http://localhost:9600/upload",formData,{
            onUploadProgress:(progress:ProgressEvent)=>{
              const completed=Math.round((progress.loaded * 100) / progress.total);
              setProgress(completed);
            }
          });
          setStatus("Uploaded");
      }
    }
    catch(e){
      setStatus('Waiting');
      alert('Error Occured');     
    }
  }

  const CancelUpload=()=>{
    setStatus("Waiting");
  }

  return <div id='card'>
    <Card sx={{width:'100%', height:'100%'}}>
        <UploadController 
            onStartUpload={StartUpload} 
            onCancelUpload={CancelUpload}
            onFileChange={(file)=>setFiles(file)}
            status={status}
            uploadPercentage={progress}
            fileListType='List'
        />
    </Card>
  </div>
}

export default App