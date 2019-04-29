import {create, removeAllChild} from './../../js/function.js';
import {paginationServer} from '../pagination/pagination.server.js';
import {paginationClient} from '../pagination/pagination.client.js';
import {createCheckbox} from './../../js/generate.js';
import {loading} from '../loading/loading.js';
import {createTableInit} from './createTableInit.js';


function createTable(opt) {
  let option = new createTableInit(opt);
  const root = option.dom.root;
  const table = option.dom.table;
  const tableTMP = option.dom.documentFragment;
  const thead = option.dom.thead;
  const tbody = option.dom.tbody;
  const status = option.dom.status;
  createTableFillThead(thead, option._d, option.columns);
  table.appendChild(tableTMP);
  root.style.position = 'relative';
  root.style.height = '100%';
  root.style.overflow = 'auto';
  let ld;
  let load;
  let pagination;
  if (option.loading) {
    load = create(`div.${option.loading}`, root);
    ld = loading(load);
  }
  if (option.pagination) {
    pagination = create('div.pagination.btn_group', status);
  }
  if (option.stripe) {
    table.classList.add('stripe');
  }
  if (option.ajax) {
    if (option.pagination) ld.show();
    option.ajax({start: option._d.start * option.pageSize, length: option.pageSize});
  } else {
    if (option.pagination) {
      paginationClient(option.data.total, option.pageSize, option._d.start, pagination, function (start, length) {
        createTableTbody(tbody, option.data, option.columns, start, length, option._d, 'client', option);
        option.freezeThead();
      });
    } else {
      createTableTbody(tbody, option.data, option.columns, 0, option.pageSize, option._d, 'noe', option);
      option.freezeThead();
    }
  }

  option.update = function (data) {
    if (option._d.init) {
      option._d.init = false;
      if (option.pagination) {
        option.data.total = data.total;
        paginationServer(data, option.pageSize, option._d.start, pagination, option, function (start, length) {
          if (option.pagination) ld.show();
          option.ajax({start, length});
        });
      } else {
        option.data = data;
        if (option.pagination) ld.hide();
        createTableTbody(tbody, option.data, option.columns, 0, option.pageSize, option._d, 'none', option);
      }
    } else {
      if (option.pagination) ld.hide();
      createTableTbody(tbody, data, option.columns, data.start, data.length, option._d, 'server', option);
      option.freezeThead();
    }
  };
  option.default = function (data) {
    if (option.pagination) ld.hide();
    createTableTbody(tbody, data, option.columns, data.start, data.length, option._d, 'server', option);
    option.freezeThead();
  };
  option.returnCheckList=function () {
    let arr = [];
    option._d.checkList.filter((item) => {return item.checked;}).forEach((item) => {
      arr.push(item.parentElement.parentElement.parentElement._d);
    });
    console.log(arr);
  };
  return option;
}

/**
 *
 * @param thead
 * @param root
 * @param data
 * @param [render]
 */
function createTableFillThead(thead, root, data, render) {
  const TMPRoot = document.createDocumentFragment();
  const tr = create('tr', TMPRoot);
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const th = create('th', tr);
    if (item.checkbox) {
      th.appendChild(createCheckbox({
        radius: item.radius
      }, true, root));
    }
    for (let key in item) {
      if (item.hasOwnProperty(key)) {
        if (key === 'title') {
          th.innerHTML = item.title;
        } else {
          th.setAttribute(key, item[key]);
        }
      }
    }
  }
  thead.appendChild(TMPRoot);
}

/**
 * 绘制表格函数
 * @param {HTMLElement|Element} tbody tbody元素
 * @param {Object} data 渲染数据
 * @param {Array} map 数据和表头的对应关系
 * @param {Number} pageStart 页面开始时数据的index
 * @param {Number} limit 每页显示的数据条数
 * @param opt
 * @param {String} type=[none|server|client] type 分页方式
 * @param {createTableInit} option
 */
function createTableTbody(tbody, data, map, pageStart, limit, opt, type, option) {
  removeAllChild(tbody);
  opt.checkList.length = 0;
  opt.check.checked = false;
  const TMPRoot = document.createDocumentFragment();
  let tbodyData = data.rows;
  let end = pageStart + limit;
  let length = end > data.total ? data.total : end;
  let startCondition;
  let endCondition;
  let s;
  let e;
  switch (type) {
    case 'server':
      startCondition = 0;
      endCondition = tbodyData.length;
      s = pageStart;
      e = length;
      break;
    case 'client':
      startCondition = pageStart;
      endCondition = length;
      s = pageStart;
      e = length;
      break;
    default:
      startCondition = 0;
      endCondition = tbodyData.length;
      s = 0;
      e = data.total;
      break;
  }
  let stripe = opt.stripe;
  let stripeClass = opt.stripeClass;
  for (let i = startCondition; i < endCondition; i++) {
    const row = tbodyData[i];
    const tr = create('tr', TMPRoot);
    tr._d = row;
    if (stripe && stripeClass && i % 2 === 1) {
      tr.classList.add(stripeClass);
    }
    for (let j = 0; j < map.length; j++) {
      const cell = map[j];
      const td = create('td', tr);
      if (cell.checkbox && j < map.length) {
        td.appendChild(createCheckbox({radius: cell.radius}, null, opt));
        continue;
      }
      for (let key in cell) {
        if (cell.hasOwnProperty(key)) {
          switch (key) {
            case 'field':
              td.innerHTML = row[cell[key]];
              break;
            case 'class':
              td.classList.add(cell[key]);
              break;
            case 'title':
              if (opt.showTip) {
                td.setAttribute(key, cell[key]);
              }
              break;
            default:
              td.setAttribute(key, cell[key]);
              break;
          }
        }
      }
    }
  }
  tbody.appendChild(TMPRoot);
  option.showMsg(s, e);
}

export {createTable};
