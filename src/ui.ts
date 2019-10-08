export default class UI {
  wavePicker: HTMLSelectElement;
  volumeControl: HTMLInputElement;
  masterControl: HTMLInputElement;
  scalePicker: HTMLSelectElement;
  filterControl: HTMLInputElement;
  blendModePicker: HTMLSelectElement;
  decayTime: HTMLInputElement;
  octave: HTMLInputElement;
  lfoFrequency: HTMLInputElement;
  filterEnvelopeQ: HTMLInputElement;
  detune: HTMLInputElement;
  filterEnvelopeStart: HTMLInputElement;
  frequencyModulationAmount: HTMLInputElement;
  amplitudeRelease: HTMLInputElement;

  constructor() {
    this.wavePicker = document.querySelector("select[name='waveform']");
    this.volumeControl = document.querySelector("input[name='volumeControl']");
    this.masterControl = document.querySelector("input[name='masterControl']");
    this.scalePicker = document.querySelector("select[name='scalePicker']");
    this.filterControl = document.querySelector("input[name='filterControl']");
    this.blendModePicker = document.querySelector(
      "select[name='blendModePicker']"
    );
    this.decayTime = document.querySelector("input[name='decayTime']");
    this.octave = document.querySelector("input[name='octave']");
    this.lfoFrequency = document.querySelector("input[name='lfoFrequency']");
    this.filterEnvelopeQ = document.querySelector(
      "input[name='filterEnvelopeQ']"
    );
    this.detune = document.querySelector("input[name='detune']");
    this.filterEnvelopeStart = document.querySelector(
      "input[name='filterEnvelopeStart']"
    );
    this.frequencyModulationAmount = document.querySelector(
      "input[name='frequencyModulationAmount']"
    );
    this.amplitudeRelease = document.querySelector(
      "input[name='frequencyModulationAmount']"
    );
  }

  getElem(kind: string, name: string) {
    document.querySelector(`${kind}[name='${name}']`);
  }

  attach(param: string, callback: Function) {
    (this as any)[param].addEventListener("change", callback, false);
  }

  expon(x: string) {
    // Must be in range 0.0-1.0
    return -Math.sqrt(-parseFloat(x) + 1) + 1;
  }
}
