import {$$, create} from './function.js';

function createCheckbox(value, top, root) {
  let id = 'checkbox' + new Date().getTime() + Math.random();
  let checked = value.checked ? 'checked' : '';
  let disabled = value.disabled ? 'disabled' : '';
  const TMP = document.createDocumentFragment();
  let chkContainer = create('div', TMP);
  chkContainer.classList.add('chk', 'chk_default');
  if (value.radius) {
    chkContainer.classList.add('chk_radius');
  }
  chkContainer.innerHTML = `<input type="checkbox" id="${id}" ${checked} ${disabled}>
        <label for="${id}"></label>`;
  let input = $$('input', chkContainer);
  if (top) {
    root.windowCheck = input;
    input.addEventListener('change', function (e) {
      if (this.checked) {
        root.windowCheckTask.forEach(function (item) {
          item.checked = true;
        });
      } else {
        root.windowCheckTask.forEach(function (item) {
          item.checked = false;
        });
      }
    }, false);
  } else {
    root.windowCheckTask.push(input);
    input.addEventListener('change', function (e) {
      let result = root.windowCheckTask.filter(item => {
        return item.checked;
      });
      root.windowCheck.checked = result.length === root.windowCheckTask.length;
    });
  }
  return TMP;
}
export {createCheckbox};
