# CubeBoxJS

(Not really cubes but squares)

Typescript rewrite of https://github.com/topher6345/maxmsp-CubeBox

## Getting Started

- `npm install`
- `npm run watch`
- `gem install serve`
- `serve`

Canvas+WebAudio

`draw()` is recursively calls requestAnimationFrame with itself as an argument

`draw()` calls `cubeBox.tick()` which draws a frame to the canvas

`cubeBox.tick()` calls the private method `cubeBox.play()` at the `chordSpeed` interval

`cubeBox.play()` plays sounds and visual events in sync

`cubeBox.play()` plays the `chordVoices` then the `swipeVoices` localed on the right and left sides of the screen respectivley

`compositionEngine.notePressed()` calls `audioEngine.playTone()` to make the sounds

`audioEngine.playTone()` designs the sound by scheduling events with `OscillatorNode`, `BiquadFilterNode`, and `Gain`.

the `CompositionEngine` has two properties `chordVoices` and `swipeVoices`, which are arrays of generators.

The generators yield a number between 0 and 7 - this is the note that is played both visually and audibly
