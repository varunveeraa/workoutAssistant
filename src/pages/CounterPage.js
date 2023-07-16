import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const CounterPage = () => {
  return (
    <div>
      <div>
        <h2>Choose Your Workout</h2>
        {/* <Link to="/bicepcurls">
          <Button size="medium" variant="contained" color="grey">
            Bicep Curls
          </Button>
        </Link> */}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/doubleBicepCurls">
          <Button size="medium" variant="contained" color="grey">
            Double Bicep Curls
          </Button>
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {/* <Link to="/squats">
          <Button size="medium" variant="contained" color="grey">
            Squats
          </Button>
        </Link> */}
        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/pushups">
          <Button size="medium" variant="contained" color="grey">
            Pushup
          </Button>
        </Link> */}
        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/crunches">
          <Button size="medium" variant="contained" color="grey">
            Crunches
          </Button>
        </Link> */}
      </div>
      <br></br>
      <div>
        <Link to="/">
          <Button size="small" variant="contained" color="primary">
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CounterPage;
