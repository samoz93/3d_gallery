"use client";

import PauseIcon from "@mui/icons-material/Pause";
import PlayIcon from "@mui/icons-material/PlayCircle";
import UploadIcon from "@mui/icons-material/Upload";
import { styled } from "@mui/material/styles";
import { IAudioRef } from "@types";
import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Audio, AudioAnalyser, AudioListener, AudioLoader } from "three";
import { FancySelect } from "./FancySelect";
import { StaticButton } from "./StaticButton";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const audioOptions = ["Best Time", "Electro", "Satara"];

const AudioControllers = (props: any, ref: Ref<IAudioRef>) => {
  useImperativeHandle(
    ref,
    () => ({
      getAvgFrequency: () => analyser.current?.getAverageFrequency() ?? 0,
      getAudioData: () =>
        analyser.current?.getFrequencyData() ?? new Uint8Array(),
      stop: () => sound.current?.stop(),
      play: () => sound.current?.play(),
    }),
    []
  );

  const [file, setFile] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(-1);

  const listener = useRef(new AudioListener());
  const sound = useRef<Audio>();
  const loader = useRef(new AudioLoader());
  const analyser = useRef<AudioAnalyser>();

  const toggle = () => {
    const isPlaying = sound.current?.isPlaying ?? false;
    setIsPlaying(!isPlaying);
    sound.current?.isPlaying ? sound.current?.pause() : sound.current?.play();
  };

  useEffect(() => {
    if (isPlaying) {
      sound.current?.play();
    } else {
      sound.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    sound.current?.stop();
    if (!file) return;
    sound.current = new Audio(listener.current);
    analyser.current = new AudioAnalyser(sound.current, 1024);

    loader.current.load(
      file,
      function (buffer) {
        sound.current?.setBuffer(buffer);
        sound.current?.setLoop(true);
        sound.current?.setVolume(0.1);
        setProgress(-1);
        setIsPlaying(true);
      },
      (pr) => {
        setProgress(pr.loaded / pr.total);
      }
    );

    return () => {
      sound.current?.stop();
    };
  }, [file]);

  return (
    <div className="absolute bottom-0 left-0 flex-row ml-5 my-2 gap-5 h-12 flex items-center">
      <FancySelect
        onItemSelected={(e) => {
          setFile(`/audio/${e}.mp3`);
        }}
        options={audioOptions}
      />
      <StaticButton
        //@ts-ignore
        component="label"
        variant="contained"
        endIcon={<UploadIcon />}
      >
        <p>Upload file</p>
        <VisuallyHiddenInput
          type="file"
          onChange={(e) => {
            if (file) {
              setFile("");
            }
            if (e?.target.files && e!.target!.files![0]) {
              const dataSource = URL.createObjectURL(e.target.files[0]!);
              setFile(dataSource);
            }
          }}
        />
      </StaticButton>
      {progress > -1 && <h1>{Math.round(progress * 100)}%</h1>}

      <StaticButton
        //@ts-ignore
        component="label"
        variant="contained"
        endIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
        onClick={toggle}
      >
        {isPlaying ? "Pause" : "Play"}
      </StaticButton>
    </div>
  );
};

export const AudioComps = forwardRef(AudioControllers);
