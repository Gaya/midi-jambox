const midi = require('midi');
const WebSocket = require('ws');
const { nanoid } = require('nanoid');

const serverPort = parseInt(process.env.SERVER_PORT || '6660', 10);

const midiInput = new midi.Input();
const wss = new WebSocket.Server({ port: serverPort });

// midi clock settings
let settings = {
  isRunning: false,
  bpm: 120,
  ticksPerBeat: 64,
  beatsPerBar: 4, // time signature top number
  beatUnit: 4,    // time signature bottom number
};

// midi clock state
let currentTick = -1;
let lastTick = +new Date();
let startTick = lastTick;

// websocket state
let clients = {};

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

  console.log(`Client (${id}) connected`);

  ws.on('message', (rawData) => {
    try {
      const data = JSON.parse(rawData);

      switch (data.type) {
        case 'START':
          startClock();
          break;
        case 'STOP':
          stopClock();
          break;
      }
    } catch (e) {
      // silent error
    }
  });

  ws.on('close', () => {
    console.log(`Client (${id}) disconnected`);

    delete clients[id];
  });

  outputInfo();
});

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

function tickClock(d) {
  const { bpm, beatUnit, ticksPerBeat, isRunning } = settings;

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

function outputInfo() {
  const { note, beat, bar } = calcClockValues();

  Object.values(clients).forEach((c) => {
    c.send(JSON.stringify({ note, beat, bar, settings }));
  });
}

midiInput.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log(`m: ${message} d: ${deltaTime}`);
});

midiInput.openVirtualPort('Jambox');

midiInput.ignoreTypes(true, false, true);

function loop(f) {
  f(+new Date());
  setImmediate(loop.bind(null, f));
}

loop(tickClock);