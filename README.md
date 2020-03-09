# midi2key
Translate incoming MIDI messages to keypress, ***Windows only***

# How to
1. Install [AutoHotkey](https://www.autohotkey.com/)
2. Install [NodeJS](https://nodejs.org/en/)
3. Install node-gyp following [this instruction](https://github.com/nodejs/node-gyp#installation)
4. Clone this repo by `git clone https://github.com/peter-pakanun/midi2key.git`
5. Change directory by `cd midi2key`
6. Install dependencies by `npm install`
7. Edit keymap and input device in index.js file (default keymap is for DJMax Respect V)
8. Start the script by `node .`

# Known Issues
* Weird behavior when pressing keys in rapid succession
