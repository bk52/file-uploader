import { render, screen } from "@testing-library/react";
import LinearProgressWithLabel from "../LinearProgressWithLabel";

const PROGRESS_VALUE=80;

test('Value will be shown in label',()=>{
    render(<LinearProgressWithLabel value={PROGRESS_VALUE}/>)
    expect(screen.getByTestId('progress-value')).toHaveTextContent(PROGRESS_VALUE.toString());
})