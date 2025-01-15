import Webcam from "react-webcam";

const videoConstraints: MediaStreamConstraints["video"] = {
  width: 1280,
  height: 720,
  facingMode: "environment",
} as const;

export function WebcamCapture() {
  return (
    <Webcam
      audio={false}
      height={720}
      screenshotFormat="image/jpeg"
      width={1280}
      videoConstraints={videoConstraints}
    ></Webcam>
  );
}
