import { IAudioRef } from "@types/audio.interfaces";
import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Audio, AudioAnalyser, AudioListener, AudioLoader } from "three";

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
  const [file, setFile] = useState();

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
    <div className="absolute bottom-0 left-0">
      <input
        type="file"
        name=""
        id=""
        onChange={(e) => {
          if (file) {
            setFile(undefined);
          }
          if (e.target.files[0])
            setFile(URL.createObjectURL(e.target.files[0]));
        }}
      />
    </div>
  );
};

export const AudioComps = forwardRef(AudioControllers);
