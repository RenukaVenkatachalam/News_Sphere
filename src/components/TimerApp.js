import React ,{useEffect, useState} from 'react'

function TimerApp() {
      //state to store the seconds value
      const[seconds, setSeconds] = useState(0);
      //state to track if timer is running
      const[isRunning, setIsRunning] = useState(false);
      //useEffect runs when seconds or isRunning changes  to handle timer logic would go here
      useEffect(() => {
        let timer;
        if (isRunning) {
          timer = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
          }, 1000);
        } else {
          clearInterval(timer);
        }
        return () => clearInterval(timer);
      }, [isRunning, seconds]);
  return (
    <div>
        <h2>Timer Application</h2>
        <p>0 seconds</p>
        <button>Start</button>
        <button>Stop</button>
        <button>Reset</button>

    </div>
  )
}

export default TimerApp