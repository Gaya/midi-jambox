export interface JamboxSettings {
  isRunning: boolean;
  bpm: number;
  ticksPerBeat: 1 | 2 | 4 | 8 | 16 | 32 | 64;
  beatsPerBar: number;
  beatUnit: 1 | 2 | 4 | 8 | 16 | 32 | 64;
}

export interface OutputMessage {
  note: number;
  beat: number;
  bar: number;
  settings: JamboxSettings;
}

interface WEBSOCKET_START {
  type: 'START';
}

interface WEBSOCKET_STOP {
  type: 'STOP';
}

export type WEBSOCKET_MSG = WEBSOCKET_START | WEBSOCKET_STOP;
