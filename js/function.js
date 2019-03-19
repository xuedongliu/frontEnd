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
 * @param {Element|DocumentFragment} [ele] 需要插入元素的宿主元素
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

function observe(data,callback) {
  if (!data || typeof data !== 'object') {
    return;
  }
  // 取出所有属性遍历
  Object.keys(data).forEach(function(key) {
    defineReactive(data, key, data[key],callback);
  });
}

function defineReactive(data, key, val,callback) {
  observe(val,callback); // 监听子属性
  Object.defineProperty(data, key, { // 不能再define
    get: function() {
      return val;
    },
    set: function(newVal) {
      callback(key,val,newVal,data);
      val = newVal;
    }
  });
}

function removeAllChild(selector) {
  let _e;
  if (typeof selector!== 'string'){
    _e = selector;
  } else {
    _e = $$(selector);
  }
  while (_e.hasChildNodes()){
    _e.removeChild(_e.firstChild);
  }
}

export {$$, create, setProperty, observe, removeAllChild};
