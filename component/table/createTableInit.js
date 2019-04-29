import {$$, create} from '../../js/function.js';

class createTableInit {
  constructor(opt) {
    this.el = opt.el;
    this.pagination = opt.pagination || false;
    this.sortable = opt.sortable || false;
    this.ajax = opt.ajax || null;
    this.data = opt.data || {};
    this.sidePagination = opt.sidePagination || 'server';
    this.stripe = opt.stripe || true;
    this.stripeClass = opt.stripeClass || '';
    this.pageNumber = opt.pageNumber || 1;
    this.pageSize = opt.pageSize || 10;
    this.loading = opt.loading || 'loader';
    this.showTip = opt.showTip || false;
    this.columns = opt.columns || [];
    this.freeze = opt.freezeThead || false;
    this._d = {
      checkList: [],
      stripe: opt.stripe || true,
      stripeClass: opt.stripeClass || '',
      start: opt.pageNumber - 1,
      showTip: opt.showTip || false,
      init : true
    };
    this.dom = {};
    this.dom.root = $$(this.el);
    this.dom.tableContainer = create(`div.tableContainer${this.freezeThead ? '.freezeThead' : ''}`, this.dom.root);
    this.dom.table = create('table.table', this.dom.tableContainer);
    this.dom.documentFragment = document.createDocumentFragment();
    this.dom.thead = create('thead', this.dom.documentFragment);
    this.dom.tbody = create('tbody', this.dom.documentFragment);
    this.dom.status = create('div.table-footer-container', this.dom.root);
    this.dom.infoMsg = create('span.table-footer-msg', this.dom.status);
    this.dom.theadColGroup = create('colgroup');
    this.dom.theadColGroupCopy = create('colgroup');
    this.dom.freezeTable = create('table.freezeTable');
  }

  showMsg(index, end) {
    this.dom.infoMsg.innerHTML = `显示第${index + 1}-${end}条信息,共${this.data.total}条信息`;
  }

  freezeThead() {
    if (!this.dom.tableContainer.contains(this.dom.freezeTable)) {
      this.dom.tableContainer.appendChild(this.dom.freezeTable);
      this.dom.freezeTable.appendChild(this.dom.thead);
    }
    if (this.freeze) {
      this.dom.thead.querySelectorAll('th').forEach((item, index) => {
        let col = this.dom.theadColGroup.children[index] || create('col', this.dom.theadColGroup);
        col.width = item.clientWidth;
      });
      this.dom.table.appendChild(this.dom.theadColGroup);
      if (this.dom.freezeTable.contains(this.dom.theadColGroupCopy)) {
        this.dom.theadColGroupCopy.remove();
      }
      this.dom.theadColGroupCopy = this.dom.theadColGroup.cloneNode(true);
      this.dom.freezeTable.appendChild(this.dom.theadColGroupCopy);
      this.dom.tableContainer.style.marginTop = this.dom.thead.clientHeight + 'px';
      this.dom.freezeTable.style.width = this.dom.tableContainer.clientWidth + 'px';
    }
  }
}

export {createTableInit};
