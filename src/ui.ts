export default class UI {
  public wavePicker: HTMLSelectElement;
  public volumeControl: HTMLInputElement;
  public masterControl: HTMLInputElement;
  public scalePicker: HTMLSelectElement;
  public filterControl: HTMLInputElement;
  public blendModePicker: HTMLSelectElement;
  public decayTime: HTMLInputElement;
  public octave: HTMLInputElement;
  public lfoFrequency: HTMLInputElement;
  public filterEnvelopeQ: HTMLInputElement;
  public detune: HTMLInputElement;
  public filterEnvelopeStart: HTMLInputElement;

  constructor() {
    this.wavePicker = <HTMLSelectElement>(
      document.querySelector("select[name='waveform']")
    );

    this.volumeControl = <HTMLInputElement>(
      document.querySelector("input[name='volumeControl']")
    );

    this.masterControl = <HTMLInputElement>(
      document.querySelector("input[name='masterControl']")
    );

    this.scalePicker = <HTMLSelectElement>(
      document.querySelector("select[name='scalePicker']")
    );

    this.filterControl = <HTMLInputElement>(
      document.querySelector("input[name='filterControl']")
    );

    this.blendModePicker = <HTMLSelectElement>(
      document.querySelector("select[name='blendModePicker']")
    );

    this.decayTime = <HTMLInputElement>(
      document.querySelector("input[name='decayTime']")
    );

    this.octave = <HTMLInputElement>(
      document.querySelector("input[name='octave']")
    );

    this.lfoFrequency = <HTMLInputElement>(
      document.querySelector("input[name='lfoFrequency']")
    );

    this.filterEnvelopeQ = <HTMLInputElement>(
      document.querySelector("input[name='filterEnvelopeQ']")
    );

    this.detune = <HTMLInputElement>(
      document.querySelector("input[name='detune']")
    );

    this.filterEnvelopeStart = <HTMLInputElement>(
      document.querySelector("input[name='filterEnvelopeStart']")
    );
  }

  attach(param: string, callback: Function) {
    (this as any)[param].addEventListener("change", callback, false);
  }

  expon(x: string) {
    // Must be in range 0.0-1.0
    return -Math.sqrt(-parseFloat(x) + 1) + 1;
  }
}
