/* global $$ create */
let tableData = {
  'total': 7,
  'rows': [
    {
      'test': 1,
      'test1': 12
    },
    {
      'test': 23,
      'test1': 2
    },
    {
      'test': 3,
      'test1': 31
    },
    {
      'test': 41,
      'test1': 43
    },
    {
      'test': 51,
      'test1': 51
    },
    {
      'test': 6124,
      'test1': 612
    },
    {
      'test': 7123,
      'test1': 743321
    }
  ]
};
createTable();

function createTable() {
  let option = {
    el: '#table',
    pagination: true,
    sortable: true,
    // ajax: getNewsList,
    data: tableData,
    sidePagination: 'server',
    pageNumber: 1, //默认加载页
    pageSize: 10, //每页数据,
    pageList: [10, 25, 50, 100, 'All'],
    columns: [
      {
        checkbox: true,
        align: 'center',
        radius: true,
        width: 20
      },
      {
        field: 'test1',
        title: '新闻标题',
        width: 200,
        align: 'center'
      },
      {
        field: 'test',
        title: '分类',
        sortable: true,
        width: 80,
        align: 'center'
      }
    ]
  };
  const root = $$(option.el);
  root.windowCheckTask = [];
  const table = create('table');
  const tableTMP = document.createDocumentFragment();
  const thead = create('thead', tableTMP);
  const tbody = create('tbody', tableTMP);
  createTableFillThead([thead,root], option.columns);
  createTableFillTbody([tbody,root], option);
  table.appendChild(tableTMP);
  root.appendChild(table);
}

/**
 *
 * @param root
 * @param data
 * @param [render]
 */
function createTableFillThead(root, data, render) {
  const TMPRoot = document.createDocumentFragment();
  const tr = create('tr', TMPRoot);
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const th = create('th', tr);
    if (item.checkbox) {
      th.appendChild(createCheckbox({
        radius: item.radius
      },true,root[1]));
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
  root[0].appendChild(TMPRoot);
}

function createTableFillTbody(root, config) {
  const TMPRoot = document.createDocumentFragment();
  let map = config.columns;
  let tbodyData = config.data.rows;
  for (let i = 0; i < tbodyData.length; i++) {
    const row = tbodyData[i];
    const tr = create('tr', TMPRoot);
    for (let j = 0; j < map.length; j++) {
      const cell = map[j];
      const td = create('td',tr);
      if (cell.checkbox&&j<map.length){
        td.appendChild(createCheckbox({radius:cell.radius},null,root[1]));
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
  root[0].appendChild(TMPRoot);
}

function createCheckbox(value,top,root) {
  let id = 'checkbox' + new Date().getTime()+Math.random();
  let checked = value.checked?'checked':'';
  let disabled = value.disabled?'disabled':'';
  const TMP = document.createDocumentFragment();
  let chkContainer = create('div',TMP);
  chkContainer.classList.add('chk', 'chk_default');
  if (value.radius) {
    chkContainer.classList.add('chk_radius');
  }
  chkContainer.innerHTML = `<input type="checkbox" id="${id}" ${checked} ${disabled}>
        <label for="${id}"></label>`;
  let input = $$('input',chkContainer);
  if (top) {
    root.windowCheck = input;
    input.addEventListener('change',function (e) {
      if (this.checked) {
        root.windowCheckTask.forEach(function (item) {
          item.checked = true;
        });
      } else {
        root.windowCheckTask.forEach(function (item) {
          item.checked = false;
        });
      }
    },false);
  }else {
    root.windowCheckTask.push(input);
    input.addEventListener('change',function (e) {
      let result = root.windowCheckTask.filter(item => {
        return item.checked;
      });
      console.log(result.length,root.windowCheckTask.length)
      root.windowCheck.checked = result.length === root.windowCheckTask.length;
    });
  }

  return TMP;
}

