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
  }
}
