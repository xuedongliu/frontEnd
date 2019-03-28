import {$$} from '../../js/function.js';

class Loading {
  constructor(select) {
    this.init(select);
    this.hide();
  }
  static html(){
    return `
      <div class="l_main">
        <div class="l_square"><span></span><span></span><span></span></div>
        <div class="l_square"><span></span><span></span><span></span></div>
        <div class="l_square"><span></span><span></span><span></span></div>
        <div class="l_square"><span></span><span></span><span></span></div>
      </div>
    `;
  }
  init(select){
    this.select = typeof select === 'string'?$$(select):select;
    this.select.classList.add('loader');
    this.select.innerHTML = Loading.html();
  }
  hide(){
    this.select.style.display = 'none';
  }
  show(){
    this.select.style.display = 'flex';
  }
}

function loading(select) {
  return new Loading(select);
}

// loading('.loader');
export {loading};
