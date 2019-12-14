import CubeBox from "./cube-box";

import { ControlValues, HashStorage } from "./cube-box/control-values";

const audioContext = new AudioContext();
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const cubeBox = new CubeBox(canvas, audioContext);
const hashStorage = new HashStorage();

const sel = (a: string): HTMLInputElement => document.querySelector(a);

function draw(now: number) {
  cubeBox.tick(now);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

const slider = (s: string, onInput: Function, onChange: Function) => {
  const elem = sel(s);
  elem.addEventListener("change", onInput as any, false);
  elem.addEventListener("input", onChange as any, false);
};

const sl = (name: string, onInput: Function, onChange: Function) => {
  slider(
    `input[name='${name}']`,
    function(this: HTMLInputElement) {
      onInput(this.value);
    },
    function(this: HTMLInputElement) {
      onChange(this.value);
    }
  );
};

const ss = (name: string, onInput: Function, onChange: Function) => {
  slider(
    `select[name='${name}']`,
    function(this: HTMLInputElement) {
      onInput(this.value);
    },
    function(this: HTMLInputElement) {
      onChange(this.value);
    }
  );
};

const sc = (name: string, onInput: Function, onChange: Function) => {
  slider(
    `input[name='${name}']`,
    function(this: HTMLInputElement) {
      onInput(this.checked);
    },
    function(this: HTMLInputElement) {
      onChange(this.checked);
    }
  );
};

sl(
  "masterGain",
  (e: string) => hashStorage.update({ masterGain: e }),
  (e: string) => cubeBox.audioEngine.setMasterGain(e)
);

sl(
  "setMasterFilterValue",
  (e: string) => hashStorage.update({ setMasterFilterValue: e }),
  (e: string) => cubeBox.audioEngine.setMasterFilterValue(e)
);

sc(
  "masterControlState",
  (e: boolean) => {
    cubeBox.masterControlState = e;
    hashStorage.update({ masterControlState: e });
  },
  () => {}
);

sl(
  "chordOctave",
  (e: number) => hashStorage.update({ chordOctave: e }),
  (e: number) => (cubeBox.chordOctave = e)
);

sl(
  "setDecayTime",
  (e: number) => hashStorage.update({ setDecayTime: e }),
  (e: number) => cubeBox.compositionEngine.setDecayTime(e.toString())
);
sl(
  "filterEnvelopeQ",
  (e: number) => hashStorage.update({ filterEnvelopeQ: e }),
  (e: number) => (cubeBox.audioEngine.filterEnvelopeQ = e)
);

sl(
  "detune",
  (e: number) => hashStorage.update({ detune: e }),
  (e: number) => (cubeBox.compositionEngine.detune = e)
);

sl(
  "setFilterEnvelopeStartFrequency",
  (e: number) => hashStorage.update({ setFilterEnvelopeStartFrequency: e }),
  (e: number) =>
    cubeBox.audioEngine.setFilterEnvelopeStartFrequency(e.toString())
);

ss(
  "lfoWave",
  (e: string) => hashStorage.update({ lfoWave: e }),
  (e: string) => (cubeBox.audioEngine.lfoWave = e)
);

sl(
  "amplitudeAttack",
  (e: string) => hashStorage.update({ amplitudeAttack: parseFloat(e) }),
  (e: string) => (cubeBox.audioEngine.amplitudeAttack = parseFloat(e))
);

sl(
  "setFilterEnvelopeSustain",
  (e: number) => hashStorage.update({ setFilterEnvelopeSustain: e }),
  (e: number) => cubeBox.audioEngine.setFilterEnvelopeSustain(e.toString())
);

ss(
  "oscialltorType",
  (e: string) => hashStorage.update({ oscialltorType: e }),
  (e: string) => (cubeBox.compositionEngine.oscialltorType = e)
);

ss(
  "scale",
  (e: string) => hashStorage.update({ scale: e }),
  (e: string) => (cubeBox.scale = e)
);

ss(
  "setBlendMode",
  (e: string) => hashStorage.update({ setBlendMode: e }),
  (e: string) => cubeBox.graphicsEngine.setBlendMode(e)
);

sl(
  "lfoAmount",
  (e: number) => hashStorage.update({ lfoAmount: e }),
  (e: number) => (cubeBox.audioEngine.lfoAmount = e)
);

sl(
  "amplitudeRelease",
  (e: number) => hashStorage.update({ amplitudeRelease: e }),
  (e: number) => (cubeBox.audioEngine.amplitudeRelease = e)
);

sl(
  "swipeFrequency",
  (e: number) => hashStorage.update({ swipeFrequency: e }),
  (e: number) => (cubeBox.swipeFrequency = e)
);

sl(
  "swipeOctave",
  (e: number) => hashStorage.update({ swipeOctave: e }),
  (e: number) => (cubeBox.swipeOctave = e)
);

sl(
  "chordVelocity",
  (e: number) => hashStorage.update({ chordVelocity: e }),
  (e: number) => (cubeBox.chordVelocity = e)
);

sl(
  "swipeVelocity",
  (e: number) => hashStorage.update({ swipeVelocity: e }),
  (e: number) => (cubeBox.swipeVelocity = e)
);

sc(
  "sustain",
  (e: boolean) => hashStorage.update({ sustain: e }),
  (e: boolean) => (cubeBox.audioEngine.sustain = e)
);

sl(
  "setLfoFrequency",
  (e: string) => hashStorage.update({ setLfoFrequency: e }),
  (e: string) => cubeBox.audioEngine.setLfoFrequency(e)
);

sc(
  "hide",
  (e: boolean) => {
    debugger;
    sel(".settingsBar").hidden = true;
  },
  (e: boolean) => (cubeBox.audioEngine.sustain = e)
);

sel("input[name='hide']").addEventListener("change", () => {
  document
    .querySelectorAll(".settingsBar > div")
    .forEach((e: HTMLElement) => (e.style.display = "none"));
  (document.querySelector(
    ".settingsBar > div:nth-child(1)"
  ) as HTMLElement).style.display = "block";
});

sel("input[name='show']").addEventListener("change", () => {
  document
    .querySelectorAll(".settingsBar > div")
    .forEach((e: HTMLElement) => (e.style.display = "block"));
  (document.querySelector(
    ".settingsBar > div:nth-child(1)"
  ) as HTMLElement).style.display = "none";
});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

sc(
  "fullscreen",
  (e: boolean) => {
    toggleFullScreen();
  },
  (e: boolean) => {}
);

sel("input[name='fullscreen']").addEventListener("change", () => {
  document
    .querySelectorAll(".settingsBar > div")
    .forEach((e: HTMLElement) => (e.style.display = "none"));
  (document.querySelector(
    ".settingsBar > div:nth-child(1)"
  ) as HTMLElement).style.display = "block";
});

const route = (state: ControlValues) => {
  cubeBox.audioEngine.setMasterGain(state.masterGain);
  sel("input[name='masterGain']").value = state.masterGain;

  cubeBox.audioEngine.setMasterFilterValue(state.setMasterFilterValue);
  sel("input[name='setMasterFilterValue']").value = state.setMasterFilterValue;

  cubeBox.masterControlState = state.masterControlState;
  sel("input[name='masterControlState']").checked = state.masterControlState;

  cubeBox.compositionEngine.setDecayTime(state.setDecayTime);
  sel("input[name='setDecayTime']").value = state.setDecayTime;

  cubeBox.chordOctave = state.chordOctave;
  sel("input[name='chordOctave']").value = state.chordOctave.toString();

  cubeBox.audioEngine.setLfoFrequency(state.setLfoFrequency);
  sel("input[name='setLfoFrequency']").value = state.setLfoFrequency;

  cubeBox.audioEngine.filterEnvelopeQ = state.filterEnvelopeQ;
  sel("input[name='filterEnvelopeQ']").value = state.filterEnvelopeQ.toString();

  cubeBox.compositionEngine.detune = state.detune;
  sel("input[name='detune']").value = state.detune.toString();

  cubeBox.audioEngine.setFilterEnvelopeStartFrequency(
    state.setFilterEnvelopeStartFrequency
  );
  sel("input[name='setFilterEnvelopeStartFrequency']").value =
    state.setFilterEnvelopeStartFrequency;

  cubeBox.audioEngine.lfoWave = state.lfoWave;
  sel("select[name='lfoWave']").value = state.lfoWave;

  cubeBox.audioEngine.amplitudeAttack = state.amplitudeAttack;
  sel("input[name='amplitudeAttack']").value = state.amplitudeAttack.toString();

  cubeBox.audioEngine.setFilterEnvelopeSustain(state.setFilterEnvelopeSustain);
  sel(
    "input[name='setFilterEnvelopeSustain']"
  ).value = state.setFilterEnvelopeSustain.toString();

  cubeBox.compositionEngine.oscialltorType = state.oscialltorType;
  sel("select[name='oscialltorType']").value = state.oscialltorType;

  cubeBox.scale = state.scale;
  sel("select[name='scale']").value = state.scale;

  cubeBox.graphicsEngine.setBlendMode(state.setBlendMode);
  sel("select[name='setBlendMode']").value = state.setBlendMode;

  cubeBox.audioEngine.lfoAmount = state.lfoAmount;
  sel("input[name='lfoAmount']").value = state.lfoAmount.toString();

  cubeBox.audioEngine.amplitudeRelease = state.amplitudeRelease;
  sel(
    "input[name='amplitudeRelease']"
  ).value = state.amplitudeRelease.toString();

  cubeBox.swipeFrequency = state.swipeFrequency;
  sel("input[name='swipeFrequency']").value = state.swipeFrequency.toString();

  cubeBox.swipeOctave = state.swipeOctave;
  sel("input[name='swipeOctave']").value = state.swipeOctave.toString();

  cubeBox.chordVelocity = state.chordVelocity;
  sel("input[name='chordVelocity']").value = state.chordVelocity.toString();

  cubeBox.swipeVelocity = state.swipeVelocity;
  sel("input[name='swipeVelocity']").value = state.swipeVelocity.toString();

  cubeBox.audioEngine.sustain = state.sustain;
  sel("input[name='sustain']").value = state.sustain.toString();
};

// route once on page load
route(hashStorage.state());
window.addEventListener("hashchange", () => route(hashStorage.state()), false);
