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

const audioOptions = ["Best Time", "Electra", "Satar"];

const AudioControllers = (
  {
    onVersionChanged,
  }: {
    onVersionChanged?: (version: number) => void;
  },
  ref: Ref<IAudioRef>
) => {
  const [file, setFile] = useState("");
  const [version, setVersion] = useState(1);
  const [progress, setProgress] = useState(-1);

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

  const listener = useRef(new AudioListener());
  const sound = useRef<Audio>();
  const loader = useRef(new AudioLoader());
  const analyser = useRef<AudioAnalyser>();
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    if (!sound.current) return;
    const isPlaying = sound.current?.isPlaying || false;
    isPlaying ? sound.current?.pause() : sound.current?.play();
    setIsPlaying(!isPlaying);
  };

  const toggleVersion = () => {
    setVersion((ver) => (ver === 1 ? 2 : 1));
  };

  useEffect(() => {
    onVersionChanged && onVersionChanged(version);
  }, [version, onVersionChanged]);

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
        sound.current?.play();
        setProgress(-1);
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

      {!!file && (
        <StaticButton
          //@ts-ignore
          component="label"
          variant="contained"
          endIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
          onClick={toggle}
        >
          {isPlaying ? "Pause" : "Play"}
        </StaticButton>
      )}

      <StaticButton
        //@ts-ignore
        component="label"
        variant="contained"
        onClick={toggleVersion}
      >
        {`toggle version :${version}`}
      </StaticButton>
      {progress > -1 && <h1>{Math.round(progress * 100)}%</h1>}
    </div>
  );
};

export const AudioComps = forwardRef(AudioControllers);
