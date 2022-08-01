/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/no-node-access */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UploadFilesList from "../UploadFilesList";

const onStart=()=>{}
const onCancel=()=>{}
const onDelete = jest.fn(index => index);
const testList:File[]=[
    new File([""],"1.png",{type:"image/png"})
]

test('Component will not throw an error without filelist',()=>{
    expect(()=>render(<UploadFilesList 
        onStart={onStart}
        onCancel={onCancel}
        onDelete={onDelete}
        status="Waiting"/>)).not.toThrowError();
})

test('File name must show in list',()=>{
    const { container } =  render(<UploadFilesList 
        onStart={onStart}
        onCancel={onCancel}
        onDelete={onDelete}
        fileList={testList}
        status="Waiting" />
    )

    // eslint-disable-next-line testing-library/no-container
    const chip=container.getElementsByClassName('uploader-list-filename')[0];

    expect(chip).not.toBeNull();
    expect(chip).toHaveTextContent(/1.png/i);
})

test('Show delete button when waiting state',async ()=>{
    render(<UploadFilesList 
       onStart={onStart}
       onCancel={onCancel}
       onDelete={onDelete}
       fileList={testList}
       status="Waiting" />
   )

   await waitFor(() => {
       const cancelIcon=screen.findByTestId('cancelIcon');
       expect(cancelIcon).not.toBeNull();
   })
})

test('Show progress when uploading state',async ()=>{
    render(<UploadFilesList 
       onStart={onStart}
       onCancel={onCancel}
       onDelete={onDelete}
       fileList={testList}
       status="Uploading" />
   )

   await waitFor(() => {
       const cancelIcon=screen.findByTestId('progressIcon');
       expect(cancelIcon).not.toBeNull();
   })
})

test('Show check icon when uploaded state',async ()=>{
    render(<UploadFilesList 
       onStart={onStart}
       onCancel={onCancel}
       onDelete={onDelete}
       fileList={testList}
       status="Uploaded" />
   )

   await waitFor(() => {
       const cancelIcon=screen.findByTestId('checkIcon');
       expect(cancelIcon).not.toBeNull();
   })
})

test('Show start upload button when waiting state', ()=>{
    render(<UploadFilesList 
        onStart={onStart}
        onCancel={onCancel}
        onDelete={onDelete}
        fileList={testList}
        status="Waiting" />
    )

    const startButton=screen.getAllByLabelText('start')[0];
    expect(startButton).not.toBeNull();
    expect(startButton).toHaveTextContent(/Start Upload/i);
})

test('Hide start upload button when waiting uploaded',()=>{
    render(<UploadFilesList 
        onStart={onStart}
        onCancel={onCancel}
        onDelete={onDelete}
        fileList={testList}
        status="Uploaded" />
    )

    const startUploadButton = screen.queryByText(/Start Upload/i)
    expect(startUploadButton).toBeNull() 
})

test('Return index of file when delete click',()=>{
    render(<UploadFilesList 
        onStart={onStart}
        onCancel={onCancel}
        onDelete={onDelete}
        fileList={testList}
        status="Waiting" />
    )

    const deleteButton=screen.getByTestId("cancelIcon");
    expect(deleteButton).not.toBeNull();
    userEvent.click(deleteButton);
    expect(onDelete.mock.calls[0][0]).toBe(0);
})