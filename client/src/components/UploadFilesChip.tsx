import React, {memo} from 'react'
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import CancelIcon from '@mui/icons-material/Cancel';
import {IUploadList, UploadStatus} from '../global/types';

const ChipIcon=(fileStatus:UploadStatus)=>{
    if(fileStatus==="Uploading")
        return <CircularProgress size={20} data-testid='progressIcon'/>
    
    if(fileStatus==="Uploaded")
        return <CheckCircleIcon data-testid='checkIcon'/>

    return <CancelIcon data-testid='cancelIcon'/>
}

const UploadFilesChip:React.FC<IUploadList> = ({fileList, status, onStart, onCancel, onDelete}) => {
    
    return fileList && fileList.length ? <div className='uploader-chip'>
            <div className='uploader-chip-list'>
                <Stack direction="row" spacing={1}>
                    {
                        fileList && fileList.map((file,index) =><Chip
                            key={index}
                            label={file.name}
                            onDelete={()=> status==="Waiting" && onDelete && onDelete(index)}
                            deleteIcon={ChipIcon(status)}
                            variant="outlined"
                        />)
                    }
                </Stack>
            </div>     
            {
                <div>
                    { status==="Uploading" ? 
                        <Button aria-label="stop" onClick={onCancel}><CancelIcon /> Stop Upload</Button>
                        :
                        status==="Uploaded" ? 
                        null : <Button aria-label="start" onClick={onStart}><PlayArrowIcon /> Start Upload</Button>
                    }
                </div>
            }
            
        </div> : null
}

export default memo(UploadFilesChip)