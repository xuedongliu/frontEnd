import {$$, create, removeAllChild} from './../../js/function.js';
import {paginationServer} from '../pagination/pagination.server.js';
import {paginationClient} from '../pagination/pagination.client.js';
import {createCheckbox} from './../../js/generate.js';
let tableData = {
  'total': 101,
  'rows': []
};
for (let i = 0 ;i<tableData.total;i++){
  tableData.rows.push({
    'test':i+1,
    'test1':i+2
  });
}
let test = createTable({
  el: '#table',
  pagination: true,
  // sortable: true,
  ajax: getNewsList,
  data: tableData,
  sidePagination: 'server',
  pageNumber:2,
  pageSize: 20, //每页数据,
  pageList: [10, 25, 50, 100, 'All'],
  stripe: true,
  stripeClass: 'TTT',
  columns: [
    {
      checkbox: true,
      align: 'center',
      radius: true,
      width: 50
    },
    {
      field: 'test',
      title: '新闻标题',
      width: 200,
      align: 'center'
    },
    {
      field: 'test1',
      title: '分类',
      sortable: true,
      align: 'center'
    }
  ]
});

function createTable(opt) {
  let option = createTableInit(opt);

  const root = $$(option.el);
  const table = create('table.table');
  const tableTMP = document.createDocumentFragment();
  const thead = create('thead', tableTMP);
  const tbody = create('tbody', tableTMP);
  const status = create('div.table-footer-container');
  const infoMsg = create('span.table-footer-msg',status);
  createTableFillThead(thead, option._d, option.columns);
  option._d.showMsg = function (index,end) {
    infoMsg.innerHTML = `显示第${index+1}-${end}条信息,共${option.data.total}条信息`;
  };
  table.appendChild(tableTMP);
  root.appendChild(table);
  root.appendChild(status);
  const pagination = create('div.pagination.btn_group',root);

  if (option.stripe){
    table.classList.add('stripe');
  }
  if (option.ajax){
    option.ajax({start:option._d.start * option.pageSize,length:option.pageSize},root);
  }else {
    if (option.pagination) {
      paginationClient(option.data.total,option.pageSize,option._d.start,pagination,function (start, length) {
        createTableTbody(tbody,option.data,option.columns,start,length,option._d,'client');
      });
    } else {
      createTableTbody(tbody, option.data, option.columns,0,option.pageSize,option._d, 'noe');
    }
  }
  root._init = true;
  root.update = function (data) {
    if (root._init){
      root._init = false;
      if (option.pagination){
        paginationServer(data,option.pageSize,option._d.start,pagination, root,function (start,length) {
          option.ajax({start,length},root);
        });
      }else {
        option.data = data;
        createTableTbody(tbody,option.data,option.columns,0,option.pageSize,option._d,'none');
      }
    }else {
      createTableTbody(tbody,data,option.columns,data.start,data.length,option._d,'server');
    }
  };
  root.default = function (data) {
    createTableTbody(tbody,data,option.columns,data.start,data.length,option._d,'server');
  };
  return root;
}

function createTableInit(opt) {
  return {
    el: opt.el,
    pagination: opt.pagination||false,
    sortable: opt.sortable||false,
    ajax: opt.ajax||null,
    data: opt.data||{},
    sidePagination:opt.sidePagination|| 'server',
    stripe: opt.stripe||true,
    stripeClass: opt.stripeClass||'',
    pageNumber: opt.pageNumber||1,
    pageSize: opt.pageSize||10,
    // pageList: [10, 25, 50, 100, 'All'],
    columns: opt.columns||[],
    _d:{
      checkList : [],
      stripe: opt.stripe||true,
      stripeClass: opt.stripeClass||'',
      start: opt.pageNumber - 1
    }
  };
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
 * @param {HTMLElement} tbody tbody元素
 * @param {Object} data 渲染数据
 * @param {Array} map 数据和表头的对应关系
 * @param {Number} pageStart 页面开始时数据的index
 * @param {Number} limit 每页显示的数据条数
 * @param opt
 * @param {String} type=[none|server|client] type 分页方式
 */
function createTableTbody(tbody,data,map,pageStart,limit,opt,type) {
  removeAllChild(tbody);
  opt.checkList.length = 0;
  opt.check.checked = false;
  const TMPRoot = document.createDocumentFragment();
  let tbodyData = data.rows;
  let end = pageStart+limit;
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
    if (stripe&&i%2===1){
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
            default:
              td.setAttribute(key, cell[key]);
              break;
          }
        }
      }
    }
  }
  tbody.appendChild(TMPRoot);
  opt.showMsg(s, e);
}


function getNewsList({start ,length}) {
  // console.log(start,length);
  setTimeout(function () {
    let tmp = {};
    tmp.total = tableData.total;
    tmp.start = start;
    tmp.length = length;
    tmp.rows = tableData.rows.slice(start,start+length);
    test.update(tmp);
  },1000);
}
