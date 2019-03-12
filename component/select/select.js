/* global $$, create, observe */
/**
 *
 * @param {Object} [data]
 * @returns {HTMLSelectElement}
 */
HTMLSelectElement.prototype.f = function (data) {
  // console.log(12345678);
  const $this = this;
  const parentElement = $this.parentElement;
  let value = $this.value || 0;
  $this.v = {};
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
      $this.v.select = this;
      dropdown.classList.remove('open');
    });
  }
  $this.v.select = $$('li[value="' + value + '"]',dropdown);
  $this.v.select.classList.add('open');
  $this.style.display = 'none';

  select.addEventListener('click', function (e) {
    e.stopPropagation();
    this.classList.toggle('open');
    dropdown.classList.toggle('open');
  });
  observe($this.v, function (key, val, newVal) {
    select.innerHTML = newVal.innerHTML;
    val.classList.remove('open');
    newVal.classList.add('open');
    $this.value = newVal.value;
    $this.dispatchEvent(new Event('change'));

  });
  return $this;
};

let select = document.querySelector('select.select').f();
select.addEventListener('change',function () {
  console.log(this.value);
});

/*
* data = {
*   selectValue: 'D01',
*   list: [
*     {
*       value: 'D01',
*       html: 'test'
*     }
*   ]
* }
*
*/
