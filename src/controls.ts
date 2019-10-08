class Controls {
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

  private attached: string[];
  constructor() {
    this.blendModePicker = <HTMLSelectElement>(
      this.elem("select", "blendModePicker")
    );
    this.wavePicker = <HTMLSelectElement>this.elem("select", "waveform");
    this.scalePicker = <HTMLSelectElement>this.elem("select", "scalePicker");
    this.volumeControl = <HTMLInputElement>this.elem("input", "volumeControl");
    this.masterControl = <HTMLInputElement>this.elem("input", "masterControl");
    this.filterControl = <HTMLInputElement>this.elem("input", "filterControl");
    this.decayTime = <HTMLInputElement>this.elem("input", "decayTime");
    this.octave = <HTMLInputElement>this.elem("input", "octave");
    this.lfoFrequency = <HTMLInputElement>this.elem("input", "lfoFrequency");
    this.filterEnvelopeQ = <HTMLInputElement>(
      this.elem("input", "filterEnvelopeQ")
    );
    this.detune = <HTMLInputElement>this.elem("input", "detune");
    this.filterEnvelopeStart = <HTMLInputElement>(
      this.elem("input", "filterEnvelopeStart")
    );
    this.frequencyModulationAmount = <HTMLInputElement>(
      this.elem("input", "frequencyModulationAmount")
    );
    this.amplitudeRelease = <HTMLInputElement>(
      this.elem("input", "frequencyModulationAmount")
    );

    this.attached = ["scalePicker"];
  }

  elem(kind: string, name: string) {
    return document.querySelector(`${kind}[name='${name}']`);
  }

  attach(param: string, callback: Function) {
    this.attached.push(param);
    (this as any)[param].addEventListener("change", callback, false);
  }

  validate() {
    const foo = [...this.difference(Object.keys(this), this.attached)];
    if (!(foo.length === 1 && foo[0] === "attached")) {
      throw `unhooked up controls ${foo}`;
    }
  }

  difference(setA: string[], setB: string[]) {
    const _difference = new Set(setA);
    for (var elem of setB) {
      _difference.delete(elem);
    }
    return _difference;
  }
}

export default new Controls();
