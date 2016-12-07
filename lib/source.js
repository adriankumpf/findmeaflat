const notify = require('./notify');
const config = require('./config');
const xray = require('./scraper');
const Store = require('./store');
const moment = require('moment');
const got = require('got');

class Source {

  constructor() {
    this._process = o => o;
  }


  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }


  set url(func) {
    this._url = func;
  }

  get url() {
    return this._url();
  }

/**
 * @param {object} obj - Specify item of the xray collection
 * @note  obj.id is mandatory
 */

  set crawlFields(obj) {
    this._fields = obj;
  }

  get crawlFields() {
    return this._fields;
  }


  // MANDATORY
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


  // process mapping function
  set process(func) {
    this._process = func;
  }

  get process() {
    return this._process;
  }


  // MANDATORY
  set filter(filter) {
    this._filter = filter;
  }

  get filter() {
    return this._filter;
  }


  // MANDATORY
  // takees the resulting obj as param
  set formatMsg(func) {
    this._formatMsg = func;
  }

  get formatMsg() {
    return this._formatMsg;
  }

}

module.exports = Source;
