var tabListItem = document.querySelector('.tabList ul');
var tabContentList = document.querySelector('.tabContentList');
var frames = {
  content: window.frames['content'],
  active: window.frames['content']
};

/**
 *
 * @param {string} string
 */
function editTitle(string) {
  tabListItem.querySelector('.active').innerHTML = string;
}

function addTab(link) {
  var activeTab = tabListItem.querySelector('.active');
  var menu = document.querySelector('#mainMenu ul');
  if (activeTab){
    activeTab.classList.remove('active');
  }
  var newActiveTab = document.createElement('li');
  var activeTabLink = document.createElement('a');
  var closeBtn = document.createElement('i');
  closeBtn.classList.add('iconfont');
  closeBtn.innerHTML = '&#xe63c;';
  closeBtn.target = link.target;
  closeBtn.$ = newActiveTab;
  closeBtn.addEventListener('click',function (e) {
    e.stopPropagation();
    var $this = this;
    tabContentList.removeChild(frames[$this.target]);
    menu.querySelector('a[target='+$this.target+']').classList.remove('active');
    delete frames[$this.target];
    tabListItem.removeChild($this.$);

  });
  activeTabLink.classList.add('tabListItem','active');
  activeTabLink.innerHTML = link.innerHTML;
  activeTabLink.target = link.target;
  newActiveTab.appendChild(activeTabLink);
  newActiveTab.appendChild(closeBtn);
  tabListItem.appendChild(newActiveTab);
  activeTabLink.addEventListener('click',function () {
    var activeTab = tabListItem.querySelector('.active');

    var active = menu.querySelector('.active');
    if (activeTab){
      activeTab.classList.remove('active');
    }
    this.classList.add('active');
    if (active){
      active.classList.remove('active');
    }
    menu.querySelector('a[target='+this.target+']').classList.add('active');
    addIframe(this);
  });
}

/**
 *
 * @param { Array } menuList
 */
function gMenu(menuList) {
  var menu = document.querySelector('#mainMenu ul');
  menu.innerHTML = '';
  for (var i = 0; i < menuList.length; i++) {
    var item = menuList[i];
    var li = document.createElement('li');
    menu.appendChild(li);
    li.classList.add('cui-role');
    li.setAttribute('data-func-code', item.code);
    var icon = document.createElement('i');
    icon.className = 'iconfont';
    icon.innerHTML = item.icon;
    var Tlink = document.createElement('a');
    if (item.child) {
      li.classList.add('hasChild');
      li.classList.add('closeChild');
      var childList = document.createElement('ul');
      childList.classList.add('childList');
      var span = document.createElement('span');
      span.childList = childList;
      Tlink.href = 'javascript:void(0);';
      Tlink.appendChild(icon);
      Tlink.appendChild(document.createTextNode(item.name));
      var iconArrow = document.createElement('i');
      iconArrow.classList.add('iconfont','arrow');
      iconArrow.innerHTML = '&#xe658;';
      span.appendChild(Tlink);
      span.appendChild(iconArrow);
      li.appendChild(span);
      for (var j = 0; j < item.child.length; j++) {
        var childItem = item.child[j];
        var childLi = document.createElement('li');
        childLi.classList.add('cui-role');
        childLi.setAttribute('data-func-code', childItem.code);
        var link = document.createElement('a');
        link.appendChild(document.createTextNode(childItem.name));
        link['data-href'] = childItem.link;
        link.target = childItem.code;
        childLi.appendChild(link);
        childList.appendChild(childLi);
        link.addEventListener('click', function () {
          // editTitle(this.innerHTML);
          var ac = menu.querySelector('.active');
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
        var toggledItem = this.childList;
        this.classList.toggle('openItem');
        var block = this.querySelector('a[href]');
        block.onclick = function(e){
          e.stopPropagation();
          return false;
        };
        if (parseInt(toggledItem.style.marginTop, 10) < 0) {
          toggledItem.style.display = 'block';

          setTimeout(function () {
            toggledItem.style.marginTop = '0';
            block.onclick=null;
          }, 10);

        } else {
          toggledItem.style.marginTop = '-' + toggledItem.clientHeight + 'px';

          setTimeout(function () {
            block.onclick=null;
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
        var ac = menu.querySelector('.active');
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

var menuList = [
  {
    code: 'DAS000000',
    name: '主页',
    icon: '&#xe606;',
    link: '/'
  },
  {
    code: 'DAS101000',
    name: '新闻管理',
    icon: '&#xe61a;',
    child: [
      {
        code: 'DAS101100',
        name: '分类管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/news/classify/classify.html#news'
      },
      {
        code: 'DAS101200',
        name: '新闻列表',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/news/maintenance/maintenance.html'
      },
      {
        code: 'DAS101300',
        name: '评论管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/news/newsComment/maintenance.html'
      }
    ]

  },
  {
    code: 'DAS102000',
    name: '专题管理',
    icon: '&#xe60d;',
    target: 'content',
    link: 'pages/special/maintenance/maintenance.html'
  },
  {
    code: 'DAS103000',
    name: '杂志管理',
    icon: '&#xe60e;',
    child: [
      {
        code: 'DAS103001',
        name: '分类管理',
        target: 'content',
        icon: 'fa fas fa-home',
        link: 'pages/magazineManag/classify/classify.html'
      },
      {
        code: 'DAS103018',
        name: '杂志列表',
        target: 'content',
        icon: 'fa fas fa-home',
        link: 'pages/magazineManag/magazine/magazine.html'
      }
    ]
  },
  {
    code: 'DAS104000',
    name: '随手拍管理',
    icon: '&#xe627;',
    child: [
      {
        code: 'DAS104001',
        name: '分类管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/news/classify/classify.html#clue'
      },
      {
        code: 'DAS104002',
        name: '随手拍列表',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/clue/maintenance/maintenance.html'
      },
      {
        code: 'DAS104003',
        name: '评论管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/clue/clueComment/maintenance.html'
      }
    ]
  },
  {
    code: 'DAS105000',
    name: '知识库',
    icon: '&#xe69f;',
    child: [
      {
        code: 'DAS105100',
        name: '分类管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/repository/classify/classify.html#rep'
      },
      {
        code: 'DAS105200',
        name: '知识库列表',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/repository/maintenance/maintenance.html'
      }
    ]
  },
  {
    code: 'DAS106000',
    name: '专家库',
    icon: '&#xe679;',
    child: [
      {
        code: 'DAS106100',
        name: '分类管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/news/classify/classify.html#expert'
      },
      {
        code: 'DAS106200',
        name: '专家列表',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/expert/maintenance/maintenance.html'
      }
    ]
  },
  {
    code: 'DAS107000',
    name: '大讲堂',
    icon: '&#xe60c;',
    child: [
      {
        code: 'DAS107100',
        name: '分类管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/bigClassroom/classify/classify.html#room'
      },
      {
        code: 'DAS107200',
        name: '大讲堂列表',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/bigClassroom/maintenance/maintenance.html'
      }
    ]
  },
  {
    code: 'DAS110000',
    name: '版本管理',
    icon: '&#xe632;',
    target: 'content',
    link: 'pages/appVersion/maintenance.html'
  },
  {
    code: 'DAS109000',
    name: '用户管理',
    icon: '&#xe610;',
    child: [
      {
        code: 'DAS109100',
        name: '角色管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/user/role/maintenance.html'
      },
      {
        code: 'DAS109200',
        name: '功能点管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/user/function/maintenance.html'
      },
      {
        code: 'DAS109300',
        name: '用户管理',
        icon: 'fa fas fa-home',
        target: 'content',
        link: 'pages/user/maintenance/maintenance.html'
      }
    ]
  },
  {
    code: 'DAS102000',
    name: 'tt',
    icon: '&#xe60d;',
    target: 'content',
    link: 'component/shenhexiansuo/shenhexiansuo.html'
  },
  {
    code: 'DAS102000',
    name: 'tt',
    icon: '&#xe60d;',
    target: 'content',
    link: 'component/xinzengxinwen/xinzengxinwen.html'
  },
  {
    code: 'DAS102000',
    name: 'tt',
    icon: '&#xe60d;',
    target: 'content',
    link: 'component/zhuanjiaxinxi/zhuanjiaxinxi.html'
  },
  {
    code: 'DAS102000',
    name: 'tt',
    icon: '&#xe60d;',
    target: 'content',
    link: 'component/magazineManag/classify/classify.html'
  }
];
gMenu(menuList);
document.querySelector('#mainMenu ul').children[0].children[0].click();
function addIframe(link) {
  var target = link.target;
  var activeTab = tabContentList.querySelector('.active');
  if (frames[target]){
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    frames[target].classList.add('active');
    tabListItem.querySelector('.active').classList.remove('active');
    tabListItem.querySelector('a[target='+target+']').classList.add('active');
  } else {
    addTab(link);
    var src = link['data-href'];
    if(activeTab){
      activeTab.classList.remove('active');
    }
    var iframe = document.createElement('iframe');
    iframe.name = target;
    iframe.src = src;
    iframe.setAttribute('frameborder',0);
    iframe.classList.add('active');
    frames[target] = iframe;
    tabContentList.appendChild(iframe);
  }
}
