/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";
import App from './App';

test('App will render without error',()=>{
    expect(()=>render(<App/>)).not.toThrowError();
})