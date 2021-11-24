import midi from 'midi';
import WebSocket from 'ws';
import { nanoid } from 'nanoid';

import { JamboxSettings, OutputMessage } from '../types';

const serverPort = parseInt(process.env.SERVER_PORT || '6660', 10);

const midiInput = new midi.Input();
const wss = new WebSocket.Server({ port: serverPort });

// midi clock settings
const settings: JamboxSettings = {
  isRunning: false,
  bpm: 120,
  ticksPerBeat: 64,
  beatsPerBar: 4, // time signature top number
  beatUnit: 4, // time signature bottom number
};

// midi clock state
let currentTick = -1;
let lastTick = +new Date();
let startTick = lastTick;

// websocket state
const clients: { [id: string]: WebSocket } = {};

function calcClockValues() {
  const { isRunning, beatsPerBar, ticksPerBeat } = settings;

  const note = currentTick % ticksPerBeat;
  const beatTick = Math.floor((currentTick / ticksPerBeat));
  const beat = beatTick % beatsPerBar;
  const bar = Math.floor(beatTick / beatsPerBar);

  return {
    note: isRunning ? note : 0,
    beat: isRunning ? beat + 1 : 0,
    bar: isRunning ? bar + 1 : 0,
  };
}

function outputInfo() {
  const { note, beat, bar } = calcClockValues();

  const output: OutputMessage = {
    note,
    beat,
    bar,
    settings,
  };

  const message = JSON.stringify(output);

  Object.values(clients).forEach((c) => c.send(message));
}

function startClock() {
  startTick = +new Date();
  settings.isRunning = true;
}

function stopClock() {
  settings.isRunning = false;
  outputInfo();
}

wss.on('connection', (ws) => {
  const id = nanoid(8);
  clients[id] = ws;

  // eslint-disable-next-line no-console
  console.info(`Client (${id}) connected`);

  ws.on('message', (rawData) => {
    try {
      const data = JSON.parse(rawData.toString());

      switch (data.type) {
        case 'START':
          startClock();
          break;
        case 'STOP':
          stopClock();
          break;
        default:
          // eslint-disable-next-line no-console
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (e) {
      // silent error
    }
  });

  ws.on('close', () => {
    // eslint-disable-next-line no-console
    console.info(`Client (${id}) disconnected`);

    delete clients[id];
  });

  outputInfo();
});

function tickClock(d: number) {
  const {
    bpm,
    beatUnit,
    ticksPerBeat,
    isRunning,
  } = settings;

  if (!isRunning) {
    return;
  }

  const delta = d - startTick;
  const tickInterval = (60000 * 4) / beatUnit / bpm / ticksPerBeat;
  const tick = Math.floor(delta / tickInterval);

  if (tick !== currentTick) {
    currentTick = tick;

    outputInfo();
  }

  lastTick = d;
}

midiInput.on('message', (deltaTime: number, message: string) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log(`m: ${message} d: ${deltaTime}`);
});

midiInput.openVirtualPort('Jambox');

midiInput.ignoreTypes(true, false, true);

function loop(f: (t: number) => void) {
  f(+new Date());
  setImmediate(loop.bind(null, f));
}

loop(tickClock);
