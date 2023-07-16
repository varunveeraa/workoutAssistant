/* eslint-disable react-hooks/exhaustive-deps */
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
    zIndex: 1, // set a higher zIndex to appear on top of other elements
    width: 500,
    height: 375,
    left: "50%",
    transform: "translateX(-50%)",
    top: "10%",
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
  RightBicep: {
    index: [12, 14, 16],
    ul: 160,
    ll: 50,
  },
  LeftBicep: {
    index: [11, 13, 15],
    ul: 160,
    ll: 50,
  },
};

let RightArmCount = 0;
let LeftArmCount = 0;

// let TotalArmCount = 0;

let rightDir = 0;
let LeftDir = 0;

let rightArmAngle = 0;
let leftArmAngle = 0;

let DoubleBicepCurl = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  let camera = useRef(null);
  const RightCountTextbox = useRef(null);
  const LeftCountTextbox = useRef(null);

  function onResult(results) {
    if (results.poseLandmarks) {
      const position = results.poseLandmarks;

      // set height and width of canvas
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      //ratios between 0-1, covert them to pixel positions
      const rightArm = [];
      const leftArm = [];

      const indexArrayRight = exrInfo["RightBicep"].index;
      const indexArrayLeft = exrInfo["LeftBicep"].index;

      for (let i = 0; i < 3; i += 1) {
        rightArm.push({
          x: position[indexArrayRight[i]].x * width,
          y: position[indexArrayRight[i]].y * height,
        });
      }

      for (let i = 0; i < 3; i += 1) {
        leftArm.push({
          x: position[indexArrayLeft[i]].x * width,
          y: position[indexArrayLeft[i]].y * height,
        });
      }

      rightArmAngle = Math.round(angleBetweenThreePoints(rightArm));
      leftArmAngle = Math.round(angleBetweenThreePoints(leftArm));

      // Count reps
      //0 is down, 1 is up
      if (rightArmAngle > exrInfo["RightBicep"].ul) {
        if (rightDir === 0) {
          rightDir = 1;
        }
      }

      if (leftArmAngle > exrInfo["LeftBicep"].ul) {
        if (LeftDir === 0) {
          //   console.log(LeftArmCount, " ", LeftDir, " decrement ", leftArmAngle);
          LeftDir = 1;
        }
      }

      if (rightArmAngle < exrInfo["RightBicep"].ll) {
        if (rightDir === 1) {
          RightArmCount = RightArmCount + 1;
          //   console.log(RightArmCount, " ", rightDir, " increment ", rightArmAngle);
          rightDir = 0;
        }
      }

      if (leftArmAngle < exrInfo["LeftBicep"].ll) {
        if (LeftDir === 1) {
          LeftArmCount = LeftArmCount + 1;
          //   console.log(RightArmCount, " ", rightDir, " increment ", rightArmAngle);
          LeftDir = 0;
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
        canvasCtx.moveTo(rightArm[i].x, rightArm[i].y);
        canvasCtx.lineTo(rightArm[i + 1].x, rightArm[i + 1].y);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "yellow";
        canvasCtx.stroke();
      }

      for (let i = 0; i < 2; i++) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(leftArm[i].x, leftArm[i].y);
        canvasCtx.lineTo(leftArm[i + 1].x, leftArm[i + 1].y);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "yellow";
        canvasCtx.stroke();
      }

      for (let i = 0; i < 3; i++) {
        canvasCtx.beginPath();
        canvasCtx.arc(rightArm[i].x, rightArm[i].y, 5, 0, Math.PI * 2);
        canvasCtx.fillStyle = "white";
        canvasCtx.fill();
      }

      for (let i = 0; i < 3; i++) {
        canvasCtx.beginPath();
        canvasCtx.arc(leftArm[i].x, leftArm[i].y, 5, 0, Math.PI * 2);
        canvasCtx.fillStyle = "white";
        canvasCtx.fill();
      }

      canvasCtx.font = "25px roboto";
      canvasCtx.fillText(rightArmAngle, rightArm[1].x + 10, rightArm[1].y + 40);
      canvasCtx.fillText(leftArmAngle, leftArm[1].x + 10, leftArm[1].y + 40);

      canvasCtx.restore();
    }
  }

  useEffect(() => {
    console.log("rendered");
    rightDir = 0;
    LeftDir = 0;

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

    if (typeof webcamRef.current !== undefined && webcamRef.current !== null) {
      camera.current = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          RightCountTextbox.current.value = RightArmCount;
          LeftCountTextbox.current.value = LeftArmCount;

          await pose.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.current.start();
    }
    return () => {
      if (camera.current) {
        // camera.curreny.stop();
        webcamRef.current = undefined;
        camera.current = null;
      }
      if (pose.current) {
        pose.current.close();
        pose.current = null;
      }
    };
  }, []);

  function resetCount() {
    RightArmCount = 0;
    LeftArmCount = 0;
    rightDir = 0;
    LeftDir = 0;
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
          ref={RightCountTextbox}
          value={RightArmCount}
          textAlign="center"
          style={{ fontSize: 40, width: 50 }}
        />

        <input
          variant="filled"
          ref={LeftCountTextbox}
          value={LeftArmCount}
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
};

export default DoubleBicepCurl;
