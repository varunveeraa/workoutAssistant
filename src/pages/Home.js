import React from "react";
import exercise from "../assets/images/exercise.png";
import "../App.css";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
export const Home = () => {
  return (
    <div>
      <div className="home">
        <div>
          <div>
            {/* <Link to="/yoga">
              <Button
                size="large"
                variant="contained"
                color="primary"
                startIcon={<Avatar src={meditaion} />}
              >
                Yoga
              </Button>
            </Link>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
            <Link to="/counter">
              <Button
                size="large"
                variant="contained"
                color="primary"
                startIcon={<Avatar src={exercise} />}
              >
                Resistance Training
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
