const tabListItem = $$('.tabList ul');
const tabContentList = $$('.tabContentList');
const menu = $$('#mainMenu ul');
const frames = {
  content: window.frames['content'],
  active: window.frames['content']
};
const delayDown = 10;
const delayUp = 500;

fetch('assets/nav.json').then(res => res.json()).then(res => {
  gMenu(res.data,addIframe);
});

/**
 * 查找DOM元素
 * @param {String,Element} e 元素节点或ID、class名称
 * @param {Element} [ele] 可选 父级元素 默认为document
 * @returns {Element} 返回的元素
 */
function $$(e, ele) {
  let _e = ele || document;
  return _e.querySelector(e);
}

/**
 *
 * @param {String} e 元素标签
 * @param {Element} [ele] 需要插入元素的宿主元素
 */
function create(e, ele) {
  let _e = ele;
  let element = document.createElement(e);
  if (_e) {
    _e.appendChild(element);
  }
  return element;
}

/**
 * 给元素设置属性。
 * @param {Element} ele 设置属性的元素
 * @param {Object} option 需要设置的属性对象
 */
function setProperty(ele, option) {
  for (let key in option) {
    if (option.hasOwnProperty(key)) {
      ele[key] = option[key];
    }
  }
}

function addTab(link) {
  let tabListItemActive = $$('.active', tabListItem);
  if (tabListItemActive) {
    tabListItemActive.classList.remove('active');
  }
  let newActiveTab = create('li', tabListItem);
  let activeTabLink = create('a', newActiveTab);
  let closeBtn = create('i', newActiveTab);
  closeBtn.classList.add('iconfont');
  setProperty(closeBtn, {
    innerHTML: '<a>&#xe63c;</a>',
    target: link.target,
    $: newActiveTab
  });
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    let $this = this;
    tabContentList.removeChild(frames[$this.target]);
    $$('a[target=' + $this.target + ']',menu).classList.remove('active');
    delete frames[$this.target];
    tabListItem.removeChild($this.$);
  });
  activeTabLink.classList.add('tabListItem', 'active');
  setProperty(activeTabLink, {
    innerHTML: link.innerHTML,
    target: link.target
  });
  activeTabLink.addEventListener('click', function () {
    let activeTab = $$('.active',tabListItem);
    let active = $$('.active',menu);
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    this.classList.add('active');
    if (active) {
      active.classList.remove('active');
    }
    $$('a[target=' + this.target + ']',menu).classList.add('active');
    addIframe(this);
  });
}

/**
 *
 * @param { Array } menuList
 * @param { function } callback
 */
function gMenu(menuList,callback) {
  menu.innerHTML = '';
  for (let i = 0; i < menuList.length; i++) {
    let item = menuList[i];
    let li = create('li',menu);
    li.setAttribute('data-func-code', item.code);
    let icon = create('i');
    setProperty(icon,{
      className: 'iconfont',
      innerHTML: item.icon
    });
    let topMenu = create('a');
    if (item.hasOwnProperty('child')) {
      li.classList.add('hasChild','closeChild');
      let span = create('span',li);
      let childList = create('ul',li);
      childList.classList.add('childList');
      span.childList = childList;
      topMenu.classList.add('noHref');
      topMenu.appendChild(icon);
      topMenu.appendChild(document.createTextNode(item.name));
      let iconArrow = create('i',span);
      iconArrow.classList.add('iconfont', 'arrow');
      iconArrow.innerHTML = '&#xe658;';
      span.appendChild(topMenu);
      for (let j = 0; j < item.child.length; j++) {
        let childItem = item.child[j];
        let childLi = create('li',childList);
        childLi.setAttribute('data-func-code', childItem.code);
        let link = create('a',childLi);
        link.appendChild(document.createTextNode(childItem.name));
        setProperty(link,{
          'data-href': childItem.link,
          target: childItem.code
        });
        link.addEventListener('click', function () {
          // editTitle(this.innerHTML);
          let ac = $$('.active',menu);
          if (ac) {
            ac.classList.remove('active');
          }
          this.classList.add('active');
          callback(this);
          return false;
        });
      }
      childList.style.marginTop = '-' + childList.clientHeight + 'px';
      childList.style.display = 'none';
      span.addEventListener('click', function () {
        let toggledItem = this.childList;
        this.classList.toggle('openItem');
        let block = $$('a.noHref',this);
        block.onclick = function (e) {
          e.stopPropagation();
          return false;
        };
        if (parseInt(toggledItem.style.marginTop, 10) < 0) {
          toggledItem.style.display = 'block';

          setTimeout(function () {
            toggledItem.style.marginTop = '0';
            block.onclick = null;
          }, delayDown);

        } else {
          toggledItem.style.marginTop = '-' + toggledItem.clientHeight + 'px';

          setTimeout(function () {
            block.onclick = null;
            toggledItem.style.display = 'none';
          }, delayUp);
        }

      });
    } else {
      li.classList.add('noChild');
      topMenu.appendChild(icon);
      topMenu.appendChild(document.createTextNode(item.name));
      topMenu['data-href'] = item.link;
      topMenu.target = item.code;
      topMenu.addEventListener('click', function () {
        let ac = $$('.active',menu);
        if (ac) {
          ac.classList.remove('active');
        }
        this.classList.add('active');
        callback(this);
        return false;
      });
      li.appendChild(topMenu);
    }
  }
}

function addIframe(link) {
  let target = link.target;
  let activeTab = $$('.active',tabContentList);
  if (frames[target]) {
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    frames[target].classList.add('active');
    $$('.active',tabListItem).classList.remove('active');
    $$('a[target=' + target + ']',tabListItem).classList.add('active');
  } else {
    addTab(link);
    let src = link['data-href'];
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    let iframe = create('iframe',tabContentList);
    iframe.name = target;
    iframe.src = src;
    iframe.setAttribute('frameborder', 0);
    iframe.classList.add('active');
    frames[target] = iframe;
  }
}
