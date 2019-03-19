import {$$, create, observe, removeAllChild} from './../../js/function.js';

const SHOWNUMBER = 5;

function pagination(total, size, now, paginationListContainer, callback) {
  //初始化
  let showNumber = now;
  const paginationList = paginationListContainer || $$('.pagination');
  removeAllChild(paginationList);
  const paginationListTMP = document.createDocumentFragment();
  const first = create('button', paginationListTMP);
  first.classList.add('btn', 'btn_mini', 'btn_default', 'ripple', 'paginationItem', 'paginationItemFirst');
  first.innerHTML = '首页';
  const prev = create('button', paginationListTMP);
  prev.classList.add('btn', 'btn_mini', 'btn_default', 'ripple', 'paginationItem', 'paginationItemPrev');
  prev.innerHTML = '上一页';
  if (showNumber === 0 ){
    prev.setAttribute('disabled', 'disabled');
    first.setAttribute('disabled', 'disabled');
  }
  const paginationListTask = [];

  let pageCount = Math.ceil(total / size);
  if (pageCount < SHOWNUMBER) {
    for (let i = 0; i < pageCount; i++) {
      let paginationItemChild = create('button', paginationListTMP);
      paginationItemChild.classList.add('btn', 'btn_mini', 'btn_default', 'ripple', 'paginationItem', 'paginationItemChild');
      paginationItemChild.innerHTML = i + 1;
      paginationItemChild.setAttribute('dataIndex', i);
      paginationListTask.push(paginationItemChild);
    }
  } else {
    for (let i = 0; i < SHOWNUMBER; i++) {
      let paginationItemChild = create('button', paginationListTMP);
      paginationItemChild.classList.add('btn', 'btn_mini', 'btn_default', 'ripple', 'paginationItem', 'paginationItemChild');
      paginationItemChild.innerHTML = i + 1;
      paginationItemChild.setAttribute('dataIndex', i);
      paginationListTask.push(paginationItemChild);
    }
  }

  const next = create('button', paginationListTMP);
  next.classList.add('btn', 'btn_mini', 'btn_default', 'ripple', 'paginationItem', 'paginationItemNext');
  next.innerHTML = '下一页';
  const last = create('button', paginationListTMP);
  last.classList.add('btn', 'btn_mini', 'btn_default', 'ripple', 'paginationItem', 'paginationItemLast');
  last.innerHTML = '末页';
  paginationList.appendChild(paginationListTMP);
  let selector = $$(`button[dataIndex="${showNumber}"]`, paginationList);
  selector.classList.add('btn_primary');


  //
  const PA = {
    now,
    selector,
    paginationListTask,
    pageCount,
    SHOWNUMBER
  };
  console.log(PA);
  const middle = Math.ceil(pageCount/2);
  observe(PA, function (key, val, newVal, data) {
    console.log(key, val, newVal, data)
    switch (key) {
      case 'now':
        PA.selector = $$(`button[dataIndex="${newVal}"]`, paginationList);
        if (newVal === 0) {
          prev.setAttribute('disabled', 'disabled');
          first.setAttribute('disabled', 'disabled');
          prev.classList.add('disabled');
          first.classList.add('disabled');
        } else {
          prev.removeAttribute('disabled');
          first.removeAttribute('disabled');
          prev.classList.remove('disabled');
          first.classList.remove('disabled');
        }
        if (newVal === data.pageCount - 1) {
          next.setAttribute('disabled', 'disabled');
          last.setAttribute('disabled', 'disabled');
          next.classList.add('disabled');
          last.classList.add('disabled');
        } else {
          next.removeAttribute('disabled');
          last.removeAttribute('disabled');
          next.classList.remove('disabled');
          last.classList.remove('disabled');
        }
        if (newVal>middle){

        }
        break;
      case 'selector':
        val.classList.remove('btn_primary');
        newVal.classList.add('btn_primary');
        break;
      default:
        break;
    }
  });
  next.addEventListener('click', function (e) {
    e.stopPropagation();
    if (PA.now < pageCount) {
      PA.now += 1;
    }
  });
  prev.addEventListener('click', function (e) {
    e.stopPropagation();
    if (PA.now > 0) {
      PA.now -= 1;
    }
  });
  paginationListTask.forEach(function (value) {
    value.addEventListener('click', function (e) {
      e.stopPropagation();
      PA.now = this.getAttribute('dataIndex')-0;
    });
  });
}

pagination(26, 5, 0, null);
export {pagination};
