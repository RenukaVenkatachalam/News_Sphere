import { useEffect } from "react";

useEffect(() => {
    //code to run as side effect
 
    return()=>{
        //cleanup code
};
}, []); //dependency array
//empty dependency array means this effect runs once on mount and cleanup on unmount
//add dependencies in the array to re-run effect when they change
//e.g., [prop1, stateVar]
//This is useful for subscriptions, timers, or manual DOM manipulations
//that need to be set up and cleaned up to avoid memory leaks.
//Example: