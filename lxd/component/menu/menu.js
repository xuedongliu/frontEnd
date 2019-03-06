const tabListItem = $$('.tabList ul');
const tabContentList = $$('.tabContentList');
const frames = {
  content: window.frames['content'],
  active: window.frames['content']
};

fetch('assets/nav.json').then(res => res.json()).then(res => {
  gMenu(res.data);
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

function addTab(link) {
  let activeTab = $$('.active', tabListItem);
  let menu = $$('#mainMenu ul');
  if (activeTab) {
    activeTab.classList.remove('active');
  }
  let newActiveTab = create('li', tabListItem);
  let activeTabLink = create('a', newActiveTab);
  let closeBtn = create('i', newActiveTab);
  closeBtn.classList.add('iconfont');
  closeBtn.innerHTML = '&#xe63c;';
  closeBtn.target = link.target;
  closeBtn.$ = newActiveTab;
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    let $this = this;
    tabContentList.removeChild(frames[$this.target]);
    menu.querySelector('a[target=' + $this.target + ']').classList.remove('active');
    delete frames[$this.target];
    tabListItem.removeChild($this.$);
  });
  activeTabLink.classList.add('tabListItem', 'active');
  activeTabLink.innerHTML = link.innerHTML;
  activeTabLink.target = link.target;
  activeTabLink.addEventListener('click', function () {
    let activeTab = tabListItem.querySelector('.active');

    let active = menu.querySelector('.active');
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    this.classList.add('active');
    if (active) {
      active.classList.remove('active');
    }
    menu.querySelector('a[target=' + this.target + ']').classList.add('active');
    addIframe(this);
  });
}

/**
 *
 * @param { Array } menuList
 */
function gMenu(menuList) {
  let menu = document.querySelector('#mainMenu ul');
  menu.innerHTML = '';
  for (let i = 0; i < menuList.length; i++) {
    let item = menuList[i];
    let li = document.createElement('li');
    menu.appendChild(li);
    li.classList.add('cui-role');
    li.setAttribute('data-func-code', item.code);
    let icon = document.createElement('i');
    icon.className = 'iconfont';
    icon.innerHTML = item.icon;
    let Tlink = document.createElement('a');
    if (item.child) {
      li.classList.add('hasChild');
      li.classList.add('closeChild');
      let childList = document.createElement('ul');
      childList.classList.add('childList');
      let span = document.createElement('span');
      span.childList = childList;
      Tlink.href = 'javascript:void(0);';
      Tlink.appendChild(icon);
      Tlink.appendChild(document.createTextNode(item.name));
      let iconArrow = document.createElement('i');
      iconArrow.classList.add('iconfont', 'arrow');
      iconArrow.innerHTML = '&#xe658;';
      span.appendChild(Tlink);
      span.appendChild(iconArrow);
      li.appendChild(span);
      for (let j = 0; j < item.child.length; j++) {
        let childItem = item.child[j];
        let childLi = document.createElement('li');
        childLi.classList.add('cui-role');
        childLi.setAttribute('data-func-code', childItem.code);
        let link = document.createElement('a');
        link.appendChild(document.createTextNode(childItem.name));
        link['data-href'] = childItem.link;
        link.target = childItem.code;
        childLi.appendChild(link);
        childList.appendChild(childLi);
        link.addEventListener('click', function () {
          // editTitle(this.innerHTML);
          let ac = menu.querySelector('.active');
          if (ac) {
            ac.classList.remove('active');
          }
          this.classList.add('active');
          addIframe(this);
          return false;
        });
      }
      li.appendChild(childList);
      childList.style.marginTop = '-' + childList.clientHeight + 'px';
      childList.style.display = 'none';
      span.addEventListener('click', function () {
        let toggledItem = this.childList;
        this.classList.toggle('openItem');
        let block = this.querySelector('a[href]');
        block.onclick = function (e) {
          e.stopPropagation();
          return false;
        };
        if (parseInt(toggledItem.style.marginTop, 10) < 0) {
          toggledItem.style.display = 'block';

          setTimeout(function () {
            toggledItem.style.marginTop = '0';
            block.onclick = null;
          }, 10);

        } else {
          toggledItem.style.marginTop = '-' + toggledItem.clientHeight + 'px';

          setTimeout(function () {
            block.onclick = null;
            toggledItem.style.display = 'none';
          }, 500);
        }

      });
    } else {
      li.classList.add('noChild');
      Tlink.appendChild(icon);
      Tlink.appendChild(document.createTextNode(item.name));
      Tlink['data-href'] = item.link;
      Tlink.target = item.code;
      Tlink.addEventListener('click', function () {
        let ac = menu.querySelector('.active');
        if (ac) {
          ac.classList.remove('active');
        }
        this.classList.add('active');
        addIframe(this);
        return false;
      });
      li.appendChild(Tlink);

    }
  }
}

function addIframe(link) {
  let target = link.target;
  let activeTab = tabContentList.querySelector('.active');
  if (frames[target]) {
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    frames[target].classList.add('active');
    tabListItem.querySelector('.active').classList.remove('active');
    tabListItem.querySelector('a[target=' + target + ']').classList.add('active');
  } else {
    addTab(link);
    let src = link['data-href'];
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    let iframe = document.createElement('iframe');
    iframe.name = target;
    iframe.src = src;
    iframe.setAttribute('frameborder', 0);
    iframe.classList.add('active');
    frames[target] = iframe;
    tabContentList.appendChild(iframe);
  }
}
