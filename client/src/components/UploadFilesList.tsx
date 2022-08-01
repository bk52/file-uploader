import React, {memo} from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import { MB } from '../utils/convert';
import { IUploadList, IUploadListItem } from '../global/types';

const UploadFilesListItem:React.FC<IUploadListItem>=({file, status, index, onDelete})=>{
    return <ListItem>
        <Grid sx={{width:'100%'}} container>
            <Grid item xs={8} className='uploader-list-main'>
                <div className='uploader-list-filename'>{file.name}</div>
                <div className='uploader-list-filesize'>{`${MB(file.size).toFixed(2)} MB`}</div>
            </Grid>
            
            <Grid item xs={4} style={{textAlign:'right'}}>
               {
                 status==='Uploading' ? <Box sx={{ width: '100%' }}><LinearProgress data-testid='progressIcon'/></Box> 
                 : status==="Uploaded" ? <CheckCircleIcon data-testid='checkIcon'/> 
                 : <IconButton onClick={(e)=>onDelete(index)} edge="end" aria-label="cancel" data-testid='cancelIcon'><CloseIcon /></IconButton>
               }
            </Grid>
        </Grid>
  </ListItem>
}

const UploadFilesList:React.FC<IUploadList> = ({fileList, status, onStart, onCancel, onDelete}) => {
  return  <List dense={true}>
    {
        fileList && fileList.length>0 && <>
            <ListItem>
                <Grid container justifyContent={'center'} >
                    {
                        status==='Uploading' ? 
                        <Button aria-label="stop" onClick={onCancel}><CancelIcon /> Stop Upload</Button>
                        :
                        status==="Uploaded" ? 
                        null : <Button aria-label="start" onClick={onStart}><PlayArrowIcon /> Start Upload</Button>
                    }
                </Grid>
            </ListItem>
            {fileList.map((file,index) => <UploadFilesListItem key={index} index={index} file={file} status={status} onDelete={onDelete}/>)}
        </>
    }
  </List>
}

export default memo(UploadFilesList)