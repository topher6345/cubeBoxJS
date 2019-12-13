# CubeBoxJS

A music box.

See colors blend as you hear the tones harmonize.

Typescript + WebAudio + Canvas rewrite of https://github.com/topher6345/maxmsp-CubeBox

(Not really cubes but squares)

## Getting Started

- `npm i`
- `npm run start`

## How it draws animation and plays sounds

`CubeBox` class is responsible for drawing to the screen and playing the sounds

It uses the following Browser API's

- requestAnimationFrame
- Web Audio API
- Canvas API

### requestAnimationFrame

`draw()` is called at 60fps by the browser

`draw()` calls `cubeBox.tick()` which draws a frame to the canvas

`cubeBox.tick()` calls the private method `cubeBox.play()` at the `chordSpeed` interval

`cubeBox.play()` plays sounds and visual events in sync

`cubeBox.play()` plays the `chordVoices` then the `swipeVoices` localed on the right and left sides of the screen respectivley

`compositionEngine.notePressed()` calls `audioEngine.playTone()` to make the sounds

### Web Audio API

`audioEngine.playTone()` designs the sound by scheduling events with `OscillatorNode`, `BiquadFilterNode`, and `Gain`.

the `CompositionEngine` has two properties `chordVoices` and `swipeVoices`, which are arrays of generators.

The generators yield a number between 0 and 7 every time `next()` is called - this is the note that is played both visually and audibly

`urnJb` creates a shuffled array of numbers between 0 and 7 and yeilds each number in the array.
at the end of iterating through the array, the array is shuffled again and the iteration starts over

### Canvas API

`compositionEngine.notePressed()` from before also calls the `GraphicsEngine` to draw to the canvas

`GraphicsEngine` orchestrates `Square` objects to draw themselves to the canvas

`Square` has two public methods `draw()` and `play()`

`draw()` uses `CanvasRenderingContext2D.fillRect` and sets the `fillStyle` property with colors and a fade out effect using the alpha channel of the `rgba()` style

`play()` updates the `alpha` property to be bright again

the colors are chosen by the composer Alexander Scriabin:
https://en.wikipedia.org/wiki/Clavier_%C3%A0_lumi%C3%A8res

`GraphicsEngine` has an property for blend mode, which can drastically change how the animation looks

## How the sliders and menus are hooked up

* TODO: explain hash
* 
