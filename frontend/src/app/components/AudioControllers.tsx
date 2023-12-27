"use client";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

  const listener = useRef(new AudioListener());
  const sound = useRef<Audio>();
  const loader = useRef(new AudioLoader());
  const analyser = useRef<AudioAnalyser>();

  useEffect(() => {
    sound.current?.stop();
    if (!file) return;
    sound.current = new Audio(listener.current);
    analyser.current = new AudioAnalyser(sound.current, 1024);

    loader.current.load(file, function (buffer) {
      console.log(buffer);
      sound.current?.setBuffer(buffer);
      sound.current?.setLoop(true);
      sound.current?.setVolume(0.1);
      sound.current?.play();
    });

    return () => {
      sound.current?.stop();
    };
  }, [file]);

  return (
    <div className="absolute bottom-0 left-0 flex flex-row ml-5 my-2 gap-5 h-12">
      <FancySelect
        onItemSelected={(e) => {
          setFile(`/audio/${e}.mp3`);
        }}
        options={audioOptions}
      />
      <StaticButton
        component="label"
        variant="contained"
        endIcon={<CloudUploadIcon />}
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
    </div>
  );
};

export const AudioComps = forwardRef(AudioControllers);
