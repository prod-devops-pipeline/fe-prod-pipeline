import React, { useCallback, useReducer, useState } from 'react'
import { useLocation } from 'react-router-dom';

interface state {
    count: number;
}
const ChildButton = React.memo(({ onClick, label }: any) => {
    console.log(`${label} rendered`);
    return <button onClick={onClick}>{label}</button>;
});
type action =
    | { type: 'increment' }
    | { type: 'decrement' }
    | { type: 'reset', payload: number }

function TestPage2() {
    const [row, setRow] = useState(1);
    const [colum, setColum] = useState(1);

    const cell = Array.from({ length: row * colum }, (_, i) => i + 1);

    const [count, setCount] = useState(0);
    const [other, setOther] = useState(0);

    // Function stable unless count changes
    const handleIncrement = useCallback(() => {
        setCount(c => c + 1);
    }, []);

    const reducer = (state: state, action: action): state => {
        switch (action.type) {
            case 'increment':
                return {
                    count: state.count + 1
                }
            case 'decrement':
                return {
                    count: state.count - 1
                }
            case 'reset': {
                return {
                    count: action.payload
                }
            }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { count: 0 });
 
    return (
        <>
            {name}
            {state.count}
            <button onClick={() => { dispatch({ type: 'increment' }) }}>add +</button>
            <button onClick={() => { dispatch({ type: 'decrement' }) }}>-</button>
            <button onClick={() => { dispatch({ type: 'reset', payload: 0 }) }}>clear</button>

            <div>
                row      <input type="number" onChange={(e) => { setRow(Number(e.target.value)) }} />
                col      <input type="number" onChange={(e) => { setColum(Number(e.target.value)) }} />
            </div>


            <div className={` grid gap-2 `} style={{
                gridTemplateColumns: `repeat(${colum}, 1fr)`,
                gridTemplateRows: `repeat(${row}, 1fr)`
            }}>
                {cell.map((c) => (<>
                    <div className='p-2 bg-slate-400'>
                        {c}
                    </div>
                </>))}
            </div>

            <p>Count: {count} | Other: {other}</p>
            <ChildButton onClick={handleIncrement} label="Increment Count" />
            <button onClick={() => setOther(o => o + 1)}>Change Other</button>


        </>
    )
}

export default TestPage2
