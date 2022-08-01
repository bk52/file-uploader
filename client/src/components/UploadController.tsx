import React, {useState, useRef, useEffect} from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import Alert from '@mui/material/Alert';
import UploadFilesChip from './UploadFilesChip';
import UploadFilesList from './UploadFilesList';
import {IUploadController, IAlert} from '../global/types';

const UploadController:React.FC<IUploadController> = (
  {
    name="uploadController", 
    allowMultiple=true, 
    allowedTotalByteSize=1048576, 
    acceptedFileTypes="image/*", 
    fileListType="List",
    uploadText="Choose a file or drag it here.",
    fileExtentionText=".jgp, .jpeg, .gif, .png",
    status='Waiting',
    uploadPercentage=0,
    onStartUpload,
    onCancelUpload,
    onFileChange
  }) => {
  const [filestoUpload, setFilestoUpload]=useState<File[]>([]);
  const [alert, setAlert]=useState<IAlert>({active:false, type:'info', message:''});
  const uploadRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    onFileChange && onFileChange(filestoUpload);

    if(uploadRef)
       uploadRef.current!.value="";
  },[filestoUpload])

  const onFileDelete=(index:number)=>{
    let files=[...filestoUpload];
    files.splice(index,1);
    setFilestoUpload(files);
  }

  const onStartClick=(e:React.MouseEvent)=>{
    preventDefaults(e);  
    onStartUpload && onStartUpload();
  }

  const onCancelClick=(e:React.MouseEvent)=>{
    preventDefaults(e);
    onCancelUpload && onCancelUpload();
  }

  const fileSizeExceed=(fileSize:number):boolean=>{
    if(fileSize>allowedTotalByteSize){
      setAlert({
        active:true,
        type:'error',
        message:"Allowed file size exceeded."
      })

      return true;
    }

    return false;
  }

  const updateFiles=(files:FileList | null)=>{
    if(files){

      if(!allowMultiple && filestoUpload.length>0) return;

      let totalFileSize=filestoUpload.reduce((total, item)=>(total + item.size), 0);

      let fileArr= Array.from(files);

      if(!allowMultiple)
        fileArr=[fileArr[0]]

      let newFileSize=fileArr.reduce((total, item)=>(total + item.size), 0)

      if(fileSizeExceed(totalFileSize+newFileSize)) return;
      setFilestoUpload(prevState => prevState.concat(fileArr));

      if(alert.active){
        setAlert({active:false,type:'info',message:''});
      }
    }
  }

  const preventDefaults=(e:React.DragEvent | React.MouseEvent | React.ChangeEvent)=>{
    e.preventDefault();
    e.stopPropagation();
  }
  
  const onDragEnter=(e:React.DragEvent)=>{
    preventDefaults(e);
  }

  const onDragOver=(e:React.DragEvent)=>{
    preventDefaults(e);
  }

  const onDragLeave=(e:React.DragEvent)=>{
    preventDefaults(e);
  }

  const onDrop=(e:React.DragEvent<HTMLElement>)=>{
    preventDefaults(e);
    updateFiles(e.dataTransfer?.files);
  }

  const onChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    preventDefaults(e);
    updateFiles(e.currentTarget.files);
  }

  return <>
    <input ref={uploadRef} className='uploader-input' id='file-uploader' name={name} type="file" accept={acceptedFileTypes} multiple={allowMultiple} onChange={onChange}></input>
    {
      status==="Uploading" || status==="Uploaded" ?  
      <div className='uploader-box'>
        <div className='uploader-box-content'>
          <CircularProgressWithLabel data-testid='upload-progress' size={50} value={uploadPercentage}/>
          <span>{status==="Uploading" ? 'Loading' :'Successfull'}</span>
        </div>
      </div>   
    : 
      <>
        <label 
          data-testid='upload-box'
          htmlFor="file-uploader"
          onDragEnter={onDragEnter} 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className='uploader-box active'
          >
          <div className='uploader-box-content'>
            <CloudUploadIcon sx={{ fontSize: 48 }}/>
            <span className='uploader-box-text'>{uploadText}</span>
            <span className='uploader-box-allowed-text'>Allowed file extensions: {fileExtentionText}</span>
            <span className='uploader-box-max-text'>Maximum file size: 1 MB</span>
          </div>
        </label>
        {alert.active && <Alert className='uploader-box-alert' severity={alert.type}>{alert.message}</Alert>}
      </>      
    }    
    {
        fileListType==="Chip" && <div className='uploader-box-chip-list'>
           <UploadFilesChip 
             status={status}
             fileList={filestoUpload} 
             onStart={onStartClick} 
             onCancel={onCancelClick}
             onDelete={onFileDelete}/>
         </div>
    }
    {
      fileListType==="List" && <UploadFilesList  
        status={status}
        fileList={filestoUpload} 
        onStart={onStartClick} 
        onCancel={onCancelClick}
        onDelete={onFileDelete}/>
    }
  </>
}

export default UploadController