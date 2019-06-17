import {$$, create} from './../../js/function.js';

const data = [
  {
    "code": "D001",
    "name": "主页",
    "icon": "&#xe606;",
    "link": ""
  },
  {
    "code": "D002",
    "name": "组件",
    "link": "",
    "icon": "&#xe603;",
    "child": [
      {
        "code": "D002_1",
        "name": "按钮",
        "child": [
          {
            "code": "D002_2",
            "name": "switch",
            "link": "component/switch/switch.html"
          },
          {
            "code": "D002_3",
            "name": "select",
            "link": "component/select/select.html"
          },
          {
            "code": "test",
            "name": "14365",
            "child": [
              {
                "code": "D002_5",
                "name": "checkbox",
                "link": "component/checkbox/checkbox.html"
              },
            ]
          }
        ]
      },
      {
        "code": "D002_4",
        "name": "input[text]",
        "link": "component/input[text]/input[text].html"
      },

      {
        "code": "D002_6",
        "name": "radio",
        "link": "component/radio/radio.html"
      },
      {
        "code": "D002_7",
        "name": "table",
        "link": "component/table/table.html"
      },
      {
        "code": "D002_8",
        "name": "pagination",
        "link": "component/pagination/pagination.html"
      },
      {
        "code": "D002_9",
        "name": "nav",
        "link": "component/nav/nav.html"
      },
      {
        "code": "D002_10",
        "name": "loading",
        "link": "component/loading/loading.html"
      }
    ]
  }
];
const option = {
  el: '#menu',
  data
};

function gItem(data, root, lv, callback) {
  let level = lv || 1;
  const li = create('li', root);
  let icon = create('i.iconfont');
  icon.innerHTML = data.icon || '';
  if (data.child) {
    li.classList.add('has-child');
    const span = create('span', li);
    span.appendChild(icon);
    span.appendChild(document.createTextNode(data.name));
    const ul = create(`ul.child.level-${level}`, li);
    for (let i = 0; i<data.child.length;i ++){
      const child = data.child[i];
      gItem(child, ul, level+1)
    }
    ul.style.marginTop = `-${ul.clientHeight}px`;
    ul.style.display = 'none';
    span.addEventListener('click', function () {
      let toggledItem = this.nextElementSibling;
      if (toggledItem.clientHeight <= 0) {
        toggledItem.style.display = 'block';

        setTimeout(function () {
          toggledItem.style.marginTop = '0';
        }, 10);

      } else {
        toggledItem.style.marginTop = '-' + toggledItem.clientHeight + 'px';

        setTimeout(function () {
          toggledItem.style.display = 'none';
        }, 500);
      }

    });
  } else {
    const link = create('a.link', li);
    link.appendChild(icon);
    link.appendChild(document.createTextNode(data.name));
    link.href = data.link;
    link.addEventListener('click', function () {
      callback(this);
    }, false)
  }
}

function Menu(option, callback) {
  console.log(option);
  const root = create('ul.tree-menu.level-0', $$(option.el));
  const data = option.data;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    gItem(item, root, 0, callback);
  }
}

Menu(option);
