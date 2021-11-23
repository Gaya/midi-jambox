const midi = require('midi');

const input = new midi.Input();

let bmp = 120;
let beatsPerBar = 4;
let beatUnit = 4;
let currentTick = -1;
let ticksPerBeat = 64;
let lastTick = +new Date();
let startTick = lastTick;

function tickClock(d) {
  const delta = d - startTick;
  const tickInterval = (60000 * 4) / beatUnit / bmp / ticksPerBeat;
  const tick = Math.floor(delta / tickInterval);

  if (tick !== currentTick) {
    currentTick = tick;

    const noteTick = tick % ticksPerBeat;
    const beatTick = Math.floor((tick / ticksPerBeat));
    const beat = beatTick % beatsPerBar;
    const bar = Math.floor(beatTick / beatsPerBar);

    console.log(`tick: ${noteTick} beat: ${beat}, bar: ${bar}`);
  }

  lastTick = d;
}

input.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log(`m: ${message} d: ${deltaTime}`);
});

input.openVirtualPort('Jambox');

input.ignoreTypes(true, false, true);

function loop(f) {
  f(+new Date());
  setImmediate(loop.bind(null, f));
}

loop(tickClock);