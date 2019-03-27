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
  if (!root){
    return TMP;
  }
  if (top) {
    root.check = input;
    input.addEventListener('change', function (e) {
      if (this.checked) {
        root.checkList.forEach(function (item) {
          item.checked = true;
        });
      } else {
        root.checkList.forEach(function (item) {
          item.checked = false;
        });
      }
    }, false);
  } else {
    root.checkList.push(input);
    input.addEventListener('change', function (e) {
      let result = root.checkList.filter(item => {
        return item.checked;
      });
      root.check.checked = result.length === root.checkList.length;
    });
  }
  return TMP;
}
export {createCheckbox};
