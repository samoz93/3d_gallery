export interface IAudioRef {
  getAvgFrequency(): number;
  getAudioData(): Uint8Array;
  play(): void;
  stop(): void;
}
