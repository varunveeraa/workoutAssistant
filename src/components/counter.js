import React from "react";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

import Webcam from "react-webcam";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import angleBetweenThreePoints from "./angle";

const styles = {
  webcam: {
    position: "absolute",
    textAlign: "center",
    zIndex: 2, // set a higher zIndex to appear on top of other elements
    width: 500,
    height: 375,
    left: "50%",
    transform: "translateX(-50%)",
    top: "50%",
    marginTop: -187.5,
  },
  countBox: {
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    width: 400,
    height: 100,
    top: "60%", // adjust the top position to be below the webcam and canvas
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    zIndex: 1,
  },
  selectBox: {
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    left: "50%",
    transform: "translateX(-50%)",
    top: "35%", // adjust the top position to be below the webcam and canvas
    textAlign: "center",
    width: 400,
    color: "#05386B",
    background: "#8EE4AF",
    zIndex: 1,
  },
  back: {
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "10%", // adjust the bottom position to be below the webcam and canvas
    zIndex: 1,
  },
};

const exrInfo = {
  bicepCurls: {
    index: [12, 14, 16],
    ul: 160,
    ll: 50,
  },
  bicepCurls1: {
    index: [11, 13, 15],
    ul: 160,
    ll: 50,
  },
  squats: {
    index: [24, 26, 28],
    ul: 170,
    ll: 50,
  },
  pushups: {
    index: [12, 14, 16],
    ul: 160,
    ll: 80,
  },
  crunches: {
    index: [12, 24, 26],
    ul: 130,
    ll: 50,
  },
};

let count = 0;
let dir = 0;
let angle = 0;

function Counter(props) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  let camera = null;
  const countTextbox = useRef(null);

  function onResult(results) {
    if (results.poseLandmarks) {
      const position = results.poseLandmarks;

      // set height and width of canvas
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      //ratios between 0-1, covert them to pixel positions
      const upadatedPos = [];
      const indexArray = exrInfo[props.exercise].index;

      for (let i = 0; i < 3; i += 1) {
        upadatedPos.push({
          x: position[indexArray[i]].x * width,
          y: position[indexArray[i]].y * height,
        });
      }
      //console.log(upadatedPos)
      angle = Math.round(angleBetweenThreePoints(upadatedPos));
      //console.log("Angle is getting updated ",angle)

      // Count reps
      //0 is down, 1 is up
      if (angle > exrInfo[props.exercise].ul) {
        //console.log("test angle ",angle)
        if (dir === 0) {
          //count.current = count.current + 0.5
          console.log(count, " ", dir, " decrement ", angle);
          dir = 1;
        }
      }

      if (angle < exrInfo[props.exercise].ll) {
        if (dir === 1) {
          count = count + 1;
          console.log(count, " ", dir, " increment ", angle);
          dir = 0;
        }
      }

      //console.log(count.current)
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      //canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height)

      for (let i = 0; i < 2; i++) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(upadatedPos[i].x, upadatedPos[i].y);
        canvasCtx.lineTo(upadatedPos[i + 1].x, upadatedPos[i + 1].y);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "yellow";
        canvasCtx.stroke();
      }
      for (let i = 0; i < 3; i++) {
        canvasCtx.beginPath();
        canvasCtx.arc(upadatedPos[i].x, upadatedPos[i].y, 5, 0, Math.PI * 2);
        canvasCtx.fillStyle = "white";
        canvasCtx.fill();
      }
      canvasCtx.font = "25px roboto";
      canvasCtx.fillText(angle, upadatedPos[1].x + 10, upadatedPos[1].y + 40);
      canvasCtx.restore();
    }
  }

  useEffect(() => {
    console.log("rendered");
    count = 0;
    dir = 0;
    //console.log(count.current)
    //console.log("rendered counter")
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.9,
    });

    pose.onResults(onResult);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          countTextbox.current.value = count;
          //console.log(count, dir)
          //console.log("hello",countTextbox.current.value)
          await pose.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  });

  function resetCount() {
    console.log("clicked");
    count = 0;
    dir = 0;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", position: "relative" }}>
        <Webcam
          ref={webcamRef}
          style={{ ...styles.webcam, width: 500, height: 375 }}
        />
        <canvas
          ref={canvasRef}
          style={{ ...styles.webcam, zIndex: 2, width: 500, height: 375 }}
        />
      </div>
      <div style={styles.countBox}>
        <h1>Count</h1>
        <input
          variant="filled"
          ref={countTextbox}
          value={count}
          textAlign="center"
          style={{ fontSize: 40, width: 50 }}
        />
        <br></br>
        <br></br>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={resetCount}
        >
          Reset Counter
        </Button>
      </div>
      <div style={styles.back}>
        <Link to="/counter">
          <Button size="large" variant="contained" color="primary">
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Counter;
