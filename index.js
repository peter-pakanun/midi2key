const midi = require('midi');
const spawn = require('child_process').spawn;
const fs = require('fs');

// --------------------------------
const OUTPUT_TO_CONSOLE = true;
const INPUT_PORT = "Keystation 88";
const KEY_MAP = [
  { note: 30, key: 's' },
  { note: 32, key: 'd' },
  { note: 34, key: 'f' },
  { note: 36, key: 'v' },
  { note: 40, key: 'n' },
  { note: 42, key: 'j' },
  { note: 44, key: 'k' },
  { note: 46, key: 'l' },

  { note: 35, key: 'left' },
  { note: 37, key: 'up' },
  { note: 38, key: 'enter' },
  { note: 39, key: 'down' },
  { note: 41, key: 'right' },
];
const AHKEXE = process.env.ProgramFiles + "\\AutoHotkey\\AutoHotkey.exe";
// --------------------------------

// AHK
if (!fs.existsSync(AHKEXE)) {
  console.error("AutoHotkey not found, download at https://www.autohotkey.com/");
  process.exit();
}
const ahk = spawn(AHKEXE, [`sendkey.ahk`]);
ahk.on('close', (code) => {
  console.error(`child process exited with code ${code}`);
  process.exit();
});

// MIDI
const input = new midi.Input();
const portCount = input.getPortCount();

let portNum = -1;
for (let i = 0; i < portCount; i++) {
  let name = input.getPortName(i);
  if (OUTPUT_TO_CONSOLE) console.log('Port: ' + name);
  
  if (name === INPUT_PORT + " " + i) {
    portNum = i;
    break;
  }
}
if (portNum == -1) {
  console.error(`Port ${INPUT_PORT} not found`);
  process.exit();
}


// set event listener
input.on('message', (deltaTime, message) => {
  let ch = message[0] & 0b1111;
  let sb = message[0] >> 4 & 0b1111;
  if (sb !== 9) {
    return;
  }

  let note = message[1];
  let vel = message[2];
  
  let map = KEY_MAP.find((val) => val.note == note);
  if (map) {
    ahk.stdin.write(`{${map.key} ${vel > 0 ? 'Down' : 'Up'}}\n`);
  }

  if (OUTPUT_TO_CONSOLE) {
    console.log(`Note ${vel > 0 ? 'on' : 'off'}: ${note}`);
  }
});
// Start MIDI
input.openPort(portNum);