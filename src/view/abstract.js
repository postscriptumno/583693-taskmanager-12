import {createElement} from "../utils/render.js";

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`It's an abstract class, can't initiate`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
