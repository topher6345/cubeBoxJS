export default class UI {
  public wavePicker: HTMLSelectElement;
  public volumeControl: HTMLInputElement;
  public masterControl: HTMLInputElement;
  public scalePicker: HTMLSelectElement;
  public filterControl: HTMLInputElement;

  constructor() {
    this.wavePicker = <HTMLSelectElement>(
      document.querySelector("select[name='waveform']")
    );

    this.volumeControl = <HTMLInputElement>(
      document.querySelector("input[name='volume']")
    );

    this.masterControl = <HTMLInputElement>(
      document.querySelector("input[name='masterClock']")
    );

    this.scalePicker = <HTMLSelectElement>(
      document.querySelector("select[name='scale']")
    );

    this.filterControl = <HTMLInputElement>(
      document.querySelector("input[name='filter']")
    );
  }
}
