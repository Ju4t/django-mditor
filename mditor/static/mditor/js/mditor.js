/*!
 * Mditor embed version 1.3.3
 * Homepage: http://mditor.com
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1);
	var Toolbar = __webpack_require__(84);
	var Editor = __webpack_require__(89);
	var Viewer = __webpack_require__(94);
	var Finder = __webpack_require__(97);
	var Shortcut = __webpack_require__(100);
	var Parser = __webpack_require__(102);
	
	__webpack_require__(151);
	__webpack_require__(158);
	__webpack_require__(159);
	__webpack_require__(160);
	
	var HIDDEN_CLASS_NAME = 'mditor-hidden';
	
	var Mditor = new mokit.Component({
	  template: __webpack_require__(162),
	
	  /*istanbul ignore next*/onInit: function onInit() {
	    this.PLATFORM = navigator.platform.toLowerCase();
	    this.EOL = this.PLATFORM == 'win32' ? '\r\n' : '\n';
	    this.CMD = this.PLATFORM.indexOf('mac') > -1 ? 'command' : 'ctrl';
	    this.INDENT = '  ';
	    this.shortcut = new Shortcut(this);
	    this.Parser = Parser;
	    this.parser = new Parser(this);
	  },
	  /*istanbul ignore next*/onReady: function onReady() {
	    /*istanbul ignore next*/var _this = this;
	
	    this.shortcut.bind('tab', this.editor.addIndent.bind(this.editor));
	    this.shortcut.bind('shift+tab', this.editor.removeIndent.bind(this.editor));
	    this.shortcut.bind('enter', function (event) {
	      /*istanbul ignore next*/_this._ulAndQuoteAutoComplete(event);
	      /*istanbul ignore next*/_this._olAutoComplete(event);
	      /*istanbul ignore next*/_this._keepIndent(event);
	    }, true);
	    setTimeout(function () {
	      /*istanbul ignore next*/_this.$emit('ready');
	    }, 0);
	  },
	
	
	  components: {
	    Toolbar: Toolbar,
	    Editor: Editor,
	    Viewer: Viewer,
	    Finder: Finder
	  },
	
	  props: {
	    height: '400px',
	    width: 'auto',
	    preview: false,
	    split: true,
	    fullscreen: false
	  },
	
	  /*istanbul ignore next*/data: function data() {
	    return {
	      self: this,
	      value: ''
	    };
	  },
	  /*istanbul ignore next*/find: function find(text) {
	    this.finder.show(text);
	  },
	  /*istanbul ignore next*/syncScroll: function syncScroll() {
	    if (!this.split || this.preview) return;
	    var offsetHeight = this.editor.textarea.offsetHeight;
	    var editorScrollHeight = this.editor.textarea.scrollHeight;
	    var viewerScrollHeight = this.viewer.$element.scrollHeight;
	    var editorScrollTop = this.editor.textarea.scrollTop;
	    var viewerScrollTop = editorScrollTop * (viewerScrollHeight - offsetHeight) / (editorScrollHeight - offsetHeight);
	    this.viewer.$element.scrollTop = viewerScrollTop;
	  },
	  /*istanbul ignore next*/onChanged: function onChanged(event) {
	    this.$emit('changed', event);
	    this.syncScroll();
	  },
	  /*istanbul ignore next*/onInput: function onInput(event) {
	    this.$emit('input', event);
	  },
	  /*istanbul ignore next*/onPaste: function onPaste(event) {
	    this.$emit('paste', event);
	    this.syncScroll();
	  },
	  /*istanbul ignore next*/onHeadDblClick: function onHeadDblClick(event) {
	    if (event.target.tagName == 'I') return;
	    this.$emit('head-dblclick', event);
	  },
	  /*istanbul ignore next*/_keepIndent: function _keepIndent(event) {
	    var text = this.editor.getBeforeTextInLine();
	    var parts = text.split(this.INDENT);
	    if (parts.length < 2) return;
	    var count = 0;
	    var buffer = [this.EOL];
	    while (parts[count] === '' && count < parts.length - 1) {
	      count++;
	      buffer.push(this.INDENT);
	    }
	    this.editor.insertBeforeText(buffer.join(''));
	    event.preventDefault();
	  },
	  /*istanbul ignore next*/_ulAndQuoteAutoComplete: function _ulAndQuoteAutoComplete(event) {
	    var text = this.editor.getBeforeTextInLine();
	    var prefix = text.substr(0, 2);
	    if (prefix != '- ' && prefix != '* ' && prefix != '> ') return;
	    if (text.length > prefix.length) {
	      this.editor.insertBeforeText(this.EOL + prefix);
	    } else {
	      this.editor.selectBeforeText(prefix.length);
	      this.editor.setSelectText('');
	    }
	    event.preventDefault();
	  },
	  /*istanbul ignore next*/_olAutoComplete: function _olAutoComplete(event) {
	    var exp = /^\d+\./;
	    var text = this.editor.getBeforeTextInLine();
	    var trimedText = text.trim();
	    if (!exp.test(trimedText)) return;
	    var num = trimedText.split('.')[0];
	    if (trimedText.length > num.length + 1) {
	      this.editor.insertBeforeText(this.EOL + (parseInt(num) + 1) + '. ');
	    } else {
	      this.editor.selectBeforeText(text.length);
	      this.editor.setSelectText('');
	    }
	    event.preventDefault();
	  },
	  /*istanbul ignore next*/focus: function focus() {
	    if (this.preview) {
	      this.$element.focus();
	    } else {
	      this.editor.focus();
	    }
	  },
	  /*istanbul ignore next*/blur: function blur() {
	    this.editor.blur();
	  },
	  /*istanbul ignore next*/addCommand: function addCommand(item) {
	    if (!item.name || !item.handler) return;
	    this.commands = this.commands || {};
	    this.commands[item.name] = item;
	    if (item.key) {
	      this.shortcut.bind(item.key, item.name, item.allowDefault, item.owner);
	    }
	  },
	  /*istanbul ignore next*/removeCommand: function removeCommand(name) {
	    this.commands = this.commands || {};
	    var item = this.commands[name];
	    if (!item) return;
	    this.shortcut.unbind(item.key);
	    this.commands[name] = null;
	    delete this.commands[name];
	  },
	  /*istanbul ignore next*/execCommand: function execCommand(name, event) {
	    event = event || {};
	    event.mditor = this;
	    event.toolbar = this.toolbar;
	    event.editor = this.editor;
	    this.commands[name].handler.call(this, event);
	  }
	});
	
	Mditor.fromTextarea = function (textarea) {
	  textarea.classList.add(HIDDEN_CLASS_NAME);
	  var mditor = new Mditor();
	  mditor.value = textarea.value;
	  mditor.$watch('value', function () {
	    textarea.value = mditor.value;
	  });
	  mditor.$mount(textarea);
	  mditor.switchTextarea = function () {
	    if (textarea.classList.contains(HIDDEN_CLASS_NAME)) {
	      textarea.value = mditor.value;
	      mditor.$element.classList.add(HIDDEN_CLASS_NAME);
	      textarea.classList.remove(HIDDEN_CLASS_NAME);
	    } else {
	      mditor.value = textarea.value;
	      textarea.classList.add(HIDDEN_CLASS_NAME);
	      mditor.$element.classList.remove(HIDDEN_CLASS_NAME);
	    }
	  };
	  return mditor;
	};
	
	Mditor.Parser = Parser;
	
	module.exports = window.Mditor = Mditor;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var info = __webpack_require__(2);
	var utils = __webpack_require__(3);
	var Class = __webpack_require__(4);
	var Watcher = __webpack_require__(5);
	var Observer = __webpack_require__(6);
	var Template = __webpack_require__(51);
	var Component = __webpack_require__(79);
	var EventEmitter = __webpack_require__(50);
	
	//????????????????????????
	utils.copy(Template, Component);
	
	Component.version = info.version;
	Component.Template = Template;
	Component.Watcher = Watcher;
	Component.Observer = Observer;
	Component.EventEmitter = EventEmitter;
	Component.utils = utils;
	Component.Class = Class;
	
	//???????????????????????????
	Component.use = function (plugin) {
	  var install = plugin.install || plugin;
	  if (!utils.isFunction(install)) {
	    throw new Error('Invalid Plugin');
	  }
	  return install.call(plugin, this);
	};
	
	//???????????????????????????
	//Component.use(Router);
	
	module.exports = Component;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = {"name":"mokit","version":"3.1.3"}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	(function (ntils) {
	
	  /**
	   * ?????????
	   */
	  ntils.noop = function () { };
	
	  /**
	   * ???????????????????????????NULL
	   * @method isNull
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isNull = function (obj) {
	    return obj === null || typeof obj === "undefined";
	  };
	
	  /**
	   * ??????????????????????????????
	   * @method trim
	   * @param  {String} str ????????????
	   * @return {String}     ???????????????
	   * @static
	   */
	  ntils.trim = function (str) {
	    if (this.isNull(str)) return str;
	    if (str.trim) {
	      return str.trim();
	    } else {
	      return str.replace(/(^[\\s]*)|([\\s]*$)/g, "");
	    }
	  };
	
	  /**
	   * ????????????
	   * @method replace
	   * @param {String} str ????????????
	   * @param {String} str1 ?????????????????????
	   * @param {String} str2 ?????????????????????
	   * @static
	   */
	  ntils.replace = function (str, str1, str2) {
	    if (this.isNull(str)) return str;
	    return str.replace(new RegExp(str1, 'g'), str2);
	  };
	
	  /**
	   * ????????????????????????
	   * @method startWith
	   * @param {String} str1 ????????????
	   * @param {String} str2 ?????????????????????
	   * @return {Boolean} ????????????
	   * @static
	   */
	  ntils.startWith = function (str1, str2) {
	    if (this.isNull(str1) || this.isNull(str2)) return false;
	    return str1.indexOf(str2) === 0;
	  };
	
	  /**
	   * ????????????
	   * @method contains
	   * @param {String} str1 ????????????
	   * @param {String} str2 ?????????????????????
	   * @return {Boolean} ??????
	   * @static
	   */
	  ntils.contains = function (str1, str2) {
	    var self = this;
	    if (this.isNull(str1) || this.isNull(str2)) return false;
	    return str1.indexOf(str2) > -1;
	  };
	
	  /**
	   * ????????????????????????
	   * @method endWidth
	   * @param {String} str1 ????????????
	   * @param {String} str2 ???????????????
	   * @return {Boolean} ????????????
	   * @static
	   */
	  ntils.endWith = function (str1, str2) {
	    if (this.isNull(str1) || this.isNull(str2)) return false;
	    return str1.indexOf(str2) === (str1.length - str2.length);
	  };
	
	  /**
	   * ??????????????????
	   * @method hasProperty
	   * @param  {Object}  obj  ??????
	   * @param  {String}  name ?????????
	   * @return {Boolean}      ??????
	   * @static
	   */
	  ntils.has = ntils.hasProperty = function (obj, name) {
	    if (this.isNull(obj) || this.isNull(name)) return false;
	    return (name in obj) || (obj.hasOwnProperty(name));
	  };
	
	  /**
	   * ???????????????????????????Function
	   * @method isFunction
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isFunction = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === "function";
	  };
	
	  /**
	   * ???????????????????????????String
	   * @method isString
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isString = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === 'string' || obj instanceof String;
	  };
	
	  /**
	   * ???????????????????????????Number
	   * @method isNumber
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isNumber = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === 'number' || obj instanceof Number;
	  };
	
	  /**
	   * ???????????????????????????Boolean
	   * @method isBoolean
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isBoolean = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === 'boolean' || obj instanceof Boolean;
	  };
	
	  /**
	   * ???????????????????????????HTML Element
	   * @method isElement
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isElement = function (obj) {
	    if (this.isNull(obj)) return false;
	    if (window.Element) {
	      return obj instanceof Element;
	    } else {
	      return (obj.tagName && obj.nodeType && obj.nodeName && obj.attributes && obj.ownerDocument);
	    }
	  };
	
	  /**
	   * ???????????????????????????HTML Text Element
	   * @method isText
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isText = function (obj) {
	    if (this.isNull(obj)) return false;
	    return obj instanceof Text;
	  };
	
	  /**
	   * ???????????????????????????Object
	   * @method isObject
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isObject = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === "object";
	  };
	
	  /**
	   * ???????????????????????????Array??????Array
	   * @method isArray
	   * @param  {Object}  obj ??????????????????
	   * @return {Boolean}     ??????
	   * @static
	   */
	  ntils.isArray = function (obj) {
	    if (this.isNull(obj)) return false;
	    var v1 = Object.prototype.toString.call(obj) === '[object Array]';
	    var v2 = obj instanceof Array;
	    var v3 = !this.isString(obj) && this.isNumber(obj.length) && this.isFunction(obj.splice);
	    var v4 = !this.isString(obj) && this.isNumber(obj.length) && obj[0];
	    return v1 || v2 || v3 || v4;
	  };
	
	  /**
	   * ?????????????????????????????????
	   * @method isDate
	   * @param {Object} val   ??????????????????
	   * @return {Boolean}           ??????
	   * @static
	   */
	  ntils.isDate = function (val) {
	    if (this.isNull(val)) return false;
	    return val instanceof Date;
	  };
	
	  /**
	   * ?????????????????????????????????
	   * @method isDate
	   * @param {Object} val   ??????????????????
	   * @return {Boolean}           ??????
	   * @static
	   */
	  ntils.isRegexp = function (val) {
	    return val instanceof RegExp;
	  };
	
	  /**
	   * ???????????????
	   * @method toArray
	   * @param {Array|Object} array ?????????
	   * @return {Array} ??????????????????
	   * @static
	   */
	  ntils.toArray = function (array) {
	    if (this.isNull(array)) return [];
	    return Array.prototype.slice.call(array);
	  };
	
	  /**
	   * ??????????????????
	   * @method toDate
	   * @param {Number|String} val ??????????????????????????????
	   * @return {Date} ????????????
	   * @static
	   */
	  ntils.toDate = function (val) {
	    var self = this;
	    if (self.isNumber(val))
	      return new Date(val);
	    else if (self.isString(val))
	      return new Date(self.replace(self.replace(val, '-', '/'), 'T', ' '));
	    else if (self.isDate(val))
	      return val;
	    else
	      return null;
	  };
	
	  /**
	   * ???????????????????????????
	   * @method each
	   * @param  {Object or Array}   obj  ???????????????????????????
	   * @param  {Function} fn            ????????????
	   * @return {void}                   ????????????
	   * @static
	   */
	  ntils.each = function (list, handler, scope) {
	    if (this.isNull(list) || this.isNull(handler)) return;
	    if (this.isArray(list)) {
	      var listLength = list.length;
	      for (var i = 0; i < listLength; i++) {
	        var rs = handler.call(scope || list[i], i, list[i]);
	        if (!this.isNull(rs)) return rs;
	      }
	    } else {
	      for (var key in list) {
	        var rs = handler.call(scope || list[key], key, list[key]);
	        if (!this.isNull(rs)) return rs;
	      }
	    }
	  };
	
	  /**
	   * ???????????????
	   * @method formatDate
	   * @param {Date|String|Number} date ??????
	   * @param {String} format ??????????????????
	   * @param {object} dict ????????????
	   * @return {String} ???????????????
	   * @static
	   */
	  ntils.formatDate = function (date, format, dict) {
	    if (this.isNull(format) || this.isNull(date)) return date;
	    date = this.toDate(date);
	    dict = dict || {};
	    var placeholder = {
	      "M+": date.getMonth() + 1, //month
	      "d+": date.getDate(), //day
	      "h+": date.getHours(), //hour
	      "m+": date.getMinutes(), //minute
	      "s+": date.getSeconds(), //second
	      "w+": date.getDay(), //week
	      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
	      "S": date.getMilliseconds() //millisecond
	    }
	    if (/(y+)/.test(format)) {
	      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    }
	    for (var key in placeholder) {
	      if (new RegExp("(" + key + ")").test(format)) {
	        var value = placeholder[key];
	        value = dict[value] || value;
	        format = format.replace(RegExp.$1, RegExp.$1.length == 1
	          ? value : ("00" + value).substr(("" + value).length));
	      }
	    }
	    return format;
	  };
	
	  /**
	   * ????????????
	   * @method copy
	   * @param {Object} src ?????????
	   * @param {Object} dst ????????????
	   * @static
	   */
	  ntils.copy = function (src, dst, igonres) {
	    dst = dst || (this.isArray(src) ? [] : {});
	    this.each(src, function (key) {
	      if (igonres && igonres.indexOf(key) > -1) return;
	      delete dst[key];
	      if (Object.getOwnPropertyDescriptor) {
	        try {
	          Object.defineProperty(dst, key, Object.getOwnPropertyDescriptor(src, key));
	        } catch (ex) {
	          dst[key] = src[key];
	        }
	      } else {
	        dst[key] = src[key];
	      }
	    })
	    return dst;
	  };
	
	  /**
	   * ??????????????????
	   * @method clone
	   * @param {Object} src ?????????
	   * @return {Object} ?????????
	   * @static
	   */
	  ntils.clone = function (src, igonres) {
	    if (this.isNull(src) ||
	      this.isString(src) ||
	      this.isNumber(src) ||
	      this.isBoolean(src) ||
	      this.isDate(src)) {
	      return src;
	    }
	    var objClone = src;
	    try {
	      objClone = new src.constructor();
	    } catch (ex) { }
	    this.each(src, function (key, value) {
	      if (objClone[key] != value && !this.contains(igonres, key)) {
	        if (this.isObject(value)) {
	          objClone[key] = this.clone(value, igonres);
	        } else {
	          objClone[key] = value;
	        }
	      }
	    }, this);
	    ['toString', 'valueOf'].forEach(function (key) {
	      if (this.contains(igonres, key)) return;
	      this.defineFreezeProp(objClone, key, src[key]);
	    }, this);
	    return objClone;
	  };
	
	  /**
	   * ????????????
	   * @method mix
	   * @return ??????????????????
	   * @param {Object} dst ????????????
	   * @param {Object} src ?????????
	   * @param {Array} igonres ??????????????????,
	   * @param {Number} mode ??????
	   */
	  ntils.mix = function (dst, src, igonres, mode, igonreNull) {
	    //?????????????????????????????????Obj to Obj???  
	    if (mode) {
	      switch (mode) {
	        case 1: // proto to proto  
	          return ntils.mix(dst.prototype, src.prototype, igonres, 0);
	        case 2: // object to object and proto to proto  
	          ntils.mix(dst.prototype, src.prototype, igonres, 0);
	          break; // pass through  
	        case 3: // proto to static  
	          return ntils.mix(dst, src.prototype, igonres, 0);
	        case 4: // static to proto  
	          return ntils.mix(dst.prototype, src, igonres, 0);
	        default: // object to object is what happens below  
	      }
	    }
	    //---
	    src = src || {};
	    dst = dst || (this.isArray(src) ? [] : {});
	    this.keys(src).forEach(function (key) {
	      if (this.contains(igonres, key)) return;
	      if (igonreNull && this.isNull(src[key])) return;
	      if (this.isObject(src[key]) &&
	        (src[key].constructor == Object ||
	          src[key].constructor == Array ||
	          src[key].constructor == null)) {
	        dst[key] = ntils.mix(dst[key], src[key], igonres, 0, igonreNull);
	      } else {
	        dst[key] = src[key];
	      }
	    }, this);
	    return dst;
	  };
	
	  /**
	   * ???????????????????????????
	   **/
	  ntils.defineFreezeProp = function (obj, name, value) {
	    try {
	      Object.defineProperty(obj, name, {
	        value: value,
	        enumerable: false,
	        configurable: true, //?????????????????????
	        writable: false //????????????????????????????????????
	      });
	    } catch (err) {
	      obj[name] = value;
	    }
	  };
	
	  /**
	   * ???????????? key 
	   */
	  ntils.keys = function (obj) {
	    if (Object.keys) return Object.keys(obj);
	    var keys = [];
	    this.each(obj, function (key) {
	      keys.push(key);
	    });
	    return keys;
	  };
	
	  /**
	   * ??????????????????
	   */
	  ntils.create = function (proto, props) {
	    if (Object.create) return Object.create(proto, props);
	    var Cotr = function () { };
	    Cotr.prototype = proto;
	    var obj = new Cotr();
	    if (props) this.copy(props, obj);
	    return obj;
	  };
	
	  /**
	   * ?????? proto
	   * ???????????? setPrototypeOf ???????????? __proto__ ????????????
	   * ??????????????? copy ??????
	   */
	  ntils.setPrototypeOf = function (obj, proto) {
	    if (Object.setPrototypeOf) {
	      return Object.setPrototypeOf(obj, proto || this.create(null));
	    } else {
	      if (!('__proto__' in Object)) this.copy(proto, obj);
	      obj.__proto__ = proto;
	    }
	  };
	
	  /**
	   * ?????? proto
	   */
	  ntils.getPrototypeOf = function (obj) {
	    if (obj.__proto__) return obj.__proto__;
	    if (Object.getPrototypeOf) return Object.getPrototypeOf(obj);
	    if (obj.constructor) return obj.constructor.prototype;
	  };
	
	  /**
	   * ??????????????????
	   */
	  ntils.deepEqual = function (a, b) {
	    if (a === b) return true;
	    if (!this.isObject(a) || !this.isObject(b)) return false;
	    var aKeys = this.keys(a);
	    var bKeys = this.keys(b);
	    if (aKeys.length !== bKeys.length) return false;
	    var allKeys = aKeys.concat(bKeys);
	    var checkedMap = this.create(null);
	    var result = true;
	    this.each(allKeys, function (i, key) {
	      if (checkedMap[key]) return;
	      if (!this.deepEqual(a[key], b[key])) result = false;
	      checkedMap[key] = true;
	    }, this);
	    return result;
	  };
	
	  /**
	   * ????????????????????????????????????
	   * @param {number} fromNum ????????????
	   * @param {Number} toNum ????????????
	   * @param {Number} step ?????????
	   * @param {function} handler ????????????
	   * @returns {void} ?????????
	   */
	  ntils.fromTo = function (fromNum, toNum, step, handler) {
	    if (!handler) handler = [step, step = handler][0];
	    step = Math.abs(step || 1);
	    if (fromNum < toNum) {
	      for (var i = fromNum; i <= toNum; i += step) handler(i);
	    } else {
	      for (var i = fromNum; i >= toNum; i -= step) handler(i);
	    }
	  };
	
	  /**
	   * ????????????Guid
	   * @method newGuid
	   * @return {String} GUID?????????
	   * @static
	   */
	  ntils.newGuid = function () {
	    var S4 = function () {
	      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    };
	    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	  };
	
	  /**
	   * ????????????
	   **/
	  ntils.map = function (list, fn) {
	    var buffer = this.isArray(list) ? [] : {};
	    this.each(list, function (name, value) {
	      buffer[name] = fn(name, value);
	    });
	    return buffer;
	  };
	
	  /**
	   * ???????????????????????????
	   */
	  ntils.setByPath = function (obj, path, value) {
	    if (this.isNull(obj) || this.isNull(path) || path === '') {
	      return;
	    }
	    if (!this.isArray(path)) {
	      path = path.replace(/\[/, '.').replace(/\]/, '.').split('.');
	    }
	    this.each(path, function (index, name) {
	      if (this.isNull(name) || name.length < 1) return;
	      if (index === path.length - 1) {
	        obj[name] = value;
	      } else {
	        obj[name] = obj[name] || {};
	        obj = obj[name];
	      }
	    }, this);
	  };
	
	  /**
	   * ???????????????????????????
	   */
	  ntils.getByPath = function (obj, path) {
	    if (this.isNull(obj) || this.isNull(path) || path === '') {
	      return obj;
	    }
	    if (!this.isArray(path)) {
	      path = path.replace(/\[/, '.').replace(/\]/, '.').split('.');
	    }
	    this.each(path, function (index, name) {
	      if (this.isNull(name) || name.length < 1) return;
	      if (!this.isNull(obj)) obj = obj[name];
	    }, this);
	    return obj;
	  };
	
	  /**
	   * ????????????
	   **/
	  ntils.unique = function (array) {
	    if (this.isNull(array)) return array;
	    var newArray = [];
	    this.each(array, function (i, value) {
	      if (newArray.indexOf(value) > -1) return;
	      newArray.push(value);
	    });
	    return newArray;
	  };
	
	  /**
	   * ?????? function ???????????????
	   **/
	  ntils.getFunctionArgumentNames = function (fn) {
	    if (!fn) return [];
	    var src = fn.toString();
	    var parts = src.split(')')[0].split('=>')[0].split('(');
	    return (parts[1] || parts[0]).split(',').map(function (name) {
	      return name.trim();
	    }).filter(function (name) {
	      return name != 'function';
	    });
	  };
	
	  /**
	   * ???????????????
	   */
	  ntils.short = function (str, maxLength) {
	    if (!str) return str;
	    maxLength = maxLength || 40;
	    var strLength = str.length;
	    var trimLength = maxLength / 2;
	    return strLength > maxLength ? str.substr(0, trimLength) + '...' + str.substr(strLength - trimLength) : str;
	  };
	
	  /**
	   * ???????????????
	   */
	  ntils.firstUpper = function (str) {
	    if (this.isNull(str)) return;
	    return str.substring(0, 1).toUpperCase() + str.substring(1);
	  };
	
	  /**
	   * ?????????????????????
	   */
	  ntils.escapeRegExp = function (str) {
	    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	  };
	
	  /**
	   * ?????????????????? dom 
	   * @param {string} str ?????????
	   * @returns {HTMLNode} ???????????? DOM 
	   */
	  ntils.parseDom = function (str) {
	    this._PDD_ = this._PDD_ || document.createElement('div');
	    this._PDD_.innerHTML = ntils.trim(str);
	    var firstNode = this._PDD_.childNodes[0];
	    //??? clone ??????????????? innerHTML ??????
	    //?????? IE9 ????????????????????????????????? DOM ???????????????
	    if (firstNode) firstNode = firstNode.cloneNode(true);
	    this._PDD_.innerHTML = '';
	    return firstNode;
	  };
	
	})(( false) ? (window.ntils = {}) : exports);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	const utils = __webpack_require__(3);
	
	function ClassFactory(options) {
	  //?????? options
	  options = options || utils.create(null);
	  options.$name = options.$name || 'Class';
	  options.$extends = options.$extends || ClassFactory;
	  options.$static = options.$static || utils.create(null);
	  //???????????? prototype
	  var superPrototype = utils.isFunction(options.$extends) ?
	    options.$extends.prototype : options.$extends;
	  //????????????
	  var Class = function () {
	    //?????? super
	    if (!this.$super) {
	      utils.defineFreezeProp(this, '$super', function () {
	        if (this._super_called_) return this._super_ret_;
	        this._super_called_ = true;
	        if (utils.isFunction(options.$extends)) {
	          this._super_ret_ = options.$extends.apply(this, arguments);
	          //?????????????????????????????????
	          if (this._super_ret_) {
	            var proto = utils.getPrototypeOf(this);
	            utils.setPrototypeOf(proto, this._super_ret_);
	          }
	        } else {
	          this._super_ret_ = options.$extends;
	        }
	        return this._super_ret_;
	      });
	      for (var name in superPrototype) {
	        var value = superPrototype[name];
	        if (utils.isFunction(value)) {
	          this.$super[name] = value.bind(this);
	        } else {
	          this.$super[name] = value;
	        }
	      }
	    }
	    //????????????
	    if (utils.isFunction(options.constructor) &&
	      options.constructor !== Object) {
	      return options.constructor.apply(this, arguments);
	    } else {
	      //?????????????????? constructor ?????????????????????
	      this.$super.apply(this, arguments);
	    }
	  };
	  //?????? prototype
	  Class.prototype = utils.create(superPrototype);
	  utils.copy(options, Class.prototype);
	  utils.defineFreezeProp(Class.prototype, '$class', Class);
	  //??????????????????
	  utils.copy(options.$static, Class);
	  if (utils.isFunction(options.$extends)) {
	    utils.setPrototypeOf(Class, options.$extends);
	  }
	  if (!options.$extends.$extend) {
	    utils.copy(ClassFactory, Class);
	  }
	  utils.defineFreezeProp(Class, '$super', options.$extends);
	  //--
	  return Class;
	}
	
	//??????????????????
	ClassFactory.$extend = function (options) {
	  options.$extends = this;
	  return new ClassFactory(options);
	};
	
	ClassFactory.Class = ClassFactory;
	module.exports = ClassFactory;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Class = __webpack_require__(4);
	var utils = __webpack_require__(3);
	
	/**
	 * Watcher ???
	 * ??????????????????????????????????????????????????????????????? Watcher ??????
	 */
	var Watcher = new Class({
	
	  /**
	   * ????????????????????????????????????????????????????????? Watcher ??????
	   * @param {function} calcor ????????????
	   * @param {function} handler ????????????
	   * @param {boolean} first ???????????????????????????
	   * @returns {void} ?????????
	   */
	  constructor: function /*istanbul ignore next*/constructor(calcor, handler, first) {
	    if (!utils.isFunction(calcor) || !utils.isFunction(handler)) {
	      throw new Error('Invalid parameters');
	    }
	    this.calcor = calcor;
	    this.handler = handler;
	    if (first) this.calc(true);
	  },
	
	  /**
	   * ????????????
	   * @param {boolean} force ????????????????????????????????????
	   * @returns {Object} ???????????????
	   */
	  calc: function /*istanbul ignore next*/calc(force) {
	    var newValue = this.calcor();
	    if (force || !utils.deepEqual(newValue, this.value)) {
	      this.handler(newValue, this.value);
	    }
	    this.value = utils.clone(newValue);
	  }
	
	});
	
	module.exports = Watcher;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	/*istanbul ignore next*/var _keys = __webpack_require__(7);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _getOwnPropertyDescriptor = __webpack_require__(42);
	
	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);
	
	var _defineProperty = __webpack_require__(47);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Class = __webpack_require__(4);
	var utils = __webpack_require__(3);
	var EventEmitter = __webpack_require__(50);
	
	var OBSERVER_PROP_NAME = '_observer_';
	var CHANGE_EVENT_NAME = 'change';
	var EVENT_MAX_DISPATCH_LAYER = 10;
	var IGNORE_REGEXPS = [/^\_(.*)\_$/i, /^\_\_/i];
	
	/**
	 * ??????????????????????????????????????????
	 * ??????????????????:
	 *   ????????????????????????????????????????????????????????? delete ????????????????????????????????????????????????
	 *   ???????????? clearReference ??????????????????????????????????????? parents ???????????????????????????????????????????????????
	 * ???????????????:
	 *   ???????????????????????????????????????????????? ob.parents ????????????????????????????????????????????? filter ?????????
	 *   ????????????????????????????????????????????????????????????????????? clearReference ????????????
	 * ???????????????: 
	 *   ?????????????????????????????????????????? observer change ???????????????????????? observer ??????????????????
	 *   ????????????????????????????????????????????????????????????????????? change ??????????????? ob ??????????????????????????????
	 *   clearReference ?????????????????????????????????????????? delete ??????????????????????????????????????????
	 * ???????????????: 
	 *   ??????????????????????????? deep ??????????????? deep ??? ob ??????????????????????????????????????????????????????????????????
	 *   ?????????????????????????????????????????????????????????????????????
	 */
	var Observer = new Class({
	  $extends: EventEmitter,
	
	  /**
	   * ??????????????????????????????????????????
	   * @param {Object} target ????????????
	   * @param {Object} options ??????
	   * @returns {void} ?????????
	   */
	  constructor: function /*istanbul ignore next*/constructor(target, options) {
	    if (utils.isNull(target)) {
	      throw new Error('Invalid target');
	    }
	    options = options || {};
	    var observer = target[OBSERVER_PROP_NAME];
	    if (observer) {
	      utils.copy(options, observer.options);
	      //?????????????????? A ???????????? B ??? prop ??????A ?????????????????? B ??????
	      //???????????????????????????????????????????????? prop ??????????????? excute ??????????????????????????? update ??????
	      // if (observer.options.root) {
	      //   observer.parents.length = 0;
	      // }
	      observer.apply();
	      return observer;
	    }
	    EventEmitter.call(this);
	    utils.defineFreezeProp(this, 'options', options);
	    utils.defineFreezeProp(this, 'shadow', {});
	    utils.defineFreezeProp(this, 'target', target);
	    utils.defineFreezeProp(this, 'parents', []);
	    utils.defineFreezeProp(target, OBSERVER_PROP_NAME, this);
	    this.apply();
	  },
	
	  /**
	   * ???????????????????????????????????????????????????????????????
	   * ???????????? set ???????????????????????????????????????
	   * @param {string} name ??????
	   * @param {Object} value ???
	   * @returns {void} ?????????
	   */
	  set: function /*istanbul ignore next*/set(name, value) {
	    if (utils.isFunction(value) || Observer.isIgnore(name)) {
	      return;
	    }
	    /*istanbul ignore next*/(0, _defineProperty2.default)(this.target, name, {
	      get: function /*istanbul ignore next*/get() {
	        return this[OBSERVER_PROP_NAME].shadow[name];
	      },
	      set: function /*istanbul ignore next*/set(value) {
	        var observer = this[OBSERVER_PROP_NAME];
	        var oldValue = observer.shadow[name];
	        if (oldValue === value) return;
	        if (utils.isObject(value)) {
	          var childObserver = new Observer(value);
	          observer.addChild(childObserver, name);
	        }
	        //????????????????????????
	        //????????? delete ???????????????????????????????????????
	        if (oldValue && oldValue[OBSERVER_PROP_NAME]) {
	          observer.removeChild(oldValue[OBSERVER_PROP_NAME], name);
	        }
	        observer.shadow[name] = value;
	        observer.emitChange({ path: name, value: value });
	      },
	      configurable: true,
	      enumerable: true
	    });
	    this.target[name] = value;
	  },
	
	  /**
	   * ???????????????????????????????????????
	   * @returns {void} ?????????
	   */
	  apply: function /*istanbul ignore next*/apply() {
	    if (utils.isArray(this.target)) {
	      this._wrapArray(this.target);
	    }
	    var names = this._getPropertyNames(this.target);
	    names.forEach(function (name) {
	      var desc = /*istanbul ignore next*/(0, _getOwnPropertyDescriptor2.default)(this.target, name);
	      if (!('value' in desc)) return;
	      this.set(name, this.target[name]);
	    }, this);
	  },
	
	  /**
	   * ????????????????????????
	   * @returns {void} ?????????
	   */
	  clearReference: function /*istanbul ignore next*/clearReference() {
	    utils.each(this.target, function (name, value) {
	      if (utils.isNull(value)) return;
	      var child = value[OBSERVER_PROP_NAME];
	      if (child) this.removeChild(child);
	    }, this);
	  },
	
	  /**
	   * ???????????????????????????????????????????????????
	   * @param {string} eventName ????????????
	   * @param {Object} event ????????????
	   * @returns {void} ?????????
	   */
	  dispatch: function /*istanbul ignore next*/dispatch(eventName, event) {
	    if (event._src_ === this) return;
	    event._src_ = event._src_ || this;
	    event._layer_ = event._layer_ || 0;
	    if (event._layer_++ >= EVENT_MAX_DISPATCH_LAYER) return;
	    this.emit(eventName, event);
	    if (!this.parents || this.parents.length < 1) return;
	    this.parents.forEach(function (item) {
	      if (!(item.name in item.parent.target)) {
	        return item.parent.removeChild(this);
	      }
	      var parentEvent = utils.copy(event);
	      parentEvent.path = item.name + '.' + event.path;
	      item.parent.dispatch(eventName, parentEvent);
	    }, this);
	  },
	
	  /**
	   * ?????????????????????
	   * @param {Object} child ?????????
	   * @param {String} name ?????????
	   * @returns {void} ?????????
	   */
	  addChild: function /*istanbul ignore next*/addChild(child, name) {
	    if (utils.isNull(child) || utils.isNull(name)) {
	      throw new Error('Invalid paramaters');
	    }
	    if (child.options.root) return;
	    child.parents.push({ parent: this, name: name });
	  },
	
	  /**
	   * ???????????????
	   * @param {Object} child ?????????
	   * @param {String} name ?????????
	   * @returns {void} ?????????
	   */
	  removeChild: function /*istanbul ignore next*/removeChild(child, name) {
	    if (utils.isNull(child)) {
	      throw new Error('Invalid paramaters');
	    }
	    var foundIndex = -1;
	    child.parents.forEach(function (item, index) {
	      if (item.parent === this && item.name === name) {
	        foundIndex = index;
	      }
	    }, this);
	    if (foundIndex > -1) {
	      child.parents.splice(foundIndex, 1);
	    }
	  },
	
	  /**
	   * ?????? change ??????
	   * @param {Object} event ????????????
	   * @returns {void} ?????????
	   */
	  emitChange: function /*istanbul ignore next*/emitChange(event) {
	    this.dispatch(CHANGE_EVENT_NAME, event);
	  },
	
	  /**
	   * ??????????????????????????????
	   * @returns {Array} ????????????????????????
	   */
	  _getPropertyNames: function /*istanbul ignore next*/_getPropertyNames() {
	    var names = utils.isArray(this.target) ? this.target.map(function (item, index) {
	      return index;
	    }) : /*istanbul ignore next*/(0, _keys2.default)(this.target);
	    return names.filter(function (name) {
	      return name !== OBSERVER_PROP_NAME;
	    });
	  },
	
	  /**
	   * ????????????
	   * @param {array} array ?????????
	   * @returns {array} ??????????????????
	   */
	  _wrapArray: function /*istanbul ignore next*/_wrapArray(array) {
	    utils.defineFreezeProp(array, 'push', function () {
	      var items = [].slice.call(arguments);
	      items.forEach(function (item) {
	        //???????????????????????? index ??? change ??????
	        this[OBSERVER_PROP_NAME].set(array.length, item);
	      }, this);
	      this[OBSERVER_PROP_NAME].emitChange({ path: 'length', value: this.length });
	    });
	    utils.defineFreezeProp(array, 'pop', function () {
	      var item = [].pop.apply(this, arguments);
	      this[OBSERVER_PROP_NAME].emitChange({ path: this.length, value: item });
	      this[OBSERVER_PROP_NAME].emitChange({ path: 'length', value: this.length });
	      return item;
	    });
	    utils.defineFreezeProp(array, 'unshift', function () {
	      var items = [].slice.call(arguments);
	      items.forEach(function (item) {
	        //???????????????????????? index ??? change ??????
	        this[OBSERVER_PROP_NAME].set(0, item);
	      }, this);
	      this[OBSERVER_PROP_NAME].emitChange({ path: 'length', value: this.length });
	    });
	    utils.defineFreezeProp(array, 'shift', function () {
	      var item = [].shift.apply(this, arguments);
	      this[OBSERVER_PROP_NAME].emitChange({ path: 0, value: item });
	      this[OBSERVER_PROP_NAME].emitChange({ path: 'length', value: this.length });
	      return item;
	    });
	    utils.defineFreezeProp(array, 'splice', function () {
	      var startIndex = arguments[0];
	      var endIndex = utils.isNull(arguments[1]) ? startIndex + arguments[1] : this.length - 1;
	      var items = [].splice.apply(this, arguments);
	      for (var i = startIndex; i <= endIndex; i++) {
	        this[OBSERVER_PROP_NAME].emitChange({ path: i, value: items[i - startIndex] });
	      }
	      this[OBSERVER_PROP_NAME].emitChange({ path: 'length', value: this.length });
	      return items;
	    });
	    utils.defineFreezeProp(array, 'set', function (index, value) {
	      if (index >= this.length) {
	        this[OBSERVER_PROP_NAME].emitChange({ path: 'length', value: this.length });
	      }
	      this[OBSERVER_PROP_NAME].set(index, value);
	    });
	  }
	
	});
	
	/**
	 * ??????????????????
	 * @param {Object} target ????????????
	 * @return {Observer} ???????????????
	 */
	Observer.observe = function (target) {
	  return new Observer(target);
	};
	
	/**
	 * ?????????????????????????????????
	 * @param {string} word ?????????????????????
	 * @returns {void} ?????????
	 */
	Observer.isIgnore = function (word) {
	  return IGNORE_REGEXPS.some(function (re) /*istanbul ignore next*/{
	    return re.test(word);
	  });
	};
	
	module.exports = Observer;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	module.exports = __webpack_require__(29).Object.keys;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(10);
	var $keys = __webpack_require__(12);
	
	__webpack_require__(27)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(11);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(13);
	var enumBugKeys = __webpack_require__(26);
	
	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(14);
	var toIObject = __webpack_require__(15);
	var arrayIndexOf = __webpack_require__(18)(false);
	var IE_PROTO = __webpack_require__(22)('IE_PROTO');
	
	module.exports = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(16);
	var defined = __webpack_require__(11);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(17);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(15);
	var toLength = __webpack_require__(19);
	var toAbsoluteIndex = __webpack_require__(21);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(20);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(20);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(23)('keys');
	var uid = __webpack_require__(25);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(24);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(28);
	var core = __webpack_require__(29);
	var fails = __webpack_require__(38);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
	};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(24);
	var core = __webpack_require__(29);
	var ctx = __webpack_require__(30);
	var hide = __webpack_require__(32);
	var PROTOTYPE = 'prototype';
	
	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.5.1' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(31);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(33);
	var createDesc = __webpack_require__(41);
	module.exports = __webpack_require__(37) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(34);
	var IE8_DOM_DEFINE = __webpack_require__(36);
	var toPrimitive = __webpack_require__(40);
	var dP = Object.defineProperty;
	
	exports.f = __webpack_require__(37) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(37) && !__webpack_require__(38)(function () {
	  return Object.defineProperty(__webpack_require__(39)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(38)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35);
	var document = __webpack_require__(24).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(35);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(43), __esModule: true };

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(44);
	var $Object = __webpack_require__(29).Object;
	module.exports = function getOwnPropertyDescriptor(it, key) {
	  return $Object.getOwnPropertyDescriptor(it, key);
	};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(15);
	var $getOwnPropertyDescriptor = __webpack_require__(45).f;
	
	__webpack_require__(27)('getOwnPropertyDescriptor', function () {
	  return function getOwnPropertyDescriptor(it, key) {
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE = __webpack_require__(46);
	var createDesc = __webpack_require__(41);
	var toIObject = __webpack_require__(15);
	var toPrimitive = __webpack_require__(40);
	var has = __webpack_require__(14);
	var IE8_DOM_DEFINE = __webpack_require__(36);
	var gOPD = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(37) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(48), __esModule: true };

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(49);
	var $Object = __webpack_require__(29).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(28);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(37), 'Object', { defineProperty: __webpack_require__(33).f });


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var utils = __webpack_require__(3);
	var Class = __webpack_require__(4);
	
	/**
	 * ?????????????????????
	 */
	var EventEmitter = new Class({
	  $extends: Function,
	
	  /**
	   * ??????????????????????????????????????????
	   * @param {object} target ????????????????????????????????????
	   * @returns {void} ?????????
	   */
	  constructor: function /*istanbul ignore next*/constructor(target) {
	    target = target || this;
	    var emitter = target._emitter_;
	    if (emitter) return emitter;
	    utils.defineFreezeProp(this, '_target_', target);
	    utils.defineFreezeProp(target, '_emitter_', this);
	    this._isNative_ = this._isNativeObject(this._target_);
	    this._listeners_ = this._listeners_ || {};
	    this.on = this.$on = this.$addListener = this.addListener;
	    this.off = this.$off = this.$removeListener = this.removeListener;
	    this.$emit = this.emit;
	  },
	
	  /**
	   * ??????????????????????????????
	   * @param {object} obj ??????
	   * @returns {void} ????????????
	   */
	  _isNativeObject: function /*istanbul ignore next*/_isNativeObject(obj) {
	    return obj.addEventListener && obj.removeEventListener && obj.dispatchEvent;
	  },
	
	  /**
	   * ??????????????????????????????
	   * @param {string} name ????????????
	   * @param {function} listener ??????????????????
	   * @param {capture} capture ???????????????????????????(???????????? dom ???????????????)
	   * @returns {void} ?????????
	   */
	  addListener: function /*istanbul ignore next*/addListener(name, listener, capture) {
	    if (this._isNative_) {
	      this._addNativeEventListener(name, listener, capture);
	    }
	    this._listeners_[name] = this._listeners_[name] || [];
	    this._listeners_[name].push(listener);
	    if (this._listeners_[name].length > EventEmitter._maxListeners) {
	      throw new Error('The `' + name + '` event listener is not more than 10');
	    }
	  },
	
	  /**
	   * ???????????????/??????/???????????????????????????
	   * @param {string} name ????????????
	   * @param {function} listener ??????????????????
	   * @param {capture} capture ???????????????????????????(???????????? dom ???????????????)
	   * @returns {void} ?????????
	   */
	  removeListener: function /*istanbul ignore next*/removeListener(name, listener, capture) {
	    if (name && listener) {
	      if (this._isNative_) {
	        this._removeNativeEventListener(name, listener, capture);
	      }
	      if (!this._listeners_[name]) return;
	      var index = this._listeners_[name].indexOf(listener);
	      this._listeners_[name].splice(index, 1);
	    } else if (name) {
	      if (this._isNative_ && this._listeners_[name]) {
	        this._listeners_[name].forEach(function (_listener) {
	          this.removeListener(name, _listener, capture);
	        }, this);
	      }
	      delete this._listeners_[name];
	    } else {
	      utils.each(this._listeners_, function (name) {
	        this.removeListener(name, null, capture);
	      }, this);
	      this._listeners_ = {};
	    }
	  },
	
	  /**
	   * ???????????????????????????
	   * @param {string} name ????????????
	   * @param {object} data ???????????????
	   * @param {string} canBubble ????????????(???????????? dom ???????????????)
	   * @param {object} cancelAble ????????????(???????????? dom ???????????????)
	   * @returns {void} ?????????
	   */
	  emit: function /*istanbul ignore next*/emit(name, data, canBubble, cancelAble) {
	    if (this._isNative_) {
	      return this._emitNativeEvent(name, data, canBubble, cancelAble);
	    }
	    if (!this._listeners_[name]) return;
	    var stopPropagation = false;
	    this._listeners_[name].forEach(function (handler) {
	      var rs = handler.call(this._target_, data);
	      if (rs === false) stopPropagation = true;
	    }, this);
	    return stopPropagation;
	  },
	
	  /**
	   * ?????? DOM ????????????
	   * @param {string} name ????????????
	   * @param {function} listener ??????????????????
	   * @param {capture} capture ???????????????????????????
	   * @returns {void} ?????????
	   */
	  _addNativeEventListener: function /*istanbul ignore next*/_addNativeEventListener(name, listener, capture) {
	    this._target_.addEventListener(name, listener, capture);
	    //????????????????????????????????? ??????????????????
	    var descriptor = EventEmitter._events[name];
	    if (descriptor) {
	      descriptor.addListener = descriptor.addListener || descriptor.on;
	      descriptor.addListener(this, name, listener, capture);
	    }
	  },
	
	  /**
	   * ?????? DOM ????????????
	   * @param {string} name ????????????
	   * @param {function} listener ??????????????????
	   * @param {capture} capture ???????????????????????????
	   * @returns {void} ?????????
	   */
	  _removeNativeEventListener: function /*istanbul ignore next*/_removeNativeEventListener(name, listener, capture) {
	    this._target_.removeEventListener(name, listener, capture);
	    //????????????????????????????????? ??????????????????
	    var descriptor = EventEmitter._events[name];
	    if (descriptor) {
	      descriptor.removeListener = descriptor.removeListener || descriptor.off;
	      descriptor.removeListener(this, name, listener, capture);
	    }
	  },
	
	  /**
	   * ?????? DOM ????????????
	   * @param {string} name ????????????
	   * @param {object} data ???????????????
	   * @param {string} canBubble ????????????
	   * @param {object} cancelAble ????????????
	   * @returns {void} ?????????
	   */
	  _emitNativeEvent: function /*istanbul ignore next*/_emitNativeEvent(name, data, canBubble, cancelAble) {
	    var event = document.createEvent('HTMLEvents');
	    event.initEvent(name, canBubble, cancelAble);
	    utils.copy(data, event, ['data']);
	    event.data = data;
	    return this._target_.dispatchEvent(event);
	  }
	
	});
	
	//????????????????????? listener
	EventEmitter._maxListeners = 10;
	
	//?????????????????????
	EventEmitter._events = [];
	
	/**
	 * ?????????????????????(???????????? dom ???????????????)
	 * @param {object} descriptor ????????????
	 * @returns {void} ?????????
	 */
	EventEmitter.register = function (descriptor) {
	  var names = descriptor.name;
	  if (!names) return;
	  if (!utils.isArray(names)) names = names.split(',');
	  names.forEach(function (name) {
	    this._events[name] = descriptor;
	  }, this);
	};
	
	module.exports = EventEmitter;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Compiler = __webpack_require__(52);
	var Directive = __webpack_require__(53);
	var Expression = __webpack_require__(54);
	var Template = __webpack_require__(78);
	var directives = __webpack_require__(55);
	
	Template.Template = Template;
	Template.Compiler = Compiler;
	Template.Directive = Directive;
	Template.directives = directives;
	Template.Expression = Expression;
	
	module.exports = Template;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Class = __webpack_require__(4);
	var Directive = __webpack_require__(53);
	var utils = __webpack_require__(3);
	var Expression = __webpack_require__(54);
	var commonDirectives = __webpack_require__(55);
	
	var DEFAULT_PREFIX = 'm';
	
	/**
	 * ???????????????
	 * ????????????????????????????????????????????????????????????
	 */
	var Compiler = new Class({
	
	  /**
	   * ?????????????????????
	   * @param {Object} options ??????
	   * @returns {void} ?????????
	   */
	  constructor: function /*istanbul ignore next*/constructor(options) {
	    options = options || {};
	    this.prefix = options.prefix || DEFAULT_PREFIX;
	    this.elementDirectives = {};
	    this.attributeDirectives = {};
	    this.registerDirectives(commonDirectives);
	    this.registerDirectives(options.directives);
	  },
	
	  /**
	  * ?????????????????????????????????
	  * @param {string} str ???????????????
	  * @param {number} mode 1 ????????????0 ?????????
	  * @return {string} ?????????????????????
	  */
	  toCamelCase: function /*istanbul ignore next*/toCamelCase(str, mode) {
	    if (str) {
	      str = str.replace(/\-[a-z0-9]/g, function ($1) /*istanbul ignore next*/{
	        return $1.slice(1).toUpperCase();
	      });
	      str = str.replace(/^[a-z]/i, function ($1) {
	        return mode ? $1.toUpperCase() : $1.toLowerCase();
	      });
	    }
	    return str;
	  },
	
	  /**
	   * ??????????????????????????????
	   * @param {string} str ???????????????
	   * @return {string} ?????????????????????
	   */
	  toSplitCase: function /*istanbul ignore next*/toSplitCase(str) {
	    if (str) {
	      str = str.replace(/([A-Z])/g, '-$1');
	      if (str[0] == '-') str = str.slice(1);
	    }
	    return str;
	  },
	
	  /**
	   * ????????????
	   * @param {Object} directives ????????? 
	   * @returns {void} ?????????
	   */
	  registerDirectives: function /*istanbul ignore next*/registerDirectives(directives) {
	    utils.each(directives, function (name, directive) {
	      name = this.toSplitCase(name);
	      var fullName = directive.options.prefix === false ? name : /*istanbul ignore next*/this.prefix + ':' + name;
	      if (directive.options.type == Directive.TE) {
	        this.elementDirectives[fullName.toUpperCase()] = directive;
	      } else {
	        this.attributeDirectives[fullName.toLowerCase()] = directive;
	      }
	    }, this);
	  },
	
	  /**
	   * ????????? attr ????????????
	   * @param {string} attrName ???????????????????????????
	   * @returns {Object} ??????????????????
	   */
	  _parseAttrInfo: function /*istanbul ignore next*/_parseAttrInfo(attrName) {
	    /*istanbul ignore next*/var _this = this;
	
	    var parts = attrName.toLowerCase().split(':');
	    var info = {};
	    if (parts.length > 1) {
	      info.name = /*istanbul ignore next*/parts[0] + ':' + parts[1];
	      info.decorates = parts.slice(2).map(function (item) /*istanbul ignore next*/{
	        return (/*istanbul ignore next*/_this.toCamelCase(item)
	        );
	      });
	    } else {
	      info.name = parts[0];
	      info.decorates = [];
	    }
	    return info;
	  },
	
	  /**
	   * ????????????????????????
	   * @param {Directive} Directive ?????????
	   * @param {Object} options ??????????????????
	   * @returns {Directive} ????????????
	   */
	  _createDirectiveInstance: function /*istanbul ignore next*/_createDirectiveInstance(Directive, options) {
	    options.compiler = this;
	    options.prefix = this.prefix;
	    return new Directive(options);
	  },
	
	  /**
	   * ?????????????????????????????? handler
	   * @param {function} handler ???????????????????????????
	   * @returns {void} ?????????
	   */
	  _bindHandler: function /*istanbul ignore next*/_bindHandler(handler) {
	    //?????? directives
	    handler.directives = handler.directives.sort(function (a, b) {
	      return b.level - a.level;
	    });
	    //????????? directives
	    var boundDirectives = [];
	    utils.each(handler.directives, function (index, directive) {
	      directive.index = index;
	      directive.bind();
	      boundDirectives.push(directive);
	      //???????????????????????????????????? attribute
	      if (directive.remove !== false && directive.attribute) {
	        directive.node.removeAttribute(directive.attribute.name);
	      }
	      //????????????????????????????????????????????????????????????
	      if (directive.final) {
	        return handler.final = true;
	      }
	    }, this);
	    handler.directives = boundDirectives;
	  },
	
	  /**
	   * ????????????????????????
	   * @param {function} handler ??????????????????
	   * @param {HTMLNode} node ?????? HTML ??????
	   * @returns {void} ?????????
	   */
	  _compileElement: function /*istanbul ignore next*/_compileElement(handler, node) {
	    var ElementDirective = this.elementDirectives[node.nodeName.toUpperCase()];
	    if (!ElementDirective) return;
	    handler.directives.push(this._createDirectiveInstance(ElementDirective, {
	      handler: handler,
	      node: node
	    }));
	  },
	
	  /**
	   * ???????????????????????? attributes 
	   * @param {function} handler ??????????????????
	   * @param {HTMLNode} node ?????? HTML ??????
	   * @returns {void} ?????????
	   */
	  _compileAttributes: function /*istanbul ignore next*/_compileAttributes(handler, node) {
	    utils.toArray(node.attributes).forEach(function (attribute) {
	      var attrInfo = this._parseAttrInfo(attribute.name);
	      var AttrDirective = this.attributeDirectives[attrInfo.name] || this.attributeDirectives['*'];
	      if (!AttrDirective) return;
	      var directiveOptions = AttrDirective.options;
	      handler.directives.push(this._createDirectiveInstance(AttrDirective, {
	        handler: handler,
	        node: node,
	        attribute: attribute,
	        expression: directiveOptions.literal ? attribute.value : new Expression(attribute.value, directiveOptions.mixed),
	        decorates: attrInfo.decorates
	      }));
	    }, this);
	  },
	
	  /**
	   * ?????????????????????
	   * @param {function} handler ??????????????????
	   * @param {HTMLNode} node ?????? HTML ??????
	   * @returns {void} ?????????
	   */
	  _compileChildren: function /*istanbul ignore next*/_compileChildren(handler, node) {
	    if (handler.final) return;
	    utils.toArray(node.childNodes).forEach(function (childNode) {
	      if (childNode._compiled_) return;
	      var childHandler = this.compile(childNode);
	      childHandler.parent = this;
	      handler.children.push(childHandler);
	    }, this);
	  },
	
	  /**
	   * ??????????????????
	   * @param {HTMLNode} node ???????????????
	   * @param {Object} options ??????
	   * @returns {function} ????????????
	   */
	  compile: function /*istanbul ignore next*/compile(node, options) {
	    if (!node) {
	      throw new Error('Invalid node for compile');
	    }
	    node._compiled_ = true;
	    options = options || {};
	    //????????????????????????
	    var handler = function handler(scope) {
	      if (utils.isNull(scope)) scope = {};
	      handler.directives.forEach(function (directive) {
	        directive.scope = scope;
	        directive.execute(scope);
	      }, this);
	      handler.children.forEach(function (childHandler) {
	        childHandler(scope);
	      }, this);
	    };
	    //--
	    handler.dispose = function () {
	      handler.directives.forEach(function (directive) {
	        directive.unbind();
	      }, this);
	      handler.children.forEach(function (childHandler) {
	        childHandler.dispose();
	      }, this);
	    };
	    handler.node = node;
	    //?????? children & directives 
	    handler.directives = [];
	    handler.children = [];
	    //??????????????????
	    if (options.element !== false) this._compileElement(handler, node);
	    if (options.attribute !== false) this._compileAttributes(handler, node);
	    this._bindHandler(handler);
	    if (options.children !== false) this._compileChildren(handler, node);
	    //?????????????????????
	    return handler;
	  }
	
	});
	
	module.exports = Compiler;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Class = __webpack_require__(4);
	var utils = __webpack_require__(3);
	var Expression = __webpack_require__(54);
	
	/**
	 * ????????????????????????
	 * @param {Object} classOptions ??????
	 * @returns {Directive} ?????????
	 */
	function Directive(classOptions) {
	  //??????????????????
	  classOptions = classOptions || {};
	  classOptions.type = classOptions.type || Directive.TA;
	  classOptions.level = classOptions.level || Directive.LG;
	
	  //???????????????
	  var DirectiveClass = new Class({
	
	    $extends: classOptions,
	    //??????????????????
	    constructor: function /*istanbul ignore next*/constructor(instanceOptions) {
	      utils.copy(instanceOptions, this);
	    },
	    //?????????????????? options
	    options: classOptions,
	    //????????????????????????
	    bind: classOptions.bind || utils.noop,
	    execute: classOptions.execute || function (scope) {
	      this.scope = scope;
	      if (this.options.type === Directive.TE) {
	        return this.update();
	      }
	      var newValue = this.options.literal ? this.attribute.value : this.expression.execute(scope);
	      if (!utils.deepEqual(this._value_, newValue)) {
	        this.update(newValue, this._value_);
	        this._value_ = newValue;
	      }
	    },
	    update: classOptions.update || utils.noop,
	    unbind: classOptions.unbind || utils.noop,
	    //???????????????????????????
	    utils: utils,
	    Expression: Expression
	  });
	  //??????????????????????????????????????????
	  DirectiveClass.options = classOptions;
	  utils.setPrototypeOf(DirectiveClass, classOptions);
	  return DirectiveClass;
	}
	
	//????????????
	Directive.TA = 'A';
	Directive.TE = 'E';
	
	//????????????
	Directive.LP = 3000; //prevent
	Directive.LS = 2000; //statement
	Directive.LE = 1000; //eleemtn
	Directive.LG = 0; //general
	Directive.LA = -1000; //any attribute
	Directive.LC = -2000; //cloak
	
	module.exports = Directive;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Class = __webpack_require__(4);
	var utils = __webpack_require__(3);
	
	/**
	 * ???????????????????????????????????????????????????????????????
	 */
	var Expression = new Class({
	
	  /**
	   * ??????????????????????????????????????????
	   * @param {string} code ???????????????
	   * @param {boolean} mix ?????????????????????
	   * @returns {void} ?????????
	   */
	  constructor: function /*istanbul ignore next*/constructor(code, mix) {
	    this.func = mix ? this._compileMixedCode(code) : this._compileCode(code);
	  },
	
	  /**
	   * ???????????????????????????
	   * @param {string} code ???????????????
	   * @returns {function} ??????????????????
	   */
	  _compileCode: function /*istanbul ignore next*/_compileCode(code) {
	    code = this._escapeEOL(this._wrapCode(code));
	    return this._createFunction(code);
	  },
	
	  /**
	   * ??????????????????????????????
	   * @param {string} code ???????????????
	   * @returns {function} ??????????????????
	   */
	  _compileMixedCode: function /*istanbul ignore next*/_compileMixedCode(code) {
	    var statements = this._parseMixedCode(code);
	    code = this._escapeEOL(statements.join('+'));
	    return this._createFunction(code);
	  },
	
	  /**
	   * ?????????????????????????????????????????????
	   * @param {string} code ???????????????
	   * @returns {function} ???????????????
	   */
	  _createFunction: function /*istanbul ignore next*/_createFunction(code) {
	    var func = new Function('utils', 'scope', 'with(scope){return ' + code + '}');
	    return func.bind(null, utils);
	  },
	
	  /**
	   * ???????????????????????????
	   * @param {string} code ?????????????????????
	   * @returns {Array} ???????????????token?????????
	   */
	  _parseMixedCode: function /*istanbul ignore next*/_parseMixedCode(code) {
	    var index = 0,
	        length = code.length;
	    var token = '',
	        isExpr = false,
	        tokens = [];
	    while (index <= length) {
	      var char = code[index++];
	      var nextChar = code[index];
	      if (utils.isNull(char)) {
	        if (token.length > 0) {
	          tokens.push('"' + this._escapeCode(token) + '"');
	        }
	        token = '';
	        isExpr = false;
	      } else if (!isExpr && char + nextChar == '{{') {
	        if (token.length > 0) {
	          tokens.push('"' + this._escapeCode(token) + '"');
	        }
	        token = '';
	        isExpr = true;
	        index++;
	      } else if (isExpr && char + nextChar == '}}') {
	        if (token.length > 0) {
	          tokens.push(this._wrapCode(token));
	        }
	        token = '';
	        isExpr = false;
	        index++;
	      } else {
	        token += char;
	      }
	    }
	    return tokens;
	  },
	
	  /**
	   * ???????????????????????????
	   * @param {string} code ????????????
	   * @returns {string} ?????????????????????
	   */
	  _escapeCode: function /*istanbul ignore next*/_escapeCode(code) {
	    return code.replace(/"/, '\\"').replace('\r\n', '\\r\\n').replace('\n', '\\n');
	  },
	
	  /**
	   * ???????????????
	   * @param {string} code ????????????
	   * @returns {string} ?????????????????????
	   */
	  _escapeEOL: function /*istanbul ignore next*/_escapeEOL(code) {
	    return code.replace(/\n/gm, '\\\n');
	  },
	
	  /**
	   * ??????????????? try/cache ????????????
	   * ???????????????????????????????????????????????????????????????????????????????????????????????????
	   * @param {string} code ????????????
	   * @returns {string} ?????????????????????
	   */
	  _wrapCode: function /*istanbul ignore next*/_wrapCode(code) {
	    return '((function(){try{return (' + code + ')}catch(err){console.error(err);return err;}})())';
	  },
	
	  /**
	   * ?????? scope ?????????????????????
	   * @param {Object} scope ???????????????
	   * @returns {Object} ????????????
	   */
	  execute: function /*istanbul ignore next*/execute(scope) {
	    if (utils.isNull(scope)) {
	      scope = {};
	    }
	    return this.func.call(scope, scope);
	  }
	
	});
	
	module.exports = Expression;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	module.exports = {
	  '#text': __webpack_require__(56),
	  'each': __webpack_require__(57),
	  'if': __webpack_require__(59),
	  'prop': __webpack_require__(60),
	  'attr': __webpack_require__(61),
	  'on': __webpack_require__(62),
	  'html': __webpack_require__(63),
	  'text': __webpack_require__(64),
	  'prevent': __webpack_require__(65),
	  'id': __webpack_require__(66),
	  'cloak': __webpack_require__(67),
	  'show': __webpack_require__(68),
	  'model': __webpack_require__(69),
	  'focus': __webpack_require__(76),
	  '*': __webpack_require__(77) //?????????????????? attr
	};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	var Expression = __webpack_require__(54);
	
	module.exports = new Directive({
	  type: Directive.TE,
	  prefix: false,
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.expr = new Expression(this.node.nodeValue, true);
	    this.node.nodeValue = '';
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    this.scope = scope;
	    var newValue = this.expr.execute(scope);
	    if (this.node.nodeValue !== newValue) {
	      this.node.nodeValue = newValue;
	    }
	  }
	
	});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	/*istanbul ignore next*/var _defineProperty = __webpack_require__(47);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Directive = __webpack_require__(53);
	var utils = __webpack_require__(3);
	var Scope = __webpack_require__(58);
	
	module.exports = new Directive({
	  level: Directive.LS + 1, //??? if ??????????????????
	  final: true,
	  literal: true,
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.mountNode = document.createTextNode('');
	    this.node.parentNode.insertBefore(this.mountNode, this.node);
	    //?????????bind ???????????????????????? attribute ????????????
	    //??? each ???????????????????????????????????? item ????????? each ????????????
	    this.node.removeAttribute(this.attribute.name);
	    this.node.parentNode.removeChild(this.node);
	    this.parseExpr();
	    this.eachItems = {};
	  },
	
	  parseExpr: function /*istanbul ignore next*/parseExpr() {
	    this.eachType = this.attribute.value.indexOf(' in ') > -1 ? 'in' : 'of';
	    var tokens = this.attribute.value.split(' ' + this.eachType + ' ');
	    var fnText = /*istanbul ignore next*/'with(scope){utils.each(' + tokens[1] + ',fn.bind(this,' + tokens[1] + '))}';
	    this.each = new Function('utils', 'scope', 'fn', fnText).bind(null, this.utils);
	    var names = tokens[0].split(',').map(function (name) {
	      return name.trim();
	    });
	    if (this.eachType == 'in') {
	      this.keyName = names[0];
	      this.valueName = names[1];
	    } else {
	      this.keyName = names[1];
	      this.valueName = names[0];
	    }
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    /*istanbul ignore next*/var _this = this;
	
	    var currentEachKeys = [];
	    var itemsFragment = document.createDocumentFragment();
	    var self = this;
	    this.each(scope, function (eachTarget, key) {
	      //????????? scope??????????????????????????? prototype ????????????????????????????????????
	      //????????????????????????????????????????????? scope ??????????????????
	      //??????????????? watch ????????????????????????????????????
	      var newScope = new Scope(this.scope);
	      if (self.keyName) {
	        /*istanbul ignore next*/(0, _defineProperty2.default)(newScope, self.keyName, {
	          /*istanbul ignore next*/get: function get() {
	            return key;
	          }
	        });
	      }
	      //value ?????????????????????????????????????????????????????????????????????????????????
	      if (self.valueName) {
	        /*istanbul ignore next*/(0, _defineProperty2.default)(newScope, self.valueName, {
	          /*istanbul ignore next*/get: function get() {
	            return eachTarget[key];
	          },
	          /*istanbul ignore next*/set: function set(value) {
	            eachTarget[key] = value;
	          }
	        });
	      }
	      var oldItem = this.eachItems[key];
	      if (oldItem) {
	        oldItem.handler(newScope);
	      } else {
	        var newItem = {};
	        //???????????????
	        newItem.node = this.node.cloneNode(true);
	        itemsFragment.appendChild(newItem.node);
	        newItem.handler = this.compiler.compile(newItem.node);
	        newItem.handler(newScope);
	        this.eachItems[key] = newItem;
	      }
	      currentEachKeys.push(key);
	    }.bind(this));
	    utils.each(this.eachItems, function (key, item) {
	      if (currentEachKeys.some(function (k) /*istanbul ignore next*/{
	        return k == key;
	      })) return;
	      if (item.node.parentNode) {
	        item.node.parentNode.removeChild(item.node);
	      }
	      delete /*istanbul ignore next*/_this.eachItems[key];
	    }, this);
	    if (itemsFragment.childNodes.length > 0) {
	      this.mountNode.parentNode.insertBefore(itemsFragment, this.mountNode);
	    }
	  }
	
	});

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var utils = __webpack_require__(3);
	
	var Scope = function Scope(parent, props) {
	  //?????? scope ????????????????????? _observer_ 
	  //???????????? scope ????????????????????????????????????????????????
	  //????????????????????? utils.cteate ???????????????????????? _observer_ 
	  //????????? scope ??? defineProperty ?????? parentScope
	  var scope = utils.create(parent);
	  utils.copy(props, scope);
	  //??? func ???????????? scope ???;
	  utils.each(parent, function (key, value) {
	    if (!utils.isFunction(value)) return;
	    scope[key] = value.bind(parent);
	  });
	  return scope;
	};
	
	module.exports = Scope;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  level: Directive.LS,
	  final: true,
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.mountNode = document.createTextNode('');
	    this.node.parentNode.insertBefore(this.mountNode, this.node);
	    //?????????bind ???????????????????????? attribute ????????????
	    //??? if ???????????????????????????????????? item ????????? if ????????????
	    this.node.removeAttribute(this.attribute.name);
	    this.node.parentNode.removeChild(this.node);
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    var newValue = this.expression.execute(scope);
	    if (newValue) {
	      //??????????????????????????? true ????????? 
	      this._handler = this._handler || this.compiler.compile(this.node);
	      this._handler(scope);
	      var node = this.node.$substitute || this.node;
	      if (!node.parentNode) {
	        this.mountNode.parentNode.insertBefore(node, this.mountNode);
	      }
	    } else {
	      var _node = this.node.$substitute || this.node;
	      if (_node.parentNode) _node.parentNode.removeChild(_node);
	    }
	  }
	
	});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  update: function /*istanbul ignore next*/update(value) {
	    var target = this.node.$target || this.node;
	    target[this.decorates[0]] = value;
	  }
	  // execute: function (scope) {
	  //   this.scope = scope;
	  //   let newValue = this.expression.execute(scope);
	  //   let target = this.node.$target || this.node;
	  //   target[this.decorates[0]] = newValue;
	  // }
	});

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  update: function /*istanbul ignore next*/update(value) {
	    var target = this.node.$target || this.node;
	    if (target.setAttribute) {
	      target.setAttribute(this.decorates[0], value);
	    } else {
	      target[this.decorates[0]] = value;
	    }
	  }
	});

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	var EventEmitter = __webpack_require__(50);
	var Scope = __webpack_require__(58);
	
	module.exports = new Directive({
	  literal: true,
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    var attrValue = this.attribute.value || '';
	    if (attrValue.indexOf('(') < 0 && attrValue.indexOf(')') < 0) {
	      attrValue += '($event)';
	    }
	    this.expr = new this.Expression(attrValue);
	    var eventTarget = this.node.$target || this.node;
	    this.emiter = new EventEmitter(eventTarget);
	    this.emiter.addListener(this.decorates[0], function (event) {
	      if (this.utils.isNull(this.scope)) return;
	      this.expr.execute(new Scope(this.scope, {
	        $event: event
	      }));
	    }.bind(this), false);
	  },
	
	  unbind: function /*istanbul ignore next*/unbind() {
	    this.emiter.removeListener();
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    this.scope = scope;
	  }
	
	});

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  update: function /*istanbul ignore next*/update(newValue) {
	    this.node.innerHTML = newValue;
	  }
	});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  update: function /*istanbul ignore next*/update(newValue) {
	    this.node.innerText = newValue;
	  }
	});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  level: Directive.LP,
	  final: true
	});

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  literal: true,
	
	  update: function /*istanbul ignore next*/update(id) {
	    if (id in this.scope) {
	      throw new Error('Conflicting component id `' + id + '`');
	    }
	    this.scope[id] = this.node.$target || this.node;
	  }
	
	});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  level: Directive.LC,
	  literal: true,
	  prefix: false,
	
	  bind: function /*istanbul ignore next*/bind() {
	    this.node.removeAttribute(this.attribute.name);
	  }
	
	});

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  update: function /*istanbul ignore next*/update(value) {
	    this.node.style.display = value ? '' : 'none';
	  }
	});

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var SelectDirective = __webpack_require__(70);
	var EditableDirective = __webpack_require__(71);
	var InputDirective = __webpack_require__(72);
	var RadioDirective = __webpack_require__(73);
	var CheckboxDirective = __webpack_require__(74);
	var PropDirective = __webpack_require__(75);
	
	var Directive = function Directive(options) {
	  var node = options.node;
	  var tagName = node.tagName;
	  if (options.decorates[0]) {
	    return new PropDirective(options);
	  } else if (tagName == 'INPUT') {
	    var type = node.getAttribute('type');
	    if (type == 'radio') {
	      return new RadioDirective(options);
	    } else if (type == 'checkbox') {
	      return new CheckboxDirective(options);
	    } else {
	      return new InputDirective(options);
	    }
	  } else if (tagName == 'TEXTAREA') {
	    return new InputDirective(options);
	  } else if (tagName == 'SELECT') {
	    return new SelectDirective(options);
	  } else if (node.isContentEditable) {
	    return new EditableDirective(options);
	  } else {
	    throw new Error( /*istanbul ignore next*/'Directive `model` cannot be used on `' + tagName + '`');
	  }
	};
	
	//???????????? classOptions
	Directive.options = {
	  level: Directive.LA
	};
	
	module.exports = Directive;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	var EventEmitter = __webpack_require__(50);
	var Scope = __webpack_require__(58);
	
	module.exports = new Directive({
	  final: true,
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.backExpr = new this.Expression( /*istanbul ignore next*/this.attribute.value + '=_value_');
	    this.node.removeAttribute(this.attribute.name);
	    this._handler = this.compiler.compile(this.node);
	    this.emiter = new EventEmitter(this.node);
	    this.emiter.addListener('change', function () {
	      if (this.utils.isNull(this.scope)) return;
	      var selectedOptions = this.node.selectedOptions;
	      var value = this.node.multiple ? [].slice.call(selectedOptions).map(function (option) {
	        return option.value;
	      }, this) : selectedOptions[0].value;
	      this.backExpr.execute(new Scope(this.scope, {
	        _value_: value
	      }));
	    }.bind(this), false);
	  },
	
	  unbind: function /*istanbul ignore next*/unbind() {
	    this.emiter.removeListener();
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    this.scope = scope;
	    this._handler(scope);
	    var value = this.expression.execute(scope);
	    if (!this.utils.isArray(value)) value = [value];
	    [].slice.call(this.node.options).forEach(function (option) {
	      option.selected = value.indexOf(option.value) > -1;
	    }, this);
	  }
	
	});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	var EventEmitter = __webpack_require__(50);
	var Scope = __webpack_require__(58);
	
	module.exports = new Directive({
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.backExpr = new this.Expression( /*istanbul ignore next*/this.attribute.value + '=_value_');
	    this.emiter = new EventEmitter(this.node);
	    this.emiter.addListener('input', function () {
	      if (this.utils.isNull(this.scope)) return;
	      this.backExpr.execute(new Scope(this.scope, {
	        _value_: this.node.innerHTML
	      }));
	    }.bind(this), false);
	  },
	
	  unbind: function /*istanbul ignore next*/unbind() {
	    this.emiter.removeListener();
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    var value = this.expression.execute(scope);
	    if (this.node.innerHTML !== value) {
	      this.node.innerHTML = value;
	    }
	  }
	
	});

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	var EventEmitter = __webpack_require__(50);
	var Scope = __webpack_require__(58);
	
	module.exports = new Directive({
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.backExpr = new this.Expression( /*istanbul ignore next*/this.attribute.value + '=_value_');
	    this.emiter = new EventEmitter(this.node);
	    this.emiter.addListener('input', function () {
	      if (this.utils.isNull(this.scope)) return;
	      this.backExpr.execute(new Scope(this.scope, {
	        _value_: this.node.value
	      }));
	    }.bind(this), false);
	  },
	
	  unbind: function /*istanbul ignore next*/unbind() {
	    this.emiter.removeListener();
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    var value = this.expression.execute(scope);
	    if (this.node.value !== value) {
	      this.node.value = value;
	    }
	  }
	
	});

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	var EventEmitter = __webpack_require__(50);
	var Scope = __webpack_require__(58);
	
	module.exports = new Directive({
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.backExpr = new this.Expression( /*istanbul ignore next*/this.attribute.value + '=_value_');
	    this.emiter = new EventEmitter(this.node);
	    this.emiter.addListener('change', function () {
	      if (this.utils.isNull(this.scope)) return;
	      this.backExpr.execute(new Scope(this.scope, {
	        _value_: this.node.value
	      }));
	    }.bind(this), false);
	  },
	
	  unbind: function /*istanbul ignore next*/unbind() {
	    this.emiter.removeListener();
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    this.scope = scope;
	    var value = this.expression.execute(scope);
	    this.node.checked = value == this.node.value;
	  }
	
	});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	var EventEmitter = __webpack_require__(50);
	var Scope = __webpack_require__(58);
	
	module.exports = new Directive({
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.backExpr = new this.Expression( /*istanbul ignore next*/this.attribute.value + '=_value_');
	    this.emiter = new EventEmitter(this.node);
	    this.emiter.addListener('change', function () {
	      if (this.utils.isNull(this.scope)) return;
	      var value = this.expression.execute(this.scope);
	      if (this.utils.isArray(value) && this.node.checked) {
	        value.push(this.node.value);
	      } else if (this.utils.isArray(value) && !this.node.checked) {
	        var index = value.indexOf(this.node.value);
	        value.splice(index, 1);
	      } else {
	        this.backExpr.execute(new Scope(this.scope, {
	          _value_: this.node.checked
	        }));
	      }
	    }.bind(this), false);
	  },
	
	  unbind: function /*istanbul ignore next*/unbind() {
	    this.emiter.removeListener();
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    this.scope = scope;
	    var value = this.expression.execute(scope);
	    if (this.utils.isArray(value)) {
	      this.node.checked = value.indexOf(this.node.value) > -1;
	    } else {
	      this.node.checked = value;
	    }
	  }
	
	});

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	var Scope = __webpack_require__(58);
	
	module.exports = new Directive({
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    /*istanbul ignore next*/var _this = this;
	
	    this.target = this.node.$target;
	    this.backExpr = new this.Expression( /*istanbul ignore next*/this.attribute.value + '=_value_');
	    this.bindProp = this.decorates[0];
	    if (!this.target) {
	      throw new Error( /*istanbul ignore next*/'Directive `model:' + this.bindProp + '` cannot be used on `' + this.node.tagName + '`');
	    }
	    this.watcher = this.target.$watch(this.bindProp, function (value) {
	      if ( /*istanbul ignore next*/_this.utils.isNull( /*istanbul ignore next*/_this.scope)) return;
	      /*istanbul ignore next*/_this.backExpr.execute(new Scope( /*istanbul ignore next*/_this.scope, {
	        _value_: value
	      }));
	    });
	  },
	
	  unbind: function /*istanbul ignore next*/unbind() {
	    this.target.$unWatch(this.watcher);
	  },
	
	  update: function /*istanbul ignore next*/update(value) {
	    this.target[this.bindProp] = value;
	  }
	
	});

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	module.exports = new Directive({
	  execute: function /*istanbul ignore next*/execute(scope) {
	    /*istanbul ignore next*/var _this = this;
	
	    var state = this.expression.execute(scope);
	    setTimeout(function () {
	      if (state) /*istanbul ignore next*/_this.node.focus();else /*istanbul ignore next*/_this.node.blur();
	    }, 0);
	  }
	});

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Directive = __webpack_require__(53);
	
	/**
	 * ????????? attribute ??????
	 * ???????????? attribute ?????????
	 * ??????:
	 *  <div attr1="{{expr1}}" {{expr2}} {{attr3}}="{{expr3}}">
	 *  </div>
	 */
	module.exports = new Directive({
	  level: Directive.LA,
	  prefix: false,
	  literal: true,
	  remove: false,
	
	  /**
	   * ???????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind() {
	    this.computedName = this.attribute.name;
	    this.computedValue = this.attribute.value;
	    this.nameExpr = new this.Expression(this.attribute.name, true);
	    this.valueExpr = new this.Expression(this.attribute.value, true);
	  },
	
	  execute: function /*istanbul ignore next*/execute(scope) {
	    var target = this.node.$target || this.node;
	    var newComputedName = this.nameExpr.execute(scope);
	    if (this.computedName !== newComputedName) {
	      //???????????????
	      if (target.removeAttribute) {
	        target.removeAttribute(this.computedName);
	      }
	      //???????????????
	      this.computedName = newComputedName;
	      if (!this.utils.isNull(this.computedName) && this.computedName.length > 0) {
	        if (target.setAttribute) {
	          target.setAttribute(this.computedName, this.computedValue || '');
	        }
	      }
	    }
	    var newComputeValue = this.valueExpr.execute(scope);
	    if (this.computedValue !== newComputeValue) {
	      this.computedValue = newComputeValue;
	      if (target.setAttribute) {
	        target.setAttribute(this.computedName, this.computedValue || '');
	      } else {
	        target[this.computedName] = this.computedValue;
	      }
	    }
	  }
	
	});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Class = __webpack_require__(4);
	var Observer = __webpack_require__(6);
	var EventEmitter = __webpack_require__(50);
	var Compiler = __webpack_require__(52);
	
	/**
	 * ?????????
	 * ???????????? element ???????????????????????????????????????
	 */
	var Template = new Class({
	
	  $extends: EventEmitter,
	
	  /**
	   * ???????????????????????????
	   * @param {HTMLNode} element HTML ??????
	   * @param {Object} options ??????
	   * @returns {void} ?????????
	   */
	  constructor: function /*istanbul ignore next*/constructor(element, options) {
	    options = options || {};
	    EventEmitter.call(this);
	    this.options = options;
	    this.element = element;
	    this.compiler = options.compiler || new Compiler(options);
	    this.render = this.compiler.compile(this.element);
	    this.update = this.update.bind(this);
	    this._update = this._update.bind(this);
	    this._updateTimer = 0;
	  },
	
	  /**
	   * ?????????????????? (???????????????????????????)
	   * @returns {void} ?????????
	   */
	  update: function /*istanbul ignore next*/update() {
	    if (this._updateTimer) {
	      clearTimeout(this._updateTimer);
	      this._updateTimer = null;
	    }
	    this._updateTimer = setTimeout(this._update, 0);
	  },
	
	  /**
	   * ?????????????????????????????? 
	   * @returns {void} ?????????
	   */
	  _update: function /*istanbul ignore next*/_update() {
	    if (!this._updateTimer || !this.observer) return;
	    this.emit('update', this);
	    this.render(this.observer.target);
	    this._onBind();
	  },
	
	  /**
	   * ??????????????????
	   * @returns {void} ?????????
	   */
	  _onBind: function /*istanbul ignore next*/_onBind() {
	    if (this._bound) return;
	    this._bound = true;
	    this.emit('bind', this);
	  },
	
	  /**
	   * ???????????????????????? scope
	   * @param {Object} scope ????????????????????????
	   * @param {boolean} disableFirst ????????????????????????????????????
	   * @returns {void} ?????????
	   */
	  bind: function /*istanbul ignore next*/bind(scope, disableFirst) {
	    if (!scope) return;
	    this.unbind();
	    this.observer = new Observer(scope, {
	      root: this.options.root
	    });
	    scope.$self = scope;
	    this.observer.on('change', this.update);
	    if (disableFirst) {
	      this._onBind();
	    } else {
	      this.update();
	    }
	  },
	
	  /**
	   * ?????????
	   * @returns {void} ?????????
	   */
	  unbind: function /*istanbul ignore next*/unbind() {
	    if (!this.observer) return;
	    this.observer.removeListener('change', this.update);
	    this.observer.clearReference();
	    this.observer = null;
	  },
	
	  /**
	   * ??????
	   * @returns {void} ?????????
	   */
	  dispose: function /*istanbul ignore next*/dispose() {
	    this.unbind();
	    this.render.dispose();
	  }
	
	});
	
	module.exports = Template;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Component = __webpack_require__(80);
	var components = __webpack_require__(82);
	var directives = __webpack_require__(51).directives;
	
	Component.components = components;
	Component.Component = Component;
	
	Component.component = function (name, component) {
	  if (!component) return components[name];
	  components[name] = component;
	};
	
	Component.directive = function (name, directive) {
	  if (!directive) return directives[name];
	  directives[name] = directive;
	};
	
	module.exports = Component;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	/*istanbul ignore next*/var _defineProperty = __webpack_require__(47);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Class = __webpack_require__(4);
	var Template = __webpack_require__(51);
	var Watcher = __webpack_require__(5);
	var utils = __webpack_require__(3);
	var EventEmitter = __webpack_require__(50);
	var Observer = __webpack_require__(6);
	var ComponentDirective = __webpack_require__(81);
	
	/**
	 * ?????????
	 * ??????????????????????????????
	 * @param {Object} classOpts ?????????
	 * @returns {Component} ?????????
	 */
	function Component(classOpts) {
	
	  //??????????????????
	  classOpts = classOpts || {};
	
	  //?????????????????????????????????????????????????????????????????????
	  var mixes = classOpts.mixes;
	  delete classOpts.mixes;
	  if (mixes && !utils.isArray(mixes)) {
	    mixes = [mixes];
	  } else {
	    mixes = [];
	  }
	  var extendComponent = classOpts.extend || Component;
	  delete classOpts.extend;
	  //extend ????????? mixes ??????????????????
	  mixes.push(extendComponent);
	  //classOpts ????????? extend ??? mixes ??????????????????
	  mixes.push(classOpts);
	  var mixedClassOpts = {};
	  mixes.forEach(function (mixItem) {
	    if (mixItem instanceof Component || mixItem == Component) {
	      mixItem = mixItem.$options || {};
	    }
	    utils.mix(mixedClassOpts, mixItem);
	  });
	  classOpts = mixedClassOpts;
	
	  /**
	   * ???????????????
	   * ???????????? new ComponentClass() ??????????????????
	   */
	  var ComponentClass = new Class({
	    $extends: extendComponent,
	
	    /**
	     * ?????????????????????
	     * @param {object} instanceOpts ????????????
	     * @returns {void} ?????????
	     */
	    constructor: function /*istanbul ignore next*/constructor(instanceOpts) {
	      /*istanbul ignore next*/var _this = this;
	
	      if (this == window) return new this.$class(instanceOpts);
	      EventEmitter.call(this);
	      instanceOpts = instanceOpts || {};
	      //????????????????????????????????????????????????
	      utils.each(instanceOpts, function (key, value) {
	        if (key in /*istanbul ignore next*/_this) return;
	        /*istanbul ignore next*/_this[key] = value;
	      });
	      this._onTemplateUpdate_ = this._onTemplateUpdate_.bind(this);
	      this._createdData_(classOpts.data);
	      this._createProperties_(classOpts.properties || classOpts.props);
	      this._createWatches_(classOpts.watches || classOpts.watch);
	      this.$directives = this.$directives || {};
	      this._importDirectives_(classOpts.directives);
	      this.$components = this.$components || {};
	      this._importComponents_(__webpack_require__(82));
	      this._importComponents_({
	        'self': ComponentClass
	      });
	      this._importComponents_(classOpts.components);
	      utils.defineFreezeProp(this, '$children', []);
	      if (instanceOpts.parent) this.$setParent(instanceOpts.parent);
	      this.$callHook('init', [instanceOpts]);
	      Observer.observe(this);
	      if (classOpts.element) {
	        this.$mount();
	      } else {
	        this.$compile();
	      }
	    },
	
	    /**
	     * ???????????????
	     * @param {Object} parent ?????????
	     * @returns {void} ?????????
	     */
	    $setParent: function /*istanbul ignore next*/$setParent(parent) {
	      if (this.$parent === parent) return;
	      if (this.$parent) {
	        this.$parent.$removeChild(this);
	      }
	      if (parent) {
	        parent.$addChild(this);
	      }
	    },
	
	    /**
	     * ???????????????
	     * @param {Object} child ?????????
	     * @returns {void} ?????????
	     */
	    $addChild: function /*istanbul ignore next*/$addChild(child) {
	      if (!(child instanceof Component)) return;
	      this.$children.push(child);
	      utils.defineFreezeProp(child, '$parent', this);
	      utils.defineFreezeProp(child, '$root', this.$root || this);
	    },
	
	    /**
	     * ???????????????
	     * @param {Object} child ?????????
	     * @returns {void} ?????????
	     */
	    $removeChild: function /*istanbul ignore next*/$removeChild(child) {
	      var index = this.$children.indexOf(child);
	      this.$children.splice(index, 1);
	      utils.defineFreezeProp(child, '$parent', null);
	      //utils.defineFreezeProp(child, '$root', null);
	    },
	
	    /**
	     * ???????????????, ??????????????? polyfill ?????? IE8 ?????????????????????
	     */
	    get $root() {
	      if (this.$parent) {
	        return this.$parent.$root;
	      } else {
	        return this;
	      }
	    },
	
	    /**
	     * ???????????????????????????
	     * @param {Object} components ???????????????
	     * @returns {void} ?????????
	     */
	    _importComponents_: function /*istanbul ignore next*/_importComponents_(components) {
	      utils.each(components, function (name, component) {
	        if (!component) return;
	        this.$components[name] = component;
	        this.$directives[name] = new ComponentDirective({
	          name: name,
	          component: component,
	          parent: this
	        });
	      }, this);
	    },
	
	    /**
	     * ???????????????????????????
	     * @param {Object} directives ???????????????
	     * @returns {void} ?????????
	     */
	    _importDirectives_: function /*istanbul ignore next*/_importDirectives_(directives) {
	      utils.each(directives, function (name, directive) {
	        if (!directive) return;
	        this.$directives[name] = directive;
	      }, this);
	    },
	
	    /**
	     * ?????????????????? hook
	     * @param {string} name ????????? hook ??????
	     * @param {Array} args ?????? hook ???????????????
	     * @returns {void} ?????????
	     */
	    $callHook: function /*istanbul ignore next*/$callHook(name, args) {
	      var hook = this[/*istanbul ignore next*/'on' + utils.firstUpper(name)];
	      if (!utils.isFunction(hook)) return;
	      hook.apply(this, args || []);
	      this.$emit( /*istanbul ignore next*/'$' + name, args);
	    },
	
	    /**
	     * ??????????????????
	     * @param {Object} data ??????????????????
	     * @returns {void} ?????????
	     */
	    _createdData_: function /*istanbul ignore next*/_createdData_(data) {
	      if (utils.isFunction(data)) {
	        this.$data = data.call(this);
	      } else {
	        this.$data = data || {};
	      }
	      utils.each(this.$data, function (name) {
	        /*istanbul ignore next*/(0, _defineProperty2.default)(this, name, {
	          configurable: true,
	          enumerable: true,
	          get: function /*istanbul ignore next*/get() {
	            if (!this.$data) return;
	            return this.$data[name];
	          },
	          set: function /*istanbul ignore next*/set(value) {
	            if (!this.$data) return;
	            this.$data[name] = value;
	          }
	        });
	      }, this);
	    },
	
	    /**
	     * ??????????????????
	     * @param {Object} properties ??????????????????
	     * @returns {void} ?????????
	     */
	    _createProperties_: function /*istanbul ignore next*/_createProperties_(properties) {
	      this.$properties = {};
	      utils.each(properties, function (name, descriptor) {
	        if (utils.isFunction(descriptor)) {
	          //get ????????????
	          descriptor = {
	            get: descriptor
	          };
	        } else if (!utils.isObject(descriptor)) {
	          //????????????
	          descriptor = {
	            value: descriptor
	          };
	        } else {
	          //?????? descriptor ?????? get/set/value
	          //??????????????? descriptor???
	          //????????????????????????????????????????????????
	          descriptor = utils.copy(descriptor);
	        }
	        //?????? get/set ???????????????????????????
	        var hasGetterOrSetter = !!descriptor.get || !!descriptor.set;
	        if (!hasGetterOrSetter) {
	          descriptor.get = function () {
	            return descriptor.value;
	          };
	          descriptor.set = function (value) {
	            descriptor.value = value;
	          };
	        }
	        //???????????????
	        /*istanbul ignore next*/(0, _defineProperty2.default)(this, name, {
	          configurable: true,
	          enumerable: true,
	          get: function /*istanbul ignore next*/get() {
	            if (!descriptor.get) {
	              throw new Error('Property `' + name + '` cannot be read');
	            }
	            return descriptor.get.call(this);
	          },
	          set: function /*istanbul ignore next*/set(value) {
	            if (!descriptor.set) {
	              throw new Error('Property `' + name + '` cannot be written');
	            }
	            if (descriptor.test && !descriptor.test(value)) {
	              throw new Error('Invalid value `' + value + '` for property `' + name + '`');
	            }
	            descriptor.set.call(this, value);
	            if (this._observer_) {
	              this._observer_.emitChange({
	                path: name,
	                value: value
	              });
	            }
	          }
	        });
	        this.$properties[name] = descriptor;
	      }, this);
	    },
	
	    /**
	     * ????????????
	     * ???????????? watches ????????? watchers ????????????
	     * ????????????????????????????????????????????????????????????
	     * @param {Object} watches ??????????????????
	     * @returns {void} ?????????
	     */
	    _createWatches_: function /*istanbul ignore next*/_createWatches_(watches) {
	      this._watchers_ = this._watchers_ || [];
	      utils.each(watches, function (name, handler) {
	        this.$watch(name, handler);
	      }, this);
	    },
	
	    /**
	     * ????????????????????????
	     * @returns {void} ?????????
	     */
	    _onTemplateUpdate_: function /*istanbul ignore next*/_onTemplateUpdate_() {
	      this._watchers_.forEach(function (watcher) {
	        watcher.calc();
	      }, this);
	    },
	
	    /**
	     * ??????????????????
	     * @param {string|function} path ?????????????????????
	     * @param {function} handler ????????????
	     * @returns {void} ?????????
	     */
	    $watch: function /*istanbul ignore next*/$watch(path, handler) {
	      if (!utils.isFunction(handler)) return;
	      var calcer = path;
	      if (!utils.isFunction(path)) {
	        calcer = function /*istanbul ignore next*/calcer() {
	          return utils.getByPath(this, path);
	        };
	      }
	      var watcher = new Watcher(calcer.bind(this), handler.bind(this));
	      this._watchers_.push(watcher);
	      return watcher;
	    },
	
	    /**
	     * ???????????? watcher ??????
	     * @param {object} watcher ??????????????????
	     * @returns {void} ?????????
	     */
	    $unWatch: function /*istanbul ignore next*/$unWatch(watcher) {
	      var index = this._watchers_.findIndex(function (w) /*istanbul ignore next*/{
	        return w === watcher;
	      });
	      this._watchers_.splice(index, 1);
	    },
	
	    /**
	     * ????????????
	     * @returns {void} ?????????
	     */
	    _createElement_: function /*istanbul ignore next*/_createElement_() {
	      if (this._created_) return;
	      this._created_ = true;
	      this.$callHook('create');
	      utils.defineFreezeProp(this, '$element', this.element || ComponentClass.$template.cloneNode(true));
	      if (!this.$element || this.$element.nodeName === '#text') {
	        throw new Error('Invalid component template');
	      }
	      this.$callHook('created');
	    },
	
	    /**
	     * ?????????????????????????????????
	     * @returns {void} ?????????
	     */
	    $compile: function /*istanbul ignore next*/$compile() {
	      if (this._compiled_) return;
	      this._compiled_ = true;
	      this._createElement_();
	      utils.defineFreezeProp(this, '_template_', new Template(this.$element, {
	        directives: this.$directives,
	        root: true
	      }));
	      this._template_.bind(this);
	      this._template_.on('update', this._onTemplateUpdate_);
	      this._template_.on('bind', function () {
	        if (!this.deferReady) this.$callHook('ready');
	      }.bind(this));
	    },
	
	    /**
	     * ??? DOM tree ???????????????
	     * @param {HTMLNode} mountNode ???????????????
	     * @param {append} append ?????? append ??????????????????
	     * @returns {void} ????????? 
	     */
	    $mount: function /*istanbul ignore next*/$mount(mountNode, append) {
	      if (this._mounted_) return;
	      this.$compile();
	      this.$callHook('mount');
	      if (mountNode) {
	        mountNode.$substitute = this.$element;
	        this.$element._mountNode = mountNode;
	        if (append) {
	          mountNode.appendChild(this.$element);
	        } else if (mountNode.parentNode) {
	          mountNode.parentNode.insertBefore(this.$element, mountNode);
	        }
	      }
	      this._mounted_ = true;
	      this._removed_ = false;
	      this.$callHook('mounted');
	    },
	
	    /**
	     * ???????????????????????????????????????
	     * @param {HTMLNode} node ????????????
	     * @returns {void} ????????? 
	     */
	    $appendTo: function /*istanbul ignore next*/$appendTo(node) {
	      this.$mount(node, true);
	    },
	
	    /**
	     * ????????????
	     * @returns {void} ?????????
	     */
	    $remove: function /*istanbul ignore next*/$remove() {
	      if (this._removed_ || !this._mounted_) return;
	      this.$callHook('remove');
	      if (this.$element.parentNode) {
	        this.$element.parentNode.removeChild(this.$element);
	      }
	      this._removed_ = true;
	      this._mounted_ = false;
	      this.$callHook('removed');
	    },
	
	    /**
	     * ??????????????????????????????????????????
	     * @param {string} name ????????????
	     * @param {object} data ???????????????
	     * @returns {void} ?????????
	     */
	    $dispatch: function /*istanbul ignore next*/$dispatch(name, data) {
	      var stopPropagation = this.$emit(name, data);
	      if (!stopPropagation && this.$parent) {
	        this.$parent.$dispatch(name, data);
	      }
	    },
	
	    /**
	     * ??????????????????????????????????????????
	     * @param {string} name ????????????
	     * @param {object} data ???????????????
	     * @returns {void} ?????????
	     */
	    $broadcast: function /*istanbul ignore next*/$broadcast(name, data) {
	      var stopPropagation = this.$emit(name, data);
	      if (!stopPropagation && this.$children && this.$children.length > 0) {
	        this.$children.forEach(function (child) {
	          child.$broadcast(name, data);
	        }, this);
	      }
	    },
	
	    /**
	     * ????????????
	     * @returns {void} ?????????
	     */
	    $dispose: function /*istanbul ignore next*/$dispose() {
	      this.$remove();
	      this._emitter_.off();
	      this.$children.forEach(function (child) {
	        child.$dispose();
	      }, this);
	      if (this.$parent) {
	        var index = this.$parent.$children.indexOf(this);
	        this.$parent.$children.splice(index, 1);
	      }
	      this.$callHook('dispose');
	      if (this._compiled_) {
	        this._template_.unbind();
	      }
	      this.$callHook('disposed');
	      for (var key in this) {
	        delete this[key];
	      }
	      ['_observer_', '$element', '$children', '$parent', '_template_'].forEach(function (key) {
	        delete this[key];
	      }, this);
	      utils.setPrototypeOf(this, null);
	    }
	
	  });
	
	  //???????????????
	  ComponentClass.$options = classOpts;
	  ComponentClass.$template = utils.parseDom(classOpts.template);
	
	  //??? ComponentClass.prototype ???????????????
	  utils.copy(classOpts, ComponentClass.prototype);
	  utils.copy(classOpts.methods, ComponentClass.prototype);
	
	  //??? ComponentClass instanceof Component === true 
	  //IE9/10 ?????? false?????????????????? Component.prototype ???????????????????????? ComponentClass ?????????
	  utils.setPrototypeOf(ComponentClass, Component.prototype);
	
	  return ComponentClass;
	}
	
	//????????? EventEmitter
	Component.prototype = utils.create(EventEmitter.prototype);
	
	//????????????????????????????????? extends
	Component.extend = function (classOpts) {
	  return new Component(classOpts);
	};
	
	//??????????????????
	Component.prototype.extend = function (classOpts) {
	  classOpts = classOpts || {};
	  classOpts.extend = this;
	  return new Component(classOpts);
	};
	
	//?????????????????????
	Component.prototype.create = function (instanceOpts) {
	  return new this(instanceOpts);
	};
	
	//???????????? element ????????????????????????
	Component.prototype.start = function (instanceOpts) {
	  if (!this.$options || !this.$options.element) {
	    throw new Error('Start method cannot be called');
	  }
	  return this.create(instanceOpts);
	};
	
	module.exports = Component;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Template = __webpack_require__(51);
	var Directive = Template.Directive;
	
	/**
	 * ????????????????????????
	 * @param {object} options ??????
	 * @returns {object} ????????????
	 */
	function ComponentDirective(options) {
	
	  return new Directive({
	    type: Directive.TE,
	    literal: true,
	    final: true,
	    level: Directive.LE,
	
	    bind: function /*istanbul ignore next*/bind() {
	      this.component = new options.component({
	        deferReady: true,
	        parent: options.parent || this.scope
	      });
	      this.handleAttrs();
	      this.node.$target = this.component;
	      this.handler = this.compiler.compile(this.node, {
	        element: false,
	        children: false
	      });
	      this.handleContents();
	      this.component.$mount(this.node);
	      if (this.node.parentNode) {
	        this.node.parentNode.removeChild(this.node);
	      }
	    },
	
	    handleAttrs: function /*istanbul ignore next*/handleAttrs() {
	      this.attrs = [].slice.call(this.node.attributes);
	      var directiveRegexp = new RegExp('^' + this.prefix + ':', 'i');
	      this.attrs.forEach(function (attr) {
	        if (directiveRegexp.test(attr.name)) return;
	        if (attr.name in this.component.$properties) return;
	        this.component.$element.setAttribute(attr.name, attr.value);
	        this.node.removeAttribute(attr.name);
	      }, this);
	    },
	
	    handleContents: function /*istanbul ignore next*/handleContents() {
	      this.placeHandlers = [];
	      var places = [].slice.call(this.component.$element.querySelectorAll('[' + this.prefix + '\\:content]'));
	      places.forEach(function (place) {
	        //???????????????????????????????????????
	        var contents = null;
	        var selector = place.getAttribute(this.prefix + ':content');
	        if (!selector) {
	          contents = [].slice.call(this.node.childNodes);
	        } else {
	          contents = [].slice.call(this.node.querySelectorAll(selector));
	        }
	        if (!contents || contents.length < 1) return;
	        place.innerHTML = '';
	        contents.forEach(function (content) {
	          place.appendChild(content.cloneNode(true));
	        }, this);
	        //???????????????????????????????????????
	        var handler = this.compiler.compile(place);
	        this.placeHandlers.push(handler);
	      }, this);
	    },
	
	    execute: function /*istanbul ignore next*/execute(scope) {
	      this.handler(scope);
	      if (!this._ready_) {
	        this._ready_ = true;
	        this.component.$callHook('ready');
	      }
	      this.placeHandlers.forEach(function (handler) {
	        handler(scope);
	      }, this);
	    }
	
	  });
	}
	
	module.exports = ComponentDirective;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	module.exports = {
	  View: __webpack_require__(83)
	};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Component = __webpack_require__(80);
	var utils = __webpack_require__(3);
	
	/**
	 * ??????????????????
	 * ?????????????????????????????????????????????????????????????????????
	 */
	var View = new Component({
	
	  template: '<div></div>',
	
	  properties: {
	
	    /**
	     * ???????????????????????????
	     */
	    component: {
	      test: function /*istanbul ignore next*/test(value) {
	        if (!value) return false;
	        return value instanceof Component || utils.isString(value);
	      },
	      set: function /*istanbul ignore next*/set(component) {
	        if (this._transitioning) return;
	        this._transitioning = true;
	        //?????? value ???????????????????????? $parent.components ?????????????????? 
	        if (utils.isString(component)) {
	          if (this.$parent && this.$parent.$components) {
	            this.component = this.$parent.$components[component];
	          } else {
	            this.component = null;
	          }
	          return;
	        }
	        //????????????????????????
	        var newComponentInstance = null;
	        var oldComponentInstance = this.componentInstance;
	        //?????????????????????
	        if (utils.isFunction(component)) {
	          newComponentInstance = new component({
	            parent: this
	          });
	        } else {
	          component.$setParent(this);
	          newComponentInstance = component;
	        }
	        //???????????????????????????????????????
	        this.transition.prep(newComponentInstance, oldComponentInstance);
	        //?????????????????????
	        newComponentInstance.$appendTo(this.$element);
	        //?????????????????????????????????
	        this.transition.go(newComponentInstance, oldComponentInstance, function () {
	          //??????????????????
	          this.$emit('enter', newComponentInstance);
	          this.$emit('leave', oldComponentInstance);
	          //?????????????????????
	          if (oldComponentInstance) {
	            oldComponentInstance.$dispose();
	          }
	          this._transitioning = false;
	        }.bind(this));
	        //????????????????????????
	        this.componentInstance = newComponentInstance;
	      },
	      get: function /*istanbul ignore next*/get() {
	        return this._Component;
	      }
	    },
	
	    /**
	     * ???????????????????????????
	     */
	    transition: {
	      get: function /*istanbul ignore next*/get() {
	        return this._transition || View.transition;
	      },
	      set: function /*istanbul ignore next*/set(transition) {
	        if (this._transitioning) return;
	        if (!transition || utils.isFunction(transition.prep) && utils.isFunction(transition.go)) {
	          if (this._transition && utils.isFunction(this._transition.clean)) {
	            this._transition.clean(this);
	          }
	          if (transition && utils.isFunction(transition.init)) {
	            transition.init(this);
	          }
	          this._transition = transition;
	        } else {
	          throw new Error('Invalid transition');
	        }
	      }
	    }
	  },
	
	  /**
	   * ????????????????????????
	   * @param {Component} component ??????
	   * @param {transition} transition ??????????????????
	   * @returns {void} ?????????
	   */
	  switchTo: function /*istanbul ignore next*/switchTo(component, transition) {
	    if (transition) {
	      this.transition = transition;
	    }
	    this.component = component;
	  }
	
	});
	
	/**
	 * ??????????????????
	 */
	View.transition = {
	  //init: function () { },
	  //clean: function () { },
	
	  /**
	   * ????????????????????????
	   * @param {Component} newComponent ?????????
	   * @param {Component} oldComponent ?????????
	   * @returns {void} ?????????
	   */
	  prep: function /*istanbul ignore next*/prep(newComponent, oldComponent) {
	    if (oldComponent) oldComponent.$element.style.display = 'none';
	  },
	
	  /**
	   * ??????????????????
	   * @param {Component} newComponent ?????????
	   * @param {Component} oldComponent ?????????
	   * @param {Function} done ??????????????????
	   * @returns {void} ?????????
	   */
	  go: function /*istanbul ignore next*/go(newComponent, oldComponent, done) {
	    done();
	  }
	};
	
	module.exports = View;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1);
	var items = __webpack_require__(85);
	
	__webpack_require__(86);
	
	var Toolbar = new mokit.Component({
	  template: __webpack_require__(88),
	  props: {
	    mditor: null
	  },
	
	  /*istanbul ignore next*/data: function data() {
	    return {
	      items: items.slice(0)
	    };
	  },
	  /*istanbul ignore next*/onReady: function onReady() {
	    this.bindCommands();
	  },
	
	
	  watch: {
	    /*istanbul ignore next*/items: function items() {
	      this.bindCommands();
	    }
	  },
	
	  /*istanbul ignore next*/bindCommands: function bindCommands() {
	    /*istanbul ignore next*/var _this = this;
	
	    if (!this.mditor) return;
	    this.items.forEach(function (item) {
	      /*istanbul ignore next*/_this.mditor.removeCommand(item.name);
	      /*istanbul ignore next*/_this.mditor.addCommand(item);
	    });
	  },
	  /*istanbul ignore next*/isActive: function isActive(item) {
	    return this.mditor && item.state && this.mditor[item.state];
	  },
	  /*istanbul ignore next*/exec: function exec(name, event) {
	    event.preventDefault();
	    this.mditor.execCommand(name, event);
	  },
	  /*istanbul ignore next*/getItem: function getItem(name) {
	    return this.items.find(function (item) /*istanbul ignore next*/{
	      return item.name === name;
	    });
	  },
	  /*istanbul ignore next*/removeItem: function removeItem(name) {
	    var index = this.items.findIndex(function (item) /*istanbul ignore next*/{
	      return item.name === name;
	    });
	    return this.items.splice(index, 1);
	  },
	  /*istanbul ignore next*/addItem: function addItem(item) {
	    this.items.push(item);
	  },
	  /*istanbul ignore next*/replaceItem: function replaceItem(name, newItem) {
	    var index = this.items.findIndex(function (item) /*istanbul ignore next*/{
	      return item.name === name;
	    });
	    var oldItem = this.items.splice(index, 1);
	    this.items.splice(index, 0, newItem);
	    return oldItem;
	  }
	});
	
	module.exports = Toolbar;

/***/ }),
/* 85 */
/***/ (function(module, exports) {

	/*istanbul ignore next*/'use strict';
	
	module.exports = [{
	  name: 'bold',
	  title: '??????',
	  key: 'shift+alt+b',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('**', '**');
	  }
	}, {
	  name: 'italic',
	  title: '??????',
	  key: 'shift+alt+i',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('*', '*');
	  }
	}, {
	  name: 'underline',
	  title: '?????????',
	  key: 'shift+alt+e',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('<u>', '</u>');
	  }
	}, {
	  name: 'strikethrough',
	  title: '?????????',
	  key: 'shift+alt+d',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('~~', '~~');
	  }
	}, {
	  name: 'header',
	  title: '??????',
	  key: 'shift+alt+1',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('# ');
	  }
	}, {
	  name: 'quote',
	  icon: 'quote-left',
	  title: '??????',
	  key: 'shift+alt+q',
	  /*istanbul ignore next*/handler: function handler() {
	    var selectText = this.editor.getSelectText();
	    if (selectText.length < 1) {
	      this.editor.wrapSelectText('> ');
	      return;
	    }
	    var textArray = selectText.split(this.EOL);
	    var buffer = [];
	    textArray.forEach(function (line) {
	      buffer.push('> ' + line + '  ');
	    });
	    this.editor.setSelectText(buffer.join(this.EOL) + this.EOL);
	  }
	}, {
	  name: 'code',
	  title: '??????',
	  key: 'shift+alt+c',
	  /*istanbul ignore next*/handler: function handler() {
	    var lang = 'js' + this.EOL;
	    var before = '```' + lang;
	    var after = '```  ' + this.EOL;
	    var text = this.editor.getSelectText().trim();
	    if (text.length > 0) {
	      text += this.EOL;
	    }
	    this.editor.setSelectText(text);
	    this.editor.wrapSelectText(before, after);
	    var range = this.editor.getSelectRange();
	    var start = range.start - lang.length;
	    var end = range.start - this.EOL.length;
	    this.editor.setSelectRange(start, end);
	  }
	}, {
	  name: 'list-ol',
	  title: '????????????',
	  key: 'shift+alt+o',
	  /*istanbul ignore next*/handler: function handler() {
	    var selectText = this.editor.getSelectText();
	    if (selectText.length < 1) {
	      this.editor.wrapSelectText('1. ');
	      return;
	    }
	    var textArray = selectText.split(this.EOL);
	    var buffer = [];
	    for (var i = 0; i < textArray.length; i++) {
	      var line = textArray[i];
	      buffer.push(i + 1 + '. ' + line);
	    }
	    this.editor.setSelectText(buffer.join(this.EOL) + this.EOL);
	  }
	}, {
	  name: 'list-ul',
	  title: '????????????',
	  key: 'shift+alt+u',
	  /*istanbul ignore next*/handler: function handler() {
	    var selectText = this.editor.getSelectText();
	    if (selectText.length < 1) {
	      this.editor.wrapSelectText('- ');
	      return;
	    }
	    var textArray = selectText.split(this.EOL);
	    var buffer = [];
	    textArray.forEach(function (line) {
	      buffer.push('- ' + line);
	    });
	    this.editor.setSelectText(buffer.join(this.EOL) + this.EOL);
	  }
	}, {
	  name: 'link',
	  title: '??????',
	  key: 'shift+alt+l',
	  /*istanbul ignore next*/handler: function handler() {
	    var text = this.editor.getSelectText();
	    if (!text || /^(https:|http:|ftp:|file:|mailto:|\/|\.)/i.test(text)) {
	      this.editor.wrapSelectText('[link](', ')');
	      if (!text) return;
	      var range = this.editor.getSelectRange();
	      var start = range.start - 6;
	      this.editor.setSelectRange(start, start + 4);
	    } else {
	      this.editor.wrapSelectText('[', ']()');
	      var _range = this.editor.getSelectRange();
	      var index = _range.end + 2;
	      this.editor.setSelectRange(index, index);
	    }
	  }
	}, {
	  name: 'table',
	  title: '??????',
	  key: 'shift+alt+t',
	  /*istanbul ignore next*/handler: function handler() {
	    var buffer = ['column1 | column2 | column3  ', '------- | ------- | -------  ', 'column1 | column2 | column3  ', 'column1 | column2 | column3  ', 'column1 | column2 | column3  '];
	    this.editor.wrapSelectText(buffer.join(this.EOL) + this.EOL);
	  }
	}, {
	  name: 'line',
	  title: '?????????',
	  icon: 'minus',
	  key: 'shift+alt+h',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('----' + this.EOL);
	  }
	}, {
	  name: 'image',
	  title: '??????',
	  key: 'shift+alt+p',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('![alt](', ')');
	  }
	}, {
	  name: 'help',
	  title: '??????',
	  icon: 'question',
	  key: 'shift+alt+/',
	  /*istanbul ignore next*/handler: function handler() {
	    window.open('http://mditor.com', '_blank');
	  }
	}, {
	  name: 'toggleFullScreen',
	  title: '??????',
	  icon: 'arrows-alt',
	  key: 'shift+alt+f',
	  control: true,
	  state: 'fullscreen',
	  owner: function /*istanbul ignore next*/owner(mditor) {
	    return mditor.$element;
	  },
	  /*istanbul ignore next*/handler: function handler() {
	    this.fullscreen = !this.fullscreen;
	  }
	}, {
	  name: 'togglePreview',
	  title: '??????',
	  icon: 'desktop',
	  key: 'shift+alt+v',
	  control: true,
	  state: 'preview',
	  owner: function /*istanbul ignore next*/owner(mditor) {
	  	// console.log(mditor)
	    return mditor.$element;
	  },
	  /*istanbul ignore next*/handler: function handler() {
	    this.preview = !this.preview;
	    if (this.preview) {
	      this._split = this.split;
	      this.split = false;
	    } else {
	      this.split = this._split;
	    }
	  }
	}, {
	  name: 'toggleSplit',
	  title: '??????',
	  icon: 'columns',
	  key: 'shift+alt+s',
	  control: true,
	  state: 'split',
	  owner: function /*istanbul ignore next*/owner(mditor) {
	    return mditor.$element;
	  },
	  /*istanbul ignore next*/handler: function handler() {
	    this.split = !this.split;
	    if (this.split) {
	      this.preview = false;
	    }
	  }
	}];

/***/ }),
/* 86 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 87 */,
/* 88 */
/***/ (function(module, exports) {

	module.exports = "<ul class=\"toolbar\">\n  <i m:each=\"item of items\" data-cmd=\"{{item.name}}\" m:on:click=\"exec(item.name,$event)\" class=\"item fa fa-{{item.icon || item.name}} {{isActive(item)?'active':''}} {{item.control?'control':''}}\" title=\"{{item.title || item.name}} {{item.key}}\"></i>\n</ul>"

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1);
	var EventEmitter = mokit.EventEmitter;
	var utils = __webpack_require__(3);
	var Stack = __webpack_require__(90);
	var commands = __webpack_require__(91);
	
	__webpack_require__(92);
	
	var ua = window.navigator.userAgent.toLowerCase();
	var isIE = !!ua.match(/msie|trident\/7|edge/);
	//const isWinPhone = ua.indexOf('windows phone') !== -1;
	//const isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);
	
	module.exports = new mokit.Component({
	  template: __webpack_require__(93),
	
	  props: {
	    mditor: null,
	    value: null,
	    markExp: null
	  },
	
	  /*istanbul ignore next*/onReady: function onReady() {
	    /*istanbul ignore next*/var _this = this;
	
	    this.stack = new Stack();
	    setTimeout(function () {
	      /*istanbul ignore next*/_this.textareaEmitter = new EventEmitter( /*istanbul ignore next*/_this.textarea);
	      /*istanbul ignore next*/_this.stack.init({
	        value: /*istanbul ignore next*/_this.getValue()
	      });
	    }, 300);
	    this._bindCommands();
	  },
	  /*istanbul ignore next*/_bindCommands: function _bindCommands() {
	    /*istanbul ignore next*/var _this2 = this;
	
	    commands.forEach(function (item) {
	      /*istanbul ignore next*/_this2.mditor.removeCommand(item.name);
	      /*istanbul ignore next*/_this2.mditor.addCommand(item);
	    });
	  },
	  /*istanbul ignore next*/onCompositionStart: function onCompositionStart() {
	    this._compositionLock = true;
	  },
	  /*istanbul ignore next*/onCompositionEnd: function onCompositionEnd() {
	    /*istanbul ignore next*/var _this3 = this;
	
	    this._compositionLock = false;
	    setTimeout(function () /*istanbul ignore next*/{
	      return (/*istanbul ignore next*/_this3.onInput()
	      );
	    }, 300);
	    /**
	     * ??????????????????????????????????????????????????????????????????????????????
	     * ?????????????????????????????????????????????????????????????????????????????????????????????
	     * ????????????????????????????????????????????????????????????????????????????????????????????? Bug
	     * ???????????? issues
	     * https://github.com/electron/electron/issues/8894
	     * https://github.com/electron/electron/issues/4539
	     */
	    // this.textarea.blur();
	    // this.textarea.focus();
	  },
	  /*istanbul ignore next*/onInput: function onInput() {
	    /*istanbul ignore next*/var _this4 = this;
	
	    this.$emit('input');
	    if (this._changedTimer) {
	      clearTimeout(this._changedTimer);
	      this._changedTimer = null;
	    }
	    if (this._compositionLock) return;
	    this._changedTimer = setTimeout(function () {
	      if (! /*istanbul ignore next*/_this4._changedTimer) return;
	      /*istanbul ignore next*/_this4.stack.push({
	        value: /*istanbul ignore next*/_this4.getValue(),
	        range: /*istanbul ignore next*/_this4.getSelectRange()
	      });
	      /*istanbul ignore next*/_this4.$emit('changed');
	    }, 300);
	  },
	  /*istanbul ignore next*/undo: function undo() {
	    /*istanbul ignore next*/var _this5 = this;
	
	    var last = this.stack.last();
	    var item = this.stack.undo();
	    if (utils.isNull(item) || utils.isNull(item.value)) return;
	    var valGap = last.value.length - item.value.length;
	    this.value = item.value;
	    if (last.range) {
	      setTimeout(function () {
	        var start = last.range.start - valGap;
	        var end = last.range.end - valGap;
	        /*istanbul ignore next*/_this5.setSelectRange(start, end);
	      });
	    }
	  },
	  /*istanbul ignore next*/redo: function redo() {
	    /*istanbul ignore next*/var _this6 = this;
	
	    var item = this.stack.redo();
	    if (utils.isNull(item) || utils.isNull(item.value)) return;
	    this.value = item.value;
	    if (item.range) {
	      setTimeout(function () {
	        /*istanbul ignore next*/_this6.setSelectRange(item.range.start, item.range.end);
	      });
	    }
	  },
	  /*istanbul ignore next*/onPaste: function onPaste(event) {
	    this.$emit('paste', event);
	  },
	  /*istanbul ignore next*/onDragover: function onDragover(event) {
	    event.preventDefault();
	    this.$emit('dragover', event);
	  },
	  /*istanbul ignore next*/onDrop: function onDrop(event) {
	    event.preventDefault();
	    this.$emit('drop', event);
	  },
	  /*istanbul ignore next*/focus: function focus() {
	    this.textarea.focus();
	  },
	  /*istanbul ignore next*/blur: function blur() {
	    this.textarea.blur();
	  },
	  /*istanbul ignore next*/onScroll: function onScroll(event) {
	    this.syncScroll();
	    this.$emit('scroll', event);
	  },
	  /*istanbul ignore next*/syncScroll: function syncScroll(disTwice) {
	    /*istanbul ignore next*/var _this7 = this;
	
	    this.marks.scrollTop = this.textarea.scrollTop;
	    this.marks.scrollLeft = this.textarea.scrollLeft;
	    if (disTwice) return;
	    setTimeout(function () {
	      /*istanbul ignore next*/_this7.syncScroll(true);
	    }, 0);
	  },
	  /*istanbul ignore next*/applyMarks: function applyMarks(text) {
	    if (!text || !this.markExp) return;
	    text = text.replace(/\n$/g, '\n\n').replace(this.markExp, '<mark>$&</mark>');
	    if (isIE) {
	      // IE wraps whitespace differently in a div vs textarea, this fixes it
	      text = text.replace(/ /g, ' <wbr>');
	    }
	    return text;
	  },
	  /*istanbul ignore next*/activeMark: function activeMark(index) {
	    var marks = [].slice.call(this.marks.querySelectorAll('mark'));
	    if (marks.length < 1) return;
	    this.activeMarkIndex = utils.isNull(this.activeMarkIndex) ? -1 : this.activeMarkIndex;
	    if (utils.isNull(index)) {
	      this.activeMarkIndex++;
	    } else {
	      this.activeMarkIndex = index;
	    }
	    if (this.activeMarkIndex >= marks.length) {
	      this.activeMarkIndex = 0;
	    }
	    marks.forEach(function (mark) {
	      mark.classList.remove('active');
	    });
	    var activeMark = marks[this.activeMarkIndex];
	    activeMark.classList.add('active');
	    this.scrollToMark(activeMark);
	  },
	  /*istanbul ignore next*/scrollToMark: function scrollToMark(mark) {
	    // mark.scrollIntoView();
	    // this.textarea.scrollTop = this.marks.scrollTop;
	    // this.textarea.scrollTop -= 20;
	    this.textarea.scrollTop = mark.offsetTop - 20;
	  },
	  /*istanbul ignore next*/getValue: function getValue() {
	    return this.textarea.value;
	  },
	  /*istanbul ignore next*/setValue: function setValue(value) {
	    this.textarea.value = value;
	  },
	  /*istanbul ignore next*/getActiveElement: function getActiveElement() {
	    this.textarea.focus();
	    return document.activeElement;
	  },
	  /*istanbul ignore next*/getSelectRange: function getSelectRange() {
	    var box = this.getActiveElement();
	    return {
	      'start': box.selectionStart,
	      'end': box.selectionEnd
	    };
	  },
	  /*istanbul ignore next*/setSelectRange: function setSelectRange(start, end) {
	    var box = this.getActiveElement();
	    box.setSelectionRange(start, end);
	  },
	  /*istanbul ignore next*/getSelectText: function getSelectText() {
	    var box = this.getActiveElement();
	    var range = this.getSelectRange();
	    return box.value.substring(range.start, range.end);
	  },
	  /*istanbul ignore next*/setSelectText: function setSelectText(text) {
	    /*istanbul ignore next*/var _this8 = this;
	
	    var box = this.getActiveElement();
	    var range = this.getSelectRange();
	    box.setRangeText(text);
	    if (range.end == range.start) {
	      this.setSelectRange(range.start, range.end + text.length);
	    }
	    this.value = this.getValue();
	    this.onInput();
	    setTimeout(function () {
	      /*istanbul ignore next*/_this8.blur();
	      /*istanbul ignore next*/_this8.focus();
	    }, 0);
	  },
	  /*istanbul ignore next*/wrapSelectText: function wrapSelectText(before, after) {
	    before = before !== null && before !== undefined ? before : '';
	    after = after !== null && after !== undefined ? after : '';
	    var range = this.getSelectRange();
	    var text = this.getSelectText();
	    this.setSelectText(before + text + after);
	    var newStart = range.start + before.length;
	    var newEnd = range.end + before.length;
	    this.setSelectRange(newStart, newEnd);
	  },
	  /*istanbul ignore next*/insertBeforeText: function insertBeforeText(text) {
	    this.wrapSelectText(text);
	  },
	  /*istanbul ignore next*/insertAfterText: function insertAfterText(text) {
	    this.wrapSelectText('', text);
	  },
	  /*istanbul ignore next*/getBeforeText: function getBeforeText(length) {
	    var range = this.getSelectRange();
	    var end = range.start;
	    var start = end - length;
	    var value = this.getValue();
	    return value.substring(start, end);
	  },
	  /*istanbul ignore next*/getBeforeFirstCharIndex: function getBeforeFirstCharIndex(char) {
	    var range = this.getSelectRange();
	    var end = range.start;
	    var start = 0;
	    var value = this.getValue();
	    return value.substring(start, end).lastIndexOf(char);
	  },
	  /*istanbul ignore next*/getBeforeWord: function getBeforeWord() {
	    /*istanbul ignore next*/var _this9 = this;
	
	    var chars = [' ', '\t', this.mditor.EOL];
	    var start = 0;
	    chars.forEach(function (char) {
	      var index = /*istanbul ignore next*/_this9.getBeforeFirstCharIndex(char);
	      if (index + char.length > start) {
	        start = index + char.length;
	      }
	    });
	    var range = this.getSelectRange();
	    var value = this.getValue();
	    return value.substring(start, range.end);
	  },
	  /*istanbul ignore next*/getBeforeTextInLine: function getBeforeTextInLine() {
	    var start = this.getBeforeFirstCharIndex(this.mditor.EOL) + this.mditor.EOL.length;
	    var range = this.getSelectRange();
	    var value = this.getValue();
	    return value.substring(start, range.end);
	  },
	  /*istanbul ignore next*/selectBeforeText: function selectBeforeText(length) {
	    var range = this.getSelectRange();
	    this.setSelectRange(range.start - length, range.end);
	  },
	  /*istanbul ignore next*/selectAfterText: function selectAfterText(length) {
	    var range = this.getSelectRange();
	    this.setSelectRange(range.start, range.end + length);
	  },
	  /*istanbul ignore next*/selectBeforeTextInLine: function selectBeforeTextInLine() {
	    var start = this.getBeforeFirstCharIndex(this.mditor.EOL) + this.mditor.EOL.length;
	    var range = this.getSelectRange();
	    this.setSelectRange(start, range.end);
	  },
	  /*istanbul ignore next*/addIndent: function addIndent() {
	    /*istanbul ignore next*/var _this10 = this;
	
	    var selectText = this.getSelectText();
	    if (selectText.length < 1) {
	      this.insertBeforeText(this.mditor.INDENT);
	      return;
	    }
	    var textArray = selectText.split(this.mditor.EOL);
	    var buffer = [];
	    var lineCount = textArray.length - 1;
	    textArray.forEach(function (line, index) {
	      line = line.trim() !== '' ? /*istanbul ignore next*/_this10.mditor.INDENT + line : line;
	      if (index < lineCount || line.trim() !== '') {
	        buffer.push(line);
	      }
	    });
	    this.setSelectText(buffer.join(this.mditor.EOL));
	  },
	  /*istanbul ignore next*/removeIndent: function removeIndent() {
	    /*istanbul ignore next*/var _this11 = this;
	
	    var indentRegExp = new RegExp('^' + this.mditor.INDENT);
	    var selectText = this.getSelectText();
	    if (selectText.length < 1) {
	      this.selectBeforeTextInLine();
	      if (this.getSelectText().length > 0) {
	        event.clearSelected = true;
	        this.removeIndent();
	      }
	      return;
	    }
	    var textArray = selectText.split(this.mditor.EOL);
	    var buffer = [];
	    textArray.forEach(function (line) {
	      if (indentRegExp.test(line)) {
	        line = line.replace( /*istanbul ignore next*/_this11.mditor.INDENT, '');
	      }
	      buffer.push(line);
	    });
	    this.setSelectText(buffer.join(this.mditor.EOL));
	    if (event.clearSelected) {
	      var range = this.getSelectRange();
	      this.setSelectRange(range.end, range.end);
	    }
	  }
	});

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Class = __webpack_require__(4).Class;
	var utils = __webpack_require__(3);
	
	var Stack = new Class({
	  /*istanbul ignore next*/constructor: function constructor(item) {
	    this.init(item);
	  },
	  /*istanbul ignore next*/init: function init(item) {
	    this.undoList = [item || {
	      value: null
	    }];
	    this.redoList = [];
	  },
	  /*istanbul ignore next*/push: function push(item) {
	    if (this.last() === item) return;
	    this.undoList.push(item);
	  },
	  /*istanbul ignore next*/last: function last() {
	    return this.undoList[this.undoList.length - 1];
	  },
	  /*istanbul ignore next*/undo: function undo() {
	    if (this.undoList.length > 1) {
	      var item = this.undoList.pop();
	      if (utils.isNull(item) || utils.isNull(item.value)) return;
	      this.redoList.push(item);
	    }
	    return this.last();
	  },
	  /*istanbul ignore next*/redo: function redo() {
	    var item = this.redoList.pop();
	    if (utils.isNull(item) || utils.isNull(item.value)) return;
	    this.undoList.push(item);
	    return item;
	  }
	});
	
	module.exports = Stack;

/***/ }),
/* 91 */
/***/ (function(module, exports) {

	/*istanbul ignore next*/'use strict';
	
	module.exports = [{
	  name: 'undo',
	  key: '{cmd}+z',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.undo();
	  }
	}, {
	  name: 'redo',
	  key: '{cmd}+shift+z',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.redo();
	  }
	}, {
	  name: 'h2',
	  key: 'shift+alt+2',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('## ');
	  }
	}, {
	  name: 'h3',
	  key: 'shift+alt+3',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('### ');
	  }
	}, {
	  name: 'h4',
	  key: 'shift+alt+4',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('#### ');
	  }
	}, {
	  name: 'h5',
	  key: 'shift+alt+5',
	  /*istanbul ignore next*/handler: function handler() {
	    this.editor.wrapSelectText('##### ');
	  }
	}];

/***/ }),
/* 92 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 93 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"editor\">\n  <div class=\"backdrop\" m:id=\"marks\">\n    <div class=\"inner\" m:html=\"applyMarks(value)\"></div>\n  </div>\n  <textarea class=\"textarea\" m:id=\"textarea\" m:model=\"value\" m:on:paste=\"onPaste\" m:on:dragover=\"onDragover\" m:on:drop=\"onDrop\"\n    m:on:scroll=\"onScroll()\" m:on:input=\"onInput\" m:on:compositionStart=\"onCompositionStart\" m:on:compositionEnd=\"onCompositionEnd\"></textarea>\n</div>"

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1);
	
	__webpack_require__(95);
	
	var Viewer = new mokit.Component({
	  template: __webpack_require__(96),
	
	  /*istanbul ignore next*/data: function data() {
	    return {
	      html: '',
	      alert: '????????????'
	    };
	  },
	
	
	  props: {
	    mditor: null,
	    value: {
	      /*istanbul ignore next*/get: function get() {
	        return this._value;
	      },
	      /*istanbul ignore next*/set: function set(value) {
	        /*istanbul ignore next*/var _this = this;
	
	        this._value = value;
	        var beforeEvent = { value: this._value };
	        this.$emit('beforeRender', beforeEvent);
	        this.mditor.parser.parse(beforeEvent.value, function (err, result) {
	          var afterEvent = { value: result || err };
	          /*istanbul ignore next*/_this.$emit('afterRender', afterEvent);
	          /*istanbul ignore next*/_this.html = afterEvent.value;
	        });
	      }
	    }
	  },
	
	  /*istanbul ignore next*/onClick: function onClick(event) {
	    event.preventDefault();
	    var tag = event.target;
	    if (tag.tagName == 'A') {
	      var href = tag.getAttribute('href');
	      if (href) window.open(href, '_blank');
	    }
	  }
	});
	
	module.exports = Viewer;

/***/ }),
/* 95 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 96 */
/***/ (function(module, exports) {

    module.exports = "<div class=\"viewer\" m:on:click=\"onClick\">\n  <div m:show=\"html\" class=\"markdown-body\" m:html=\"html\"></div>\n  <div m:show=\"!html\" class=\"alert\" m:html=\"alert\"></div>\n</>";

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1);
	var utils = __webpack_require__(3);
	
	__webpack_require__(98);
	
	var CHECK_REGEXP = /^\/[\s\S]+\/(i|g|m)*$/;
	
	var Finder = new mokit.Component({
	  template: __webpack_require__(99),
	  props: {
	    mditor: null,
	    active: false,
	    findWord: '',
	    replaceWord: ''
	  },
	  /*istanbul ignore next*/onReady: function onReady() {
	    this.mditor.removeCommand('find');
	    this.mditor.addCommand({
	      name: 'find',
	      key: '{cmd}+f',
	      owner: this.mditor.$element,
	      handler: this.show.bind(this, null)
	    });
	    this.mditor.removeCommand('cancel-find');
	    this.mditor.addCommand({
	      name: 'cancel-find',
	      key: 'esc',
	      owner: this.mditor.$element,
	      handler: this.hide.bind(this)
	    });
	  },
	  /*istanbul ignore next*/hide: function hide() {
	    this.findWord = '';
	    this.replaceWord = '';
	    this.mditor.editor.markExp = null;
	    this.active = false;
	  },
	  /*istanbul ignore next*/show: function show(text) {
	    /*istanbul ignore next*/var _this = this;
	
	    this.active = true;
	    this.findWord = text || this.mditor.editor.getSelectText();
	    if (this.active) {
	      setTimeout(function () {
	        /*istanbul ignore next*/_this.findBox.focus();
	      }, 200);
	    }
	    this.mditor.editor.syncScroll();
	  },
	
	  watch: {
	    /*istanbul ignore next*/findWord: function findWord() {
	      /*istanbul ignore next*/var _this2 = this;
	
	      if (!this.mditor || !this.mditor.editor) return;
	      if (!this.findWord) {
	        this.mditor.editor.markExp = null;
	      } else {
	        this.mditor.editor.markExp = this.parseRegexp(this.findWord);
	      }
	      setTimeout(function () {
	        /*istanbul ignore next*/_this2.mditor.editor.activeMark(0);
	      }, 100);
	    }
	  },
	  /*istanbul ignore next*/parseRegexp: function parseRegexp(text, forceStr) {
	    if (!forceStr && CHECK_REGEXP.test(text)) {
	      try {
	        return new Function( /*istanbul ignore next*/'return ' + text)();
	      } catch (err) {
	        return this.parseRegexp(text, true);
	      }
	    } else {
	      return new RegExp(utils.escapeRegExp(text), 'gm');
	    }
	  },
	  /*istanbul ignore next*/find: function find() {
	    this.mditor.editor.activeMark();
	  },
	  /*istanbul ignore next*/replace: function replace() {
	    this.mditor.value = this.mditor.value.replace(this.mditor.editor.markExp, this.replaceWord || '');
	  },
	  /*istanbul ignore next*/onFindEnter: function onFindEnter(event) {
	    if (event.keyCode != 13) return;
	    event.preventDefault();
	    this.find();
	  },
	  /*istanbul ignore next*/onReplaceEnter: function onReplaceEnter(event) {
	    if (event.keyCode != 13) return;
	    event.preventDefault();
	    this.replace();
	  },
	  /*istanbul ignore next*/onCompositionEnd: function onCompositionEnd(event) {
	    event.target.blur();
	    event.target.focus();
	  }
	});
	
	module.exports = Finder;

/***/ }),
/* 98 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 99 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"finder {{active?'active':''}}\">\n  <div>\n    <input m:id=\"findBox\" m:model=\"findWord\" m:on:keydown=\"onFindEnter\" m:on:compositionend=\"onCompositionEnd\" type=\"text\" placeholder=\"Find\">\n    <i class=\"fa fa-search\" aria-hidden=\"true\" tabindex=\"-1\" m:on:click=\"find()\"></i>\n  </div>\n  <div>\n    <input m:id=\"replaceBox\" m:model=\"replaceWord\" m:on:keydown=\"onReplaceEnter\" m:on:compositionend=\"onCompositionEnd\" type=\"text\"\n      placeholder=\"Replace\">\n    <i class=\"fa fa-exchange\" aria-hidden=\"true\" tabindex=\"-1\" m:on:click=\"replace()\"></i>\n  </div>\n</div>"

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var shortcuts = __webpack_require__(101);
	var utils = __webpack_require__(3);
	
	shortcuts.filter = function (event) {
	  return !!event.target;
	};
	
	var Shortcut = module.exports = function (mditor) {
	  utils.defineFreezeProp(this, 'mditor', mditor);
	};
	
	Shortcut.prototype._inRegion = function (target, owner) {
	  if (!target) return false;
	  owner = owner || this.mditor.editor.$element;
	  if (utils.isFunction(owner)) owner = owner(this.mditor);
	  return target === owner || this._inRegion(target.parentNode, owner);
	};
	
	Shortcut.prototype.bind = function (key, cmd, allowDefault, owner) {
	  /*istanbul ignore next*/var _this = this;
	
	  var mditor = this.mditor;
	  //????????????
	  if (!key || !cmd) return;
	  key = key.replace('{cmd}', mditor.CMD);
	  shortcuts(key, function (event) {
	    if (! /*istanbul ignore next*/_this._inRegion(event.target, owner)) return;
	    //??????????????????????????????
	    if (!allowDefault) {
	      event.preventDefault();
	    }
	    if (cmd instanceof Function) {
	      cmd.call(mditor, event);
	    } else {
	      mditor.execCommand(cmd, event);
	    }
	    setTimeout(function () {
	      mditor.focus();
	    }, 0);
	  });
	};
	
	Shortcut.prototype.unbind = function (key) {
	  shortcuts.unbind(key);
	};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	(function (global) {
	  var k,
	    _handlers = {},
	    _mods = {
	      16: false,
	      18: false,
	      17: false,
	      91: false
	    },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '???': 16,
	      shift: 16,
	      '???': 18,
	      alt: 18,
	      option: 18,
	      '???': 17,
	      ctrl: 17,
	      control: 17,
	      '???': 91,
	      command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8,
	      tab: 9,
	      clear: 12,
	      enter: 13,
	      'return': 13,
	      esc: 27,
	      escape: 27,
	      space: 32,
	      left: 37,
	      up: 38,
	      right: 39,
	      down: 40,
	      del: 46,
	      'delete': 46,
	      home: 36,
	      end: 35,
	      pageup: 33,
	      pagedown: 34,
	      ',': 188,
	      '.': 190,
	      '/': 191,
	      '`': 192,
	      '-': 189,
	      '=': 187,
	      ';': 186,
	      '\'': 222,
	      '[': 219,
	      ']': 221,
	      '\\': 220
	    },
	    code = function (x) {
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];
	
	  for (k = 1; k < 20; k++) _MAP['f' + k] = 111 + k;
	
	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item) {
	    var i = array.length;
	    while (i--)
	      if (array[i] === item) return i;
	    return -1;
	  }
	
	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	      if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }
	
	  var modifierMap = {
	    16: 'shiftKey',
	    18: 'altKey',
	    17: 'ctrlKey',
	    91: 'metaKey'
	  };
	
	  function updateModifierKey(event) {
	    for (k in _mods) _mods[k] = event[modifierMap[k]];
	  };
	
	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;
	
	    if (index(_downKeys, key) == -1) {
	      _downKeys.push(key);
	    }
	
	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if (key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if (key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for (k in _MODIFIERS)
	        if (_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);
	
	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if (!assignKey.filter.call(this, event)) return;
	
	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;
	
	    scope = getScope();
	
	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];
	
	      // see if it's in the current scope
	      if (handler.scope == scope || handler.scope == 'all') {
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for (k in _mods)
	          if ((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if ((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch) {
	          if (handler.method(event, handler) === false) {
	            if (event.preventDefault) event.preventDefault();
	            else event.returnValue = false;
	            if (event.stopPropagation) event.stopPropagation();
	            if (event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };
	
	  // unset modifier keys on keyup
	  function clearModifier(event) {
	    var key = event.keyCode,
	      k,
	      i = index(_downKeys, key);
	
	    // remove key from _downKeys
	    if (i >= 0) {
	      _downKeys.splice(i, 1);
	    }
	
	    if (key == 93 || key == 224) key = 91;
	    if (key in _mods) {
	      _mods[key] = false;
	      for (k in _MODIFIERS)
	        if (_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };
	
	  function resetModifiers() {
	    for (k in _mods) _mods[k] = false;
	    for (k in _MODIFIERS) assignKey[k] = false;
	  };
	
	  // parse and assign shortcut
	  function assignKey(key, scope, method) {
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }
	
	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1) {
	        mods = getMods(key);
	        key = [key[key.length - 1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({
	        shortcut: keys[i],
	        scope: scope,
	        method: method,
	        key: keys[i],
	        mods: mods
	      });
	    }
	  };
	
	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;
	
	    multipleKeys = getKeys(key);
	
	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');
	
	      if (keys.length > 1) {
	        mods = getMods(keys);
	        key = keys[keys.length - 1];
	      }
	
	      key = code(key);
	
	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i in _handlers[key]) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };
	
	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	    if (typeof (keyCode) == 'string') {
	      keyCode = code(keyCode);
	    }
	    return index(_downKeys, keyCode) != -1;
	  }
	
	  function getPressedKeyCodes() {
	    return _downKeys.slice(0);
	  }
	
	  function filter(event) {
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }
	
	  // initialize key.<modifier> to false
	  for (k in _MODIFIERS) assignKey[k] = false;
	
	  // set current scope (default 'all')
	  function setScope(scope) {
	    _scope = scope || 'all'
	  };
	
	  function getScope() {
	    return _scope || 'all'
	  };
	
	  // delete all handlers for a given scope
	  function deleteScope(scope) {
	    var key, handlers, i;
	
	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length;) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };
	
	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }
	
	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	      mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }
	
	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if (object.attachEvent)
	      object.attachEvent('on' + event, function () {
	        method(window.event)
	      });
	  };
	
	  // set the handlers globally on document
	  addEvent(document, 'keydown', function (event) {
	    dispatch(event)
	  }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);
	
	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);
	
	  // store previously defined key
	  var previousKey = global.key;
	
	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }
	
	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;
	
	  if (true) module.exports = key;
	
	})(window);

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var marked = __webpack_require__(103);
	var Prism = __webpack_require__(104);
	
	//language
	__webpack_require__(105);
	__webpack_require__(106);
	__webpack_require__(107);
	__webpack_require__(108);
	__webpack_require__(109);
	__webpack_require__(110);
	__webpack_require__(111);
	__webpack_require__(112);
	__webpack_require__(113);
	__webpack_require__(114);
	__webpack_require__(115);
	__webpack_require__(116);
	__webpack_require__(117);
	__webpack_require__(118);
	__webpack_require__(119);
	__webpack_require__(120);
	__webpack_require__(121);
	__webpack_require__(122);
	__webpack_require__(123);
	__webpack_require__(124);
	__webpack_require__(125);
	__webpack_require__(126);
	__webpack_require__(127);
	__webpack_require__(128);
	__webpack_require__(129);
	__webpack_require__(130);
	__webpack_require__(131);
	__webpack_require__(132);
	__webpack_require__(133);
	__webpack_require__(134);
	__webpack_require__(135);
	__webpack_require__(136);
	__webpack_require__(137);
	__webpack_require__(138);
	__webpack_require__(139);
	__webpack_require__(140);
	__webpack_require__(141);
	__webpack_require__(142);
	__webpack_require__(143);
	__webpack_require__(144);
	__webpack_require__(145);
	__webpack_require__(146);
	__webpack_require__(147);
	__webpack_require__(148);
	__webpack_require__(149);
	__webpack_require__(150);
	
	//alias
	Prism.languages.js = Prism.languages.javascript;
	Prism.languages['c#'] = Prism.languages.csharp;
	Prism.languages['f#'] = Prism.languages.fsharp;
	Prism.languages.sh = Prism.languages.bash;
	Prism.languages.md = Prism.languages.markdown;
	Prism.languages.py = Prism.languages.python;
	Prism.languages.yml = Prism.languages.yaml;
	Prism.languages.rb = Prism.languages.ruby;
	
	var Parser = function Parser(options) {
	  options = options || {};
	  this.options = options;
	};
	
	Parser.highlights = {};
	Parser.marked = marked;
	Parser.Prism = Prism;
	
	//??????????????? # ??????????????????
	marked.Lexer.rules.gfm.heading = marked.Lexer.rules.heading;
	marked.Lexer.rules.tables.heading = marked.Lexer.rules.heading;
	
	var renderer = new marked.Renderer();
	Parser.renderer = renderer;
	marked.setOptions({
	  renderer: renderer, gfm: true, tables: true, breaks: true, //????????????????????????????????????
	  pedantic: false,
	  sanitize: false,
	  smartLists: true,
	  smartypants: false,
	  mangle: false,
	  highlight: function /*istanbul ignore next*/highlight(code, lang, callback) {
	    if (Parser.highlights[lang]) {
	      var result = Parser.highlights[lang].parse(code, lang, callback);
	      if (!callback) return result;
	    } else if (Prism.languages[lang]) {
	      var _result = Prism.highlight(code, Prism.languages[lang]);
	      if (callback) return callback(null, _result);else return _result;
	    } else {
	      if (callback) //eslint-disable-line
	        return callback(null, code);else return code;
	    }
	  }
	});
	
	Parser.prototype.parse = function (mdText, callback) {
	  return marked(mdText, callback);
	};
	
	module.exports = Parser;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 */
	
	;(function() {
	
	/**
	 * Block-Level Grammar
	 */
	
	var block = {
	  newline: /^\n+/,
	  code: /^( {4}[^\n]+\n*)+/,
	  fences: noop,
	  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
	  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
	  nptable: noop,
	  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
	  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
	  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
	  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
	  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
	  table: noop,
	  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
	  text: /^[^\n]+/
	};
	
	block.bullet = /(?:[*+-]|\d+\.)/;
	block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
	block.item = replace(block.item, 'gm')
	  (/bull/g, block.bullet)
	  ();
	
	block.list = replace(block.list)
	  (/bull/g, block.bullet)
	  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
	  ('def', '\\n+(?=' + block.def.source + ')')
	  ();
	
	block.blockquote = replace(block.blockquote)
	  ('def', block.def)
	  ();
	
	block._tag = '(?!(?:'
	  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
	  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
	  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';
	
	block.html = replace(block.html)
	  ('comment', /<!--[\s\S]*?-->/)
	  ('closed', /<(tag)[\s\S]+?<\/\1>/)
	  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
	  (/tag/g, block._tag)
	  ();
	
	block.paragraph = replace(block.paragraph)
	  ('hr', block.hr)
	  ('heading', block.heading)
	  ('lheading', block.lheading)
	  ('blockquote', block.blockquote)
	  ('tag', '<' + block._tag)
	  ('def', block.def)
	  ();
	
	/**
	 * Normal Block Grammar
	 */
	
	block.normal = merge({}, block);
	
	/**
	 * GFM Block Grammar
	 */
	
	block.gfm = merge({}, block.normal, {
	  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
	  paragraph: /^/,
	  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
	});
	
	block.gfm.paragraph = replace(block.paragraph)
	  ('(?!', '(?!'
	    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
	    + block.list.source.replace('\\1', '\\3') + '|')
	  ();
	
	/**
	 * GFM + Tables Block Grammar
	 */
	
	block.tables = merge({}, block.gfm, {
	  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
	  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
	});
	
	/**
	 * Block Lexer
	 */
	
	function Lexer(options) {
	  this.tokens = [];
	  this.tokens.links = {};
	  this.options = options || marked.defaults;
	  this.rules = block.normal;
	
	  if (this.options.gfm) {
	    if (this.options.tables) {
	      this.rules = block.tables;
	    } else {
	      this.rules = block.gfm;
	    }
	  }
	}
	
	/**
	 * Expose Block Rules
	 */
	
	Lexer.rules = block;
	
	/**
	 * Static Lex Method
	 */
	
	Lexer.lex = function(src, options) {
	  var lexer = new Lexer(options);
	  return lexer.lex(src);
	};
	
	/**
	 * Preprocessing
	 */
	
	Lexer.prototype.lex = function(src) {
	  src = src
	    .replace(/\r\n|\r/g, '\n')
	    .replace(/\t/g, '    ')
	    .replace(/\u00a0/g, ' ')
	    .replace(/\u2424/g, '\n');
	
	  return this.token(src, true);
	};
	
	/**
	 * Lexing
	 */
	
	Lexer.prototype.token = function(src, top, bq) {
	  var src = src.replace(/^ +$/gm, '')
	    , next
	    , loose
	    , cap
	    , bull
	    , b
	    , item
	    , space
	    , i
	    , l;
	
	  while (src) {
	    // newline
	    if (cap = this.rules.newline.exec(src)) {
	      src = src.substring(cap[0].length);
	      if (cap[0].length > 1) {
	        this.tokens.push({
	          type: 'space'
	        });
	      }
	    }
	
	    // code
	    if (cap = this.rules.code.exec(src)) {
	      src = src.substring(cap[0].length);
	      cap = cap[0].replace(/^ {4}/gm, '');
	      this.tokens.push({
	        type: 'code',
	        text: !this.options.pedantic
	          ? cap.replace(/\n+$/, '')
	          : cap
	      });
	      continue;
	    }
	
	    // fences (gfm)
	    if (cap = this.rules.fences.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'code',
	        lang: cap[2],
	        text: cap[3] || ''
	      });
	      continue;
	    }
	
	    // heading
	    if (cap = this.rules.heading.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'heading',
	        depth: cap[1].length,
	        text: cap[2]
	      });
	      continue;
	    }
	
	    // table no leading pipe (gfm)
	    if (top && (cap = this.rules.nptable.exec(src))) {
	      src = src.substring(cap[0].length);
	
	      item = {
	        type: 'table',
	        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
	        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
	        cells: cap[3].replace(/\n$/, '').split('\n')
	      };
	
	      for (i = 0; i < item.align.length; i++) {
	        if (/^ *-+: *$/.test(item.align[i])) {
	          item.align[i] = 'right';
	        } else if (/^ *:-+: *$/.test(item.align[i])) {
	          item.align[i] = 'center';
	        } else if (/^ *:-+ *$/.test(item.align[i])) {
	          item.align[i] = 'left';
	        } else {
	          item.align[i] = null;
	        }
	      }
	
	      for (i = 0; i < item.cells.length; i++) {
	        item.cells[i] = item.cells[i].split(/ *\| */);
	      }
	
	      this.tokens.push(item);
	
	      continue;
	    }
	
	    // lheading
	    if (cap = this.rules.lheading.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'heading',
	        depth: cap[2] === '=' ? 1 : 2,
	        text: cap[1]
	      });
	      continue;
	    }
	
	    // hr
	    if (cap = this.rules.hr.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'hr'
	      });
	      continue;
	    }
	
	    // blockquote
	    if (cap = this.rules.blockquote.exec(src)) {
	      src = src.substring(cap[0].length);
	
	      this.tokens.push({
	        type: 'blockquote_start'
	      });
	
	      cap = cap[0].replace(/^ *> ?/gm, '');
	
	      // Pass `top` to keep the current
	      // "toplevel" state. This is exactly
	      // how markdown.pl works.
	      this.token(cap, top, true);
	
	      this.tokens.push({
	        type: 'blockquote_end'
	      });
	
	      continue;
	    }
	
	    // list
	    if (cap = this.rules.list.exec(src)) {
	      src = src.substring(cap[0].length);
	      bull = cap[2];
	
	      this.tokens.push({
	        type: 'list_start',
	        ordered: bull.length > 1
	      });
	
	      // Get each top-level item.
	      cap = cap[0].match(this.rules.item);
	
	      next = false;
	      l = cap.length;
	      i = 0;
	
	      for (; i < l; i++) {
	        item = cap[i];
	
	        // Remove the list item's bullet
	        // so it is seen as the next token.
	        space = item.length;
	        item = item.replace(/^ *([*+-]|\d+\.) +/, '');
	
	        // Outdent whatever the
	        // list item contains. Hacky.
	        if (~item.indexOf('\n ')) {
	          space -= item.length;
	          item = !this.options.pedantic
	            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
	            : item.replace(/^ {1,4}/gm, '');
	        }
	
	        // Determine whether the next list item belongs here.
	        // Backpedal if it does not belong in this list.
	        if (this.options.smartLists && i !== l - 1) {
	          b = block.bullet.exec(cap[i + 1])[0];
	          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
	            src = cap.slice(i + 1).join('\n') + src;
	            i = l - 1;
	          }
	        }
	
	        // Determine whether item is loose or not.
	        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
	        // for discount behavior.
	        loose = next || /\n\n(?!\s*$)/.test(item);
	        if (i !== l - 1) {
	          next = item.charAt(item.length - 1) === '\n';
	          if (!loose) loose = next;
	        }
	
	        this.tokens.push({
	          type: loose
	            ? 'loose_item_start'
	            : 'list_item_start'
	        });
	
	        // Recurse.
	        this.token(item, false, bq);
	
	        this.tokens.push({
	          type: 'list_item_end'
	        });
	      }
	
	      this.tokens.push({
	        type: 'list_end'
	      });
	
	      continue;
	    }
	
	    // html
	    if (cap = this.rules.html.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: this.options.sanitize
	          ? 'paragraph'
	          : 'html',
	        pre: !this.options.sanitizer
	          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
	        text: cap[0]
	      });
	      continue;
	    }
	
	    // def
	    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
	      src = src.substring(cap[0].length);
	      this.tokens.links[cap[1].toLowerCase()] = {
	        href: cap[2],
	        title: cap[3]
	      };
	      continue;
	    }
	
	    // table (gfm)
	    if (top && (cap = this.rules.table.exec(src))) {
	      src = src.substring(cap[0].length);
	
	      item = {
	        type: 'table',
	        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
	        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
	        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
	      };
	
	      for (i = 0; i < item.align.length; i++) {
	        if (/^ *-+: *$/.test(item.align[i])) {
	          item.align[i] = 'right';
	        } else if (/^ *:-+: *$/.test(item.align[i])) {
	          item.align[i] = 'center';
	        } else if (/^ *:-+ *$/.test(item.align[i])) {
	          item.align[i] = 'left';
	        } else {
	          item.align[i] = null;
	        }
	      }
	
	      for (i = 0; i < item.cells.length; i++) {
	        item.cells[i] = item.cells[i]
	          .replace(/^ *\| *| *\| *$/g, '')
	          .split(/ *\| */);
	      }
	
	      this.tokens.push(item);
	
	      continue;
	    }
	
	    // top-level paragraph
	    if (top && (cap = this.rules.paragraph.exec(src))) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'paragraph',
	        text: cap[1].charAt(cap[1].length - 1) === '\n'
	          ? cap[1].slice(0, -1)
	          : cap[1]
	      });
	      continue;
	    }
	
	    // text
	    if (cap = this.rules.text.exec(src)) {
	      // Top-level should never reach here.
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'text',
	        text: cap[0]
	      });
	      continue;
	    }
	
	    if (src) {
	      throw new
	        Error('Infinite loop on byte: ' + src.charCodeAt(0));
	    }
	  }
	
	  return this.tokens;
	};
	
	/**
	 * Inline-Level Grammar
	 */
	
	var inline = {
	  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
	  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
	  url: noop,
	  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
	  link: /^!?\[(inside)\]\(href\)/,
	  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
	  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
	  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
	  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
	  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
	  br: /^ {2,}\n(?!\s*$)/,
	  del: noop,
	  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
	};
	
	inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
	inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;
	
	inline.link = replace(inline.link)
	  ('inside', inline._inside)
	  ('href', inline._href)
	  ();
	
	inline.reflink = replace(inline.reflink)
	  ('inside', inline._inside)
	  ();
	
	/**
	 * Normal Inline Grammar
	 */
	
	inline.normal = merge({}, inline);
	
	/**
	 * Pedantic Inline Grammar
	 */
	
	inline.pedantic = merge({}, inline.normal, {
	  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
	  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
	});
	
	/**
	 * GFM Inline Grammar
	 */
	
	inline.gfm = merge({}, inline.normal, {
	  escape: replace(inline.escape)('])', '~|])')(),
	  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
	  del: /^~~(?=\S)([\s\S]*?\S)~~/,
	  text: replace(inline.text)
	    (']|', '~]|')
	    ('|', '|https?://|')
	    ()
	});
	
	/**
	 * GFM + Line Breaks Inline Grammar
	 */
	
	inline.breaks = merge({}, inline.gfm, {
	  br: replace(inline.br)('{2,}', '*')(),
	  text: replace(inline.gfm.text)('{2,}', '*')()
	});
	
	/**
	 * Inline Lexer & Compiler
	 */
	
	function InlineLexer(links, options) {
	  this.options = options || marked.defaults;
	  this.links = links;
	  this.rules = inline.normal;
	  this.renderer = this.options.renderer || new Renderer;
	  this.renderer.options = this.options;
	
	  if (!this.links) {
	    throw new
	      Error('Tokens array requires a `links` property.');
	  }
	
	  if (this.options.gfm) {
	    if (this.options.breaks) {
	      this.rules = inline.breaks;
	    } else {
	      this.rules = inline.gfm;
	    }
	  } else if (this.options.pedantic) {
	    this.rules = inline.pedantic;
	  }
	}
	
	/**
	 * Expose Inline Rules
	 */
	
	InlineLexer.rules = inline;
	
	/**
	 * Static Lexing/Compiling Method
	 */
	
	InlineLexer.output = function(src, links, options) {
	  var inline = new InlineLexer(links, options);
	  return inline.output(src);
	};
	
	/**
	 * Lexing/Compiling
	 */
	
	InlineLexer.prototype.output = function(src) {
	  var out = ''
	    , link
	    , text
	    , href
	    , cap;
	
	  while (src) {
	    // escape
	    if (cap = this.rules.escape.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += cap[1];
	      continue;
	    }
	
	    // autolink
	    if (cap = this.rules.autolink.exec(src)) {
	      src = src.substring(cap[0].length);
	      if (cap[2] === '@') {
	        text = cap[1].charAt(6) === ':'
	          ? this.mangle(cap[1].substring(7))
	          : this.mangle(cap[1]);
	        href = this.mangle('mailto:') + text;
	      } else {
	        text = escape(cap[1]);
	        href = text;
	      }
	      out += this.renderer.link(href, null, text);
	      continue;
	    }
	
	    // url (gfm)
	    if (!this.inLink && (cap = this.rules.url.exec(src))) {
	      src = src.substring(cap[0].length);
	      text = escape(cap[1]);
	      href = text;
	      out += this.renderer.link(href, null, text);
	      continue;
	    }
	
	    // tag
	    if (cap = this.rules.tag.exec(src)) {
	      if (!this.inLink && /^<a /i.test(cap[0])) {
	        this.inLink = true;
	      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
	        this.inLink = false;
	      }
	      src = src.substring(cap[0].length);
	      out += this.options.sanitize
	        ? this.options.sanitizer
	          ? this.options.sanitizer(cap[0])
	          : escape(cap[0])
	        : cap[0]
	      continue;
	    }
	
	    // link
	    if (cap = this.rules.link.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.inLink = true;
	      out += this.outputLink(cap, {
	        href: cap[2],
	        title: cap[3]
	      });
	      this.inLink = false;
	      continue;
	    }
	
	    // reflink, nolink
	    if ((cap = this.rules.reflink.exec(src))
	        || (cap = this.rules.nolink.exec(src))) {
	      src = src.substring(cap[0].length);
	      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
	      link = this.links[link.toLowerCase()];
	      if (!link || !link.href) {
	        out += cap[0].charAt(0);
	        src = cap[0].substring(1) + src;
	        continue;
	      }
	      this.inLink = true;
	      out += this.outputLink(cap, link);
	      this.inLink = false;
	      continue;
	    }
	
	    // strong
	    if (cap = this.rules.strong.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.strong(this.output(cap[2] || cap[1]));
	      continue;
	    }
	
	    // em
	    if (cap = this.rules.em.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.em(this.output(cap[2] || cap[1]));
	      continue;
	    }
	
	    // code
	    if (cap = this.rules.code.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.codespan(escape(cap[2], true));
	      continue;
	    }
	
	    // br
	    if (cap = this.rules.br.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.br();
	      continue;
	    }
	
	    // del (gfm)
	    if (cap = this.rules.del.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.del(this.output(cap[1]));
	      continue;
	    }
	
	    // text
	    if (cap = this.rules.text.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.text(escape(this.smartypants(cap[0])));
	      continue;
	    }
	
	    if (src) {
	      throw new
	        Error('Infinite loop on byte: ' + src.charCodeAt(0));
	    }
	  }
	
	  return out;
	};
	
	/**
	 * Compile Link
	 */
	
	InlineLexer.prototype.outputLink = function(cap, link) {
	  var href = escape(link.href)
	    , title = link.title ? escape(link.title) : null;
	
	  return cap[0].charAt(0) !== '!'
	    ? this.renderer.link(href, title, this.output(cap[1]))
	    : this.renderer.image(href, title, escape(cap[1]));
	};
	
	/**
	 * Smartypants Transformations
	 */
	
	InlineLexer.prototype.smartypants = function(text) {
	  if (!this.options.smartypants) return text;
	  return text
	    // em-dashes
	    .replace(/---/g, '\u2014')
	    // en-dashes
	    .replace(/--/g, '\u2013')
	    // opening singles
	    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
	    // closing singles & apostrophes
	    .replace(/'/g, '\u2019')
	    // opening doubles
	    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
	    // closing doubles
	    .replace(/"/g, '\u201d')
	    // ellipses
	    .replace(/\.{3}/g, '\u2026');
	};
	
	/**
	 * Mangle Links
	 */
	
	InlineLexer.prototype.mangle = function(text) {
	  if (!this.options.mangle) return text;
	  var out = ''
	    , l = text.length
	    , i = 0
	    , ch;
	
	  for (; i < l; i++) {
	    ch = text.charCodeAt(i);
	    if (Math.random() > 0.5) {
	      ch = 'x' + ch.toString(16);
	    }
	    out += '&#' + ch + ';';
	  }
	
	  return out;
	};
	
	/**
	 * Renderer
	 */
	
	function Renderer(options) {
	  this.options = options || {};
	}
	
	Renderer.prototype.code = function(code, lang, escaped) {
	  if (this.options.highlight) {
	    var out = this.options.highlight(code, lang);
	    if (out != null && out !== code) {
	      escaped = true;
	      code = out;
	    }
	  }
	
	  if (!lang) {
	    return '<pre><code>'
	      + (escaped ? code : escape(code, true))
	      + '\n</code></pre>';
	  }
	
	  return '<pre><code class="'
	    + this.options.langPrefix
	    + escape(lang, true)
	    + '">'
	    + (escaped ? code : escape(code, true))
	    + '\n</code></pre>\n';
	};
	
	Renderer.prototype.blockquote = function(quote) {
	  return '<blockquote>\n' + quote + '</blockquote>\n';
	};
	
	Renderer.prototype.html = function(html) {
	  return html;
	};
	
	Renderer.prototype.heading = function(text, level, raw) {
	  return '<h'
	    + level
	    + ' id="'
	    + this.options.headerPrefix
	    + raw.toLowerCase().replace(/[^\w]+/g, '-')
	    + '">'
	    + text
	    + '</h'
	    + level
	    + '>\n';
	};
	
	Renderer.prototype.hr = function() {
	  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
	};
	
	Renderer.prototype.list = function(body, ordered) {
	  var type = ordered ? 'ol' : 'ul';
	  return '<' + type + '>\n' + body + '</' + type + '>\n';
	};
	
	Renderer.prototype.listitem = function(text) {
	  return '<li>' + text + '</li>\n';
	};
	
	Renderer.prototype.paragraph = function(text) {
	  return '<p>' + text + '</p>\n';
	};
	
	Renderer.prototype.table = function(header, body) {
	  return '<table>\n'
	    + '<thead>\n'
	    + header
	    + '</thead>\n'
	    + '<tbody>\n'
	    + body
	    + '</tbody>\n'
	    + '</table>\n';
	};
	
	Renderer.prototype.tablerow = function(content) {
	  return '<tr>\n' + content + '</tr>\n';
	};
	
	Renderer.prototype.tablecell = function(content, flags) {
	  var type = flags.header ? 'th' : 'td';
	  var tag = flags.align
	    ? '<' + type + ' style="text-align:' + flags.align + '">'
	    : '<' + type + '>';
	  return tag + content + '</' + type + '>\n';
	};
	
	// span level renderer
	Renderer.prototype.strong = function(text) {
	  return '<strong>' + text + '</strong>';
	};
	
	Renderer.prototype.em = function(text) {
	  return '<em>' + text + '</em>';
	};
	
	Renderer.prototype.codespan = function(text) {
	  return '<code>' + text + '</code>';
	};
	
	Renderer.prototype.br = function() {
	  return this.options.xhtml ? '<br/>' : '<br>';
	};
	
	Renderer.prototype.del = function(text) {
	  return '<del>' + text + '</del>';
	};
	
	Renderer.prototype.link = function(href, title, text) {
	  if (this.options.sanitize) {
	    try {
	      var prot = decodeURIComponent(unescape(href))
	        .replace(/[^\w:]/g, '')
	        .toLowerCase();
	    } catch (e) {
	      return '';
	    }
	    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
	      return '';
	    }
	  }
	  var out = '<a href="' + href + '"';
	  if (title) {
	    out += ' title="' + title + '"';
	  }
	  out += '>' + text + '</a>';
	  return out;
	};
	
	Renderer.prototype.image = function(href, title, text) {
	  var out = '<img src="' + href + '" alt="' + text + '"';
	  if (title) {
	    out += ' title="' + title + '"';
	  }
	  out += this.options.xhtml ? '/>' : '>';
	  return out;
	};
	
	Renderer.prototype.text = function(text) {
	  return text;
	};
	
	/**
	 * Parsing & Compiling
	 */
	
	function Parser(options) {
	  this.tokens = [];
	  this.token = null;
	  this.options = options || marked.defaults;
	  this.options.renderer = this.options.renderer || new Renderer;
	  this.renderer = this.options.renderer;
	  this.renderer.options = this.options;
	}
	
	/**
	 * Static Parse Method
	 */
	
	Parser.parse = function(src, options, renderer) {
	  var parser = new Parser(options, renderer);
	  return parser.parse(src);
	};
	
	/**
	 * Parse Loop
	 */
	
	Parser.prototype.parse = function(src) {
	  this.inline = new InlineLexer(src.links, this.options, this.renderer);
	  this.tokens = src.reverse();
	
	  var out = '';
	  while (this.next()) {
	    out += this.tok();
	  }
	
	  return out;
	};
	
	/**
	 * Next Token
	 */
	
	Parser.prototype.next = function() {
	  return this.token = this.tokens.pop();
	};
	
	/**
	 * Preview Next Token
	 */
	
	Parser.prototype.peek = function() {
	  return this.tokens[this.tokens.length - 1] || 0;
	};
	
	/**
	 * Parse Text Tokens
	 */
	
	Parser.prototype.parseText = function() {
	  var body = this.token.text;
	
	  while (this.peek().type === 'text') {
	    body += '\n' + this.next().text;
	  }
	
	  return this.inline.output(body);
	};
	
	/**
	 * Parse Current Token
	 */
	
	Parser.prototype.tok = function() {
	  switch (this.token.type) {
	    case 'space': {
	      return '';
	    }
	    case 'hr': {
	      return this.renderer.hr();
	    }
	    case 'heading': {
	      return this.renderer.heading(
	        this.inline.output(this.token.text),
	        this.token.depth,
	        this.token.text);
	    }
	    case 'code': {
	      return this.renderer.code(this.token.text,
	        this.token.lang,
	        this.token.escaped);
	    }
	    case 'table': {
	      var header = ''
	        , body = ''
	        , i
	        , row
	        , cell
	        , flags
	        , j;
	
	      // header
	      cell = '';
	      for (i = 0; i < this.token.header.length; i++) {
	        flags = { header: true, align: this.token.align[i] };
	        cell += this.renderer.tablecell(
	          this.inline.output(this.token.header[i]),
	          { header: true, align: this.token.align[i] }
	        );
	      }
	      header += this.renderer.tablerow(cell);
	
	      for (i = 0; i < this.token.cells.length; i++) {
	        row = this.token.cells[i];
	
	        cell = '';
	        for (j = 0; j < row.length; j++) {
	          cell += this.renderer.tablecell(
	            this.inline.output(row[j]),
	            { header: false, align: this.token.align[j] }
	          );
	        }
	
	        body += this.renderer.tablerow(cell);
	      }
	      return this.renderer.table(header, body);
	    }
	    case 'blockquote_start': {
	      var body = '';
	
	      while (this.next().type !== 'blockquote_end') {
	        body += this.tok();
	      }
	
	      return this.renderer.blockquote(body);
	    }
	    case 'list_start': {
	      var body = ''
	        , ordered = this.token.ordered;
	
	      while (this.next().type !== 'list_end') {
	        body += this.tok();
	      }
	
	      return this.renderer.list(body, ordered);
	    }
	    case 'list_item_start': {
	      var body = '';
	
	      while (this.next().type !== 'list_item_end') {
	        body += this.token.type === 'text'
	          ? this.parseText()
	          : this.tok();
	      }
	
	      return this.renderer.listitem(body);
	    }
	    case 'loose_item_start': {
	      var body = '';
	
	      while (this.next().type !== 'list_item_end') {
	        body += this.tok();
	      }
	
	      return this.renderer.listitem(body);
	    }
	    case 'html': {
	      var html = !this.token.pre && !this.options.pedantic
	        ? this.inline.output(this.token.text)
	        : this.token.text;
	      return this.renderer.html(html);
	    }
	    case 'paragraph': {
	      return this.renderer.paragraph(this.inline.output(this.token.text));
	    }
	    case 'text': {
	      return this.renderer.paragraph(this.parseText());
	    }
	  }
	};
	
	/**
	 * Helpers
	 */
	
	function escape(html, encode) {
	  return html
	    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;')
	    .replace(/'/g, '&#39;');
	}
	
	function unescape(html) {
		// explicitly match decimal, hex, and named HTML entities 
	  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
	    n = n.toLowerCase();
	    if (n === 'colon') return ':';
	    if (n.charAt(0) === '#') {
	      return n.charAt(1) === 'x'
	        ? String.fromCharCode(parseInt(n.substring(2), 16))
	        : String.fromCharCode(+n.substring(1));
	    }
	    return '';
	  });
	}
	
	function replace(regex, opt) {
	  regex = regex.source;
	  opt = opt || '';
	  return function self(name, val) {
	    if (!name) return new RegExp(regex, opt);
	    val = val.source || val;
	    val = val.replace(/(^|[^\[])\^/g, '$1');
	    regex = regex.replace(name, val);
	    return self;
	  };
	}
	
	function noop() {}
	noop.exec = noop;
	
	function merge(obj) {
	  var i = 1
	    , target
	    , key;
	
	  for (; i < arguments.length; i++) {
	    target = arguments[i];
	    for (key in target) {
	      if (Object.prototype.hasOwnProperty.call(target, key)) {
	        obj[key] = target[key];
	      }
	    }
	  }
	
	  return obj;
	}
	
	
	/**
	 * Marked
	 */
	
	function marked(src, opt, callback) {
	  if (callback || typeof opt === 'function') {
	    if (!callback) {
	      callback = opt;
	      opt = null;
	    }
	
	    opt = merge({}, marked.defaults, opt || {});
	
	    var highlight = opt.highlight
	      , tokens
	      , pending
	      , i = 0;
	
	    try {
	      tokens = Lexer.lex(src, opt)
	    } catch (e) {
	      return callback(e);
	    }
	
	    pending = tokens.length;
	
	    var done = function(err) {
	      if (err) {
	        opt.highlight = highlight;
	        return callback(err);
	      }
	
	      var out;
	
	      try {
	        out = Parser.parse(tokens, opt);
	      } catch (e) {
	        err = e;
	      }
	
	      opt.highlight = highlight;
	
	      return err
	        ? callback(err)
	        : callback(null, out);
	    };
	
	    if (!highlight || highlight.length < 3) {
	      return done();
	    }
	
	    delete opt.highlight;
	
	    if (!pending) return done();
	
	    for (; i < tokens.length; i++) {
	      (function(token) {
	        if (token.type !== 'code') {
	          return --pending || done();
	        }
	        return highlight(token.text, token.lang, function(err, code) {
	          if (err) return done(err);
	          if (code == null || code === token.text) {
	            return --pending || done();
	          }
	          token.text = code;
	          token.escaped = true;
	          --pending || done();
	        });
	      })(tokens[i]);
	    }
	
	    return;
	  }
	  try {
	    if (opt) opt = merge({}, marked.defaults, opt);
	    return Parser.parse(Lexer.lex(src, opt), opt);
	  } catch (e) {
	    e.message += '\nPlease report this to https://github.com/chjj/marked.';
	    if ((opt || marked.defaults).silent) {
	      return '<p>An error occured:</p><pre>'
	        + escape(e.message + '', true)
	        + '</pre>';
	    }
	    throw e;
	  }
	}
	
	/**
	 * Options
	 */
	
	marked.options =
	marked.setOptions = function(opt) {
	  merge(marked.defaults, opt);
	  return marked;
	};
	
	marked.defaults = {
	  gfm: true,
	  tables: true,
	  breaks: false,
	  pedantic: false,
	  sanitize: false,
	  sanitizer: null,
	  mangle: true,
	  smartLists: false,
	  silent: false,
	  highlight: null,
	  langPrefix: 'lang-',
	  smartypants: false,
	  headerPrefix: '',
	  renderer: new Renderer,
	  xhtml: false
	};
	
	/**
	 * Expose
	 */
	
	marked.Parser = Parser;
	marked.parser = Parser.parse;
	
	marked.Renderer = Renderer;
	
	marked.Lexer = Lexer;
	marked.lexer = Lexer.lex;
	
	marked.InlineLexer = InlineLexer;
	marked.inlineLexer = InlineLexer.output;
	
	marked.parse = marked;
	
	if (true) {
	  module.exports = marked;
	} else if (typeof define === 'function' && define.amd) {
	  define(function() { return marked; });
	} else {
	  this.marked = marked;
	}
	
	}).call(function() {
	  return this || (typeof window !== 'undefined' ? window : global);
	}());
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 104 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/* **********************************************
	     Begin prism-core.js
	********************************************** */
	
	var _self = (typeof window !== 'undefined')
		? window   // if in browser
		: (
			(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
		);
	
	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */
	
	var Prism = (function(){
	
	// Private helper vars
	var lang = /\blang(?:uage)?-(\w+)\b/i;
	var uniqueId = 0;
	
	var _ = _self.Prism = {
		manual: _self.Prism && _self.Prism.manual,
		util: {
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (_.util.type(tokens) === 'Array') {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},
	
			type: function (o) {
				return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
			},
	
			objId: function (obj) {
				if (!obj['__id']) {
					Object.defineProperty(obj, '__id', { value: ++uniqueId });
				}
				return obj['__id'];
			},
	
			// Deep clone a language definition (e.g. to extend it)
			clone: function (o) {
				var type = _.util.type(o);
	
				switch (type) {
					case 'Object':
						var clone = {};
	
						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = _.util.clone(o[key]);
							}
						}
	
						return clone;
	
					case 'Array':
						return o.map(function(v) { return _.util.clone(v); });
				}
	
				return o;
			}
		},
	
		languages: {
			extend: function (id, redef) {
				var lang = _.util.clone(_.languages[id]);
	
				for (var key in redef) {
					lang[key] = redef[key];
				}
	
				return lang;
			},
	
			/**
			 * Insert a token before another token in a language literal
			 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
			 * we cannot just provide an object, we need anobject and a key.
			 * @param inside The key (or language id) of the parent
			 * @param before The key to insert before. If not provided, the function appends instead.
			 * @param insert Object with the key/value pairs to insert
			 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
			 */
			insertBefore: function (inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];
	
				if (arguments.length == 2) {
					insert = arguments[1];
	
					for (var newToken in insert) {
						if (insert.hasOwnProperty(newToken)) {
							grammar[newToken] = insert[newToken];
						}
					}
	
					return grammar;
				}
	
				var ret = {};
	
				for (var token in grammar) {
	
					if (grammar.hasOwnProperty(token)) {
	
						if (token == before) {
	
							for (var newToken in insert) {
	
								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}
	
						ret[token] = grammar[token];
					}
				}
	
				// Update references in other language definitions
				_.languages.DFS(_.languages, function(key, value) {
					if (value === root[inside] && key != inside) {
						this[key] = ret;
					}
				});
	
				return root[inside] = ret;
			},
	
			// Traverse a language definition with Depth First Search
			DFS: function(o, callback, type, visited) {
				visited = visited || {};
				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);
	
						if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, null, visited);
						}
						else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, i, visited);
						}
					}
				}
			}
		},
		plugins: {},
	
		highlightAll: function(async, callback) {
			var env = {
				callback: callback,
				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};
	
			_.hooks.run("before-highlightall", env);
	
			var elements = env.elements || document.querySelectorAll(env.selector);
	
			for (var i=0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, env.callback);
			}
		},
	
		highlightElement: function(element, async, callback) {
			// Find language
			var language, grammar, parent = element;
	
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}
	
			if (parent) {
				language = (parent.className.match(lang) || [,''])[1].toLowerCase();
				grammar = _.languages[language];
			}
	
			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
	
			// Set language on the parent, for styling
			parent = element.parentNode;
	
			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
	
			var code = element.textContent;
	
			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};
	
			_.hooks.run('before-sanity-check', env);
	
			if (!env.code || !env.grammar) {
				if (env.code) {
					_.hooks.run('before-highlight', env);
					env.element.textContent = env.code;
					_.hooks.run('after-highlight', env);
				}
				_.hooks.run('complete', env);
				return;
			}
	
			_.hooks.run('before-highlight', env);
	
			if (async && _self.Worker) {
				var worker = new Worker(_.filename);
	
				worker.onmessage = function(evt) {
					env.highlightedCode = evt.data;
	
					_.hooks.run('before-insert', env);
	
					env.element.innerHTML = env.highlightedCode;
	
					callback && callback.call(env.element);
					_.hooks.run('after-highlight', env);
					_.hooks.run('complete', env);
				};
	
				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code,
					immediateClose: true
				}));
			}
			else {
				env.highlightedCode = _.highlight(env.code, env.grammar, env.language);
	
				_.hooks.run('before-insert', env);
	
				env.element.innerHTML = env.highlightedCode;
	
				callback && callback.call(element);
	
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			}
		},
	
		highlight: function (text, grammar, language) {
			var tokens = _.tokenize(text, grammar);
			return Token.stringify(_.util.encode(tokens), language);
		},
	
		matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
			var Token = _.Token;
	
			for (var token in grammar) {
				if(!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}
	
				if (token == target) {
					return;
				}
	
				var patterns = grammar[token];
				patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];
	
				for (var j = 0; j < patterns.length; ++j) {
					var pattern = patterns[j],
						inside = pattern.inside,
						lookbehind = !!pattern.lookbehind,
						greedy = !!pattern.greedy,
						lookbehindLength = 0,
						alias = pattern.alias;
	
					if (greedy && !pattern.pattern.global) {
						// Without the global flag, lastIndex won't work
						var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
						pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
					}
	
					pattern = pattern.pattern || pattern;
	
					// Don???t cache length as it changes during the loop
					for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
	
						var str = strarr[i];
	
						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							return;
						}
	
						if (str instanceof Token) {
							continue;
						}
	
						pattern.lastIndex = 0;
	
						var match = pattern.exec(str),
						    delNum = 1;
	
						// Greedy patterns can override/remove up to two previously matched tokens
						if (!match && greedy && i != strarr.length - 1) {
							pattern.lastIndex = pos;
							match = pattern.exec(text);
							if (!match) {
								break;
							}
	
							var from = match.index + (lookbehind ? match[1].length : 0),
							    to = match.index + match[0].length,
							    k = i,
							    p = pos;
	
							for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
								p += strarr[k].length;
								// Move the index i to the element in strarr that is closest to from
								if (from >= p) {
									++i;
									pos = p;
								}
							}
	
							/*
							 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
							 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
							 */
							if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
								continue;
							}
	
							// Number of tokens to delete and replace with the new match
							delNum = k - i;
							str = text.slice(pos, p);
							match.index -= pos;
						}
	
						if (!match) {
							if (oneshot) {
								break;
							}
	
							continue;
						}
	
						if(lookbehind) {
							lookbehindLength = match[1].length;
						}
	
						var from = match.index + lookbehindLength,
						    match = match[0].slice(lookbehindLength),
						    to = from + match.length,
						    before = str.slice(0, from),
						    after = str.slice(to);
	
						var args = [i, delNum];
	
						if (before) {
							++i;
							pos += before.length;
							args.push(before);
						}
	
						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);
	
						args.push(wrapped);
	
						if (after) {
							args.push(after);
						}
	
						Array.prototype.splice.apply(strarr, args);
	
						if (delNum != 1)
							_.matchGrammar(text, strarr, grammar, i, pos, true, token);
	
						if (oneshot)
							break;
					}
				}
			}
		},
	
		tokenize: function(text, grammar, language) {
			var strarr = [text];
	
			var rest = grammar.rest;
	
			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}
	
				delete grammar.rest;
			}
	
			_.matchGrammar(text, strarr, grammar, 0, 0, false);
	
			return strarr;
		},
	
		hooks: {
			all: {},
	
			add: function (name, callback) {
				var hooks = _.hooks.all;
	
				hooks[name] = hooks[name] || [];
	
				hooks[name].push(callback);
			},
	
			run: function (name, env) {
				var callbacks = _.hooks.all[name];
	
				if (!callbacks || !callbacks.length) {
					return;
				}
	
				for (var i=0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		}
	};
	
	var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
		this.type = type;
		this.content = content;
		this.alias = alias;
		// Copy of the full string this token was created from
		this.length = (matchedStr || "").length|0;
		this.greedy = !!greedy;
	};
	
	Token.stringify = function(o, language, parent) {
		if (typeof o == 'string') {
			return o;
		}
	
		if (_.util.type(o) === 'Array') {
			return o.map(function(element) {
				return Token.stringify(element, language, o);
			}).join('');
		}
	
		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language,
			parent: parent
		};
	
		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}
	
		if (o.alias) {
			var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}
	
		_.hooks.run('wrap', env);
	
		var attributes = Object.keys(env.attributes).map(function(name) {
			return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
		}).join(' ');
	
		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
	
	};
	
	if (!_self.document) {
		if (!_self.addEventListener) {
			// in Node.js
			return _self.Prism;
		}
	 	// In worker
		_self.addEventListener('message', function(evt) {
			var message = JSON.parse(evt.data),
			    lang = message.language,
			    code = message.code,
			    immediateClose = message.immediateClose;
	
			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	
		return _self.Prism;
	}
	
	//Get current script and highlight
	var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
	
	if (script) {
		_.filename = script.src;
	
		if (!_.manual && !script.hasAttribute('data-manual')) {
			if(document.readyState !== "loading") {
				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(_.highlightAll);
				} else {
					window.setTimeout(_.highlightAll, 16);
				}
			}
			else {
				document.addEventListener('DOMContentLoaded', _.highlightAll);
			}
		}
	}
	
	return _self.Prism;
	
	})();
	
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Prism;
	}
	
	// hack for components to work correctly in node.js
	if (typeof global !== 'undefined') {
		global.Prism = Prism;
	}
	
	
	/* **********************************************
	     Begin prism-markup.js
	********************************************** */
	
	Prism.languages.markup = {
		'comment': /<!--[\s\S]*?-->/,
		'prolog': /<\?[\s\S]+?\?>/,
		'doctype': /<!DOCTYPE[\s\S]+?>/i,
		'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
		'tag': {
			pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\s\S])*\1|[^\s'">=]+))?)*\s*\/?>/i,
			inside: {
				'tag': {
					pattern: /^<\/?[^\s>\/]+/i,
					inside: {
						'punctuation': /^<\/?/,
						'namespace': /^[^\s>\/:]+:/
					}
				},
				'attr-value': {
					pattern: /=(?:('|")[\s\S]*?(\1)|[^\s>]+)/i,
					inside: {
						'punctuation': /[=>"']/
					}
				},
				'punctuation': /\/?>/,
				'attr-name': {
					pattern: /[^\s>\/]+/,
					inside: {
						'namespace': /^[^\s>\/:]+:/
					}
				}
	
			}
		},
		'entity': /&#?[\da-z]{1,8};/i
	};
	
	Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
		Prism.languages.markup['entity'];
	
	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function(env) {
	
		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		}
	});
	
	Prism.languages.xml = Prism.languages.markup;
	Prism.languages.html = Prism.languages.markup;
	Prism.languages.mathml = Prism.languages.markup;
	Prism.languages.svg = Prism.languages.markup;
	
	
	/* **********************************************
	     Begin prism-css.js
	********************************************** */
	
	Prism.languages.css = {
		'comment': /\/\*[\s\S]*?\*\//,
		'atrule': {
			pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
			inside: {
				'rule': /@[\w-]+/
				// See rest below
			}
		},
		'url': /url\((?:(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
		'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
		'string': {
			pattern: /("|')(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'property': /(\b|\B)[\w-]+(?=\s*:)/i,
		'important': /\B!important\b/i,
		'function': /[-a-z0-9]+(?=\()/i,
		'punctuation': /[(){};:]/
	};
	
	Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);
	
	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'style': {
				pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
				lookbehind: true,
				inside: Prism.languages.css,
				alias: 'language-css'
			}
		});
		
		Prism.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|').*?\1/i,
				inside: {
					'attr-name': {
						pattern: /^\s*style/i,
						inside: Prism.languages.markup.tag.inside
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/i,
						inside: Prism.languages.css
					}
				},
				alias: 'language-css'
			}
		}, Prism.languages.markup.tag);
	}
	
	/* **********************************************
	     Begin prism-clike.js
	********************************************** */
	
	Prism.languages.clike = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true
			}
		],
		'string': {
			pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'class-name': {
			pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
			lookbehind: true,
			inside: {
				punctuation: /(\.|\\)/
			}
		},
		'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		'boolean': /\b(true|false)\b/,
		'function': /[a-z0-9_]+(?=\()/i,
		'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
		'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
		'punctuation': /[{}[\];(),.:]/
	};
	
	
	/* **********************************************
	     Begin prism-javascript.js
	********************************************** */
	
	Prism.languages.javascript = Prism.languages.extend('clike', {
		'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
		'number': /\b-?(0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
		// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
		'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\s*\()/i,
		'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
	});
	
	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /(^|[^/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
			lookbehind: true,
			greedy: true
		},
		// This must be declared before keyword because we use "function" inside the look-forward
		'function-variable': {
			pattern: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)\s*=>))/i,
			alias: 'function'
		}
	});
	
	Prism.languages.insertBefore('javascript', 'string', {
		'template-string': {
			pattern: /`(?:\\\\|\\?[^\\])*?`/,
			greedy: true,
			inside: {
				'interpolation': {
					pattern: /\$\{[^}]+\}/,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\$\{|\}$/,
							alias: 'punctuation'
						},
						rest: Prism.languages.javascript
					}
				},
				'string': /[\s\S]+/
			}
		}
	});
	
	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'script': {
				pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
				lookbehind: true,
				inside: Prism.languages.javascript,
				alias: 'language-javascript'
			}
		});
	}
	
	Prism.languages.js = Prism.languages.javascript;
	
	
	/* **********************************************
	     Begin prism-file-highlight.js
	********************************************** */
	
	(function () {
		if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
			return;
		}
	
		self.Prism.fileHighlight = function() {
	
			var Extensions = {
				'js': 'javascript',
				'py': 'python',
				'rb': 'ruby',
				'ps1': 'powershell',
				'psm1': 'powershell',
				'sh': 'bash',
				'bat': 'batch',
				'h': 'c',
				'tex': 'latex'
			};
	
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');
	
				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}
	
				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}
	
				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}
	
				var code = document.createElement('code');
				code.className = 'language-' + language;
	
				pre.textContent = '';
	
				code.textContent = 'Loading???';
	
				pre.appendChild(code);
	
				var xhr = new XMLHttpRequest();
	
				xhr.open('GET', src, true);
	
				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
	
						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;
	
							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '??? Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '??? Error: File does not exist or is empty';
						}
					}
				};
	
				xhr.send(null);
			});
	
		};
	
		document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);
	
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 105 */
/***/ (function(module, exports) {

	Prism.languages.java = Prism.languages.extend('clike', {
		'keyword': /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
		'number': /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+(?:e[+-]?\d+)?[df]?\b/i,
		'operator': {
			pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
			lookbehind: true
		}
	});
	
	Prism.languages.insertBefore('java','function', {
		'annotation': {
			alias: 'punctuation',
			pattern: /(^|[^.])@\w+/,
			lookbehind: true
		}
	});


/***/ }),
/* 106 */
/***/ (function(module, exports) {

	Prism.languages.csharp = Prism.languages.extend('clike', {
		'keyword': /\b(abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|descending|dynamic|from|get|global|group|into|join|let|orderby|partial|remove|select|set|value|var|where|yield)\b/,
		'string': [
			{
				pattern: /@("|')(\1\1|\\\1|\\?(?!\1)[\s\S])*\1/,
				greedy: true
			},
			{
				pattern: /("|')(\\?.)*?\1/,
				greedy: true
			}
		],
		'number': /\b-?(0x[\da-f]+|\d*\.?\d+f?)\b/i
	});
	
	Prism.languages.insertBefore('csharp', 'keyword', {
		'generic-method': {
			pattern: /[a-z0-9_]+\s*<[^>\r\n]+?>\s*(?=\()/i,
			alias: 'function',
			inside: {
				keyword: Prism.languages.csharp.keyword,
				punctuation: /[<>(),.:]/
			}
		},
		'preprocessor': {
			pattern: /(^\s*)#.*/m,
			lookbehind: true,
			alias: 'property',
			inside: {
				// highlight preprocessor directives as keywords
				'directive': {
					pattern: /(\s*#)\b(define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
					lookbehind: true,
					alias: 'keyword'
				}
			}
		}
	});


/***/ }),
/* 107 */
/***/ (function(module, exports) {

	/**
	 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
	 * Modified by Miles Johnson: http://milesj.me
	 *
	 * Supports the following:
	 * 		- Extends clike syntax
	 * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
	 * 		- Smarter constant and function matching
	 *
	 * Adds the following new token classes:
	 * 		constant, delimiter, variable, function, package
	 */
	
	Prism.languages.php = Prism.languages.extend('clike', {
		'keyword': /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
		'constant': /\b[A-Z0-9_]{2,}\b/,
		'comment': {
			pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
			lookbehind: true
		}
	});
	
	// Shell-like comments are matched after strings, because they are less
	// common than strings containing hashes...
	Prism.languages.insertBefore('php', 'class-name', {
		'shell-comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true,
			alias: 'comment'
		}
	});
	
	Prism.languages.insertBefore('php', 'keyword', {
		'delimiter': {
			pattern: /\?>|<\?(?:php|=)?/i,
			alias: 'important'
		},
		'variable': /\$\w+\b/i,
		'package': {
			pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
			lookbehind: true,
			inside: {
				punctuation: /\\/
			}
		}
	});
	
	// Must be defined after the function pattern
	Prism.languages.insertBefore('php', 'operator', {
		'property': {
			pattern: /(->)[\w]+/,
			lookbehind: true
		}
	});
	
	// Add HTML support if the markup language exists
	if (Prism.languages.markup) {
	
		// Tokenize all inline PHP blocks that are wrapped in <?php ?>
		// This allows for easy PHP + markup highlighting
		Prism.hooks.add('before-highlight', function(env) {
			if (env.language !== 'php' || !/(?:<\?php|<\?)/ig.test(env.code)) {
				return;
			}
	
			env.tokenStack = [];
	
			env.backupCode = env.code;
			env.code = env.code.replace(/(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/ig, function(match) {
				var i = env.tokenStack.length;
				// Check for existing strings
				while (env.backupCode.indexOf('___PHP' + i + '___') !== -1)
					++i;
	
				// Create a sparse array
				env.tokenStack[i] = match;
	
				return '___PHP' + i + '___';
			});
	
			// Switch the grammar to markup
			env.grammar = Prism.languages.markup;
		});
	
		// Restore env.code for other plugins (e.g. line-numbers)
		Prism.hooks.add('before-insert', function(env) {
			if (env.language === 'php' && env.backupCode) {
				env.code = env.backupCode;
				delete env.backupCode;
			}
		});
	
		// Re-insert the tokens after highlighting
		Prism.hooks.add('after-highlight', function(env) {
			if (env.language !== 'php' || !env.tokenStack) {
				return;
			}
	
			// Switch the grammar back
			env.grammar = Prism.languages.php;
	
			for (var i = 0, keys = Object.keys(env.tokenStack); i < keys.length; ++i) {
				var k = keys[i];
				var t = env.tokenStack[k];
	
				// The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
				env.highlightedCode = env.highlightedCode.replace('___PHP' + k + '___',
						"<span class=\"token php language-php\">" +
						Prism.highlight(t, env.grammar, 'php').replace(/\$/g, '$$$$') +
						"</span>");
			}
	
			env.element.innerHTML = env.highlightedCode;
		});
	}


/***/ }),
/* 108 */
/***/ (function(module, exports) {

	Prism.languages.python= {
		'triple-quoted-string': {
			pattern: /"""[\s\S]+?"""|'''[\s\S]+?'''/,
			alias: 'string'
		},
		'comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true
		},
		'string': {
			pattern: /("|')(?:\\\\|\\?[^\\\r\n])*?\1/,
			greedy: true
		},
		'function' : {
			pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,
			lookbehind: true
		},
		'class-name': {
			pattern: /(\bclass\s+)[a-z0-9_]+/i,
			lookbehind: true
		},
		'keyword' : /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,
		'boolean' : /\b(?:True|False)\b/,
		'number' : /\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
		'operator' : /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
		'punctuation' : /[{}[\];(),.:]/
	};


/***/ }),
/* 109 */
/***/ (function(module, exports) {

	Prism.languages.json = {
		'property': /"(?:\\.|[^\\"])*"(?=\s*:)/ig,
		'string': /"(?!:)(?:\\.|[^\\"])*"(?!:)/g,
		'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/g,
		'punctuation': /[{}[\]);,]/g,
		'operator': /:/g,
		'boolean': /\b(true|false)\b/gi,
		'null': /\bnull\b/gi
	};
	
	Prism.languages.jsonp = Prism.languages.json;


/***/ }),
/* 110 */
/***/ (function(module, exports) {

	Prism.languages.yaml={scalar:{pattern:/([\-:]\s*(![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\3[^\r\n]+)*)/,lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:/(\s*(?:^|[:\-,[{\r\n?])[ \t]*(![^\s]+)?[ \t]*)[^\r\n{[\]},#\s]+?(?=\s*:\s)/,lookbehind:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)(\d{4}-\d\d?-\d\d?([tT]|[ \t]+)\d\d?:\d{2}:\d{2}(\.\d*)?[ \t]*(Z|[-+]\d\d?(:\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(:\d{2}(\.\d*)?)?)(?=[ \t]*($|,|]|}))/m,lookbehind:!0,alias:"number"},"boolean":{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)(true|false)[ \t]*(?=$|,|]|})/im,lookbehind:!0,alias:"important"},"null":{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)(null|~)[ \t]*(?=$|,|]|})/im,lookbehind:!0,alias:"important"},string:{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')(?=[ \t]*($|,|]|}))/m,lookbehind:!0,greedy:!0},number:{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)[+\-]?(0x[\da-f]+|0o[0-7]+|(\d+\.?\d*|\.?\d+)(e[\+\-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,lookbehind:!0},tag:/![^\s]+/,important:/[&*][\w]+/,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./};

/***/ }),
/* 111 */
/***/ (function(module, exports) {

	Prism.languages.perl = {
		'comment': [
			{
				// POD
				pattern: /(^\s*)=\w+[\s\S]*?=cut.*/m,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\$])#.*/,
				lookbehind: true
			}
		],
		// TODO Could be nice to handle Heredoc too.
		'string': [
			// q/.../
			{
				pattern: /\b(?:q|qq|qx|qw)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/,
				greedy: true
			},
		
			// q a...a
			{
				pattern: /\b(?:q|qq|qx|qw)\s+([a-zA-Z0-9])(?:[^\\]|\\[\s\S])*?\1/,
				greedy: true
			},
		
			// q(...)
			{
				pattern: /\b(?:q|qq|qx|qw)\s*\((?:[^()\\]|\\[\s\S])*\)/,
				greedy: true
			},
		
			// q{...}
			{
				pattern: /\b(?:q|qq|qx|qw)\s*\{(?:[^{}\\]|\\[\s\S])*\}/,
				greedy: true
			},
		
			// q[...]
			{
				pattern: /\b(?:q|qq|qx|qw)\s*\[(?:[^[\]\\]|\\[\s\S])*\]/,
				greedy: true
			},
		
			// q<...>
			{
				pattern: /\b(?:q|qq|qx|qw)\s*<(?:[^<>\\]|\\[\s\S])*>/,
				greedy: true
			},
	
			// "...", `...`
			{
				pattern: /("|`)(?:[^\\]|\\[\s\S])*?\1/,
				greedy: true
			},
	
			// '...'
			// FIXME Multi-line single-quoted strings are not supported as they would break variables containing '
			{
				pattern: /'(?:[^'\\\r\n]|\\.)*'/,
				greedy: true
			}
		],
		'regex': [
			// m/.../
			{
				pattern: /\b(?:m|qr)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[msixpodualngc]*/,
				greedy: true
			},
		
			// m a...a
			{
				pattern: /\b(?:m|qr)\s+([a-zA-Z0-9])(?:[^\\]|\\.)*?\1[msixpodualngc]*/,
				greedy: true
			},
		
			// m(...)
			{
				pattern: /\b(?:m|qr)\s*\((?:[^()\\]|\\[\s\S])*\)[msixpodualngc]*/,
				greedy: true
			},
		
			// m{...}
			{
				pattern: /\b(?:m|qr)\s*\{(?:[^{}\\]|\\[\s\S])*\}[msixpodualngc]*/,
				greedy: true
			},
		
			// m[...]
			{
				pattern: /\b(?:m|qr)\s*\[(?:[^[\]\\]|\\[\s\S])*\][msixpodualngc]*/,
				greedy: true
			},
		
			// m<...>
			{
				pattern: /\b(?:m|qr)\s*<(?:[^<>\\]|\\[\s\S])*>[msixpodualngc]*/,
				greedy: true
			},
	
			// The lookbehinds prevent -s from breaking
			// FIXME We don't handle change of separator like s(...)[...]
			// s/.../.../
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\2(?:[^\\]|\\[\s\S])*?\2[msixpodualngcer]*/,
				lookbehind: true,
				greedy: true
			},
		
			// s a...a...a
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s+([a-zA-Z0-9])(?:[^\\]|\\[\s\S])*?\2(?:[^\\]|\\[\s\S])*?\2[msixpodualngcer]*/,
				lookbehind: true,
				greedy: true
			},
		
			// s(...)(...)
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*\((?:[^()\\]|\\[\s\S])*\)\s*\((?:[^()\\]|\\[\s\S])*\)[msixpodualngcer]*/,
				lookbehind: true,
				greedy: true
			},
		
			// s{...}{...}
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*\{(?:[^{}\\]|\\[\s\S])*\}\s*\{(?:[^{}\\]|\\[\s\S])*\}[msixpodualngcer]*/,
				lookbehind: true,
				greedy: true
			},
		
			// s[...][...]
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*\[(?:[^[\]\\]|\\[\s\S])*\]\s*\[(?:[^[\]\\]|\\[\s\S])*\][msixpodualngcer]*/,
				lookbehind: true,
				greedy: true
			},
		
			// s<...><...>
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*<(?:[^<>\\]|\\[\s\S])*>\s*<(?:[^<>\\]|\\[\s\S])*>[msixpodualngcer]*/,
				lookbehind: true,
				greedy: true
			},
		
			// /.../
			// The look-ahead tries to prevent two divisions on
			// the same line from being highlighted as regex.
			// This does not support multi-line regex.
			{
				pattern: /\/(?:[^\/\\\r\n]|\\.)*\/[msixpodualngc]*(?=\s*(?:$|[\r\n,.;})&|\-+*~<>!?^]|(lt|gt|le|ge|eq|ne|cmp|not|and|or|xor|x)\b))/,
				greedy: true
			}
		],
	
		// FIXME Not sure about the handling of ::, ', and #
		'variable': [
			// ${^POSTMATCH}
			/[&*$@%]\{\^[A-Z]+\}/,
			// $^V
			/[&*$@%]\^[A-Z_]/,
			// ${...}
			/[&*$@%]#?(?=\{)/,
			// $foo
			/[&*$@%]#?((::)*'?(?!\d)[\w$]+)+(::)*/i,
			// $1
			/[&*$@%]\d+/,
			// $_, @_, %!
			// The negative lookahead prevents from breaking the %= operator
			/(?!%=)[$@%][!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/
		],
		'filehandle': {
			// <>, <FOO>, _
			pattern: /<(?![<=])\S*>|\b_\b/,
			alias: 'symbol'
		},
		'vstring': {
			// v1.2, 1.2.3
			pattern: /v\d+(\.\d+)*|\d+(\.\d+){2,}/,
			alias: 'string'
		},
		'function': {
			pattern: /sub [a-z0-9_]+/i,
			inside: {
				keyword: /sub/
			}
		},
		'keyword': /\b(any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
		'number': /\b-?(0x[\dA-Fa-f](_?[\dA-Fa-f])*|0b[01](_?[01])*|(\d(_?\d)*)?\.?\d(_?\d)*([Ee][+-]?\d+)?)\b/,
		'operator': /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(lt|gt|le|ge|eq|ne|cmp|not|and|or|xor)\b/,
		'punctuation': /[{}[\];(),:]/
	};


/***/ }),
/* 112 */
/***/ (function(module, exports) {

	Prism.languages.go = Prism.languages.extend('clike', {
		'keyword': /\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
		'builtin': /\b(bool|byte|complex(64|128)|error|float(32|64)|rune|string|u?int(8|16|32|64|)|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(ln)?|real|recover)\b/,
		'boolean': /\b(_|iota|nil|true|false)\b/,
		'operator': /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
		'number': /\b(-?(0x[a-f\d]+|(\d+\.?\d*|\.\d+)(e[-+]?\d+)?)i?)\b/i,
		'string': {
			pattern: /("|'|`)(\\?.|\r|\n)*?\1/,
			greedy: true
		}
	});
	delete Prism.languages.go['class-name'];


/***/ }),
/* 113 */
/***/ (function(module, exports) {

	(function(Prism) {
		var insideString = {
			variable: [
				// Arithmetic Environment
				{
					pattern: /\$?\(\([\s\S]+?\)\)/,
					inside: {
						// If there is a $ sign at the beginning highlight $(( and )) as variable
						variable: [{
								pattern: /(^\$\(\([\s\S]+)\)\)/,
								lookbehind: true
							},
							/^\$\(\(/,
						],
						number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,
						// Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
						operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
						// If there is no $ sign at the beginning highlight (( and )) as punctuation
						punctuation: /\(\(?|\)\)?|,|;/
					}
				},
				// Command Substitution
				{
					pattern: /\$\([^)]+\)|`[^`]+`/,
					inside: {
						variable: /^\$\(|^`|\)$|`$/
					}
				},
				/\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i
			],
		};
	
		Prism.languages.bash = {
			'shebang': {
				pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
				alias: 'important'
			},
			'comment': {
				pattern: /(^|[^"{\\])#.*/,
				lookbehind: true
			},
			'string': [
				//Support for Here-Documents https://en.wikipedia.org/wiki/Here_document
				{
					pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,
					lookbehind: true,
					greedy: true,
					inside: insideString
				},
				{
					pattern: /(["'])(?:\\\\|\\?[^\\])*?\1/g,
					greedy: true,
					inside: insideString
				}
			],
			'variable': insideString.variable,
			// Originally based on http://ss64.com/bash/
			'function': {
				pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,
				lookbehind: true
			},
			'keyword': {
				pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,
				lookbehind: true
			},
			'boolean': {
				pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,
				lookbehind: true
			},
			'operator': /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
			'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
		};
	
		var inside = insideString.variable[1].inside;
		inside['function'] = Prism.languages.bash['function'];
		inside.keyword = Prism.languages.bash.keyword;
		inside.boolean = Prism.languages.bash.boolean;
		inside.operator = Prism.languages.bash.operator;
		inside.punctuation = Prism.languages.bash.punctuation;
	})(Prism);


/***/ }),
/* 114 */
/***/ (function(module, exports) {

	Prism.languages.fsharp = Prism.languages.extend('clike', {
		'comment': [
			{
				pattern: /(^|[^\\])\(\*[\s\S]*?\*\)/,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true
			}
		],
		'keyword': /\b(?:let|return|use|yield)(?:!\B|\b)|\b(abstract|and|as|assert|base|begin|class|default|delegate|do|done|downcast|downto|elif|else|end|exception|extern|false|finally|for|fun|function|global|if|in|inherit|inline|interface|internal|lazy|match|member|module|mutable|namespace|new|not|null|of|open|or|override|private|public|rec|select|static|struct|then|to|true|try|type|upcast|val|void|when|while|with|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|include|method|mixin|object|parallel|process|protected|pure|sealed|tailcall|trait|virtual|volatile)\b/,
		'string': {
			pattern: /(?:"""[\s\S]*?"""|@"(?:""|[^"])*"|("|')(?:\\\1|\\?(?!\1)[\s\S])*\1)B?/,
			greedy: true
		},
		'number': [
			/\b-?0x[\da-fA-F]+(un|lf|LF)?\b/,
			/\b-?0b[01]+(y|uy)?\b/,
			/\b-?(\d*\.?\d+|\d+\.)([fFmM]|[eE][+-]?\d+)?\b/,
			/\b-?\d+(y|uy|s|us|l|u|ul|L|UL|I)?\b/
		]
	});
	Prism.languages.insertBefore('fsharp', 'keyword', {
		'preprocessor': {
			pattern: /^[^\r\n\S]*#.*/m,
			alias: 'property',
			inside: {
				'directive': {
					pattern: /(\s*#)\b(else|endif|if|light|line|nowarn)\b/,
					lookbehind: true,
					alias: 'keyword'
				}
			}
		}
	});


/***/ }),
/* 115 */
/***/ (function(module, exports) {

	Prism.languages.typescript = Prism.languages.extend('javascript', {
		// From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
		'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|false|true|module|declare|constructor|string|Function|any|number|boolean|Array|enum|symbol|namespace|abstract|require|type)\b/
	});
	
	Prism.languages.ts = Prism.languages.typescript;

/***/ }),
/* 116 */
/***/ (function(module, exports) {

	(function (Prism) {
		var inside = {
			'url': /url\((["']?).*?\1\)/i,
			'string': {
				pattern: /("|')(?:[^\\\r\n]|\\(?:\r\n|[\s\S]))*?\1/,
				greedy: true
			},
			'interpolation': null, // See below
			'func': null, // See below
			'important': /\B!(?:important|optional)\b/i,
			'keyword': {
				pattern: /(^|\s+)(?:(?:if|else|for|return|unless)(?=\s+|$)|@[\w-]+)/,
				lookbehind: true
			},
			'hexcode': /#[\da-f]{3,6}/i,
			'number': /\b\d+(?:\.\d+)?%?/,
			'boolean': /\b(?:true|false)\b/,
			'operator': [
				// We want non-word chars around "-" because it is
				// accepted in property names.
				/~|[+!\/%<>?=]=?|[-:]=|\*[*=]?|\.+|&&|\|\||\B-\B|\b(?:and|in|is(?: a| defined| not|nt)?|not|or)\b/
			],
			'punctuation': /[{}()\[\];:,]/
		};
	
		inside['interpolation'] = {
			pattern: /\{[^\r\n}:]+\}/,
			alias: 'variable',
			inside: Prism.util.clone(inside)
		};
		inside['func'] = {
			pattern: /[\w-]+\([^)]*\).*/,
			inside: {
				'function': /^[^(]+/,
				rest: Prism.util.clone(inside)
			}
		};
	
		Prism.languages.stylus = {
			'comment': {
				pattern: /(^|[^\\])(\/\*[\s\S]*?\*\/|\/\/.*)/,
				lookbehind: true
			},
			'atrule-declaration': {
				pattern: /(^\s*)@.+/m,
				lookbehind: true,
				inside: {
					'atrule': /^@[\w-]+/,
					rest: inside
				}
			},
			'variable-declaration': {
				pattern: /(^[ \t]*)[\w$-]+\s*.?=[ \t]*(?:(?:\{[^}]*\}|.+)|$)/m,
				lookbehind: true,
				inside: {
					'variable': /^\S+/,
					rest: inside
				}
			},
	
			'statement': {
				pattern: /(^[ \t]*)(?:if|else|for|return|unless)[ \t]+.+/m,
				lookbehind: true,
				inside: {
					keyword: /^\S+/,
					rest: inside
				}
			},
	
			// A property/value pair cannot end with a comma or a brace
			// It cannot have indented content unless it ended with a semicolon
			'property-declaration': {
				pattern: /((?:^|\{)([ \t]*))(?:[\w-]|\{[^}\r\n]+\})+(?:\s*:\s*|[ \t]+)[^{\r\n]*(?:;|[^{\r\n,](?=$)(?!(\r?\n|\r)(?:\{|\2[ \t]+)))/m,
				lookbehind: true,
				inside: {
					'property': {
						pattern: /^[^\s:]+/,
						inside: {
							'interpolation': inside.interpolation
						}
					},
					rest: inside
				}
			},
	
	
	
			// A selector can contain parentheses only as part of a pseudo-element
			// It can span multiple lines.
			// It must end with a comma or an accolade or have indented content.
			'selector': {
				pattern: /(^[ \t]*)(?:(?=\S)(?:[^{}\r\n:()]|::?[\w-]+(?:\([^)\r\n]*\))?|\{[^}\r\n]+\})+)(?:(?:\r?\n|\r)(?:\1(?:(?=\S)(?:[^{}\r\n:()]|::?[\w-]+(?:\([^)\r\n]*\))?|\{[^}\r\n]+\})+)))*(?:,$|\{|(?=(?:\r?\n|\r)(?:\{|\1[ \t]+)))/m,
				lookbehind: true,
				inside: {
					'interpolation': inside.interpolation,
					'punctuation': /[{},]/
				}
			},
	
			'func': inside.func,
			'string': inside.string,
			'interpolation': inside.interpolation,
			'punctuation': /[{}()\[\];:.]/
		};
	}(Prism));

/***/ }),
/* 117 */
/***/ (function(module, exports) {

	/* FIXME :
	 :extend() is not handled specifically : its highlighting is buggy.
	 Mixin usage must be inside a ruleset to be highlighted.
	 At-rules (e.g. import) containing interpolations are buggy.
	 Detached rulesets are highlighted as at-rules.
	 A comment before a mixin usage prevents the latter to be properly highlighted.
	 */
	
	Prism.languages.less = Prism.languages.extend('css', {
		'comment': [
			/\/\*[\s\S]*?\*\//,
			{
				pattern: /(^|[^\\])\/\/.*/,
				lookbehind: true
			}
		],
		'atrule': {
			pattern: /@[\w-]+?(?:\([^{}]+\)|[^(){};])*?(?=\s*\{)/i,
			inside: {
				'punctuation': /[:()]/
			}
		},
		// selectors and mixins are considered the same
		'selector': {
			pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\([^{}]*\)|[^{};@])*?(?=\s*\{)/,
			inside: {
				// mixin parameters
				'variable': /@+[\w-]+/
			}
		},
	
		'property': /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/i,
		'punctuation': /[{}();:,]/,
		'operator': /[+\-*\/]/
	});
	
	// Invert function and punctuation positions
	Prism.languages.insertBefore('less', 'punctuation', {
		'function': Prism.languages.less.function
	});
	
	Prism.languages.insertBefore('less', 'property', {
		'variable': [
			// Variable declaration (the colon must be consumed!)
			{
				pattern: /@[\w-]+\s*:/,
				inside: {
					"punctuation": /:/
				}
			},
	
			// Variable usage
			/@@?[\w-]+/
		],
		'mixin-usage': {
			pattern: /([{;]\s*)[.#](?!\d)[\w-]+.*?(?=[(;])/,
			lookbehind: true,
			alias: 'function'
		}
	});


/***/ }),
/* 118 */
/***/ (function(module, exports) {

	(function(Prism) {
		Prism.languages.sass = Prism.languages.extend('css', {
			// Sass comments don't need to be closed, only indented
			'comment': {
				pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
				lookbehind: true
			}
		});
	
		Prism.languages.insertBefore('sass', 'atrule', {
			// We want to consume the whole line
			'atrule-line': {
				// Includes support for = and + shortcuts
				pattern: /^(?:[ \t]*)[@+=].+/m,
				inside: {
					'atrule': /(?:@[\w-]+|[+=])/m
				}
			}
		});
		delete Prism.languages.sass.atrule;
	
	
		var variable = /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i;
		var operator = [
			/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/,
			{
				pattern: /(\s+)-(?=\s)/,
				lookbehind: true
			}
		];
	
		Prism.languages.insertBefore('sass', 'property', {
			// We want to consume the whole line
			'variable-line': {
				pattern: /^[ \t]*\$.+/m,
				inside: {
					'punctuation': /:/,
					'variable': variable,
					'operator': operator
				}
			},
			// We want to consume the whole line
			'property-line': {
				pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
				inside: {
					'property': [
						/[^:\s]+(?=\s*:)/,
						{
							pattern: /(:)[^:\s]+/,
							lookbehind: true
						}
					],
					'punctuation': /:/,
					'variable': variable,
					'operator': operator,
					'important': Prism.languages.sass.important
				}
			}
		});
		delete Prism.languages.sass.property;
		delete Prism.languages.sass.important;
	
		// Now that whole lines for other patterns are consumed,
		// what's left should be selectors
		delete Prism.languages.sass.selector;
		Prism.languages.insertBefore('sass', 'punctuation', {
			'selector': {
				pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
				lookbehind: true
			}
		});
	
	}(Prism));

/***/ }),
/* 119 */
/***/ (function(module, exports) {

	(function(Prism) {
	
		var handlebars_pattern = /\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g;
	
		Prism.languages.handlebars = Prism.languages.extend('markup', {
			'handlebars': {
				pattern: handlebars_pattern,
				inside: {
					'delimiter': {
						pattern: /^\{\{\{?|\}\}\}?$/i,
						alias: 'punctuation'
					},
					'string': /(["'])(\\?.)*?\1/,
					'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/,
					'boolean': /\b(true|false)\b/,
					'block': {
						pattern: /^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,
						lookbehind: true,
						alias: 'keyword'
					},
					'brackets': {
						pattern: /\[[^\]]+\]/,
						inside: {
							punctuation: /\[|\]/,
							variable: /[\s\S]+/
						}
					},
					'punctuation': /[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,
					'variable': /[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~\s]+/
				}
			}
		});
	
		// Comments are inserted at top so that they can
		// surround markup
		Prism.languages.insertBefore('handlebars', 'tag', {
			'handlebars-comment': {
				pattern: /\{\{![\s\S]*?\}\}/,
				alias: ['handlebars','comment']
			}
		});
	
		// Tokenize all inline Handlebars expressions that are wrapped in {{ }} or {{{ }}}
		// This allows for easy Handlebars + markup highlighting
		Prism.hooks.add('before-highlight', function(env) {
			if (env.language !== 'handlebars') {
				return;
			}
	
			env.tokenStack = [];
	
			env.backupCode = env.code;
			env.code = env.code.replace(handlebars_pattern, function(match) {
				var i = env.tokenStack.length;
				// Check for existing strings
				while (env.backupCode.indexOf('___HANDLEBARS' + i + '___') !== -1)
					++i;
	
				// Create a sparse array
				env.tokenStack[i] = match;
	
				return '___HANDLEBARS' + i + '___';
			});
		});
	
		// Restore env.code for other plugins (e.g. line-numbers)
		Prism.hooks.add('before-insert', function(env) {
			if (env.language === 'handlebars') {
				env.code = env.backupCode;
				delete env.backupCode;
			}
		});
	
		// Re-insert the tokens after highlighting
		// and highlight them with defined grammar
		Prism.hooks.add('after-highlight', function(env) {
			if (env.language !== 'handlebars') {
				return;
			}
	
			for (var i = 0, keys = Object.keys(env.tokenStack); i < keys.length; ++i) {
				var k = keys[i];
				var t = env.tokenStack[k];
	
				// The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
				env.highlightedCode = env.highlightedCode.replace('___HANDLEBARS' + k + '___', Prism.highlight(t, env.grammar, 'handlebars').replace(/\$/g, '$$$$'));
			}
	
			env.element.innerHTML = env.highlightedCode;
		});
	
	}(Prism));


/***/ }),
/* 120 */
/***/ (function(module, exports) {

	Prism.languages.applescript = {
		'comment': [
			// Allow one level of nesting
			/\(\*(?:\(\*[\s\S]*?\*\)|[\s\S])*?\*\)/,
			/--.+/,
			/#.+/
		],
		'string': /"(?:\\?.)*?"/,
		'number': /\b-?\d*\.?\d+([Ee]-?\d+)?\b/,
		'operator': [
			/[&=?????????*+\-\/??^]|[<>]=?/,
			/\b(?:(?:start|begin|end)s? with|(?:(?:does not|doesn't) contain|contains?)|(?:is|isn't|is not) (?:in|contained by)|(?:(?:is|isn't|is not) )?(?:greater|less) than(?: or equal)?(?: to)?|(?:(?:does not|doesn't) come|comes) (?:before|after)|(?:is|isn't|is not) equal(?: to)?|(?:(?:does not|doesn't) equal|equals|equal to|isn't|is not)|(?:a )?(?:ref(?: to)?|reference to)|(?:and|or|div|mod|as|not))\b/
		],
		'keyword': /\b(?:about|above|after|against|apart from|around|aside from|at|back|before|beginning|behind|below|beneath|beside|between|but|by|considering|continue|copy|does|eighth|else|end|equal|error|every|exit|false|fifth|first|for|fourth|from|front|get|given|global|if|ignoring|in|instead of|into|is|it|its|last|local|me|middle|my|ninth|of|on|onto|out of|over|prop|property|put|repeat|return|returning|second|set|seventh|since|sixth|some|tell|tenth|that|the|then|third|through|thru|timeout|times|to|transaction|true|try|until|where|while|whose|with|without)\b/,
		'class': {
			pattern: /\b(?:alias|application|boolean|class|constant|date|file|integer|list|number|POSIX file|real|record|reference|RGB color|script|text|centimetres|centimeters|feet|inches|kilometres|kilometers|metres|meters|miles|yards|square feet|square kilometres|square kilometers|square metres|square meters|square miles|square yards|cubic centimetres|cubic centimeters|cubic feet|cubic inches|cubic metres|cubic meters|cubic yards|gallons|litres|liters|quarts|grams|kilograms|ounces|pounds|degrees Celsius|degrees Fahrenheit|degrees Kelvin)\b/,
			alias: 'builtin'
		},
		'punctuation': /[{}():,????????????]/
	};

/***/ }),
/* 121 */
/***/ (function(module, exports) {

	Prism.languages.actionscript = Prism.languages.extend('javascript',  {
		'keyword': /\b(?:as|break|case|catch|class|const|default|delete|do|else|extends|finally|for|function|if|implements|import|in|instanceof|interface|internal|is|native|new|null|package|private|protected|public|return|super|switch|this|throw|try|typeof|use|var|void|while|with|dynamic|each|final|get|include|namespace|native|override|set|static)\b/,
		'operator': /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/
	});
	Prism.languages.actionscript['class-name'].alias = 'function';
	
	if (Prism.languages.markup) {
		Prism.languages.insertBefore('actionscript', 'string', {
			'xml': {
				pattern: /(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\\1|\\?(?!\1)[\s\S])*\2)*\s*\/?>/,
				lookbehind: true,
				inside: {
					rest: Prism.languages.markup
				}
			}
		});
	}

/***/ }),
/* 122 */
/***/ (function(module, exports) {

	Prism.languages.aspnet = Prism.languages.extend('markup', {
		'page-directive tag': {
			pattern: /<%\s*@.*%>/i,
			inside: {
				'page-directive tag': /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
				rest: Prism.languages.markup.tag.inside
			}
		},
		'directive tag': {
			pattern: /<%.*%>/i,
			inside: {
				'directive tag': /<%\s*?[$=%#:]{0,2}|%>/i,
				rest: Prism.languages.csharp
			}
		}
	});
	// Regexp copied from prism-markup, with a negative look-ahead added
	Prism.languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\s\S])*\1|[^\s'">=]+))?)*\s*\/?>/i;
	
	// match directives of attribute value foo="<% Bar %>"
	Prism.languages.insertBefore('inside', 'punctuation', {
		'directive tag': Prism.languages.aspnet['directive tag']
	}, Prism.languages.aspnet.tag.inside["attr-value"]);
	
	Prism.languages.insertBefore('aspnet', 'comment', {
		'asp comment': /<%--[\s\S]*?--%>/
	});
	
	// script runat="server" contains csharp, not javascript
	Prism.languages.insertBefore('aspnet', Prism.languages.javascript ? 'script' : 'tag', {
		'asp script': {
			pattern: /(<script(?=.*runat=['"]?server['"]?)[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.csharp || {}
		}
	});

/***/ }),
/* 123 */
/***/ (function(module, exports) {

	Prism.languages.basic = {
		'string': /"(?:""|[!#$%&'()*,\/:;<=>?^_ +\-.A-Z\d])*"/i,
		'comment': {
			pattern: /(?:!|REM\b).+/i,
			inside: {
				'keyword': /^REM/i
			}
		},
		'number': /(?:\b|\B[.-])(?:\d+\.?\d*)(?:E[+-]?\d+)?/i,
		'keyword': /\b(?:AS|BEEP|BLOAD|BSAVE|CALL(?: ABSOLUTE)?|CASE|CHAIN|CHDIR|CLEAR|CLOSE|CLS|COM|COMMON|CONST|DATA|DECLARE|DEF(?: FN| SEG|DBL|INT|LNG|SNG|STR)|DIM|DO|DOUBLE|ELSE|ELSEIF|END|ENVIRON|ERASE|ERROR|EXIT|FIELD|FILES|FOR|FUNCTION|GET|GOSUB|GOTO|IF|INPUT|INTEGER|IOCTL|KEY|KILL|LINE INPUT|LOCATE|LOCK|LONG|LOOP|LSET|MKDIR|NAME|NEXT|OFF|ON(?: COM| ERROR| KEY| TIMER)?|OPEN|OPTION BASE|OUT|POKE|PUT|READ|REDIM|REM|RESTORE|RESUME|RETURN|RMDIR|RSET|RUN|SHARED|SINGLE|SELECT CASE|SHELL|SLEEP|STATIC|STEP|STOP|STRING|SUB|SWAP|SYSTEM|THEN|TIMER|TO|TROFF|TRON|TYPE|UNLOCK|UNTIL|USING|VIEW PRINT|WAIT|WEND|WHILE|WRITE)(?:\$|\b)/i,
		'function': /\b(?:ABS|ACCESS|ACOS|ANGLE|AREA|ARITHMETIC|ARRAY|ASIN|ASK|AT|ATN|BASE|BEGIN|BREAK|CAUSE|CEIL|CHR|CLIP|COLLATE|COLOR|CON|COS|COSH|COT|CSC|DATE|DATUM|DEBUG|DECIMAL|DEF|DEG|DEGREES|DELETE|DET|DEVICE|DISPLAY|DOT|ELAPSED|EPS|ERASABLE|EXLINE|EXP|EXTERNAL|EXTYPE|FILETYPE|FIXED|FP|GO|GRAPH|HANDLER|IDN|IMAGE|IN|INT|INTERNAL|IP|IS|KEYED|LBOUND|LCASE|LEFT|LEN|LENGTH|LET|LINE|LINES|LOG|LOG10|LOG2|LTRIM|MARGIN|MAT|MAX|MAXNUM|MID|MIN|MISSING|MOD|NATIVE|NUL|NUMERIC|OF|OPTION|ORD|ORGANIZATION|OUTIN|OUTPUT|PI|POINT|POINTER|POINTS|POS|PRINT|PROGRAM|PROMPT|RAD|RADIANS|RANDOMIZE|RECORD|RECSIZE|RECTYPE|RELATIVE|REMAINDER|REPEAT|REST|RETRY|REWRITE|RIGHT|RND|ROUND|RTRIM|SAME|SEC|SELECT|SEQUENTIAL|SET|SETTER|SGN|SIN|SINH|SIZE|SKIP|SQR|STANDARD|STATUS|STR|STREAM|STYLE|TAB|TAN|TANH|TEMPLATE|TEXT|THERE|TIME|TIMEOUT|TRACE|TRANSFORM|TRUNCATE|UBOUND|UCASE|USE|VAL|VARIABLE|VIEWPORT|WHEN|WINDOW|WITH|ZER|ZONEWIDTH)(?:\$|\b)/i,
		'operator': /<[=>]?|>=?|[+\-*\/^=&]|\b(?:AND|EQV|IMP|NOT|OR|XOR)\b/i,
		'punctuation': /[,;:()]/
	};

/***/ }),
/* 124 */
/***/ (function(module, exports) {

	Prism.languages.c = Prism.languages.extend('clike', {
		'keyword': /\b(_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
		'operator': /\-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|?\||[~^%?*\/]/,
		'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)[ful]*\b/i
	});
	
	Prism.languages.insertBefore('c', 'string', {
		'macro': {
			// allow for multiline macro definitions
			// spaces after the # character compile fine with gcc
			pattern: /(^\s*)#\s*[a-z]+([^\r\n\\]|\\.|\\(?:\r\n?|\n))*/im,
			lookbehind: true,
			alias: 'property',
			inside: {
				// highlight the path of the include statement as a string
				'string': {
					pattern: /(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/,
					lookbehind: true
				},
				// highlight macro directives as keywords
				'directive': {
					pattern: /(#\s*)\b(define|defined|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
					lookbehind: true,
					alias: 'keyword'
				}
			}
		},
		// highlight predefined macros as constants
		'constant': /\b(__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/
	});
	
	delete Prism.languages.c['class-name'];
	delete Prism.languages.c['boolean'];


/***/ }),
/* 125 */
/***/ (function(module, exports) {

	// Based on Free Pascal
	
	/* TODO
		Support inline asm ?
	*/
	
	Prism.languages.pascal = {
		'comment': [
			/\(\*[\s\S]+?\*\)/,
			/\{[\s\S]+?\}/,
			/\/\/.*/
		],
		'string': {
			pattern: /(?:'(?:''|[^'\r\n])*'|#[&$%]?[a-f\d]+)+|\^[a-z]/i,
			greedy: true
		},
		'keyword': [
			{
				// Turbo Pascal
				pattern: /(^|[^&])\b(?:absolute|array|asm|begin|case|const|constructor|destructor|do|downto|else|end|file|for|function|goto|if|implementation|inherited|inline|interface|label|nil|object|of|operator|packed|procedure|program|record|reintroduce|repeat|self|set|string|then|to|type|unit|until|uses|var|while|with)\b/i,
				lookbehind: true
			},
			{
				// Free Pascal
				pattern: /(^|[^&])\b(?:dispose|exit|false|new|true)\b/i,
				lookbehind: true
			},
			{
				// Object Pascal
				pattern: /(^|[^&])\b(?:class|dispinterface|except|exports|finalization|finally|initialization|inline|library|on|out|packed|property|raise|resourcestring|threadvar|try)\b/i,
				lookbehind: true
			},
			{
				// Modifiers
				pattern: /(^|[^&])\b(?:absolute|abstract|alias|assembler|bitpacked|break|cdecl|continue|cppdecl|cvar|default|deprecated|dynamic|enumerator|experimental|export|external|far|far16|forward|generic|helper|implements|index|interrupt|iochecks|local|message|name|near|nodefault|noreturn|nostackframe|oldfpccall|otherwise|overload|override|pascal|platform|private|protected|public|published|read|register|reintroduce|result|safecall|saveregisters|softfloat|specialize|static|stdcall|stored|strict|unaligned|unimplemented|varargs|virtual|write)\b/i,
				lookbehind: true
			}
		],
		'number': [
			// Hexadecimal, octal and binary
			/[+-]?(?:[&%]\d+|\$[a-f\d]+)/i,
			// Decimal
			/([+-]|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?/i
		],
		'operator': [
			/\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=]/i,
			{
				pattern: /(^|[^&])\b(?:and|as|div|exclude|in|include|is|mod|not|or|shl|shr|xor)\b/,
				lookbehind: true
			}
		],
		'punctuation': /\(\.|\.\)|[()\[\]:;,.]/
	};

/***/ }),
/* 126 */
/***/ (function(module, exports) {

	Prism.languages.vim = {
		'string': /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\r\n]|'')*'/,
		'comment': /".*/,
		'function': /\w+(?=\()/,
		'keyword': /\b(?:ab|abbreviate|abc|abclear|abo|aboveleft|al|all|arga|argadd|argd|argdelete|argdo|arge|argedit|argg|argglobal|argl|arglocal|ar|args|argu|argument|as|ascii|bad|badd|ba|ball|bd|bdelete|be|bel|belowright|bf|bfirst|bl|blast|bm|bmodified|bn|bnext|bN|bNext|bo|botright|bp|bprevious|brea|break|breaka|breakadd|breakd|breakdel|breakl|breaklist|br|brewind|bro|browse|bufdo|b|buffer|buffers|bun|bunload|bw|bwipeout|ca|cabbrev|cabc|cabclear|caddb|caddbuffer|cad|caddexpr|caddf|caddfile|cal|call|cat|catch|cb|cbuffer|cc|ccl|cclose|cd|ce|center|cex|cexpr|cf|cfile|cfir|cfirst|cgetb|cgetbuffer|cgete|cgetexpr|cg|cgetfile|c|change|changes|chd|chdir|che|checkpath|checkt|checktime|cla|clast|cl|clist|clo|close|cmapc|cmapclear|cnew|cnewer|cn|cnext|cN|cNext|cnf|cnfile|cNfcNfile|cnorea|cnoreabbrev|col|colder|colo|colorscheme|comc|comclear|comp|compiler|conf|confirm|con|continue|cope|copen|co|copy|cpf|cpfile|cp|cprevious|cq|cquit|cr|crewind|cuna|cunabbrev|cu|cunmap|cw|cwindow|debugg|debuggreedy|delc|delcommand|d|delete|delf|delfunction|delm|delmarks|diffg|diffget|diffoff|diffpatch|diffpu|diffput|diffsplit|diffthis|diffu|diffupdate|dig|digraphs|di|display|dj|djump|dl|dlist|dr|drop|ds|dsearch|dsp|dsplit|earlier|echoe|echoerr|echom|echomsg|echon|e|edit|el|else|elsei|elseif|em|emenu|endfo|endfor|endf|endfunction|endfun|en|endif|endt|endtry|endw|endwhile|ene|enew|ex|exi|exit|exu|exusage|f|file|files|filetype|fina|finally|fin|find|fini|finish|fir|first|fix|fixdel|fo|fold|foldc|foldclose|folddoc|folddoclosed|foldd|folddoopen|foldo|foldopen|for|fu|fun|function|go|goto|gr|grep|grepa|grepadd|ha|hardcopy|h|help|helpf|helpfind|helpg|helpgrep|helpt|helptags|hid|hide|his|history|ia|iabbrev|iabc|iabclear|if|ij|ijump|il|ilist|imapc|imapclear|in|inorea|inoreabbrev|isearch|isp|isplit|iuna|iunabbrev|iu|iunmap|j|join|ju|jumps|k|keepalt|keepj|keepjumps|kee|keepmarks|laddb|laddbuffer|lad|laddexpr|laddf|laddfile|lan|language|la|last|later|lb|lbuffer|lc|lcd|lch|lchdir|lcl|lclose|let|left|lefta|leftabove|lex|lexpr|lf|lfile|lfir|lfirst|lgetb|lgetbuffer|lgete|lgetexpr|lg|lgetfile|lgr|lgrep|lgrepa|lgrepadd|lh|lhelpgrep|l|list|ll|lla|llast|lli|llist|lmak|lmake|lm|lmap|lmapc|lmapclear|lnew|lnewer|lne|lnext|lN|lNext|lnf|lnfile|lNf|lNfile|ln|lnoremap|lo|loadview|loc|lockmarks|lockv|lockvar|lol|lolder|lop|lopen|lpf|lpfile|lp|lprevious|lr|lrewind|ls|lt|ltag|lu|lunmap|lv|lvimgrep|lvimgrepa|lvimgrepadd|lw|lwindow|mak|make|ma|mark|marks|mat|match|menut|menutranslate|mk|mkexrc|mks|mksession|mksp|mkspell|mkvie|mkview|mkv|mkvimrc|mod|mode|m|move|mzf|mzfile|mz|mzscheme|nbkey|new|n|next|N|Next|nmapc|nmapclear|noh|nohlsearch|norea|noreabbrev|nu|number|nun|nunmap|omapc|omapclear|on|only|o|open|opt|options|ou|ounmap|pc|pclose|ped|pedit|pe|perl|perld|perldo|po|pop|popu|popu|popup|pp|ppop|pre|preserve|prev|previous|p|print|P|Print|profd|profdel|prof|profile|promptf|promptfind|promptr|promptrepl|ps|psearch|pta|ptag|ptf|ptfirst|ptj|ptjump|ptl|ptlast|ptn|ptnext|ptN|ptNext|ptp|ptprevious|ptr|ptrewind|pts|ptselect|pu|put|pw|pwd|pyf|pyfile|py|python|qa|qall|q|quit|quita|quitall|r|read|rec|recover|redi|redir|red|redo|redr|redraw|redraws|redrawstatus|reg|registers|res|resize|ret|retab|retu|return|rew|rewind|ri|right|rightb|rightbelow|rub|ruby|rubyd|rubydo|rubyf|rubyfile|ru|runtime|rv|rviminfo|sal|sall|san|sandbox|sa|sargument|sav|saveas|sba|sball|sbf|sbfirst|sbl|sblast|sbm|sbmodified|sbn|sbnext|sbN|sbNext|sbp|sbprevious|sbr|sbrewind|sb|sbuffer|scripte|scriptencoding|scrip|scriptnames|se|set|setf|setfiletype|setg|setglobal|setl|setlocal|sf|sfind|sfir|sfirst|sh|shell|sign|sil|silent|sim|simalt|sla|slast|sl|sleep|sm|smagic|sm|smap|smapc|smapclear|sme|smenu|sn|snext|sN|sNext|sni|sniff|sno|snomagic|snor|snoremap|snoreme|snoremenu|sor|sort|so|source|spelld|spelldump|spe|spellgood|spelli|spellinfo|spellr|spellrepall|spellu|spellundo|spellw|spellwrong|sp|split|spr|sprevious|sre|srewind|sta|stag|startg|startgreplace|star|startinsert|startr|startreplace|stj|stjump|st|stop|stopi|stopinsert|sts|stselect|sun|sunhide|sunm|sunmap|sus|suspend|sv|sview|syncbind|t|tab|tabc|tabclose|tabd|tabdo|tabe|tabedit|tabf|tabfind|tabfir|tabfirst|tabl|tablast|tabm|tabmove|tabnew|tabn|tabnext|tabN|tabNext|tabo|tabonly|tabp|tabprevious|tabr|tabrewind|tabs|ta|tag|tags|tc|tcl|tcld|tcldo|tclf|tclfile|te|tearoff|tf|tfirst|th|throw|tj|tjump|tl|tlast|tm|tm|tmenu|tn|tnext|tN|tNext|to|topleft|tp|tprevious|tr|trewind|try|ts|tselect|tu|tu|tunmenu|una|unabbreviate|u|undo|undoj|undojoin|undol|undolist|unh|unhide|unlet|unlo|unlockvar|unm|unmap|up|update|verb|verbose|ve|version|vert|vertical|vie|view|vim|vimgrep|vimgrepa|vimgrepadd|vi|visual|viu|viusage|vmapc|vmapclear|vne|vnew|vs|vsplit|vu|vunmap|wa|wall|wh|while|winc|wincmd|windo|winp|winpos|win|winsize|wn|wnext|wN|wNext|wp|wprevious|wq|wqa|wqall|w|write|ws|wsverb|wv|wviminfo|X|xa|xall|x|xit|xm|xmap|xmapc|xmapclear|xme|xmenu|XMLent|XMLns|xn|xnoremap|xnoreme|xnoremenu|xu|xunmap|y|yank)\b/,
		'builtin': /\b(?:autocmd|acd|ai|akm|aleph|allowrevins|altkeymap|ambiwidth|ambw|anti|antialias|arab|arabic|arabicshape|ari|arshape|autochdir|autoindent|autoread|autowrite|autowriteall|aw|awa|background|backspace|backup|backupcopy|backupdir|backupext|backupskip|balloondelay|ballooneval|balloonexpr|bdir|bdlay|beval|bex|bexpr|bg|bh|bin|binary|biosk|bioskey|bk|bkc|bomb|breakat|brk|browsedir|bs|bsdir|bsk|bt|bufhidden|buflisted|buftype|casemap|ccv|cdpath|cedit|cfu|ch|charconvert|ci|cin|cindent|cink|cinkeys|cino|cinoptions|cinw|cinwords|clipboard|cmdheight|cmdwinheight|cmp|cms|columns|com|comments|commentstring|compatible|complete|completefunc|completeopt|consk|conskey|copyindent|cot|cpo|cpoptions|cpt|cscopepathcomp|cscopeprg|cscopequickfix|cscopetag|cscopetagorder|cscopeverbose|cspc|csprg|csqf|cst|csto|csverb|cuc|cul|cursorcolumn|cursorline|cwh|debug|deco|def|define|delcombine|dex|dg|dict|dictionary|diff|diffexpr|diffopt|digraph|dip|dir|directory|dy|ea|ead|eadirection|eb|ed|edcompatible|ef|efm|ei|ek|enc|encoding|endofline|eol|ep|equalalways|equalprg|errorbells|errorfile|errorformat|esckeys|et|eventignore|expandtab|exrc|fcl|fcs|fdc|fde|fdi|fdl|fdls|fdm|fdn|fdo|fdt|fen|fenc|fencs|fex|ff|ffs|fileencoding|fileencodings|fileformat|fileformats|fillchars|fk|fkmap|flp|fml|fmr|foldcolumn|foldenable|foldexpr|foldignore|foldlevel|foldlevelstart|foldmarker|foldmethod|foldminlines|foldnestmax|foldtext|formatexpr|formatlistpat|formatoptions|formatprg|fp|fs|fsync|ft|gcr|gd|gdefault|gfm|gfn|gfs|gfw|ghr|gp|grepformat|grepprg|gtl|gtt|guicursor|guifont|guifontset|guifontwide|guiheadroom|guioptions|guipty|guitablabel|guitabtooltip|helpfile|helpheight|helplang|hf|hh|hi|hidden|highlight|hk|hkmap|hkmapp|hkp|hl|hlg|hls|hlsearch|ic|icon|iconstring|ignorecase|im|imactivatekey|imak|imc|imcmdline|imd|imdisable|imi|iminsert|ims|imsearch|inc|include|includeexpr|incsearch|inde|indentexpr|indentkeys|indk|inex|inf|infercase|insertmode|isf|isfname|isi|isident|isk|iskeyword|isprint|joinspaces|js|key|keymap|keymodel|keywordprg|km|kmp|kp|langmap|langmenu|laststatus|lazyredraw|lbr|lcs|linebreak|lines|linespace|lisp|lispwords|listchars|loadplugins|lpl|lsp|lz|macatsui|magic|makeef|makeprg|matchpairs|matchtime|maxcombine|maxfuncdepth|maxmapdepth|maxmem|maxmempattern|maxmemtot|mco|mef|menuitems|mfd|mh|mis|mkspellmem|ml|mls|mm|mmd|mmp|mmt|modeline|modelines|modifiable|modified|more|mouse|mousef|mousefocus|mousehide|mousem|mousemodel|mouses|mouseshape|mouset|mousetime|mp|mps|msm|mzq|mzquantum|nf|nrformats|numberwidth|nuw|odev|oft|ofu|omnifunc|opendevice|operatorfunc|opfunc|osfiletype|pa|para|paragraphs|paste|pastetoggle|patchexpr|patchmode|path|pdev|penc|pex|pexpr|pfn|ph|pheader|pi|pm|pmbcs|pmbfn|popt|preserveindent|previewheight|previewwindow|printdevice|printencoding|printexpr|printfont|printheader|printmbcharset|printmbfont|printoptions|prompt|pt|pumheight|pvh|pvw|qe|quoteescape|readonly|remap|report|restorescreen|revins|rightleft|rightleftcmd|rl|rlc|ro|rs|rtp|ruf|ruler|rulerformat|runtimepath|sbo|sc|scb|scr|scroll|scrollbind|scrolljump|scrolloff|scrollopt|scs|sect|sections|secure|sel|selection|selectmode|sessionoptions|sft|shcf|shellcmdflag|shellpipe|shellquote|shellredir|shellslash|shelltemp|shelltype|shellxquote|shiftround|shiftwidth|shm|shortmess|shortname|showbreak|showcmd|showfulltag|showmatch|showmode|showtabline|shq|si|sidescroll|sidescrolloff|siso|sj|slm|smartcase|smartindent|smarttab|smc|smd|softtabstop|sol|spc|spell|spellcapcheck|spellfile|spelllang|spellsuggest|spf|spl|splitbelow|splitright|sps|sr|srr|ss|ssl|ssop|stal|startofline|statusline|stl|stmp|su|sua|suffixes|suffixesadd|sw|swapfile|swapsync|swb|swf|switchbuf|sws|sxq|syn|synmaxcol|syntax|tabline|tabpagemax|tabstop|tagbsearch|taglength|tagrelative|tagstack|tal|tb|tbi|tbidi|tbis|tbs|tenc|term|termbidi|termencoding|terse|textauto|textmode|textwidth|tgst|thesaurus|tildeop|timeout|timeoutlen|title|titlelen|titleold|titlestring|toolbar|toolbariconsize|top|tpm|tsl|tsr|ttimeout|ttimeoutlen|ttm|tty|ttybuiltin|ttyfast|ttym|ttymouse|ttyscroll|ttytype|tw|tx|uc|ul|undolevels|updatecount|updatetime|ut|vb|vbs|vdir|verbosefile|vfile|viewdir|viewoptions|viminfo|virtualedit|visualbell|vop|wak|warn|wb|wc|wcm|wd|weirdinvert|wfh|wfw|whichwrap|wi|wig|wildchar|wildcharm|wildignore|wildmenu|wildmode|wildoptions|wim|winaltkeys|window|winfixheight|winfixwidth|winheight|winminheight|winminwidth|winwidth|wiv|wiw|wm|wmh|wmnu|wmw|wop|wrap|wrapmargin|wrapscan|writeany|writebackup|writedelay|ww|noacd|noai|noakm|noallowrevins|noaltkeymap|noanti|noantialias|noar|noarab|noarabic|noarabicshape|noari|noarshape|noautochdir|noautoindent|noautoread|noautowrite|noautowriteall|noaw|noawa|nobackup|noballooneval|nobeval|nobin|nobinary|nobiosk|nobioskey|nobk|nobl|nobomb|nobuflisted|nocf|noci|nocin|nocindent|nocompatible|noconfirm|noconsk|noconskey|nocopyindent|nocp|nocscopetag|nocscopeverbose|nocst|nocsverb|nocuc|nocul|nocursorcolumn|nocursorline|nodeco|nodelcombine|nodg|nodiff|nodigraph|nodisable|noea|noeb|noed|noedcompatible|noek|noendofline|noeol|noequalalways|noerrorbells|noesckeys|noet|noex|noexpandtab|noexrc|nofen|nofk|nofkmap|nofoldenable|nogd|nogdefault|noguipty|nohid|nohidden|nohk|nohkmap|nohkmapp|nohkp|nohls|noic|noicon|noignorecase|noim|noimc|noimcmdline|noimd|noincsearch|noinf|noinfercase|noinsertmode|nois|nojoinspaces|nojs|nolazyredraw|nolbr|nolinebreak|nolisp|nolist|noloadplugins|nolpl|nolz|noma|nomacatsui|nomagic|nomh|noml|nomod|nomodeline|nomodifiable|nomodified|nomore|nomousef|nomousefocus|nomousehide|nonu|nonumber|noodev|noopendevice|nopaste|nopi|nopreserveindent|nopreviewwindow|noprompt|nopvw|noreadonly|noremap|norestorescreen|norevins|nori|norightleft|norightleftcmd|norl|norlc|noro|nors|noru|noruler|nosb|nosc|noscb|noscrollbind|noscs|nosecure|nosft|noshellslash|noshelltemp|noshiftround|noshortname|noshowcmd|noshowfulltag|noshowmatch|noshowmode|nosi|nosm|nosmartcase|nosmartindent|nosmarttab|nosmd|nosn|nosol|nospell|nosplitbelow|nosplitright|nospr|nosr|nossl|nosta|nostartofline|nostmp|noswapfile|noswf|nota|notagbsearch|notagrelative|notagstack|notbi|notbidi|notbs|notermbidi|noterse|notextauto|notextmode|notf|notgst|notildeop|notimeout|notitle|noto|notop|notr|nottimeout|nottybuiltin|nottyfast|notx|novb|novisualbell|nowa|nowarn|nowb|noweirdinvert|nowfh|nowfw|nowildmenu|nowinfixheight|nowinfixwidth|nowiv|nowmnu|nowrap|nowrapscan|nowrite|nowriteany|nowritebackup|nows|invacd|invai|invakm|invallowrevins|invaltkeymap|invanti|invantialias|invar|invarab|invarabic|invarabicshape|invari|invarshape|invautochdir|invautoindent|invautoread|invautowrite|invautowriteall|invaw|invawa|invbackup|invballooneval|invbeval|invbin|invbinary|invbiosk|invbioskey|invbk|invbl|invbomb|invbuflisted|invcf|invci|invcin|invcindent|invcompatible|invconfirm|invconsk|invconskey|invcopyindent|invcp|invcscopetag|invcscopeverbose|invcst|invcsverb|invcuc|invcul|invcursorcolumn|invcursorline|invdeco|invdelcombine|invdg|invdiff|invdigraph|invdisable|invea|inveb|inved|invedcompatible|invek|invendofline|inveol|invequalalways|inverrorbells|invesckeys|invet|invex|invexpandtab|invexrc|invfen|invfk|invfkmap|invfoldenable|invgd|invgdefault|invguipty|invhid|invhidden|invhk|invhkmap|invhkmapp|invhkp|invhls|invhlsearch|invic|invicon|invignorecase|invim|invimc|invimcmdline|invimd|invincsearch|invinf|invinfercase|invinsertmode|invis|invjoinspaces|invjs|invlazyredraw|invlbr|invlinebreak|invlisp|invlist|invloadplugins|invlpl|invlz|invma|invmacatsui|invmagic|invmh|invml|invmod|invmodeline|invmodifiable|invmodified|invmore|invmousef|invmousefocus|invmousehide|invnu|invnumber|invodev|invopendevice|invpaste|invpi|invpreserveindent|invpreviewwindow|invprompt|invpvw|invreadonly|invremap|invrestorescreen|invrevins|invri|invrightleft|invrightleftcmd|invrl|invrlc|invro|invrs|invru|invruler|invsb|invsc|invscb|invscrollbind|invscs|invsecure|invsft|invshellslash|invshelltemp|invshiftround|invshortname|invshowcmd|invshowfulltag|invshowmatch|invshowmode|invsi|invsm|invsmartcase|invsmartindent|invsmarttab|invsmd|invsn|invsol|invspell|invsplitbelow|invsplitright|invspr|invsr|invssl|invsta|invstartofline|invstmp|invswapfile|invswf|invta|invtagbsearch|invtagrelative|invtagstack|invtbi|invtbidi|invtbs|invtermbidi|invterse|invtextauto|invtextmode|invtf|invtgst|invtildeop|invtimeout|invtitle|invto|invtop|invtr|invttimeout|invttybuiltin|invttyfast|invtx|invvb|invvisualbell|invwa|invwarn|invwb|invweirdinvert|invwfh|invwfw|invwildmenu|invwinfixheight|invwinfixwidth|invwiv|invwmnu|invwrap|invwrapscan|invwrite|invwriteany|invwritebackup|invws|t_AB|t_AF|t_al|t_AL|t_bc|t_cd|t_ce|t_Ce|t_cl|t_cm|t_Co|t_cs|t_Cs|t_CS|t_CV|t_da|t_db|t_dl|t_DL|t_EI|t_F1|t_F2|t_F3|t_F4|t_F5|t_F6|t_F7|t_F8|t_F9|t_fs|t_IE|t_IS|t_k1|t_K1|t_k2|t_k3|t_K3|t_k4|t_K4|t_k5|t_K5|t_k6|t_K6|t_k7|t_K7|t_k8|t_K8|t_k9|t_K9|t_KA|t_kb|t_kB|t_KB|t_KC|t_kd|t_kD|t_KD|t_ke|t_KE|t_KF|t_KG|t_kh|t_KH|t_kI|t_KI|t_KJ|t_KK|t_kl|t_KL|t_kN|t_kP|t_kr|t_ks|t_ku|t_le|t_mb|t_md|t_me|t_mr|t_ms|t_nd|t_op|t_RI|t_RV|t_Sb|t_se|t_Sf|t_SI|t_so|t_sr|t_te|t_ti|t_ts|t_ue|t_us|t_ut|t_vb|t_ve|t_vi|t_vs|t_WP|t_WS|t_xs|t_ZH|t_ZR)\b/,
		'number': /\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b/i,
		'operator': /\|\||&&|[-+.]=?|[=!](?:[=~][#?]?)?|[<>]=?[#?]?|[*\/%?]|\b(?:is(?:not)?)\b/,
		'punctuation': /[{}[\](),;:]/
	};

/***/ }),
/* 127 */
/***/ (function(module, exports) {

	// issues: nested multiline comments
	Prism.languages.swift = Prism.languages.extend('clike', {
		'string': {
			pattern: /("|')(\\(?:\((?:[^()]|\([^)]+\))+\)|\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true,
			inside: {
				'interpolation': {
					pattern: /\\\((?:[^()]|\([^)]+\))+\)/,
					inside: {
						delimiter: {
							pattern: /^\\\(|\)$/,
							alias: 'variable'
						}
						// See rest below
					}
				}
			}
		},
		'keyword': /\b(as|associativity|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic(?:Type)?|else|enum|extension|fallthrough|final|for|func|get|guard|if|import|in|infix|init|inout|internal|is|lazy|left|let|mutating|new|none|nonmutating|operator|optional|override|postfix|precedence|prefix|private|Protocol|public|repeat|required|rethrows|return|right|safe|self|Self|set|static|struct|subscript|super|switch|throws?|try|Type|typealias|unowned|unsafe|var|weak|where|while|willSet|__(?:COLUMN__|FILE__|FUNCTION__|LINE__))\b/,
		'number': /\b([\d_]+(\.[\de_]+)?|0x[a-f0-9_]+(\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
		'constant': /\b(nil|[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
		'atrule': /@\b(IB(?:Outlet|Designable|Action|Inspectable)|class_protocol|exported|noreturn|NS(?:Copying|Managed)|objc|UIApplicationMain|auto_closure)\b/,
		'builtin': /\b([A-Z]\S+|abs|advance|alignof(?:Value)?|assert|contains|count(?:Elements)?|debugPrint(?:ln)?|distance|drop(?:First|Last)|dump|enumerate|equal|filter|find|first|getVaList|indices|isEmpty|join|last|lexicographicalCompare|map|max(?:Element)?|min(?:Element)?|numericCast|overlaps|partition|print(?:ln)?|reduce|reflect|reverse|sizeof(?:Value)?|sort(?:ed)?|split|startsWith|stride(?:of(?:Value)?)?|suffix|swap|toDebugString|toString|transcode|underestimateCount|unsafeBitCast|with(?:ExtendedLifetime|Unsafe(?:MutablePointers?|Pointers?)|VaList))\b/
	});
	Prism.languages.swift['string'].inside['interpolation'].inside.rest = Prism.util.clone(Prism.languages.swift);

/***/ }),
/* 128 */
/***/ (function(module, exports) {

	Prism.languages.objectivec = Prism.languages.extend('c', {
		'keyword': /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|in|self|super)\b|(@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
		'string': /("|')(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|@"(\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
		'operator': /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/
	});


/***/ }),
/* 129 */
/***/ (function(module, exports) {

	Prism.languages.sql= {
		'comment': {
			pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
			lookbehind: true
		},
		'string' : {
			pattern: /(^|[^@\\])("|')(?:\\?[\s\S])*?\2/,
			greedy: true,
			lookbehind: true
		},
		'variable': /@[\w.$]+|@("|'|`)(?:\\?[\s\S])+?\1/,
		'function': /\b(?:COUNT|SUM|AVG|MIN|MAX|FIRST|LAST|UCASE|LCASE|MID|LEN|ROUND|NOW|FORMAT)(?=\s*\()/i, // Should we highlight user defined functions too?
		'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR VARYING|CHARACTER (?:SET|VARYING)|CHARSET|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|DATA(?:BASES?)?|DATE(?:TIME)?|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITER(?:S)?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE(?: PRECISION)?|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE(?:D BY)?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEYS?|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL(?: CHAR VARYING| CHARACTER(?: VARYING)?| VARCHAR)?|NATURAL|NCHAR(?: VARCHAR)?|NEXT|NO(?: SQL|CHECK|CYCLE)?|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READ(?:S SQL DATA|TEXT)?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START(?:ING BY)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED BY|TEXT(?:SIZE)?|THEN|TIMESTAMP|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNPIVOT|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?)\b/i,
		'boolean': /\b(?:TRUE|FALSE|NULL)\b/i,
		'number': /\b-?(?:0x)?\d*\.?[\da-f]+\b/,
		'operator': /[-+*\/=%^~]|&&?|\|?\||!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
		'punctuation': /[;[\]()`,.]/
	};

/***/ }),
/* 130 */
/***/ (function(module, exports) {

	Prism.languages.scheme = {
		'comment' : /;.*/,
		'string' :  {
			pattern: /"(?:[^"\\\r\n]|\\.)*?"|'[^('\s]*/,
			greedy: true
		},
		'keyword' : {
			pattern : /(\()(?:define(?:-syntax|-library|-values)?|(?:case-)?lambda|let(?:\*|rec)?(?:-values)?|else|if|cond|begin|delay(?:-force)?|parameterize|guard|set!|(?:quasi-)?quote|syntax-rules)/,
			lookbehind : true
		},
		'builtin' : {
			pattern :  /(\()(?:(?:cons|car|cdr|list|call-with-current-continuation|call\/cc|append|abs|apply|eval)\b|null\?|pair\?|boolean\?|eof-object\?|char\?|procedure\?|number\?|port\?|string\?|vector\?|symbol\?|bytevector\?)/,
			lookbehind : true
		},
		'number' : {
			pattern: /(\s|\))[-+]?\d*\.?\d+(?:\s*[-+]\s*\d*\.?\d+i)?\b/,
			lookbehind: true
		},
		'boolean' : /#[tf]/,
		'operator': {
			pattern: /(\()(?:[-+*%\/]|[<>]=?|=>?)/,
			lookbehind: true
		},
		'function' : {
			pattern : /(\()[^\s()]*(?=\s)/,
			lookbehind : true
		},
		'punctuation' : /[()]/
	};

/***/ }),
/* 131 */
/***/ (function(module, exports) {

	/**
	 * Original by Samuel Flores
	 *
	 * Adds the following new token classes:
	 * 		constant, builtin, variable, symbol, regex
	 */
	(function(Prism) {
		Prism.languages.ruby = Prism.languages.extend('clike', {
			'comment': [
				/#(?!\{[^\r\n]*?\}).*/,
				/^=begin(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?=end/m
			],
			'keyword': /\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/
		});
	
		var interpolation = {
			pattern: /#\{[^}]+\}/,
			inside: {
				'delimiter': {
					pattern: /^#\{|\}$/,
					alias: 'tag'
				},
				rest: Prism.util.clone(Prism.languages.ruby)
			}
		};
	
		Prism.languages.insertBefore('ruby', 'keyword', {
			'regex': [
				{
					pattern: /%r([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[gim]{0,3}/,
					greedy: true,
					inside: {
						'interpolation': interpolation
					}
				},
				{
					pattern: /%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/,
					greedy: true,
					inside: {
						'interpolation': interpolation
					}
				},
				{
					// Here we need to specifically allow interpolation
					pattern: /%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/,
					greedy: true,
					inside: {
						'interpolation': interpolation
					}
				},
				{
					pattern: /%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/,
					greedy: true,
					inside: {
						'interpolation': interpolation
					}
				},
				{
					pattern: /%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/,
					greedy: true,
					inside: {
						'interpolation': interpolation
					}
				},
				{
					pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,
					lookbehind: true,
					greedy: true
				}
			],
			'variable': /[@$]+[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/,
			'symbol': /:[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/
		});
	
		Prism.languages.insertBefore('ruby', 'number', {
			'builtin': /\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
			'constant': /\b[A-Z][a-zA-Z_0-9]*(?:[?!]|\b)/
		});
	
		Prism.languages.ruby.string = [
			{
				pattern: /%[qQiIwWxs]?([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/,
				greedy: true,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				pattern: /%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/,
				greedy: true,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				// Here we need to specifically allow interpolation
				pattern: /%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/,
				greedy: true,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				pattern: /%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/,
				greedy: true,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				pattern: /%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/,
				greedy: true,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				pattern: /("|')(#\{[^}]+\}|\\(?:\r?\n|\r)|\\?.)*?\1/,
				greedy: true,
				inside: {
					'interpolation': interpolation
				}
			}
		];
	}(Prism));

/***/ }),
/* 132 */
/***/ (function(module, exports) {

	/* TODO
		Add support for variables inside double quoted strings
		Add support for {php}
	*/
	
	(function(Prism) {
	
		var smarty_pattern = /\{\*[\s\S]+?\*\}|\{[\s\S]+?\}/g;
		var smarty_litteral_start = '{literal}';
		var smarty_litteral_end = '{/literal}';
		var smarty_litteral_mode = false;
	
		Prism.languages.smarty = Prism.languages.extend('markup', {
			'smarty': {
				pattern: smarty_pattern,
				inside: {
					'delimiter': {
						pattern: /^\{|\}$/i,
						alias: 'punctuation'
					},
					'string': /(["'])(?:\\?.)*?\1/,
					'number': /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee][-+]?\d+)?)\b/,
					'variable': [
						/\$(?!\d)\w+/,
						/#(?!\d)\w+#/,
						{
							pattern: /(\.|->)(?!\d)\w+/,
							lookbehind: true
						},
						{
							pattern: /(\[)(?!\d)\w+(?=\])/,
							lookbehind: true
						}
					],
					'function': [
						{
							pattern: /(\|\s*)@?(?!\d)\w+/,
							lookbehind: true
						},
						/^\/?(?!\d)\w+/,
						/(?!\d)\w+(?=\()/
					],
					'attr-name': {
						// Value is made optional because it may have already been tokenized
						pattern: /\w+\s*=\s*(?:(?!\d)\w+)?/,
						inside: {
							"variable": {
								pattern: /(=\s*)(?!\d)\w+/,
								lookbehind: true
							},
							"operator": /=/
						}
					},
					'punctuation': [
						/[\[\]().,:`]|\->/
					],
					'operator': [
						/[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/,
						/\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/,
						/\b(?:eq|neq?|gt|lt|gt?e|lt?e|not|mod|or|and)\b/
					],
					'keyword': /\b(?:false|off|on|no|true|yes)\b/
				}
			}
		});
	
		// Comments are inserted at top so that they can
		// surround markup
		Prism.languages.insertBefore('smarty', 'tag', {
			'smarty-comment': {
				pattern: /\{\*[\s\S]*?\*\}/,
				alias: ['smarty','comment']
			}
		});
	
		// Tokenize all inline Smarty expressions
		Prism.hooks.add('before-highlight', function(env) {
			if (env.language !== 'smarty') {
				return;
			}
	
			env.tokenStack = [];
	
			env.backupCode = env.code;
			env.code = env.code.replace(smarty_pattern, function(match) {
	
				// Smarty tags inside {literal} block are ignored
				if(match === smarty_litteral_end) {
					smarty_litteral_mode = false;
				}
	
				if(!smarty_litteral_mode) {
					if(match === smarty_litteral_start) {
						smarty_litteral_mode = true;
					}
	
					var i = env.tokenStack.length;
					// Check for existing strings
					while (env.backupCode.indexOf('___SMARTY' + i + '___') !== -1)
						++i;
	
					// Create a sparse array
					env.tokenStack[i] = match;
	
					return '___SMARTY' + i + '___';
				}
				return match;
			});
		});
	
		// Restore env.code for other plugins (e.g. line-numbers)
		Prism.hooks.add('before-insert', function(env) {
			if (env.language === 'smarty') {
				env.code = env.backupCode;
				delete env.backupCode;
			}
		});
	
		// Re-insert the tokens after highlighting
		// and highlight them with defined grammar
		Prism.hooks.add('after-highlight', function(env) {
			if (env.language !== 'smarty') {
				return;
			}
	
			for (var i = 0, keys = Object.keys(env.tokenStack); i < keys.length; ++i) {
				var k = keys[i];
				var t = env.tokenStack[k];
	
				// The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
				env.highlightedCode = env.highlightedCode.replace('___SMARTY' + k + '___', Prism.highlight(t, env.grammar, 'smarty').replace(/\$/g, '$$$$'));
			}
	
			env.element.innerHTML = env.highlightedCode;
		});
	
	}(Prism));

/***/ }),
/* 133 */
/***/ (function(module, exports) {

	Prism.languages.smalltalk = {
		'comment': /"(?:""|[^"])+"/,
		'string': /'(?:''|[^'])+'/,
		'symbol': /#[\da-z]+|#(?:-|([+\/\\*~<>=@%|&?!])\1?)|#(?=\()/i,
		'block-arguments': {
			pattern: /(\[\s*):[^\[|]*?\|/,
			lookbehind: true,
			inside: {
				'variable': /:[\da-z]+/i,
				'punctuation': /\|/
			}
		},
		'temporary-variables': {
			pattern: /\|[^|]+\|/,
			inside: {
				'variable': /[\da-z]+/i,
				'punctuation': /\|/
			}
		},
		'keyword': /\b(?:nil|true|false|self|super|new)\b/,
		'character': {
			pattern: /\$./,
			alias: 'string'
		},
		'number': [
			/\d+r-?[\dA-Z]+(?:\.[\dA-Z]+)?(?:e-?\d+)?/,
			/(?:\B-|\b)\d+(?:\.\d+)?(?:e-?\d+)?/
		],
		'operator': /[<=]=?|:=|~[~=]|\/\/?|\\\\|>[>=]?|[!^+\-*&|,@]/,
		'punctuation': /[.;:?\[\](){}]/
	};

/***/ }),
/* 134 */
/***/ (function(module, exports) {

	/* TODO
		Add support for Markdown notation inside doc comments
		Add support for nested block comments...
		Match closure params even when not followed by dash or brace
		Add better support for macro definition
	*/
	
	Prism.languages.rust = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true
			}
		],
		'string': [
			{
				pattern: /b?r(#*)"(?:\\?.)*?"\1/,
				greedy: true
			},
			{
				pattern: /b?("|')(?:\\?.)*?\1/,
				greedy: true
			}
		],
		'keyword': /\b(?:abstract|alignof|as|be|box|break|const|continue|crate|do|else|enum|extern|false|final|fn|for|if|impl|in|let|loop|match|mod|move|mut|offsetof|once|override|priv|pub|pure|ref|return|sizeof|static|self|struct|super|true|trait|type|typeof|unsafe|unsized|use|virtual|where|while|yield)\b/,
	
		'attribute': {
			pattern: /#!?\[.+?\]/,
			greedy: true,
			alias: 'attr-name'
		},
	
		'function': [
			/[a-z0-9_]+(?=\s*\()/i,
			// Macros can use parens or brackets
			/[a-z0-9_]+!(?=\s*\(|\[)/i
		],
		'macro-rules': {
			pattern: /[a-z0-9_]+!/i,
			alias: 'function'
		},
	
		// Hex, oct, bin, dec numbers with visual separators and type suffix
		'number': /\b-?(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(\d(_?\d)*)?\.?\d(_?\d)*([Ee][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64)?|f32|f64))?\b/,
	
		// Closure params should not be confused with bitwise OR |
		'closure-params': {
			pattern: /\|[^|]*\|(?=\s*[{-])/,
			inside: {
				'punctuation': /[\|:,]/,
				'operator': /[&*]/
			}
		},
		'punctuation': /[{}[\];(),:]|\.+|->/,
		'operator': /[-+*\/%!^=]=?|@|&[&=]?|\|[|=]?|<<?=?|>>?=?/
	};

/***/ }),
/* 135 */
/***/ (function(module, exports) {

	Prism.languages.r = {
		'comment': /#.*/,
		'string': {
			pattern: /(['"])(?:\\?.)*?\1/,
			greedy: true
		},
		'percent-operator': {
			// Includes user-defined operators
			// and %%, %*%, %/%, %in%, %o%, %x%
			pattern: /%[^%\s]*%/,
			alias: 'operator'
		},
		'boolean': /\b(?:TRUE|FALSE)\b/,
		'ellipsis': /\.\.(?:\.|\d+)/,
		'number': [
			/\b(?:NaN|Inf)\b/,
			/\b(?:0x[\dA-Fa-f]+(?:\.\d*)?|\d*\.?\d+)(?:[EePp][+-]?\d+)?[iL]?\b/
		],
		'keyword': /\b(?:if|else|repeat|while|function|for|in|next|break|NULL|NA|NA_integer_|NA_real_|NA_complex_|NA_character_)\b/,
		'operator': /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
		'punctuation': /[(){}\[\],;]/
	};

/***/ }),
/* 136 */
/***/ (function(module, exports) {

	Prism.languages.d = Prism.languages.extend('clike', {
		'string': [
			// r"", x""
			/\b[rx]"(\\.|[^\\"])*"[cwd]?/,
			// q"[]", q"()", q"<>", q"{}"
			/\bq"(?:\[[\s\S]*?\]|\([\s\S]*?\)|<[\s\S]*?>|\{[\s\S]*?\})"/,
			// q"IDENT
			// ...
			// IDENT"
			/\bq"([_a-zA-Z][_a-zA-Z\d]*)(?:\r?\n|\r)[\s\S]*?(?:\r?\n|\r)\1"/,
			// q"//", q"||", etc.
			/\bq"(.)[\s\S]*?\1"/,
			// Characters
			/'(?:\\'|\\?[^']+)'/,
	
			/(["`])(\\.|(?!\1)[^\\])*\1[cwd]?/
		],
	
		'number': [
			// The lookbehind and the negative look-ahead try to prevent bad highlighting of the .. operator
			// Hexadecimal numbers must be handled separately to avoid problems with exponent "e"
			/\b0x\.?[a-f\d_]+(?:(?!\.\.)\.[a-f\d_]*)?(?:p[+-]?[a-f\d_]+)?[ulfi]*/i,
			{
				pattern: /((?:\.\.)?)(?:\b0b\.?|\b|\.)\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:e[+-]?\d[\d_]*)?[ulfi]*/i,
				lookbehind: true
			}
		],
	
		// In order: $, keywords and special tokens, globally defined symbols
		'keyword': /\$|\b(?:abstract|alias|align|asm|assert|auto|body|bool|break|byte|case|cast|catch|cdouble|cent|cfloat|char|class|const|continue|creal|dchar|debug|default|delegate|delete|deprecated|do|double|else|enum|export|extern|false|final|finally|float|for|foreach|foreach_reverse|function|goto|idouble|if|ifloat|immutable|import|inout|int|interface|invariant|ireal|lazy|long|macro|mixin|module|new|nothrow|null|out|override|package|pragma|private|protected|public|pure|real|ref|return|scope|shared|short|static|struct|super|switch|synchronized|template|this|throw|true|try|typedef|typeid|typeof|ubyte|ucent|uint|ulong|union|unittest|ushort|version|void|volatile|wchar|while|with|__(?:(?:FILE|MODULE|LINE|FUNCTION|PRETTY_FUNCTION|DATE|EOF|TIME|TIMESTAMP|VENDOR|VERSION)__|gshared|traits|vector|parameters)|string|wstring|dstring|size_t|ptrdiff_t)\b/,
		'operator': /\|[|=]?|&[&=]?|\+[+=]?|-[-=]?|\.?\.\.|=[>=]?|!(?:i[ns]\b|<>?=?|>=?|=)?|\bi[ns]\b|(?:<[<>]?|>>?>?|\^\^|[*\/%^~])=?/
	});
	
	
	Prism.languages.d.comment = [
		// Shebang
		/^\s*#!.+/,
		// /+ +/
		{
			// Allow one level of nesting
			pattern: /(^|[^\\])\/\+(?:\/\+[\s\S]*?\+\/|[\s\S])*?\+\//,
			lookbehind: true
		}
	].concat(Prism.languages.d.comment);
	
	Prism.languages.insertBefore('d', 'comment', {
		'token-string': {
			// Allow one level of nesting
			pattern: /\bq\{(?:|\{[^}]*\}|[^}])*\}/,
			alias: 'string'
		}
	});
	
	Prism.languages.insertBefore('d', 'keyword', {
		'property': /\B@\w*/
	});
	
	Prism.languages.insertBefore('d', 'function', {
		'register': {
			// Iasm registers
			pattern: /\b(?:[ABCD][LHX]|E[ABCD]X|E?(?:BP|SP|DI|SI)|[ECSDGF]S|CR[0234]|DR[012367]|TR[3-7]|X?MM[0-7]|R[ABCD]X|[BS]PL|R[BS]P|[DS]IL|R[DS]I|R(?:[89]|1[0-5])[BWD]?|XMM(?:[89]|1[0-5])|YMM(?:1[0-5]|\d))\b|\bST(?:\([0-7]\)|\b)/,
			alias: 'variable'
		}
	});

/***/ }),
/* 137 */
/***/ (function(module, exports) {

	Prism.languages.dart = Prism.languages.extend('clike', {
		'string': [
			{
				pattern: /r?("""|''')[\s\S]*?\1/,
				greedy: true
			},
			{
				pattern: /r?("|')(\\?.)*?\1/,
				greedy: true
			}
		],
		'keyword': [
			/\b(?:async|sync|yield)\*/,
			/\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|default|deferred|do|dynamic|else|enum|export|external|extends|factory|final|finally|for|get|if|implements|import|in|library|new|null|operator|part|rethrow|return|set|static|super|switch|this|throw|try|typedef|var|void|while|with|yield)\b/
		],
		'operator': /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
	});
	
	Prism.languages.insertBefore('dart','function',{
		'metadata': {
			pattern: /@\w+/,
			alias: 'symbol'
		}
	});

/***/ }),
/* 138 */
/***/ (function(module, exports) {

	(function(Prism) {
	
	// Ignore comments starting with { to privilege string interpolation highlighting
	var comment = /#(?!\{).+/,
	    interpolation = {
	    	pattern: /#\{[^}]+\}/,
	    	alias: 'variable'
	    };
	
	Prism.languages.coffeescript = Prism.languages.extend('javascript', {
		'comment': comment,
		'string': [
	
			// Strings are multiline
			{
				pattern: /'(?:\\?[^\\])*?'/,
				greedy: true
			},
	
			{
				// Strings are multiline
				pattern: /"(?:\\?[^\\])*?"/,
				greedy: true,
				inside: {
					'interpolation': interpolation
				}
			}
		],
		'keyword': /\b(and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
		'class-member': {
			pattern: /@(?!\d)\w+/,
			alias: 'variable'
		}
	});
	
	Prism.languages.insertBefore('coffeescript', 'comment', {
		'multiline-comment': {
			pattern: /###[\s\S]+?###/,
			alias: 'comment'
		},
	
		// Block regexp can contain comments and interpolation
		'block-regex': {
			pattern: /\/{3}[\s\S]*?\/{3}/,
			alias: 'regex',
			inside: {
				'comment': comment,
				'interpolation': interpolation
			}
		}
	});
	
	Prism.languages.insertBefore('coffeescript', 'string', {
		'inline-javascript': {
			pattern: /`(?:\\?[\s\S])*?`/,
			inside: {
				'delimiter': {
					pattern: /^`|`$/,
					alias: 'punctuation'
				},
				rest: Prism.languages.javascript
			}
		},
	
		// Block strings
		'multiline-string': [
			{
				pattern: /'''[\s\S]*?'''/,
				greedy: true,
				alias: 'string'
			},
			{
				pattern: /"""[\s\S]*?"""/,
				greedy: true,
				alias: 'string',
				inside: {
					interpolation: interpolation
				}
			}
		]
	
	});
	
	Prism.languages.insertBefore('coffeescript', 'keyword', {
		// Object property
		'property': /(?!\d)\w+(?=\s*:(?!:))/
	});
	
	delete Prism.languages.coffeescript['template-string'];
	
	}(Prism));

/***/ }),
/* 139 */
/***/ (function(module, exports) {

	(function (Prism) {
		var variable = /%%?[~:\w]+%?|!\S+!/;
		var parameter = {
			pattern: /\/[a-z?]+(?=[ :]|$):?|-[a-z]\b|--[a-z-]+\b/im,
			alias: 'attr-name',
			inside: {
				'punctuation': /:/
			}
		};
		var string = /"[^"]*"/;
		var number = /(?:\b|-)\d+\b/;
	
		Prism.languages.batch = {
			'comment': [
				/^::.*/m,
				{
					pattern: /((?:^|[&(])[ \t]*)rem\b(?:[^^&)\r\n]|\^(?:\r\n|[\s\S]))*/im,
					lookbehind: true
				}
			],
			'label': {
				pattern: /^:.*/m,
				alias: 'property'
			},
			'command': [
				{
					// FOR command
					pattern: /((?:^|[&(])[ \t]*)for(?: ?\/[a-z?](?:[ :](?:"[^"]*"|\S+))?)* \S+ in \([^)]+\) do/im,
					lookbehind: true,
					inside: {
						'keyword': /^for\b|\b(?:in|do)\b/i,
						'string': string,
						'parameter': parameter,
						'variable': variable,
						'number': number,
						'punctuation': /[()',]/
					}
				},
				{
					// IF command
					pattern: /((?:^|[&(])[ \t]*)if(?: ?\/[a-z?](?:[ :](?:"[^"]*"|\S+))?)* (?:not )?(?:cmdextversion \d+|defined \w+|errorlevel \d+|exist \S+|(?:"[^"]*"|\S+)?(?:==| (?:equ|neq|lss|leq|gtr|geq) )(?:"[^"]*"|\S+))/im,
					lookbehind: true,
					inside: {
						'keyword': /^if\b|\b(?:not|cmdextversion|defined|errorlevel|exist)\b/i,
						'string': string,
						'parameter': parameter,
						'variable': variable,
						'number': number,
						'operator': /\^|==|\b(?:equ|neq|lss|leq|gtr|geq)\b/i
					}
				},
				{
					// ELSE command
					pattern: /((?:^|[&()])[ \t]*)else\b/im,
					lookbehind: true,
					inside: {
						'keyword': /^else\b/i
					}
				},
				{
					// SET command
					pattern: /((?:^|[&(])[ \t]*)set(?: ?\/[a-z](?:[ :](?:"[^"]*"|\S+))?)* (?:[^^&)\r\n]|\^(?:\r\n|[\s\S]))*/im,
					lookbehind: true,
					inside: {
						'keyword': /^set\b/i,
						'string': string,
						'parameter': parameter,
						'variable': [
							variable,
							/\w+(?=(?:[*\/%+\-&^|]|<<|>>)?=)/
						],
						'number': number,
						'operator': /[*\/%+\-&^|]=?|<<=?|>>=?|[!~_=]/,
						'punctuation': /[()',]/
					}
				},
				{
					// Other commands
					pattern: /((?:^|[&(])[ \t]*@?)\w+\b(?:[^^&)\r\n]|\^(?:\r\n|[\s\S]))*/im,
					lookbehind: true,
					inside: {
						'keyword': /^\w+\b/i,
						'string': string,
						'parameter': parameter,
						'label': {
							pattern: /(^\s*):\S+/m,
							lookbehind: true,
							alias: 'property'
						},
						'variable': variable,
						'number': number,
						'operator': /\^/
					}
				}
			],
			'operator': /[&@]/,
			'punctuation': /[()']/
		};
	}(Prism));

/***/ }),
/* 140 */
/***/ (function(module, exports) {

	Prism.languages.cpp = Prism.languages.extend('c', {
		'keyword': /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
		'boolean': /\b(true|false)\b/,
		'operator': /[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
	});
	
	Prism.languages.insertBefore('cpp', 'keyword', {
		'class-name': {
			pattern: /(class\s+)[a-z0-9_]+/i,
			lookbehind: true
		}
	});

/***/ }),
/* 141 */
/***/ (function(module, exports) {

	Prism.languages.lua = {
		'comment': /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
		// \z may be used to skip the following space
		'string': {
			pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
			greedy: true
		},
		'number': /\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
		'keyword': /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
		'function': /(?!\d)\w+(?=\s*(?:[({]))/,
		'operator': [
			/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/,
			{
				// Match ".." but don't break "..."
				pattern: /(^|[^.])\.\.(?!\.)/,
				lookbehind: true
			}
		],
		'punctuation': /[\[\](){},;]|\.+|:+/
	};

/***/ }),
/* 142 */
/***/ (function(module, exports) {

	Prism.languages.livescript = {
		'interpolated-string': {
			pattern: /("""|")(?:\\[\s\S]|(?!\1)[^\\])*\1/,
			greedy: true,
			inside: {
				'variable': {
					pattern: /(^|[^\\])#[a-z_](?:-?[a-z]|\d)*/m,
					lookbehind: true
				},
				'interpolation': {
					pattern: /(^|[^\\])#\{[^}]+\}/m,
					lookbehind: true,
					inside: {
						'interpolation-punctuation': {
							pattern: /^#\{|\}$/,
							alias: 'variable'
						}
						// See rest below
					}
				},
				'string': /[\s\S]+/
			}
		},
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
				lookbehind: true,
				greedy: true
			},
			{
				pattern: /(^|[^\\])#.*/,
				lookbehind: true,
				greedy: true
			}
		],
		'string': [
			{
				pattern: /('''|')(?:\\[\s\S]|(?!\1)[^\\])*\1/,
				greedy: true
			},
			{
				pattern: /<\[[\s\S]*?\]>/,
				greedy: true
			},
			/\\[^\s,;\])}]+/
		],
		'regex': [
			{
				pattern: /\/\/(\[.+?]|\\.|(?!\/\/)[^\\])+\/\/[gimyu]{0,5}/,
				greedy: true,
				inside: {
					'comment': {
						pattern: /(^|[^\\])#.*/,
						lookbehind: true
					}
				}
			},
			{
				pattern: /\/(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}/,
				greedy: true
			}
		],
		'keyword': {
			pattern: /(^|(?!-).)\b(?:break|case|catch|class|const|continue|default|do|else|extends|fallthrough|finally|for(?: ever)?|function|if|implements|it|let|loop|new|null|otherwise|own|return|super|switch|that|then|this|throw|try|unless|until|var|void|when|while|yield)(?!-)\b/m,
			lookbehind: true
		},
		'keyword-operator': {
			pattern: /(^|[^-])\b(?:(?:delete|require|typeof)!|(?:and|by|delete|export|from|import(?: all)?|in|instanceof|is(?:nt| not)?|not|of|or|til|to|typeof|with|xor)(?!-)\b)/m,
			lookbehind: true,
			alias: 'operator'
		},
		'boolean': {
			pattern: /(^|[^-])\b(?:false|no|off|on|true|yes)(?!-)\b/m,
			lookbehind: true
		},
		'argument': {
			// Don't match .&. nor &&
			pattern: /(^|(?!\.&\.)[^&])&(?!&)\d*/m,
			lookbehind: true,
			alias: 'variable'
		},
		'number': /\b(?:\d+~[\da-z]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[a-z]\w*)?)/i,
		'identifier': /[a-z_](?:-?[a-z]|\d)*/i,
		'operator': [
			// Spaced .
			{
				pattern: /( )\.(?= )/,
				lookbehind: true
			},
			// Full list, in order:
			// .= .~ .. ...
			// .&. .^. .<<. .>>. .>>>.
			// := :: ::=
			// &&
			// || |>
			// < << <<< <<<<
			// <- <-- <-! <--!
			// <~ <~~ <~! <~~!
			// <| <= <?
			// > >> >= >?
			// - -- -> -->
			// + ++
			// @ @@
			// % %%
			// * **
			// ! != !~=
			// !~> !~~>
			// !-> !-->
			// ~ ~> ~~> ~=
			// = ==
			// ^ ^^
			// / ?
			/\.(?:[=~]|\.\.?)|\.(?:[&|^]|<<|>>>?)\.|:(?:=|:=?)|&&|\|[|>]|<(?:<<?<?|--?!?|~~?!?|[|=?])?|>[>=?]?|-(?:->?|>)?|\+\+?|@@?|%%?|\*\*?|!(?:~?=|--?>|~?~>)?|~(?:~?>|=)?|==?|\^\^?|[\/?]/
		],
		'punctuation': /[(){}\[\]|.,:;`]/
	};
	
	Prism.languages.livescript['interpolated-string'].inside['interpolation'].inside.rest = Prism.languages.livescript;

/***/ }),
/* 143 */
/***/ (function(module, exports) {

	(function(Prism) {
		var funcPattern = /\\([^a-z()[\]]|[a-z\*]+)/i,
		    insideEqu = {
			    'equation-command': {
				    pattern: funcPattern,
				    alias: 'regex'
			    }
		    };
	
		Prism.languages.latex = {
			'comment': /%.*/m,
			// the verbatim environment prints whitespace to the document
			'cdata':  {
				pattern: /(\\begin\{((?:verbatim|lstlisting)\*?)\})([\s\S]*?)(?=\\end\{\2\})/,
				lookbehind: true
			},
			/*
			 * equations can be between $ $ or \( \) or \[ \]
			 * (all are multiline)
			 */
			'equation': [
				{
					pattern: /\$(?:\\?[\s\S])*?\$|\\\((?:\\?[\s\S])*?\\\)|\\\[(?:\\?[\s\S])*?\\\]/,
					inside: insideEqu,
					alias: 'string'
				},
				{
					pattern: /(\\begin\{((?:equation|math|eqnarray|align|multline|gather)\*?)\})([\s\S]*?)(?=\\end\{\2\})/,
					lookbehind: true,
					inside: insideEqu,
					alias: 'string'
				}
			],
			/*
			 * arguments which are keywords or references are highlighted
			 * as keywords
			 */
			'keyword': {
				pattern: /(\\(?:begin|end|ref|cite|label|usepackage|documentclass)(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
				lookbehind: true
			},
			'url': {
				pattern: /(\\url\{)[^}]+(?=\})/,
				lookbehind: true
			},
			/*
			 * section or chapter headlines are highlighted as bold so that
			 * they stand out more
			 */
			'headline': {
				pattern: /(\\(?:part|chapter|section|subsection|frametitle|subsubsection|paragraph|subparagraph|subsubparagraph|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\}(?:\[[^\]]+\])?)/,
				lookbehind: true,
				alias: 'class-name'
			},
			'function': {
				pattern: funcPattern,
				alias: 'selector'
			},
			'punctuation': /[[\]{}&]/
		};
	})(Prism);


/***/ }),
/* 144 */
/***/ (function(module, exports) {

	Prism.languages.groovy = Prism.languages.extend('clike', {
		'keyword': /\b(as|def|in|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/,
		'string': [
			{
				pattern: /("""|''')[\s\S]*?\1|(\$\/)(\$\/\$|[\s\S])*?\/\$/,
				greedy: true
			},
			{
				pattern: /("|'|\/)(?:\\?.)*?\1/,
				greedy: true
			}
		],
		'number': /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?[\d]+)?)[glidf]?\b/i,
		'operator': {
			pattern: /(^|[^.])(~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.{1,2}(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
			lookbehind: true
		},
		'punctuation': /\.+|[{}[\];(),:$]/
	});
	
	Prism.languages.insertBefore('groovy', 'string', {
		'shebang': {
			pattern: /#!.+/,
			alias: 'comment'
		}
	});
	
	Prism.languages.insertBefore('groovy', 'punctuation', {
		'spock-block': /\b(setup|given|when|then|and|cleanup|expect|where):/
	});
	
	Prism.languages.insertBefore('groovy', 'function', {
		'annotation': {
			alias: 'punctuation',
			pattern: /(^|[^.])@\w+/,
			lookbehind: true
		}
	});
	
	// Handle string interpolation
	Prism.hooks.add('wrap', function(env) {
		if (env.language === 'groovy' && env.type === 'string') {
			var delimiter = env.content[0];
	
			if (delimiter != "'") {
				var pattern = /([^\\])(\$(\{.*?\}|[\w\.]+))/;
				if (delimiter === '$') {
					pattern = /([^\$])(\$(\{.*?\}|[\w\.]+))/;
				}
	
				// To prevent double HTML-encoding we have to decode env.content first
				env.content = env.content.replace(/&lt;/g, '<').replace(/&amp;/g, '&');
	
				env.content = Prism.highlight(env.content, {
					'expression': {
						pattern: pattern,
						lookbehind: true,
						inside: Prism.languages.groovy
					}
				});
	
				env.classes.push(delimiter === '/' ? 'regex' : 'gstring');
			}
		}
	});


/***/ }),
/* 145 */
/***/ (function(module, exports) {

	Prism.languages.graphql = {
		'comment': /#.*/,
		'string': {
			pattern: /"(?:\\.|[^\\"])*"/,
			greedy: true
		},
		'number': /(?:\B-|\b)\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
		'boolean': /\b(?:true|false)\b/,
		'variable': /\$[a-z_]\w*/i,
		'directive': {
			pattern: /@[a-z_]\w*/i,
			alias: 'function'
		},
		'attr-name': /[a-z_]\w*(?=\s*:)/i,
		'keyword': [
			{
				pattern: /(fragment\s+(?!on)[a-z_]\w*\s+|\.\.\.\s*)on\b/,
				lookbehind: true
			},
			/\b(?:query|fragment|mutation)\b/
		],
		'operator': /!|=|\.{3}/,
		'punctuation': /[!(){}\[\]:=,]/
	};

/***/ }),
/* 146 */
/***/ (function(module, exports) {

	Prism.languages.nginx = Prism.languages.extend('clike', {
	        'comment': {
	                pattern: /(^|[^"{\\])#.*/,
	                lookbehind: true
	        },
	        'keyword': /\b(?:CONTENT_|DOCUMENT_|GATEWAY_|HTTP_|HTTPS|if_not_empty|PATH_|QUERY_|REDIRECT_|REMOTE_|REQUEST_|SCGI|SCRIPT_|SERVER_|http|server|events|location|include|accept_mutex|accept_mutex_delay|access_log|add_after_body|add_before_body|add_header|addition_types|aio|alias|allow|ancient_browser|ancient_browser_value|auth|auth_basic|auth_basic_user_file|auth_http|auth_http_header|auth_http_timeout|autoindex|autoindex_exact_size|autoindex_localtime|break|charset|charset_map|charset_types|chunked_transfer_encoding|client_body_buffer_size|client_body_in_file_only|client_body_in_single_buffer|client_body_temp_path|client_body_timeout|client_header_buffer_size|client_header_timeout|client_max_body_size|connection_pool_size|create_full_put_path|daemon|dav_access|dav_methods|debug_connection|debug_points|default_type|deny|devpoll_changes|devpoll_events|directio|directio_alignment|disable_symlinks|empty_gif|env|epoll_events|error_log|error_page|expires|fastcgi_buffer_size|fastcgi_buffers|fastcgi_busy_buffers_size|fastcgi_cache|fastcgi_cache_bypass|fastcgi_cache_key|fastcgi_cache_lock|fastcgi_cache_lock_timeout|fastcgi_cache_methods|fastcgi_cache_min_uses|fastcgi_cache_path|fastcgi_cache_purge|fastcgi_cache_use_stale|fastcgi_cache_valid|fastcgi_connect_timeout|fastcgi_hide_header|fastcgi_ignore_client_abort|fastcgi_ignore_headers|fastcgi_index|fastcgi_intercept_errors|fastcgi_keep_conn|fastcgi_max_temp_file_size|fastcgi_next_upstream|fastcgi_no_cache|fastcgi_param|fastcgi_pass|fastcgi_pass_header|fastcgi_read_timeout|fastcgi_redirect_errors|fastcgi_send_timeout|fastcgi_split_path_info|fastcgi_store|fastcgi_store_access|fastcgi_temp_file_write_size|fastcgi_temp_path|flv|geo|geoip_city|geoip_country|google_perftools_profiles|gzip|gzip_buffers|gzip_comp_level|gzip_disable|gzip_http_version|gzip_min_length|gzip_proxied|gzip_static|gzip_types|gzip_vary|if|if_modified_since|ignore_invalid_headers|image_filter|image_filter_buffer|image_filter_jpeg_quality|image_filter_sharpen|image_filter_transparency|imap_capabilities|imap_client_buffer|include|index|internal|ip_hash|keepalive|keepalive_disable|keepalive_requests|keepalive_timeout|kqueue_changes|kqueue_events|large_client_header_buffers|limit_conn|limit_conn_log_level|limit_conn_zone|limit_except|limit_rate|limit_rate_after|limit_req|limit_req_log_level|limit_req_zone|limit_zone|lingering_close|lingering_time|lingering_timeout|listen|location|lock_file|log_format|log_format_combined|log_not_found|log_subrequest|map|map_hash_bucket_size|map_hash_max_size|master_process|max_ranges|memcached_buffer_size|memcached_connect_timeout|memcached_next_upstream|memcached_pass|memcached_read_timeout|memcached_send_timeout|merge_slashes|min_delete_depth|modern_browser|modern_browser_value|mp4|mp4_buffer_size|mp4_max_buffer_size|msie_padding|msie_refresh|multi_accept|open_file_cache|open_file_cache_errors|open_file_cache_min_uses|open_file_cache_valid|open_log_file_cache|optimize_server_names|override_charset|pcre_jit|perl|perl_modules|perl_require|perl_set|pid|pop3_auth|pop3_capabilities|port_in_redirect|post_action|postpone_output|protocol|proxy|proxy_buffer|proxy_buffer_size|proxy_buffering|proxy_buffers|proxy_busy_buffers_size|proxy_cache|proxy_cache_bypass|proxy_cache_key|proxy_cache_lock|proxy_cache_lock_timeout|proxy_cache_methods|proxy_cache_min_uses|proxy_cache_path|proxy_cache_use_stale|proxy_cache_valid|proxy_connect_timeout|proxy_cookie_domain|proxy_cookie_path|proxy_headers_hash_bucket_size|proxy_headers_hash_max_size|proxy_hide_header|proxy_http_version|proxy_ignore_client_abort|proxy_ignore_headers|proxy_intercept_errors|proxy_max_temp_file_size|proxy_method|proxy_next_upstream|proxy_no_cache|proxy_pass|proxy_pass_error_message|proxy_pass_header|proxy_pass_request_body|proxy_pass_request_headers|proxy_read_timeout|proxy_redirect|proxy_redirect_errors|proxy_send_lowat|proxy_send_timeout|proxy_set_body|proxy_set_header|proxy_ssl_session_reuse|proxy_store|proxy_store_access|proxy_temp_file_write_size|proxy_temp_path|proxy_timeout|proxy_upstream_fail_timeout|proxy_upstream_max_fails|random_index|read_ahead|real_ip_header|recursive_error_pages|request_pool_size|reset_timedout_connection|resolver|resolver_timeout|return|rewrite|root|rtsig_overflow_events|rtsig_overflow_test|rtsig_overflow_threshold|rtsig_signo|satisfy|satisfy_any|secure_link_secret|send_lowat|send_timeout|sendfile|sendfile_max_chunk|server|server_name|server_name_in_redirect|server_names_hash_bucket_size|server_names_hash_max_size|server_tokens|set|set_real_ip_from|smtp_auth|smtp_capabilities|so_keepalive|source_charset|split_clients|ssi|ssi_silent_errors|ssi_types|ssi_value_length|ssl|ssl_certificate|ssl_certificate_key|ssl_ciphers|ssl_client_certificate|ssl_crl|ssl_dhparam|ssl_engine|ssl_prefer_server_ciphers|ssl_protocols|ssl_session_cache|ssl_session_timeout|ssl_verify_client|ssl_verify_depth|starttls|stub_status|sub_filter|sub_filter_once|sub_filter_types|tcp_nodelay|tcp_nopush|timeout|timer_resolution|try_files|types|types_hash_bucket_size|types_hash_max_size|underscores_in_headers|uninitialized_variable_warn|upstream|use|user|userid|userid_domain|userid_expires|userid_name|userid_p3p|userid_path|userid_service|valid_referers|variables_hash_bucket_size|variables_hash_max_size|worker_connections|worker_cpu_affinity|worker_priority|worker_processes|worker_rlimit_core|worker_rlimit_nofile|worker_rlimit_sigpending|working_directory|xclient|xml_entities|xslt_entities|xslt_stylesheet|xslt_types)\b/i,
	});
	
	Prism.languages.insertBefore('nginx', 'keyword', {
	        'variable': /\$[a-z_]+/i
	});

/***/ }),
/* 147 */
/***/ (function(module, exports) {

	Prism.languages.erlang = {
		'comment': /%.+/,
		'string': {
			pattern: /"(?:\\?.)*?"/,
			greedy: true
		},
		'quoted-function': {
			pattern: /'(?:\\.|[^'\\])+'(?=\()/,
			alias: 'function'
		},
		'quoted-atom': {
			pattern: /'(?:\\.|[^'\\])+'/,
			alias: 'atom'
		},
		'boolean': /\b(?:true|false)\b/,
		'keyword': /\b(?:fun|when|case|of|end|if|receive|after|try|catch)\b/,
		'number': [
			/\$\\?./,
			/\d+#[a-z0-9]+/i,
			/(?:\b|-)\d*\.?\d+([Ee][+-]?\d+)?\b/
		],
		'function': /\b[a-z][\w@]*(?=\()/,
		'variable': {
			// Look-behind is used to prevent wrong highlighting of atoms containing "@"
			pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/,
			lookbehind: true
		},
		'operator': [
			/[=\/<>:]=|=[:\/]=|\+\+?|--?|[=*\/!]|\b(?:bnot|div|rem|band|bor|bxor|bsl|bsr|not|and|or|xor|orelse|andalso)\b/,
			{
				// We don't want to match <<
				pattern: /(^|[^<])<(?!<)/,
				lookbehind: true
			},
			{
				// We don't want to match >>
				pattern: /(^|[^>])>(?!>)/,
				lookbehind: true
			}
		],
		'atom': /\b[a-z][\w@]*/,
		'punctuation': /[()[\]{}:;,.#|]|<<|>>/
	
	};

/***/ }),
/* 148 */
/***/ (function(module, exports) {

	Prism.languages.powershell = {
		'comment': [
			{
				pattern: /(^|[^`])<#[\s\S]*?#>/,
				lookbehind: true
			},
			{
				pattern: /(^|[^`])#.*/,
				lookbehind: true
			}
		],
		'string': [
			{
				pattern: /"(`?[\s\S])*?"/,
				greedy: true,
				inside: {
					'function': {
						pattern: /[^`]\$\(.*?\)/,
						// Populated at end of file
						inside: {}
					}
				}
			},
			{
				pattern: /'([^']|'')*'/,
				greedy: true
			}
		],
		// Matches name spaces as well as casts, attribute decorators. Force starting with letter to avoid matching array indices
		'namespace': /\[[a-z][\s\S]*?\]/i,
		'boolean': /\$(true|false)\b/i,
		'variable': /\$\w+\b/i,
		// Cmdlets and aliases. Aliases should come last, otherwise "write" gets preferred over "write-host" for example
		// Get-Command | ?{ $_.ModuleName -match "Microsoft.PowerShell.(Util|Core|Management)" }
		// Get-Alias | ?{ $_.ReferencedCommand.Module.Name -match "Microsoft.PowerShell.(Util|Core|Management)" }
		'function': [
			/\b(Add-(Computer|Content|History|Member|PSSnapin|Type)|Checkpoint-Computer|Clear-(Content|EventLog|History|Item|ItemProperty|Variable)|Compare-Object|Complete-Transaction|Connect-PSSession|ConvertFrom-(Csv|Json|StringData)|Convert-Path|ConvertTo-(Csv|Html|Json|Xml)|Copy-(Item|ItemProperty)|Debug-Process|Disable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Disconnect-PSSession|Enable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Enter-PSSession|Exit-PSSession|Export-(Alias|Clixml|Console|Csv|FormatData|ModuleMember|PSSession)|ForEach-Object|Format-(Custom|List|Table|Wide)|Get-(Alias|ChildItem|Command|ComputerRestorePoint|Content|ControlPanelItem|Culture|Date|Event|EventLog|EventSubscriber|FormatData|Help|History|Host|HotFix|Item|ItemProperty|Job|Location|Member|Module|Process|PSBreakpoint|PSCallStack|PSDrive|PSProvider|PSSession|PSSessionConfiguration|PSSnapin|Random|Service|TraceSource|Transaction|TypeData|UICulture|Unique|Variable|WmiObject)|Group-Object|Import-(Alias|Clixml|Csv|LocalizedData|Module|PSSession)|Invoke-(Command|Expression|History|Item|RestMethod|WebRequest|WmiMethod)|Join-Path|Limit-EventLog|Measure-(Command|Object)|Move-(Item|ItemProperty)|New-(Alias|Event|EventLog|Item|ItemProperty|Module|ModuleManifest|Object|PSDrive|PSSession|PSSessionConfigurationFile|PSSessionOption|PSTransportOption|Service|TimeSpan|Variable|WebServiceProxy)|Out-(Default|File|GridView|Host|Null|Printer|String)|Pop-Location|Push-Location|Read-Host|Receive-(Job|PSSession)|Register-(EngineEvent|ObjectEvent|PSSessionConfiguration|WmiEvent)|Remove-(Computer|Event|EventLog|Item|ItemProperty|Job|Module|PSBreakpoint|PSDrive|PSSession|PSSnapin|TypeData|Variable|WmiObject)|Rename-(Computer|Item|ItemProperty)|Reset-ComputerMachinePassword|Resolve-Path|Restart-(Computer|Service)|Restore-Computer|Resume-(Job|Service)|Save-Help|Select-(Object|String|Xml)|Send-MailMessage|Set-(Alias|Content|Date|Item|ItemProperty|Location|PSBreakpoint|PSDebug|PSSessionConfiguration|Service|StrictMode|TraceSource|Variable|WmiInstance)|Show-(Command|ControlPanelItem|EventLog)|Sort-Object|Split-Path|Start-(Job|Process|Service|Sleep|Transaction)|Stop-(Computer|Job|Process|Service)|Suspend-(Job|Service)|Tee-Object|Test-(ComputerSecureChannel|Connection|ModuleManifest|Path|PSSessionConfigurationFile)|Trace-Command|Unblock-File|Undo-Transaction|Unregister-(Event|PSSessionConfiguration)|Update-(FormatData|Help|List|TypeData)|Use-Transaction|Wait-(Event|Job|Process)|Where-Object|Write-(Debug|Error|EventLog|Host|Output|Progress|Verbose|Warning))\b/i,
			/\b(ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i
		],
		// per http://technet.microsoft.com/en-us/library/hh847744.aspx
		'keyword': /\b(Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
		'operator': {
			pattern: /(\W?)(!|-(eq|ne|gt|ge|lt|le|sh[lr]|not|b?(and|x?or)|(Not)?(Like|Match|Contains|In)|Replace|Join|is(Not)?|as)\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
			lookbehind: true
		},
		'punctuation': /[|{}[\];(),.]/
	};
	
	// Variable interpolation inside strings, and nested expressions
	Prism.languages.powershell.string[0].inside.boolean = Prism.languages.powershell.boolean;
	Prism.languages.powershell.string[0].inside.variable = Prism.languages.powershell.variable;
	Prism.languages.powershell.string[0].inside.function.inside = Prism.util.clone(Prism.languages.powershell);


/***/ }),
/* 149 */
/***/ (function(module, exports) {

	Prism.languages.makefile = {
		'comment': {
			pattern: /(^|[^\\])#(?:\\(?:\r\n|[\s\S])|.)*/,
			lookbehind: true
		},
		'string': {
			pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
	
		// Built-in target names
		'builtin': /\.[A-Z][^:#=\s]+(?=\s*:(?!=))/,
	
		// Targets
		'symbol': {
			pattern: /^[^:=\r\n]+(?=\s*:(?!=))/m,
			inside: {
				'variable': /\$+(?:[^(){}:#=\s]+|(?=[({]))/
			}
		},
		'variable': /\$+(?:[^(){}:#=\s]+|\([@*%<^+?][DF]\)|(?=[({]))/,
	
		'keyword': [
			// Directives
			/-include\b|\b(?:define|else|endef|endif|export|ifn?def|ifn?eq|include|override|private|sinclude|undefine|unexport|vpath)\b/,
			// Functions
			{
				pattern: /(\()(?:addsuffix|abspath|and|basename|call|dir|error|eval|file|filter(?:-out)?|findstring|firstword|flavor|foreach|guile|if|info|join|lastword|load|notdir|or|origin|patsubst|realpath|shell|sort|strip|subst|suffix|value|warning|wildcard|word(?:s|list)?)(?=[ \t])/,
				lookbehind: true
			}
		],
		'operator': /(?:::|[?:+!])?=|[|@]/,
		'punctuation': /[:;(){}]/
	};

/***/ }),
/* 150 */
/***/ (function(module, exports) {

	Prism.languages.markdown = Prism.languages.extend('markup', {});
	Prism.languages.insertBefore('markdown', 'prolog', {
		'blockquote': {
			// > ...
			pattern: /^>(?:[\t ]*>)*/m,
			alias: 'punctuation'
		},
		'code': [
			{
				// Prefixed by 4 spaces or 1 tab
				pattern: /^(?: {4}|\t).+/m,
				alias: 'keyword'
			},
			{
				// `code`
				// ``code``
				pattern: /``.+?``|`[^`\n]+`/,
				alias: 'keyword'
			}
		],
		'title': [
			{
				// title 1
				// =======
	
				// title 2
				// -------
				pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
				alias: 'important',
				inside: {
					punctuation: /==+$|--+$/
				}
			},
			{
				// # title 1
				// ###### title 6
				pattern: /(^\s*)#+.+/m,
				lookbehind: true,
				alias: 'important',
				inside: {
					punctuation: /^#+|#+$/
				}
			}
		],
		'hr': {
			// ***
			// ---
			// * * *
			// -----------
			pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
			lookbehind: true,
			alias: 'punctuation'
		},
		'list': {
			// * item
			// + item
			// - item
			// 1. item
			pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
			lookbehind: true,
			alias: 'punctuation'
		},
		'url-reference': {
			// [id]: http://example.com "Optional title"
			// [id]: http://example.com 'Optional title'
			// [id]: http://example.com (Optional title)
			// [id]: <http://example.com> "Optional title"
			pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
			inside: {
				'variable': {
					pattern: /^(!?\[)[^\]]+/,
					lookbehind: true
				},
				'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
				'punctuation': /^[\[\]!:]|[<>]/
			},
			alias: 'url'
		},
		'bold': {
			// **strong**
			// __strong__
	
			// Allow only one line break
			pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
			lookbehind: true,
			inside: {
				'punctuation': /^\*\*|^__|\*\*$|__$/
			}
		},
		'italic': {
			// *em*
			// _em_
	
			// Allow only one line break
			pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
			lookbehind: true,
			inside: {
				'punctuation': /^[*_]|[*_]$/
			}
		},
		'url': {
			// [example](http://example.com "Optional title")
			// [example] [id]
			pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
			inside: {
				'variable': {
					pattern: /(!?\[)[^\]]+(?=\]$)/,
					lookbehind: true
				},
				'string': {
					pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
				}
			}
		}
	});
	
	Prism.languages.markdown['bold'].inside['url'] = Prism.util.clone(Prism.languages.markdown['url']);
	Prism.languages.markdown['italic'].inside['url'] = Prism.util.clone(Prism.languages.markdown['url']);
	Prism.languages.markdown['bold'].inside['italic'] = Prism.util.clone(Prism.languages.markdown['italic']);
	Prism.languages.markdown['italic'].inside['bold'] = Prism.util.clone(Prism.languages.markdown['bold']);

/***/ }),
/* 151 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 159 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 160 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 161 */,
/* 162 */
/***/ (function(module, exports) {

	module.exports = "<div tabindex=\"1\" class=\"mditor {{split?'split':''}} {{preview?'preview':''}} {{fullscreen?'fullscreen':''}}\" style=\"width:{{width}};height:{{height}}\">\n  <div class=\"head\" m:on:dblclick=\"onHeadDblClick\">\n    <m:toolbar m:id=\"toolbar\" m:prop:mditor=\"self\"></m:toolbar>\n  </div>\n  <div class=\"body\">\n    <m:editor m:id=\"editor\" m:prop:mditor=\"self\" m:model:value=\"value\" m:on:scroll=\"syncScroll\" m:on:changed=\"onChanged\" m:on:input=\"onInput\" m:on:paste=\"onPaste\"></m:editor>\n    <m:viewer m:id=\"viewer\" m:prop:mditor=\"self\" m:model:value=\"value\"></m:viewer>\n    <m:finder m:id=\"finder\" m:prop:mditor=\"self\"></m:viewer>\n  </div>\n</div>"

/***/ })
/******/ ]);
//# sourceMappingURL=mditor.js.map