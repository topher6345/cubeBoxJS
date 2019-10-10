type Inputs = {
  elem: HTMLElement;
  type: string;
  min: number;
  max: number;
  step: number;
  value: number;
};

class ControlType {
  static createSlider(inputs: Inputs): HTMLInputElement {
    const { elem, type, min, max, step, value } = inputs;
    const slider = <HTMLInputElement>document.createElement(type);
    elem.appendChild(slider);
    slider.setAttribute("min", min.toString());
    slider.setAttribute("max", max.toString());
    slider.setAttribute("step", step.toString());
    slider.setAttribute("value", value.toString());
    return slider;
  }
}

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
  private document: HTMLDocument;

  constructor(document: HTMLDocument) {
    this.document = document;
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

    this.attached = ["scalePicker", "document"];
  }

  attach(param: string, callback: Function) {
    this.attached.push(param);
    try {
      (this as any)[param].addEventListener("change", callback, false);
    } catch (e) {
      throw `
      Error: 
        Expected DOM to have an HTML Element with name=${param}.
      Ex. 
        <span>{param}</span>
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.01"
          value="0.5"
          name="${param}"
        />

      Original Exception: 
        ${e}
      `;
    }
  }

  validate() {
    const foo = [...this.difference(Object.keys(this), this.attached)];
    if (!(foo.length === 1 && foo[0] === "attached")) {
      throw `unhooked up controls ${foo}`;
    }
  }

  private elem(kind: string, name: string): HTMLElement {
    return this.document.querySelector(`${kind}[name='${name}']`);
  }

  private difference(setA: string[], setB: string[]) {
    const _difference = new Set(setA);
    for (var elem of setB) {
      _difference.delete(elem);
    }
    return _difference;
  }
}

export default Controls;
