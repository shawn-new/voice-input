import React, { useState, useRef, useEffect } from "react";
import { Button, LinearProgress, ButtonGroup } from "@mui/material";
import {
  faMicrophoneLines,
  faStop,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@emotion/react";

const VoiceInput = ({ onRecordEnd }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const [isDeviceError, setIsDeviceError] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    let timerId;

    if (isRecording) {
      timerId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        setRecordDuration(elapsedSeconds);
        setRecordingProgress((elapsedSeconds / 20) * 100);

        if (elapsedSeconds >= 20) {
          stopRecording();
        }
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, [isRecording, startTime]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordedAudio(null);
    setRecordDuration(0);
    setRecordingProgress(0);
    setIsReplaying(false);
    chunksRef.current = [];
    setStartTime(Date.now());

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
          chunksRef.current.push(event.data);
        });

        mediaRecorderRef.current.addEventListener("stop", () => {
          const recordedBlob = new Blob(chunksRef.current, {
            type: "audio/wav",
          });
          setRecordedAudio(recordedBlob);
          onRecordEnd(recordedBlob); // Call the callback function with the recorded blob
        });

        mediaRecorderRef.current.addEventListener("error", () => {
          console.error("Error with media recorder");
          setIsDeviceError(true);
          setIsRecording(false);
        });

        mediaRecorderRef.current.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        setIsRecording(false);
        setIsDeviceError(true);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleReplay = () => {
    if (recordedAudio) {
      setIsReplaying(true);
      const audioElement = new Audio(URL.createObjectURL(recordedAudio));
      audioElement.play();
    }
  };

  const handleTryAgain = () => {
    setRecordedAudio(null);
    setRecordDuration(0);
    setIsDeviceError(false);
  };

  return (
    <div css={styles.container}>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
        css={styles.buttonsContainer}
      >
        <Button
          color="primary"
          onClick={startRecording}
          disabled={isRecording}
          css={styles.button}
        >
          <FontAwesomeIcon
            icon={faMicrophoneLines}
            size="2x"
            beat={isRecording}
          />
        </Button>
        <Button
          color="secondary"
          onClick={stopRecording}
          disabled={!isRecording}
          css={styles.button}
        >
          <FontAwesomeIcon icon={faStop} size="2x" />
        </Button>
        {recordedAudio && (
          <>
            <Button
              color="secondary"
              onClick={handleReplay}
              css={styles.button}
            >
              <FontAwesomeIcon icon={faPlay} size="2x" beat={Boolean(recordedAudio)} />
            </Button>
          </>
        )}
      </ButtonGroup>
      {isRecording && (
        <LinearProgress
          variant="determinate"
          value={recordingProgress}
          css={styles.progressBar}
        />
      )}
      {recordedAudio && <p>Recorded Duration: {recordDuration} seconds</p>}
      {isDeviceError && (
        <div css={styles.error}>
          <p>
            Error accessing microphone. Please check your microphone settings
            and try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  `,
  buttonsContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  `,
  button: css`
    margin: 10px;
  `,
  progressBar: css`
    flex: 1;
    height: 10px;
    border-radius: 5px;
    margin-left: 10px;
  `,
  error: css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  `
};
