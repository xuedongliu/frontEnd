/* global $$, create, observe */
/**
 *
 * @param {Object} [data]
 * @returns {HTMLSelectElement}
 */
HTMLSelectElement.prototype.f = function (data) {
  const $this = this;
  const d = data || {};
  const parentElement = $this.parentElement;
  let value = d.selectValue || $this.value || 0;
  $this.v = {
    show: false
  };
  let select = create('span', parentElement);
  let dropdown = create('ul', parentElement);
  $this._c = {};
  $this._c.select = select;
  $this._c.dropdown = dropdown;
  let dropdownListTemp = $this.querySelectorAll('option');
  let dropdownList = [];
  if (d.list) {
    dropdownList = [].concat(d.list);

  } else {
    for (let i = 0; i < dropdownListTemp.length; i++) {
      const item = dropdownListTemp[i];
      dropdownList.push({
        val: item.value,
        innerHTML: item.innerHTML
      });
    }
  }
  select.classList.add('chosen-value');
  dropdown.classList.add('selectList');
  for (let i = 0; i < dropdownList.length; i++) {
    const item = dropdownList[i];
    let li = create('li', dropdown);
    for (let key in item) {
      if (item.hasOwnProperty(key)) {
        li[key] = item[key];
      }
    }
    if (item.val === value) {
      $this.v.select = li;
      select.innerHTML = item.innerHTML;
    }
    li.addEventListener('click', function (e) {
      e.stopPropagation();
      $this.v.select = this;
      $this.v.show = false;
    });
  }
  $this.v.select.classList.add('open');
  $this.style.display = 'none';

  select.addEventListener('click', function (e) {
    e.stopPropagation();
    // this.classList.toggle('open');
    $this.v.show = !$this.v.show;
  });
  observe($this.v, function (key, val, newVal) {
    switch (key) {
      case 'select':
        select.innerHTML = newVal.innerHTML;
        val.classList.remove('open');
        newVal.classList.add('open');
        $this.value = newVal.val;
        $this.dispatchEvent(new Event('change'));
        break;
      case 'show':
        if (newVal) {
          dropdown.classList.add('open');
          select.classList.add('open');
        } else {
          dropdown.classList.remove('open');
          select.classList.remove('open');
        }
        break;
      default:
        break;
    }

  });
  window.addEventListener('click', function (e) {
    e.stopPropagation();
    // console.log(e.target===parentElement||parentElement.contains(e.target));
    // if (e.target)
    if (e.target !== parentElement && !parentElement.contains(e.target)) {
      $this.v.show = false;
    }
  }, false);
  return $this;
};

HTMLSelectElement.prototype.up = function(data) {
  let $this = this;
  if (!$this.nextElementSibling) {
    $this.f(data);
    return;
  }
  $this._c.select.remove();
  $this._c.dropdown.remove();
  $this.f(data);
};

let data = {
  selectValue: 'D01',
  list: [
    {
      val: 'D01',
      innerHTML: 'test11'
    },
    {
      val: 'D02',
      innerHTML: 'test21'
    },
    {
      val: 'D03',
      innerHTML: 'test31'
    }
  ]
};
let select = document.querySelectorAll('select.select');
select[0].f();
select[1].f(data);
select[1].addEventListener('change', function () {
  console.log(this.value);
});

/*
* data = {
*   selectValue: 'D01',
*   list: [
*     {
*       value: 'D01',
*       html: 'test1'
*     },
*     {
*       value: 'D02',
*       html: 'test2'
*     },
*     {
*       value: 'D03',
*       html: 'test3'
*     }
*   ]
* }
*
*/
