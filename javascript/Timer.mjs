const templateHTML = `
    <style>
      meter {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0;

        width: 100vw;
        border-radius: 0;
        border: none;
        height: .25rem;
      }

      meter::-moz-meter-bar {
        border-radius: 0;
        border: none;
      }

      meter::-webkit-meter-bar {
        border-radius: 0;
        border: none;
      }

      meter::-webkit-meter-inner-element {
        display: block;
      }
    </style>
    <meter
      min="0" max="100"
      low="33" high="66" optimum="0"
      value="50"></meter>
`;

const errorMessages = {
  TIME_FORMAT_INCORRECT: 'Start time is incorrect',
  TIMER_END_IS_IN_THE_PAST: 'Timer end time in the past',
  NO_DURATION: 'Duration should be a defined',
};

const selectors = {
  template: 'template',
  meter: 'meter',
};

class Timer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    const template = document.createElement('TEMPLATE');
    template.innerHTML = templateHTML;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.meter = this.shadowRoot.querySelector(selectors.meter);
    this.calculate = this.calculate.bind(this);
  }

  static get observedAttributes() { return ['optimum']; }

  connectedCallback() {
    const durationString = this.getAttribute('duration');
    const startsString = this.getAttribute('starts');
    const currentTime = +Date.now();
    const startsTime = +(new Date(startsString));
    if (isNaN(startsTime) && startsString !== null) throw new Error(errorMessages.TIME_FORMAT_INCORRECT);
    const duration = parseInt(durationString);
    if (isNaN(duration)) throw new Error(errorMessages.NO_DURATION);
    if ((startsString !== null) && ((startsTime + duration*60*1000) < currentTime)) throw new Error(errorMessages.TIMER_END_IS_IN_THE_PAST);
    this.startTime = startsTime || currentTime;
    this.duration = duration*60*1000;
    requestAnimationFrame(this.calculate);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.meter.setAttribute(name, newValue);
  }

  calculate() {
    const passed = +Date.now() - this.startTime;
    const percent = Math.max(100*passed/this.duration, 0);
    this.meter.value = percent;
    if (passed < this.duration) {
      requestAnimationFrame(this.calculate);
    }
  }
}

window.customElements.define('timer-countdown', Timer);
