class Source {

  constructor() {
    this._process = o => o;
  }

  validate() {
    function isPromise(obj) {
      return Promise.resolve(obj) == obj;
    }

    if (typeof this.name !== 'string') throw 'Name not valid'
    if (typeof this.url !== 'string' && !isPromise(this.url)) throw 'Url not valid'
    if (typeof this.crawlFields !== 'object') throw 'crawlFields not valid'
    if (typeof this.crawlContainer !== 'string') throw 'crawlContainer not valid'
    if (typeof this.filter !== 'function') throw 'filter not valid'
    if (typeof this.formatMsg !== 'function') throw 'filter not valid'

    return true;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set url(url) {
    this._url = url;
  }

  get url() {
    return this._url;
  }

  set crawlFields(obj) {
    this._fields = obj;
  }

  get crawlFields() {
    return this._fields;
  }

  set crawlContainer(obj) {
    this._container = obj;
  }

  get crawlContainer() {
    return this._container;
  }

  set paginate(selector) {
    this._paginate = selector;
  }

  get paginage() {
    return this._paginate;
  }

  set process(func) {
    this._process = func;
  }

  get process() {
    return this._process;
  }

  set filter(filter) {
    this._filter = filter;
  }

  get filter() {
    return this._filter;
  }

  set formatMsg(func) {
    this._formatMsg = func;
  }

  get formatMsg() {
    return this._formatMsg;
  }

}

module.exports = Source;
