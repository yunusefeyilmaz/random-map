export class Controller {
    constructor(id, controlValues) {
      this.element = document.getElementById(id);
      this.controlValues = controlValues;
    }
    addEventListener() {
      this.element.addEventListener("change", this.controlValues);
    }
}
