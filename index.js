const midi = require('midi');
const WebSocket = require('ws');
const { nanoid } = require('nanoid');

const serverPort = parseInt(process.env.SERVER_PORT || '6660', 10);

const midiInput = new midi.Input();
const wss = new WebSocket.Server({ port: serverPort });

// midi clock settings
let settings = {
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

wss.on('connection', (ws) => {
  const id = nanoid(8);
  clients[id] = ws;

  console.log(`Client (${id}) connected`);

  ws.on('close', () => {
    console.log(`Client (${id}) disconnected`);

    delete clients[id];
  });
});

function tickClock(d) {
  const { bpm, beatsPerBar, beatUnit, ticksPerBeat } = settings;

  const delta = d - startTick;
  const tickInterval = (60000 * 4) / beatUnit / bpm / ticksPerBeat;
  const tick = Math.floor(delta / tickInterval);

  if (tick !== currentTick) {
    currentTick = tick;

    const noteTick = currentTick % ticksPerBeat;
    const beatTick = Math.floor((currentTick / ticksPerBeat));
    const beat = beatTick % beatsPerBar;
    const bar = Math.floor(beatTick / beatsPerBar);

    outputInfo({ note: noteTick + 1, beat: beat + 1, bar: bar + 1 });
  }

  lastTick = d;
}

function outputInfo({ note, beat, bar }) {
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