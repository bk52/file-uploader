import React from "react";

export type UploadStatus= "Waiting" | "Uploading" | "Uploaded";

export interface IUploadList{
    fileList?:File[];
    status:UploadStatus;
    onStart:(e:React.MouseEvent)=> void;
    onCancel:(e:React.MouseEvent)=> void;
    onDelete:(index:number)=>void;
}

export interface IUploadListItem{
  index:number;
  file:File;
  status:UploadStatus;
  onDelete:(index:number)=>void;
}
  
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
  
export interface IAlert{
    active:boolean;
    type:'error' | 'warning' | 'info' | 'success';
    message:string;
}