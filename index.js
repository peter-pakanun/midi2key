const midi = require('midi');
const spawn = require('child_process').spawn;
const fs = require('fs');

// --------------------------------
const OUTPUT_TO_CONSOLE = true;
const KEY_MAP = {
  "Keystation 88": {
    30: 's',
    32: 'd',
    34: 'f',
    36: 'v',
    40: 'n',
    42: 'j',
    44: 'k',
    46: 'l'
  },
  "MIDIIN2 (Keystation 88)": {
    93: 'Escape',
    94: 'LShift',
    95: 'RShift',
    96: 'Up',
    97: 'Down',
    98: 'Left',
    99: 'Right',
    100: 'Enter'
  }
}
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

// Setup MIDI Listener
const inputForCheck = new midi.Input();
const portCount = inputForCheck.getPortCount();
for (let i = 0; i < portCount; i++) {
  let portName = inputForCheck.getPortName(i).split(' ').slice(0, -1).join(' ');
  if (OUTPUT_TO_CONSOLE) console.log('Port: ' + portName);

  let input = new midi.Input();
  input.on('message', (deltaTime, message) => {
    onMidiMessage(portName, deltaTime, message);
  });
  input.openPort(i);
}


// set event listener
function onMidiMessage(portName, deltaTime, message) {
  let ch = message[0] & 0b1111;
  let sb = message[0] >> 4 & 0b1111;
  if (sb !== 9) {
    return;
  }

  let note = message[1];
  let vel = message[2];

  if (OUTPUT_TO_CONSOLE && vel > 0) {
    console.log(`[${portName}] Note: ${note}`);
  }
  
  if (!KEY_MAP[portName] || !KEY_MAP[portName][note]) {
    return;
  }

  let key = KEY_MAP[portName][note];
  ahk.stdin.write(`{${key} ${vel > 0 ? 'Down' : 'Up'}}\n`);
};