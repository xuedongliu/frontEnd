/* global $$, create, observe */
HTMLSelectElement.prototype.f = function () {
  // console.log(12345678);
  const $this = this;
  const parentElement = $this.parentElement;
  let value = $this.value || 0;
  $this.v = {
    html: '',
    value: $this.value || 0
  };
  let select = create('span', parentElement);
  let dropdown = create('ul', parentElement);
  select.classList.add('chosen-value');
  dropdown.classList.add('selectList');
  select.innerHTML = $$('option[value="' + value + '"]', $this).textContent;
  for (let i = 0; i < $this.children.length; i++) {
    const item = $this.children[i];
    let li = create('li', dropdown);
    li.value = item.value;
    li.innerHTML = item.textContent;
    li.addEventListener('click', function (e) {
      e.stopPropagation();
      $$('li.open',dropdown).classList.remove('open');
      $this.value = this.value;
      $this.v.html = this.textContent;
      this.classList.add('open');
      $this.dispatchEvent(new Event('change'));
      dropdown.classList.remove('open');
    });
  }
  $$('li[value="' + value + '"]',dropdown).classList.add('open');
  $this.style.display = 'none';

  select.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  observe($this.v, function (key, val, newVal) {
    switch (key) {
      case 'html':
        select.innerHTML = newVal;
        break;
      case 'value':
        $this.value = newVal;
        break;
      default:
        break;
    }
  });
  return $this;
};

let select = document.querySelector('select.select').f();
select.addEventListener('change',function () {
  console.log(this.value);
});

/*
let inputField = document.querySelector('.chosen-value');
let dropdown = document.querySelector('.selectList');
let dropdownArray = [].concat(dropdown.querySelectorAll('li'));
let dropdownItems = dropdownArray[0];

let valueArray = [];
dropdownItems.forEach(function (item) {
  valueArray.push(item.textContent);
});
*/

/*dropdownItems.forEach(function (item) {
  item.addEventListener('click', function () {
    inputField.value = item.textContent;
    dropdown.classList.toggle('open');
    dropdownItems.forEach(function (dropdownList) {
      // dropdownList.classList.add('closed');
    });
  });
});*/


/*

inputField.addEventListener('click', function (evt) {
  dropdown.classList.toggle('open');
});
*/
