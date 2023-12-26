export const useAudioCtx = (): AudioContext => {
  let audioCtx: AudioContext;

  const getAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  };

  return audioCtx || getAudio();
};
