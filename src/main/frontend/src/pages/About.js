import { useState, useEffect, delay, useContext } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";


function About() {

    let [value, setValue] = React.useState("");

    // Block navigating elsewhere when data has been entered into the input
    // let blocker = useBlocker(
    //   ({ currentLocation, nextLocation }) =>
    //     value !== "" &&
    //     currentLocation.pathname !== nextLocation.pathname
    // );




    return (
        <div>글잇다란?</div>

        // <Form method="post">
        // <>
        // <label>
        //   Enter some important data:
        //   <input
        //     name="data"
        //     value={value}
        //     onChange={(e) => setValue(e.target.value)}
        //   />
        // </label>
        // <button type="submit">Save</button>
  
        // {blocker.state === "blocked" ? (
        //   <div>
        //     <p>Are you sure you want to leave?</p>
        //     <button onClick={() => blocker.proceed()}>
        //       Proceed
        //     </button>
        //     <button onClick={() => blocker.reset()}>
        //       Cancel
        //     </button>
        //   </div>
        // ) : null}
        // </>
    //   </Form>
    );
}


export default About;
