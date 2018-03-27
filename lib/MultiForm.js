import CustomEvent from 'custom-event'
import { Component } from 'n8tive'
import template from './MultiForm.html'

class MultiForm extends Component {
  constructor({ style = false } = {}) {
    super({ template, style });
  }

  init() {
    this.activeForm = 0;
    this.forms = [...this.querySelectorAll('form')];
    this.forms.forEach(form => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (form === this.forms[this.forms.length - 1]) {
          const detail = {
            forms: this.forms
          };
          this.dispatchEvent(new CustomEvent('multi-form.submit-all', { bubbles: true, composed: true, detail }));
          return;
        }
        this.dispatchEvent(new CustomEvent('multi-form.submit', { bubbles: true, composed: true, detail: { form } }));
      });
    });

    const prev = this.querySelector('.multi-form__controls__btn--prev');
    prev.addEventListener('click', (event) => {
      // TODO action, navigate to previous form
      this.activeForm--;
      this.render();
    });

    const next = this.querySelector('.multi-form__controls__btn--next');
    next.addEventListener('click', (event) => {
      const form = this.forms[this.activeForm];
      const submitButton = form.querySelector('button');
      submitButton.click();
    });
    this.render();
  }

  render() {
    this.scrollIntoView();
    this.forms.forEach((form, i) => {
      form.classList.remove('done');
      form.classList.remove('current');
      if (i < this.activeForm) {
        form.classList.add('done');
      } else if (i === this.activeForm) {
        form.classList.add('current');
      }
    });
    const prev = this.querySelector('.multi-form__controls__btn--prev');
    if (this.activeForm === 0) {
      prev.setAttribute('style', 'display:none;');
    } else {
      prev.removeAttribute('style');
    }

    const next = this.querySelector('.multi-form__controls__btn--next');
    if (this.activeForm === this.forms.length - 1) {
      next.textContent = 'Submit';
    } else {
      next.textContent = 'Next';
    }
  }

  next() {
    // success
    this.activeForm++;
    this.render();
  }
}

customElements.define('n8v-multi-form', MultiForm);

export default MultiForm;