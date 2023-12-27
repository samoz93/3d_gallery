export const useAudioCtx = (): AudioContext => {
  let audioCtx: AudioContext;

  const getAudio = () => {
    if (!audioCtx) {
      //@ts-ignore
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  };
  // @ts-ignore
  return audioCtx || getAudio();
};
