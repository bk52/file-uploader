/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/no-node-access */
import { createEvent, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UploadController from "../UploadController";

const onStartUpload=jest.fn();
const onCancelUpload=jest.fn();
const onFileChange = jest.fn(files => files);

const testList:File[]=[
    new File([""],"1.png",{type:"image/png"}),
    new File([""],"2.png",{type:"image/png"})
]

const bigFile= new File([""], '3.png',{type:"image/png"});
Object.defineProperty(bigFile, 'size', { value: 1024 * 1024 * 2 })

test('Component will render without error',()=>{
    expect(()=>render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"/>)).not.toThrowError();
})

test('Show files in a list by default', async ()=>{
       const {container} = render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"/>)

        const fileInput=container.querySelector('#file-uploader');
        expect(fileInput).not.toBeNull();

        await waitFor(() =>
            fireEvent.change(fileInput!, {
                target: { files: testList },
            })
        );

        const listItem=container.getElementsByClassName('uploader-list-filename')[0];

        expect(listItem).not.toBeNull();
        expect(listItem).toHaveTextContent(/1.png/i);
})

test('Show progress when uploading', ()=>{
     render(<UploadController 
     onStartUpload={onStartUpload}
     onCancelUpload={onCancelUpload}
     onFileChange={onFileChange}
     status="Uploading"/>)

     const progress=screen.getByTestId('upload-progress');
     expect(progress).not.toBeNull();
})

test('Drop file to upload box and control file list',()=>{
        const {container} =  render(<UploadController 
            onStartUpload={onStartUpload}
            onCancelUpload={onCancelUpload}
            onFileChange={onFileChange}
            status="Waiting"/>)

        const uploadBox=screen.getByTestId('upload-box');
        fireEvent.drop(uploadBox, {
            dataTransfer: {
              files: [testList[0]],
            },
        })

        const listItem=container.getElementsByClassName('uploader-list-filename')[0];

        expect(listItem).not.toBeNull();
        expect(listItem).toHaveTextContent(/1.png/i);
})

test('Disable multiple file',()=>{
    const {container} =  render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"
        allowMultiple={false}/>)

    const uploadBox=screen.getByTestId('upload-box');
    fireEvent.drop(uploadBox, {
        dataTransfer: {
          files: testList,
        },
    })

    const listItem=container.getElementsByClassName('uploader-list-filename');
    expect(listItem).not.toBeNull();
    expect(listItem).toHaveLength(1);
})

test('Allow multiple file',()=>{
    const {container} =  render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"
        allowMultiple={true}/>)

    const uploadBox=screen.getByTestId('upload-box');
    fireEvent.drop(uploadBox, {
        dataTransfer: {
          files: testList,
        },
    })

    const listItem=container.getElementsByClassName('uploader-list-filename');
    expect(listItem).not.toBeNull();
    expect(listItem).toHaveLength(2);
})

test('When total file size exceed nothing show in the list',()=>{
    const {container} =  render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"
        allowedTotalByteSize={1048576}
        allowMultiple={true}/>)

    const uploadBox=screen.getByTestId('upload-box');
    fireEvent.drop(uploadBox, {
        dataTransfer: {
          files: [...testList,bigFile],
        },
    })

    const listItem=container.getElementsByClassName('uploader-list-filename');
    expect(listItem).not.toBeNull();
    expect(listItem).toHaveLength(0);

    const alertItem=container.getElementsByClassName('uploader-box-alert')[0];
    expect(alertItem).not.toBeNull();
    expect(alertItem).toHaveTextContent(/Allowed file size exceeded/i);
})

test('Trigger onFileChange when file selected',()=>{
    render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"/>)

    const uploadBox=screen.getByTestId('upload-box');
    fireEvent.drop(uploadBox, {
        dataTransfer: {
          files: [new File([""],"1.png",{type:"image/png"})],
        },
    })

    expect(onFileChange.mock.calls[1][0]).toEqual([new File([""],"1.png",{type:"image/png"})]);
})

test('Trigger onFileChange when file deleted',()=>{
    render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"
        fileListType="List"/>)

    const uploadBox=screen.getByTestId('upload-box');
    fireEvent.drop(uploadBox, {
        dataTransfer: {
          files: [testList[0]],
        },
    })

    expect(onFileChange.mock.calls[1][0]).toEqual([testList[0]]);

    const deleteButton=screen.getByTestId("cancelIcon");
    expect(deleteButton).not.toBeNull();
    
    userEvent.click(deleteButton);
    expect(onFileChange.mock.calls[0][0]).toEqual([]);
})

test('Trigger onStartUpload when start upload button clicked',()=>{
    render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"
        fileListType="List"/>)

    const uploadBox=screen.getByTestId('upload-box');
    fireEvent.drop(uploadBox, {
        dataTransfer: {
            files: [testList[0]],
        },
    })

    const startButton=screen.getAllByLabelText('start')[0];
    expect(startButton).not.toBeNull();
    expect(startButton).toHaveTextContent(/Start Upload/i);
    
    userEvent.click(startButton);
    expect(onStartUpload).toBeCalledTimes(1);
})

test('Trigger onCancelUpload when stop upload button clicked',()=>{
    const { rerender } = render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"
        fileListType="List"/>)

    const uploadBox=screen.getByTestId('upload-box');
    fireEvent.drop(uploadBox, {
        dataTransfer: {
            files: [testList[0]],
        },
    })

    rerender(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Uploading"
        fileListType="List" />);

    const stopButton=screen.getAllByLabelText('stop')[0];
    expect(stopButton).not.toBeNull();
    expect(stopButton).toHaveTextContent(/Stop Upload/i);
    
    userEvent.click(stopButton);
    expect(onCancelUpload).toBeCalledTimes(1);
})

test('preventDefault onDragEnter, onDragOver and onDragLeave events',()=>{
    render(<UploadController 
        onStartUpload={onStartUpload}
        onCancelUpload={onCancelUpload}
        onFileChange={onFileChange}
        status="Waiting"
        fileListType="List"/>)

  const uploadBox = screen.getByTestId("upload-box");

  const dragEnterEvent = createEvent.dragEnter(uploadBox);
  fireEvent(uploadBox, dragEnterEvent);
  expect(dragEnterEvent.defaultPrevented).toBe(true);

  const dragOverEvent = createEvent.dragOver(uploadBox);
  fireEvent(uploadBox, dragOverEvent);
  expect(dragOverEvent.defaultPrevented).toBe(true);
})