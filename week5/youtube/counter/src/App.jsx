import React from 'react'
import { useState } from 'react'
import './App.css'


function App() {
  let [count, setCount] = useState(15)

  const Addvalue = () => {
    if(count < 20){
  setCount(count+1);
  console.log('Value increased', Math.random, setCount)
  }}
 const Decreasevalue =()=> {
  if(count > 0){
  setCount(count-1);
  console.log('Value decreased', Math.random, setCount) }}
  return (
    <>
     <h1>Counter App</h1>
     <h2>counter value: {count}</h2>

     <button onClick={Addvalue}>Increment</button>
     <br />

     <button onClick={Decreasevalue}>Decrement</button>

    
    </>
  )
}

export default App
