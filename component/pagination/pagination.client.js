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
  if (showNumber === 0) {
    prev.setAttribute('disabled', 'disabled');
    first.setAttribute('disabled', 'disabled');
  }
  const paginationListTask = [];

  let pageCount = Math.ceil(total / size);
  if (showNumber >= pageCount - 1) {
    showNumber = pageCount - 1;
  }
  if (showNumber < 0) {
    showNumber = 0;
  }
  if (pageCount < SHOWNUMBER) {
    for (let i = 0; i < pageCount; i++) {
      let paginationItemChild = create('button', paginationListTMP);
      paginationItemChild.classList.add('btn', 'btn_mini', 'btn_default', 'ripple', 'paginationItem', 'paginationItemChild');
      paginationItemChild.innerHTML = i + 1;
      paginationItemChild.setAttribute('dataIndex', i);
      paginationItemChild.dataIndex = i;
      paginationListTask.push(paginationItemChild);
    }
  } else {
    for (let i = 0; i < SHOWNUMBER; i++) {
      let paginationItemChild = create('button', paginationListTMP);
      paginationItemChild.classList.add('btn', 'btn_mini', 'btn_default', 'ripple', 'paginationItem', 'paginationItemChild');
      paginationItemChild.innerHTML = i + 1;
      paginationItemChild.setAttribute('dataIndex', i);
      paginationItemChild.dataIndex = i;
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


  //
  const PA = {
    now: 0,
    selector: $$(`button[dataIndex="${0}"]`, paginationList),
    paginationListTask,
    pageCount
  };
  const middle = Math.floor(SHOWNUMBER / 2);
  const center = Math.ceil(SHOWNUMBER / 2);
  observe(PA, function (key, val, newVal, data) {
    // console.log(key, val, newVal, data)
    switch (key) {
      case 'now':
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
        if (data.paginationListTask.indexOf($$(`button[dataIndex="${newVal}"]`, paginationList)) > center - 1 || newVal === data.pageCount - 1) {
          if (newVal >= data.pageCount - center) {
            let j = 0;
            for (let i = data.paginationListTask.length - 1; i >= 0; i--) {
              const botton = data.paginationListTask[i];
              botton.innerHTML = data.pageCount - j;
              botton.setAttribute('dataIndex', data.pageCount - j - 1);
              j++;
            }
          } else {
            data.paginationListTask.forEach(function (item, index) {
              item.dataIndex = newVal - middle + index;
              item.setAttribute('dataIndex', item.dataIndex);
              item.innerHTML = item.dataIndex + 1;
            });
          }
        } else {
          if (newVal < center) {
            for (let i = 0; i < data.paginationListTask.length; i++) {
              const botton = data.paginationListTask[i];
              botton.innerHTML = i + 1;
              botton.setAttribute('dataIndex', i);
            }
          } else {
            data.paginationListTask.forEach(function (item, index) {
              item.dataIndex = newVal - middle + index;
              item.setAttribute('dataIndex', item.dataIndex);
              item.innerHTML = item.dataIndex + 1;
            });
          }
        }
        PA.selector = $$(`button[dataIndex="${newVal}"]`, paginationList);
        callback(newVal * size, size);
        break;
      case 'selector':
        val.classList.remove('btn_primary');
        newVal.classList.add('btn_primary');
        // console.log(PA.now);
        break;
      default:
        break;
    }
  });
  PA.now = showNumber;
  let selector = $$(`button[dataIndex="${showNumber}"]`, paginationList);
  selector.classList.add('btn_primary');
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
      PA.now = this.getAttribute('dataIndex') - 0;
    });
  });
  first.addEventListener('click', function (e) {
    e.stopPropagation();
    PA.now = 0;
  });
  last.addEventListener('click', function (e) {
    e.stopPropagation();
    PA.now = pageCount - 1;
  });
  // callback(showNumber * size, size);
}

/*paginationClient(260, 26, 0, null,function (start,length) {
  console.log(start,length);
});*/
export {pagination as paginationClient};
