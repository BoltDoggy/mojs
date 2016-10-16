'use strict';

var Helpers = function () {
  Helpers.prototype.NS = 'http://www.w3.org/2000/svg';

  Helpers.prototype.logBadgeCss = 'background:#3A0839;color:#FF512F;border-radius:5px; padding: 1px 5px 2px; border: 1px solid #FF512F;';

  Helpers.prototype.shortColors = {
    transparent: 'rgba(0,0,0,0)',
    none: 'rgba(0,0,0,0)',
    aqua: 'rgb(0,255,255)',
    black: 'rgb(0,0,0)',
    blue: 'rgb(0,0,255)',
    fuchsia: 'rgb(255,0,255)',
    gray: 'rgb(128,128,128)',
    green: 'rgb(0,128,0)',
    lime: 'rgb(0,255,0)',
    maroon: 'rgb(128,0,0)',
    navy: 'rgb(0,0,128)',
    olive: 'rgb(128,128,0)',
    purple: 'rgb(128,0,128)',
    red: 'rgb(255,0,0)',
    silver: 'rgb(192,192,192)',
    teal: 'rgb(0,128,128)',
    white: 'rgb(255,255,255)',
    yellow: 'rgb(255,255,0)',
    orange: 'rgb(255,128,0)'
  };

  Helpers.prototype.chainOptionMap = {};

  Helpers.prototype.callbacksMap = {
    onRefresh: 1,
    onStart: 1,
    onComplete: 1,
    onFirstUpdate: 1,
    onUpdate: 1,
    onProgress: 1,
    onRepeatStart: 1,
    onRepeatComplete: 1,
    onPlaybackStart: 1,
    onPlaybackPause: 1,
    onPlaybackStop: 1,
    onPlaybackComplete: 1
  };

  Helpers.prototype.tweenOptionMap = {
    duration: 1,
    delay: 1,
    speed: 1,
    repeat: 1,
    easing: 1,
    backwardEasing: 1,
    isYoyo: 1,
    shiftTime: 1,
    isReversed: 1,
    callbacksContext: 1
  };

  Helpers.prototype.unitOptionMap = {
    left: 1,
    top: 1,
    x: 1,
    y: 1,
    rx: 1,
    ry: 1
  };

  Helpers.prototype.RAD_TO_DEG = 180 / Math.PI;

  function Helpers() {
    this.vars();
  }

  Helpers.prototype.vars = function () {
    var ua;
    this.prefix = this.getPrefix();
    this.getRemBase();
    this.isFF = this.prefix.lowercase === 'moz';
    this.isIE = this.prefix.lowercase === 'ms';
    ua = navigator.userAgent;
    this.isOldOpera = ua.match(/presto/gim);
    this.isSafari = ua.indexOf('Safari') > -1;
    this.isChrome = ua.indexOf('Chrome') > -1;
    this.isOpera = ua.toLowerCase().indexOf("op") > -1;
    this.isChrome && this.isSafari && (this.isSafari = false);
    ua.match(/PhantomJS/gim) && (this.isSafari = false);
    this.isChrome && this.isOpera && (this.isChrome = false);
    this.is3d = this.checkIf3d();
    this.uniqIDs = -1;
    this.div = document.createElement('div');
    document.body.appendChild(this.div);
    return this.defaultStyles = this.computedStyle(this.div);
  };

  Helpers.prototype.cloneObj = function (obj, exclude) {
    var i, key, keys, newObj;
    keys = Object.keys(obj);
    newObj = {};
    i = keys.length;
    while (i--) {
      key = keys[i];
      if (exclude != null) {
        if (!exclude[key]) {
          newObj[key] = obj[key];
        }
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  };

  Helpers.prototype.extend = function (objTo, objFrom) {
    var key, value;
    for (key in objFrom) {
      value = objFrom[key];
      if (objTo[key] == null) {
        objTo[key] = objFrom[key];
      }
    }
    return objTo;
  };

  Helpers.prototype.getRemBase = function () {
    var html, style;
    html = document.querySelector('html');
    style = getComputedStyle(html);
    return this.remBase = parseFloat(style.fontSize);
  };

  Helpers.prototype.clamp = function (value, min, max) {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  };

  Helpers.prototype.setPrefixedStyle = function (el, name, value) {
    name === 'transform' && (el.style["" + this.prefix.css + name] = value);
    return el.style[name] = value;
  };

  Helpers.prototype.style = function (el, name, value) {
    var key, keys, len, results;
    if ((typeof name === 'undefined' ? 'undefined' : babelHelpers.typeof(name)) === 'object') {
      keys = Object.keys(name);
      len = keys.length;
      results = [];
      while (len--) {
        key = keys[len];
        value = name[key];
        results.push(this.setPrefixedStyle(el, key, value));
      }
      return results;
    } else {
      return this.setPrefixedStyle(el, name, value);
    }
  };

  Helpers.prototype.prepareForLog = function (args) {
    args = Array.prototype.slice.apply(args);
    args.unshift('::');
    args.unshift(this.logBadgeCss);
    args.unshift('%cmo·js%c');
    return args;
  };

  Helpers.prototype.log = function () {
    if (mojs.isDebug === false) {
      return;
    }
    return console.log.apply(console, this.prepareForLog(arguments));
  };

  Helpers.prototype.warn = function () {
    if (mojs.isDebug === false) {
      return;
    }
    return console.warn.apply(console, this.prepareForLog(arguments));
  };

  Helpers.prototype.error = function () {
    if (mojs.isDebug === false) {
      return;
    }
    return console.error.apply(console, this.prepareForLog(arguments));
  };

  Helpers.prototype.parseUnit = function (value) {
    var amount, isStrict, ref, regex, returnVal, unit;
    if (typeof value === 'number') {
      return returnVal = {
        unit: 'px',
        isStrict: false,
        value: value,
        string: value === 0 ? "" + value : value + "px"
      };
    } else if (typeof value === 'string') {
      regex = /px|%|rem|em|ex|cm|ch|mm|in|pt|pc|vh|vw|vmin|deg/gim;
      unit = (ref = value.match(regex)) != null ? ref[0] : void 0;
      isStrict = true;
      if (!unit) {
        unit = 'px';
        isStrict = false;
      }
      amount = parseFloat(value);
      return returnVal = {
        unit: unit,
        isStrict: isStrict,
        value: amount,
        string: amount === 0 ? "" + amount : "" + amount + unit
      };
    }
    return value;
  };

  Helpers.prototype.bind = function (func, context) {
    var bindArgs, wrapper;
    wrapper = function wrapper() {
      var args, unshiftArgs;
      args = Array.prototype.slice.call(arguments);
      unshiftArgs = bindArgs.concat(args);
      return func.apply(context, unshiftArgs);
    };
    bindArgs = Array.prototype.slice.call(arguments, 2);
    return wrapper;
  };

  Helpers.prototype.getRadialPoint = function (o) {
    var point, radAngle, radiusX, radiusY;
    if (o == null) {
      o = {};
    }
    radAngle = (o.angle - 90) * 0.017453292519943295;
    radiusX = o.radiusX != null ? o.radiusX : o.radius;
    radiusY = o.radiusY != null ? o.radiusY : o.radius;
    return point = {
      x: o.center.x + Math.cos(radAngle) * radiusX,
      y: o.center.y + Math.sin(radAngle) * radiusY
    };
  };

  Helpers.prototype.getPrefix = function () {
    var dom, pre, styles, v;
    styles = window.getComputedStyle(document.documentElement, "");
    v = Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/);
    pre = (v || styles.OLink === "" && ["", "o"])[1];
    dom = "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: "-" + pre + "-",
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  };

  Helpers.prototype.strToArr = function (string) {
    var arr;
    arr = [];
    if (typeof string === 'number' && !isNaN(string)) {
      arr.push(this.parseUnit(string));
      return arr;
    }
    string.trim().split(/\s+/gim).forEach(function (_this) {
      return function (str) {
        return arr.push(_this.parseUnit(_this.parseIfRand(str)));
      };
    }(this));
    return arr;
  };

  Helpers.prototype.calcArrDelta = function (arr1, arr2) {
    var delta, i, j, len1, num;
    delta = [];
    for (i = j = 0, len1 = arr1.length; j < len1; i = ++j) {
      num = arr1[i];
      delta[i] = this.parseUnit("" + (arr2[i].value - arr1[i].value) + arr2[i].unit);
    }
    return delta;
  };

  Helpers.prototype.isArray = function (variable) {
    return variable instanceof Array;
  };

  Helpers.prototype.normDashArrays = function (arr1, arr2) {
    var arr1Len, arr2Len, currItem, i, j, k, lenDiff, ref, ref1, startI;
    arr1Len = arr1.length;
    arr2Len = arr2.length;
    if (arr1Len > arr2Len) {
      lenDiff = arr1Len - arr2Len;
      startI = arr2.length;
      for (i = j = 0, ref = lenDiff; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        currItem = i + startI;
        arr2.push(this.parseUnit("0" + arr1[currItem].unit));
      }
    } else if (arr2Len > arr1Len) {
      lenDiff = arr2Len - arr1Len;
      startI = arr1.length;
      for (i = k = 0, ref1 = lenDiff; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        currItem = i + startI;
        arr1.push(this.parseUnit("0" + arr2[currItem].unit));
      }
    }
    return [arr1, arr2];
  };

  Helpers.prototype.makeColorObj = function (color) {
    var alpha, b, colorObj, g, isRgb, r, regexString1, regexString2, result, rgbColor;
    if (color[0] === '#') {
      result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(color);
      colorObj = {};
      if (result) {
        r = result[1].length === 2 ? result[1] : result[1] + result[1];
        g = result[2].length === 2 ? result[2] : result[2] + result[2];
        b = result[3].length === 2 ? result[3] : result[3] + result[3];
        colorObj = {
          r: parseInt(r, 16),
          g: parseInt(g, 16),
          b: parseInt(b, 16),
          a: 1
        };
      }
    }
    if (color[0] !== '#') {
      isRgb = color[0] === 'r' && color[1] === 'g' && color[2] === 'b';
      if (isRgb) {
        rgbColor = color;
      }
      if (!isRgb) {
        rgbColor = !this.shortColors[color] ? (this.div.style.color = color, this.computedStyle(this.div).color) : this.shortColors[color];
      }
      regexString1 = '^rgba?\\((\\d{1,3}),\\s?(\\d{1,3}),';
      regexString2 = '\\s?(\\d{1,3}),?\\s?(\\d{1}|0?\\.\\d{1,})?\\)$';
      result = new RegExp(regexString1 + regexString2, 'gi').exec(rgbColor);
      colorObj = {};
      alpha = parseFloat(result[4] || 1);
      if (result) {
        colorObj = {
          r: parseInt(result[1], 10),
          g: parseInt(result[2], 10),
          b: parseInt(result[3], 10),
          a: alpha != null && !isNaN(alpha) ? alpha : 1
        };
      }
    }
    return colorObj;
  };

  Helpers.prototype.computedStyle = function (el) {
    return getComputedStyle(el);
  };

  Helpers.prototype.capitalize = function (str) {
    if (typeof str !== 'string') {
      throw Error('String expected - nothing to capitalize');
    }
    return str.charAt(0).toUpperCase() + str.substring(1);
  };

  Helpers.prototype.parseRand = function (string) {
    var rand, randArr, units;
    randArr = string.split(/rand\(|\,|\)/);
    units = this.parseUnit(randArr[2]);
    rand = this.rand(parseFloat(randArr[1]), parseFloat(randArr[2]));
    if (units.unit && randArr[2].match(units.unit)) {
      return rand + units.unit;
    } else {
      return rand;
    }
  };

  Helpers.prototype.parseStagger = function (string, index) {
    var base, number, splittedValue, unit, unitValue, value;
    value = string.split(/stagger\(|\)$/)[1].toLowerCase();
    splittedValue = value.split(/(rand\(.*?\)|[^\(,\s]+)(?=\s*,|\s*$)/gim);
    value = splittedValue.length > 3 ? (base = this.parseUnit(this.parseIfRand(splittedValue[1])), splittedValue[3]) : (base = this.parseUnit(0), splittedValue[1]);
    value = this.parseIfRand(value);
    unitValue = this.parseUnit(value);
    number = index * unitValue.value + base.value;
    unit = base.isStrict ? base.unit : unitValue.isStrict ? unitValue.unit : '';
    if (unit) {
      return "" + number + unit;
    } else {
      return number;
    }
  };

  Helpers.prototype.parseIfStagger = function (value, i) {
    if (!(typeof value === 'string' && value.match(/stagger/g))) {
      return value;
    } else {
      return this.parseStagger(value, i);
    }
  };

  Helpers.prototype.parseIfRand = function (str) {
    if (typeof str === 'string' && str.match(/rand\(/)) {
      return this.parseRand(str);
    } else {
      return str;
    }
  };

  Helpers.prototype.parseDelta = function (key, value, index) {
    var curve, delta, easing, end, endArr, endColorObj, i, j, len1, start, startArr, startColorObj;
    value = this.cloneObj(value);
    easing = value.easing;
    if (easing != null) {
      easing = mojs.easing.parseEasing(easing);
    }
    delete value.easing;
    curve = value.curve;
    if (curve != null) {
      curve = mojs.easing.parseEasing(curve);
    }
    delete value.curve;
    start = Object.keys(value)[0];
    end = value[start];
    delta = {
      start: start
    };
    if (isNaN(parseFloat(start)) && !start.match(/rand\(/) && !start.match(/stagger\(/)) {
      if (key === 'strokeLinecap') {
        this.warn("Sorry, stroke-linecap property is not animatable yet, using the start(" + start + ") value instead", value);
        return delta;
      }
      startColorObj = this.makeColorObj(start);
      endColorObj = this.makeColorObj(end);
      delta = {
        type: 'color',
        name: key,
        start: startColorObj,
        end: endColorObj,
        easing: easing,
        curve: curve,
        delta: {
          r: endColorObj.r - startColorObj.r,
          g: endColorObj.g - startColorObj.g,
          b: endColorObj.b - startColorObj.b,
          a: endColorObj.a - startColorObj.a
        }
      };
    } else if (key === 'strokeDasharray' || key === 'strokeDashoffset' || key === 'origin') {
      startArr = this.strToArr(start);
      endArr = this.strToArr(end);
      this.normDashArrays(startArr, endArr);
      for (i = j = 0, len1 = startArr.length; j < len1; i = ++j) {
        start = startArr[i];
        end = endArr[i];
        this.mergeUnits(start, end, key);
      }
      delta = {
        type: 'array',
        name: key,
        start: startArr,
        end: endArr,
        delta: this.calcArrDelta(startArr, endArr),
        easing: easing,
        curve: curve
      };
    } else {
      if (!this.callbacksMap[key] && !this.tweenOptionMap[key]) {
        if (this.unitOptionMap[key]) {
          end = this.parseUnit(this.parseStringOption(end, index));
          start = this.parseUnit(this.parseStringOption(start, index));
          this.mergeUnits(start, end, key);
          delta = {
            type: 'unit',
            name: key,
            start: start,
            end: end,
            delta: end.value - start.value,
            easing: easing,
            curve: curve
          };
        } else {
          end = parseFloat(this.parseStringOption(end, index));
          start = parseFloat(this.parseStringOption(start, index));
          delta = {
            type: 'number',
            name: key,
            start: start,
            end: end,
            delta: end - start,
            easing: easing,
            curve: curve
          };
        }
      }
    }
    return delta;
  };

  Helpers.prototype.mergeUnits = function (start, end, key) {
    if (!end.isStrict && start.isStrict) {
      end.unit = start.unit;
      return end.string = "" + end.value + end.unit;
    } else if (end.isStrict && !start.isStrict) {
      start.unit = end.unit;
      return start.string = "" + start.value + start.unit;
    } else if (end.isStrict && start.isStrict) {
      if (end.unit !== start.unit) {
        start.unit = end.unit;
        start.string = "" + start.value + start.unit;
        return this.warn("Two different units were specified on \"" + key + "\" delta property, mo · js will fallback to end \"" + end.unit + "\" unit ");
      }
    }
  };

  Helpers.prototype.rand = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  Helpers.prototype.isDOM = function (o) {
    var isNode;
    if (o == null) {
      return false;
    }
    isNode = typeof o.nodeType === 'number' && typeof o.nodeName === 'string';
    return (typeof o === 'undefined' ? 'undefined' : babelHelpers.typeof(o)) === 'object' && isNode;
  };

  Helpers.prototype.getChildElements = function (element) {
    var childNodes, children, i;
    childNodes = element.childNodes;
    children = [];
    i = childNodes.length;
    while (i--) {
      if (childNodes[i].nodeType === 1) {
        children.unshift(childNodes[i]);
      }
    }
    return children;
  };

  Helpers.prototype.delta = function (start, end) {
    var isType1, isType2, obj, type1, type2;
    type1 = typeof start === 'undefined' ? 'undefined' : babelHelpers.typeof(start);
    type2 = typeof end === 'undefined' ? 'undefined' : babelHelpers.typeof(end);
    isType1 = type1 === 'string' || type1 === 'number' && !isNaN(start);
    isType2 = type2 === 'string' || type2 === 'number' && !isNaN(end);
    if (!isType1 || !isType2) {
      this.error("delta method expects Strings or Numbers at input but got - " + start + ", " + end);
      return;
    }
    obj = {};
    obj[start] = end;
    return obj;
  };

  Helpers.prototype.getUniqID = function () {
    return ++this.uniqIDs;
  };

  Helpers.prototype.parsePath = function (path) {
    var domPath;
    if (typeof path === 'string') {
      if (path.charAt(0).toLowerCase() === 'm') {
        domPath = document.createElementNS(this.NS, 'path');
        domPath.setAttributeNS(null, 'd', path);
        return domPath;
      } else {
        return document.querySelector(path);
      }
    }
    if (path.style) {
      return path;
    }
  };

  Helpers.prototype.closeEnough = function (num1, num2, eps) {
    return Math.abs(num1 - num2) < eps;
  };

  Helpers.prototype.checkIf3d = function () {
    var div, prefixed, style, tr;
    div = document.createElement('div');
    this.style(div, 'transform', 'translateZ(0)');
    style = div.style;
    prefixed = this.prefix.css + "transform";
    tr = style[prefixed] != null ? style[prefixed] : style.transform;
    return tr !== '';
  };

  /*
    Method to check if variable holds pointer to an object.
    @param {Any} Variable to test
    @returns {Boolean} If variable is object.
   */

  Helpers.prototype.isObject = function (variable) {
    return variable !== null && (typeof variable === 'undefined' ? 'undefined' : babelHelpers.typeof(variable)) === 'object';
  };

  /*
    Method to get first value of the object.
    Used to get end value on ∆s.
    @param {Object} Object to get the value of.
    @returns {Any} The value of the first object' property.
   */

  Helpers.prototype.getDeltaEnd = function (obj) {
    var key;
    key = Object.keys(obj)[0];
    return obj[key];
  };

  /*
    Method to get first key of the object.
    Used to get start value on ∆s.
    @param {Object} Object to get the value of.
    @returns {String} The key of the first object' property.
   */

  Helpers.prototype.getDeltaStart = function (obj) {
    var key;
    key = Object.keys(obj)[0];
    return key;
  };

  /*
    Method to check if propery exists in callbacksMap or tweenOptionMap.
    @param {String} Property name to check for
    @returns {Boolean} If property is tween property.
   */

  Helpers.prototype.isTweenProp = function (keyName) {
    return this.tweenOptionMap[keyName] || this.callbacksMap[keyName];
  };

  /*
    Method to parse string property value
    which can include both `rand` and `stagger `
    value in various positions.
    @param {String} Property name to check for.
    @param {Number} Optional index for stagger.
    @returns {Number} Parsed option value.
   */

  Helpers.prototype.parseStringOption = function (value, index) {
    if (index == null) {
      index = 0;
    }
    if (typeof value === 'string') {
      value = this.parseIfStagger(value, index);
      value = this.parseIfRand(value);
    }
    return value;
  };

  /*
    Method to get the last item of array.
    @private
    @param {Array} Array to get the last item in.
    @returns {Any} The last item of array.
   */

  Helpers.prototype.getLastItem = function (arr) {
    return arr[arr.length - 1];
  };

  /*
    Method parse HTMLElement.
    @private
    @param {String, Object} Selector string or HTMLElement.
    @returns {Object} HTMLElement.
   */

  Helpers.prototype.parseEl = function (el) {
    if (h.isDOM(el)) {
      return el;
    } else if (typeof el === 'string') {
      el = document.querySelector(el);
    }
    if (el === null) {
      h.error("Can't parse HTML element: ", el);
    }
    return el;
  };

  /*
    Method force compositor layer on HTMLElement.
    @private
    @param {Object} HTMLElement.
    @returns {Object} HTMLElement.
   */

  Helpers.prototype.force3d = function (el) {
    this.setPrefixedStyle(el, 'backface-visibility', 'hidden');
    return el;
  };

  /*
    Method to check if value is delta.
    @private
    @param {Any} Property to check.
    @returns {Boolean} If value is delta.
   */

  Helpers.prototype.isDelta = function (optionsValue) {
    var isObject;
    isObject = this.isObject(optionsValue);
    isObject = isObject && !optionsValue.unit;
    return !(!isObject || this.isArray(optionsValue) || this.isDOM(optionsValue));
  };

  return Helpers;
}();

var h = new Helpers();

/*
  Base class for module. Extends and parses defaults.
*/

var Module = function () {
  function Module() {
    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    babelHelpers.classCallCheck(this, Module);

    // this._isIt = o.isIt;
    // delete o.isIt;
    this._o = o;
    this._index = this._o.index || 0;
    // map of props that should be
    // parsed to arrays of values
    this._arrayPropertyMap = {
      strokeDashoffset: 1,
      strokeDasharray: 1,
      origin: 1
    };

    this._skipPropsDelta = {
      timeline: 1,
      prevChainModule: 1,
      callbacksContext: 1
    };

    this._declareDefaults();
    this._extendDefaults();

    this._vars();
    this._render();
  }
  /*
    Method to declare defaults.
    @private
  */


  babelHelpers.createClass(Module, [{
    key: '_declareDefaults',
    value: function _declareDefaults() {
      this._defaults = {};
    }
    /*
      Method to declare module's variables.
      @private
    */

  }, {
    key: '_vars',
    value: function _vars() {
      this._progress = 0;
      this._strokeDasharrayBuffer = [];
    }
    /*
      Method to render on initialization.
      @private
    */

  }, {
    key: '_render',
    value: function _render() {}
    /*
      Method to set property on the module.
      @private
      @param {String, Object} Name of the property to set
                              or object with properties to set.
      @param {Any} Value for the property to set. Could be
                    undefined if the first param is object.
    */

  }, {
    key: '_setProp',
    value: function _setProp(attr, value) {
      if ((typeof attr === 'undefined' ? 'undefined' : babelHelpers.typeof(attr)) === 'object') {
        for (var key in attr) {
          this._assignProp(key, attr[key]);
        }
      } else {
        this._assignProp(attr, value);
      }
    }
    /*
      Method to assign single property's value.
      @private
      @param {String} Property name.
      @param {Any}    Property value.
    */

  }, {
    key: '_assignProp',
    value: function _assignProp(key, value) {
      this._props[key] = value;
    }
    /*
      Method to show element.
      @private
    */

  }, {
    key: '_show',
    value: function _show() {
      var p = this._props;
      if (!this.el) {
        return;
      }

      if (p.isSoftHide) {
        // this.el.style.opacity = p.opacity;
        this._showByTransform();
      } else {
        this.el.style.display = 'block';
      }

      this._isShown = true;
    }
    /*
      Method to hide element.
      @private
    */

  }, {
    key: '_hide',
    value: function _hide() {
      if (!this.el) {
        return;
      }

      if (this._props.isSoftHide) {
        // this.el.style.opacity = 0;
        h.setPrefixedStyle(this.el, 'transform', 'scale(0)');
      } else {
        this.el.style.display = 'none';
      }

      this._isShown = false;
    }
    /*
      Method to show element by applying transform back to normal.
      @private
    */

  }, {
    key: '_showByTransform',
    value: function _showByTransform() {}
    /*
      Method to parse option string.
      Searches for stagger and rand values and parses them.
      Leaves the value unattended otherwise.
      @param {Any} Option value to parse.
      @returns {Number} Parsed options value.
    */

  }, {
    key: '_parseOptionString',
    value: function _parseOptionString(value) {
      if (typeof value === 'string') {
        if (value.match(/stagger/)) {
          value = h.parseStagger(value, this._index);
        }
      }
      if (typeof value === 'string') {
        if (value.match(/rand/)) {
          value = h.parseRand(value);
        }
      }
      return value;
    }
    /*
      Method to parse postion option.
      @param {String} Property name.
      @param {Any} Property Value.
      @returns {String} Parsed options value.
    */

  }, {
    key: '_parsePositionOption',
    value: function _parsePositionOption(key, value) {
      if (h.unitOptionMap[key]) {
        value = h.parseUnit(value).string;
      }
      return value;
    }
    /*
      Method to parse strokeDash.. option.
      @param {String} Property name.
      @param {Any}    Property value.
      @returns {String} Parsed options value.
    */

  }, {
    key: '_parseStrokeDashOption',
    value: function _parseStrokeDashOption(key, value) {
      var result = value;
      // parse numeric/percent values for strokeDash.. properties
      if (this._arrayPropertyMap[key]) {
        var result = [];
        switch (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) {
          case 'number':
            result.push(h.parseUnit(value));
            break;
          case 'string':
            var array = value.split(' ');
            for (var i = 0; i < array.length; i++) {
              result.push(h.parseUnit(array[i]));
            }
            break;
        }
      }
      return result;
    }
    /*
      Method to check if the property is delta property.
      @private
      @param {Any} Parameter value to check.
      @returns {Boolean}
    */

  }, {
    key: '_isDelta',
    value: function _isDelta(optionsValue) {
      var isObject = h.isObject(optionsValue);
      isObject = isObject && !optionsValue.unit;
      return !(!isObject || h.isArray(optionsValue) || h.isDOM(optionsValue));
    }
    /*
      Method to get delta from property and set
      the property's start value to the props object.
      @private
      @param {String} Key name to get delta for.
      @param {Object} Option value to get the delta for.
    */

  }, {
    key: '_getDelta',
    value: function _getDelta(key, optionsValue) {
      var delta;
      if ((key === 'left' || key === 'top') && !this._o.ctx) {
        h.warn('Consider to animate x/y properties instead of left/top,\n        as it would be much more performant', optionsValue);
      }
      // skip delta calculation for a property if it is listed
      // in skipPropsDelta object
      if (this._skipPropsDelta && this._skipPropsDelta[key]) {
        return;
      }
      // get delta
      delta = h.parseDelta(key, optionsValue, this._index);
      // if successfully parsed - save it
      if (delta.type != null) {
        this._deltas[key] = delta;
      }

      var deltaEnd = babelHelpers.typeof(delta.end) === 'object' ? delta.end.value === 0 ? 0 : delta.end.string : delta.end;
      // set props to end value of the delta
      // 0 should be 0 regardless units
      this._props[key] = deltaEnd;
    }
    /*
      Method to copy `_o` options to `_props` object
      with fallback to `_defaults`.
      @private
    */

  }, {
    key: '_extendDefaults',
    value: function _extendDefaults() {
      this._props = {};
      this._deltas = {};
      for (var key in this._defaults) {
        // skip property if it is listed in _skipProps
        // if (this._skipProps && this._skipProps[key]) { continue; }
        // copy the properties to the _o object
        var value = this._o[key] != null ? this._o[key] : this._defaults[key];
        // parse option
        this._parseOption(key, value);
      }
    }
    /*
      Method to tune new oprions to _o and _props object.
      @private
      @param {Object} Options object to tune to.
    */

  }, {
    key: '_tuneNewOptions',
    value: function _tuneNewOptions(o) {
      // hide the module before tuning it's options
      // cuz the user could see the change
      this._hide();
      for (var key in o) {
        // skip property if it is listed in _skipProps
        // if (this._skipProps && this._skipProps[key]) { continue; }
        // copy the properties to the _o object
        // delete the key from deltas
        o && delete this._deltas[key];
        // rewrite _o record
        this._o[key] = o[key];
        // save the options to _props
        this._parseOption(key, o[key]);
      }
    }
    /*
      Method to parse option value.
      @private
      @param {String} Option name.
      @param {Any} Option value.
    */

  }, {
    key: '_parseOption',
    value: function _parseOption(name, value) {
      // if delta property
      if (this._isDelta(value) && !this._skipPropsDelta[name]) {
        this._getDelta(name, value);
        var deltaEnd = h.getDeltaEnd(value);
        return this._assignProp(name, this._parseProperty(name, deltaEnd));
      }

      this._assignProp(name, this._parseProperty(name, value));
    }
    /*
      Method to parse postion and string props.
      @private
      @param {String} Property name.
      @param {Any}    Property value.
      @returns {Any}  Parsed property value.
    */

  }, {
    key: '_parsePreArrayProperty',
    value: function _parsePreArrayProperty(name, value) {
      // parse stagger and rand values
      value = this._parseOptionString(value);
      // parse units for position properties
      return this._parsePositionOption(name, value);
    }
    /*
      Method to parse property value.
      @private
      @param {String} Property name.
      @param {Any}    Property value.
      @returns {Any}  Parsed property value.
    */

  }, {
    key: '_parseProperty',
    value: function _parseProperty(name, value) {
      // parse `HTML` element in `parent` option
      if (name === 'parent') {
        return h.parseEl(value);
      }
      // parse `stagger`, `rand` and `position`
      value = this._parsePreArrayProperty(name, value);
      // parse numeric/percent values for strokeDash.. properties
      return this._parseStrokeDashOption(name, value);
    }
    /*
      Method to parse values inside ∆.
      @private
      @param {String} Key name.
      @param {Object} Delta.
      @returns {Object} Delta with parsed parameters.
    */

  }, {
    key: '_parseDeltaValues',
    value: function _parseDeltaValues(name, delta) {
      // return h.parseDelta( name, delta, this._index );

      var d = {};
      for (var key in delta) {
        var value = delta[key];

        // delete delta[key];
        // add parsed properties
        var newEnd = this._parsePreArrayProperty(name, value);
        d[this._parsePreArrayProperty(name, key)] = newEnd;
      }
      return d;
    }
    /*
      Method to parse delta and nondelta properties.
      @private
      @param {String} Property name.
      @param {Any}    Property value.
      @returns {Any}  Parsed property value.
    */

  }, {
    key: '_preparsePropValue',
    value: function _preparsePropValue(key, value) {
      return this._isDelta(value) ? this._parseDeltaValues(key, value) : this._parsePreArrayProperty(key, value);
    }
    /*
      Method to calculate current progress of the deltas.
      @private
      @param {Number} Eased progress to calculate - [0..1].
      @param {Number} Progress to calculate - [0..1].
    */

  }, {
    key: '_calcCurrentProps',
    value: function _calcCurrentProps(easedProgress, p) {

      for (var key in this._deltas) {

        var value = this._deltas[key];

        // get eased progress from delta easing if defined and not curve
        var isCurve = !!value.curve;
        var ep = value.easing != null && !isCurve ? value.easing(p) : easedProgress;

        if (value.type === 'array') {
          var arr;
          // if prop property is array - reuse it else - create an array
          if (h.isArray(this._props[key])) {
            arr = this._props[key];
            arr.length = 0;
          } else {
            arr = [];
          }

          // just optimization to prevent curve
          // calculations on every array item
          var proc = isCurve ? value.curve(p) : null;

          for (var i = 0; i < value.delta.length; i++) {
            var item = value.delta[i],
                dash = !isCurve ? value.start[i].value + ep * item.value : proc * (value.start[i].value + p * item.value);
            arr.push({
              string: '' + dash + item.unit,
              value: dash,
              unit: item.unit
            });
          }

          this._props[key] = arr;
        } else if (value.type === 'number') {
          this._props[key] = !isCurve ? value.start + ep * value.delta : value.curve(p) * (value.start + p * value.delta);
        } else if (value.type === 'unit') {
          var currentValue = !isCurve ? value.start.value + ep * value.delta : value.curve(p) * (value.start.value + p * value.delta);

          this._props[key] = '' + currentValue + value.end.unit;
        } else if (value.type === 'color') {
          var r, g, b, a;
          if (!isCurve) {
            r = parseInt(value.start.r + ep * value.delta.r, 10);
            g = parseInt(value.start.g + ep * value.delta.g, 10);
            b = parseInt(value.start.b + ep * value.delta.b, 10);
            a = parseFloat(value.start.a + ep * value.delta.a);
          } else {
            var cp = value.curve(p);
            r = parseInt(cp * (value.start.r + p * value.delta.r), 10);
            g = parseInt(cp * (value.start.g + p * value.delta.g), 10);
            b = parseInt(cp * (value.start.b + p * value.delta.b), 10);
            a = parseFloat(cp * (value.start.a + p * value.delta.a));
          }
          this._props[key] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        }
      }
    }
    /*
      Method to calculate current progress and probably draw it in children.
      @private
      @param {Number} Eased progress to set - [0..1].
      @param {Number} Progress to set - [0..1].
    */

  }, {
    key: '_setProgress',
    value: function _setProgress(easedProgress, progress) {
      this._progress = easedProgress;
      this._calcCurrentProps(easedProgress, progress);
    }
  }]);
  return Module;
}();

var Bit = function (_Module) {
  babelHelpers.inherits(Bit, _Module);

  function Bit() {
    babelHelpers.classCallCheck(this, Bit);
    return babelHelpers.possibleConstructorReturn(this, (Bit.__proto__ || Object.getPrototypeOf(Bit)).apply(this, arguments));
  }

  babelHelpers.createClass(Bit, [{
    key: '_declareDefaults',

    /*
      Method to declare module's defaults.
      @private
    */
    value: function _declareDefaults() {
      this._defaults = {
        'ns': 'http://www.w3.org/2000/svg',
        'tag': 'ellipse',
        'parent': document.body,
        'ratio': 1,
        'radius': 50,
        'radiusX': null,
        'radiusY': null,
        'stroke': 'hotpink',
        'stroke-dasharray': '',
        'stroke-dashoffset': '',
        'stroke-linecap': '',
        'stroke-width': 2,
        'stroke-opacity': 1,
        'fill': 'transparent',
        'fill-opacity': 1,
        'width': 0,
        'height': 0
      };
      this._drawMap = ['stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'fill', 'stroke-dashoffset', 'stroke-linecap', 'fill-opacity', 'transform'];
    }
  }, {
    key: '_vars',
    value: function _vars() {
      this._state = {};
      this._drawMapLength = this._drawMap.length;
    }
    /*
      Method for initial render of the shape.
      @private
    */

  }, {
    key: '_render',
    value: function _render() {
      if (this._isRendered) {
        return;
      }
      // set `_isRendered` hatch
      this._isRendered = true;
      // create `SVG` canvas to draw in
      this._createSVGCanvas();
      // set canvas size
      this._setCanvasSize();
      // draw the initial state
      // this._draw();
      // append the canvas to the parent from props
      this._props.parent.appendChild(this._canvas);
    }
    /*
      Method to create `SVG` canvas to draw in.
      @private
    */

  }, {
    key: '_createSVGCanvas',
    value: function _createSVGCanvas() {
      var p = this._props;
      // create canvas - `svg` element to draw in
      this._canvas = document.createElementNS(p.ns, 'svg');
      // create the element shape element and add it to the canvas
      this.el = document.createElementNS(p.ns, p.tag);
      this._canvas.appendChild(this.el);
    }
    /*
      Method to set size of the _canvas.
      @private
    */

  }, {
    key: '_setCanvasSize',
    value: function _setCanvasSize() {
      var p = this._props,
          style = this._canvas.style;

      style.display = 'block';
      style.width = '100%';
      style.height = '100%';
      style.left = '0px';
      style.top = '0px';
    }
    /*
      Method to draw the shape.
      Called on every frame.
      @private
    */

  }, {
    key: '_draw',
    value: function _draw() {
      this._props.length = this._getLength();

      var state = this._state,
          props = this._props;

      var len = this._drawMapLength;
      while (len--) {
        var name = this._drawMap[len];
        switch (name) {
          case 'stroke-dasharray':
          case 'stroke-dashoffset':
            this.castStrokeDash(name);
        }
        this._setAttrIfChanged(name, this._props[name]);
      }
      this._state.radius = this._props.radius;
    }
  }, {
    key: 'castStrokeDash',
    value: function castStrokeDash(name) {
      // # if array of values
      var p = this._props;
      if (h.isArray(p[name])) {
        var stroke = '';
        for (var i = 0; i < p[name].length; i++) {
          var dash = p[name][i],
              cast = dash.unit === '%' ? this.castPercent(dash.value) : dash.value;
          stroke += cast + ' ';
        }
        p[name] = stroke === '0 ' ? stroke = '' : stroke;
        return p[name] = stroke;
      }
      // # if single value
      if (babelHelpers.typeof(p[name]) === 'object') {
        stroke = p[name].unit === '%' ? this.castPercent(p[name].value) : p[name].value;
        p[name] = stroke === 0 ? stroke = '' : stroke;
      }
    }
  }, {
    key: 'castPercent',
    value: function castPercent(percent) {
      return percent * (this._props.length / 100);
    }

    /*
      Method to set props to attributes and cache the values.
      @private
    */

  }, {
    key: '_setAttrIfChanged',
    value: function _setAttrIfChanged(name, value) {
      if (this._state[name] !== value) {
        // this.el.style[name] = value;
        this.el.setAttribute(name, value);
        this._state[name] = value;
      }
    }
    /*
      Method to length of the shape.
      @private
      @returns {Number} Length of the shape.
    */

  }, {
    key: '_getLength',
    value: function _getLength() {
      var p = this._props,
          len = 0,
          isGetLength = !!(this.el && this.el.getTotalLength);

      if (isGetLength && this.el.getAttribute('d')) {
        len = this.el.getTotalLength();
      } else {
        len = 2 * (p.radiusX != null ? p.radiusX : p.radius);
      }
      return len;
    }
    /*
      Method to calculate total sum between points.
      @private
      @param {Array} Array of points.
      @returns {Number} Distance bewtween all points.
    */

  }, {
    key: '_getPointsPerimiter',
    value: function _getPointsPerimiter(points) {
      var sum = 0;

      for (var i = 1; i < points.length; i++) {
        sum += this._pointsDelta(points[i - 1], points[i]);
      }

      sum += this._pointsDelta(points[0], h.getLastItem(points));
      return sum;
    }
    /*
      Method to get delta from two points.
      @private
      @param {Object} Point 1.
      @param {Object} Point 2.
      @returns {Number} Distance between the pooints.
    */

  }, {
    key: '_pointsDelta',
    value: function _pointsDelta(point1, point2) {
      var dx = Math.abs(point1.x - point2.x),
          dy = Math.abs(point1.y - point2.y);
      return Math.sqrt(dx * dx + dy * dy);
    }
    /*
      Method to set module's size.
      @private
      @param {Number} Module width.
      @param {Number} Module height.
    */

  }, {
    key: '_setSize',
    value: function _setSize(width, height) {
      var p = this._props;
      p.width = width;
      p.height = height;
      this._draw();
    }
  }]);
  return Bit;
}(Module);

var Custom = function (_Bit) {
  babelHelpers.inherits(Custom, _Bit);

  function Custom() {
    babelHelpers.classCallCheck(this, Custom);
    return babelHelpers.possibleConstructorReturn(this, (Custom.__proto__ || Object.getPrototypeOf(Custom)).apply(this, arguments));
  }

  babelHelpers.createClass(Custom, [{
    key: '_declareDefaults',

    /*
      Method to declare module's defaults.
      @private
      @overrides @ Bit
    */
    value: function _declareDefaults() {
      babelHelpers.get(Custom.prototype.__proto__ || Object.getPrototypeOf(Custom.prototype), '_declareDefaults', this).call(this);

      this._defaults.tag = 'path';
      this._defaults.parent = null;

      // remove `stroke-width` from `_drawMap`
      // because we need to recal strokeWidth size regarding scale
      for (var i = 0; i < this._drawMap.length; i++) {
        if (this._drawMap[i] === 'stroke-width') {
          this._drawMap.splice(i, 1);
        }
      }
    }
    /*
      Method to get shape to set on module's path.
      @public
      @returns {String} Empty string.
    */

  }, {
    key: 'getShape',
    value: function getShape() {
      return '';
    }
    /*
      Method to get shape perimeter length.
      @public
      @returns {Number} Default length string.
    */

  }, {
    key: 'getLength',
    value: function getLength() {
      return 100;
    }
    /*
      Method to draw the shape.
      Called on every frame.
      @private
      @overrides @ Bit
    */

  }, {
    key: '_draw',
    value: function _draw() {
      var p = this._props,
          state = this._state,
          radiusXChange = state['radiusX'] !== p.radiusX,
          radiusYChange = state['radiusY'] !== p.radiusY,
          radiusChange = state['radius'] !== p.radius;

      // update transform only if one of radiuses changed
      if (radiusXChange || radiusYChange || radiusChange) {
        this.el.setAttribute('transform', this._getScale());
        state['radiusX'] = p.radiusX;
        state['radiusY'] = p.radiusY;
        state['radius'] = p.radius;
      }

      this._setAttrIfChanged('stroke-width', p['stroke-width'] / p.maxScale);

      babelHelpers.get(Custom.prototype.__proto__ || Object.getPrototypeOf(Custom.prototype), '_draw', this).call(this);
    }
    /*
      Method for initial render of the shape.
      @private
      @overrides @ Bit
    */

  }, {
    key: '_render',
    value: function _render() {
      if (this._isRendered) {
        return;
      }
      this._isRendered = true;

      this._length = this.getLength();

      var p = this._props;
      p.parent.innerHTML = '<svg id="js-mojs-shape-canvas" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink"><g id="js-mojs-shape-el">' + this.getShape() + '</g></svg>';

      this._canvas = p.parent.querySelector('#js-mojs-shape-canvas');
      this.el = p.parent.querySelector('#js-mojs-shape-el');
      this._setCanvasSize();
    }
    /*
      Method to get scales for the shape.
      @private
      @mutates @props
    */

  }, {
    key: '_getScale',
    value: function _getScale() {
      var p = this._props,
          radiusX = p.radiusX ? p.radiusX : p.radius,
          radiusY = p.radiusY ? p.radiusY : p.radius;

      p.scaleX = 2 * radiusX / 100;
      p.scaleY = 2 * radiusY / 100;
      p.maxScale = Math.max(p.scaleX, p.scaleY);

      p.shiftX = p.width / 2 - 50 * p.scaleX;
      p.shiftY = p.height / 2 - 50 * p.scaleY;

      var translate = 'translate(' + p.shiftX + ', ' + p.shiftY + ')';
      return translate + ' scale(' + p.scaleX + ', ' + p.scaleY + ')';
    }
    /*
      Method to length of the shape.
      @private
      @returns {Number} Length of the shape.
    */

  }, {
    key: '_getLength',
    value: function _getLength() {
      return this._length;
    }
  }]);
  return Custom;
}(Bit);

var Circle;
var extend = function extend(child, parent) {
  for (var key in parent) {
    if (hasProp.call(parent, key)) child[key] = parent[key];
  }function ctor() {
    this.constructor = child;
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
};
var hasProp = {}.hasOwnProperty;
Circle = function (superClass) {
  extend(Circle, superClass);

  function Circle() {
    return Circle.__super__.constructor.apply(this, arguments);
  }

  Circle.prototype._declareDefaults = function () {
    Circle.__super__._declareDefaults.apply(this, arguments);
    return this._defaults.shape = 'ellipse';
  };

  Circle.prototype._draw = function () {
    var rx, ry;
    rx = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    ry = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    this._setAttrIfChanged('rx', rx);
    this._setAttrIfChanged('ry', ry);
    this._setAttrIfChanged('cx', this._props.width / 2);
    this._setAttrIfChanged('cy', this._props.height / 2);
    return Circle.__super__._draw.apply(this, arguments);
  };

  Circle.prototype._getLength = function () {
    var radiusX, radiusY;
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    return 2 * Math.PI * Math.sqrt((radiusX * radiusX + radiusY * radiusY) / 2);
  };

  return Circle;
}(Bit);

var Circle$1 = Circle;

var Line;
var extend$1 = function extend(child, parent) {
  for (var key in parent) {
    if (hasProp$1.call(parent, key)) child[key] = parent[key];
  }function ctor() {
    this.constructor = child;
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
};
var hasProp$1 = {}.hasOwnProperty;
Line = function (superClass) {
  extend$1(Line, superClass);

  function Line() {
    return Line.__super__.constructor.apply(this, arguments);
  }

  Line.prototype._declareDefaults = function () {
    Line.__super__._declareDefaults.apply(this, arguments);
    return this._defaults.tag = 'line';
  };

  Line.prototype._draw = function () {
    var radiusX, x, y;
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    x = this._props.width / 2;
    y = this._props.height / 2;
    this._setAttrIfChanged('x1', x - radiusX);
    this._setAttrIfChanged('x2', x + radiusX);
    this._setAttrIfChanged('y1', y);
    this._setAttrIfChanged('y2', y);
    return Line.__super__._draw.apply(this, arguments);
  };

  return Line;
}(Bit);

var Line$1 = Line;

var Zigzag;
var extend$2 = function extend(child, parent) {
  for (var key in parent) {
    if (hasProp$2.call(parent, key)) child[key] = parent[key];
  }function ctor() {
    this.constructor = child;
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
};
var hasProp$2 = {}.hasOwnProperty;
Zigzag = function (superClass) {
  extend$2(Zigzag, superClass);

  function Zigzag() {
    return Zigzag.__super__.constructor.apply(this, arguments);
  }

  Zigzag.prototype._declareDefaults = function () {
    Zigzag.__super__._declareDefaults.apply(this, arguments);
    this._defaults.tag = 'path';
    return this._defaults.points = 3;
  };

  Zigzag.prototype._draw = function () {
    var currentX, currentY, delta, i, isPoints, isRadiusX, isRadiusY, j, length, p, points, radiusX, radiusY, ref, stepX, x, y, yFlip;
    Zigzag.__super__._draw.apply(this, arguments);
    p = this._props;
    if (!this._props.points) {
      return;
    }
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    isRadiusX = radiusX === this._prevRadiusX;
    isRadiusY = radiusY === this._prevRadiusY;
    isPoints = p.points === this._prevPoints;
    if (isRadiusX && isRadiusY && isPoints) {
      return;
    }
    x = p.width / 2;
    y = p.height / 2;
    currentX = x - radiusX;
    currentY = y;
    stepX = 2 * radiusX / (p.points - 1);
    yFlip = -1;
    delta = Math.sqrt(stepX * stepX + radiusY * radiusY);
    length = -delta;
    points = "M" + currentX + ", " + y + " ";
    for (i = j = 0, ref = p.points; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      points += "L" + currentX + ", " + currentY + " ";
      currentX += stepX;
      length += delta;
      currentY = yFlip === -1 ? y - radiusY : y;
      yFlip = -yFlip;
    }
    this._length = length;
    this.el.setAttribute('d', points);
    this._prevPoints = p.points;
    this._prevRadiusX = radiusX;
    return this._prevRadiusY = radiusY;
  };

  Zigzag.prototype._getLength = function () {
    return this._length;
  };

  return Zigzag;
}(Bit);

var Zigzag$1 = Zigzag;

var Rect;
var extend$3 = function extend(child, parent) {
  for (var key in parent) {
    if (hasProp$3.call(parent, key)) child[key] = parent[key];
  }function ctor() {
    this.constructor = child;
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
};
var hasProp$3 = {}.hasOwnProperty;
Rect = function (superClass) {
  extend$3(Rect, superClass);

  function Rect() {
    return Rect.__super__.constructor.apply(this, arguments);
  }

  Rect.prototype._declareDefaults = function () {
    Rect.__super__._declareDefaults.apply(this, arguments);
    this._defaults.tag = 'rect';
    this._defaults.rx = 0;
    return this._defaults.ry = 0;
  };

  Rect.prototype._draw = function () {
    var p, radiusX, radiusY;
    Rect.__super__._draw.apply(this, arguments);
    p = this._props;
    radiusX = p.radiusX != null ? p.radiusX : p.radius;
    radiusY = p.radiusY != null ? p.radiusY : p.radius;
    this._setAttrIfChanged('width', 2 * radiusX);
    this._setAttrIfChanged('height', 2 * radiusY);
    this._setAttrIfChanged('x', p.width / 2 - radiusX);
    this._setAttrIfChanged('y', p.height / 2 - radiusY);
    this._setAttrIfChanged('rx', p.rx);
    return this._setAttrIfChanged('ry', p.ry);
  };

  Rect.prototype._getLength = function () {
    var radiusX, radiusY;
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    return 2 * (2 * radiusX + 2 * radiusY);
  };

  return Rect;
}(Bit);

var Rect$1 = Rect;

var Polygon;
var extend$4 = function extend(child, parent) {
	for (var key in parent) {
		if (hasProp$4.call(parent, key)) child[key] = parent[key];
	}function ctor() {
		this.constructor = child;
	}ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
};
var hasProp$4 = {}.hasOwnProperty;
Polygon = function (superClass) {
	extend$4(Polygon, superClass);

	function Polygon() {
		return Polygon.__super__.constructor.apply(this, arguments);
	}

	/*
   Method to declare defaults.
   @overrides @ Bit
  */

	Polygon.prototype._declareDefaults = function () {
		Polygon.__super__._declareDefaults.apply(this, arguments);
		this._defaults.tag = 'path';
		return this._defaults.points = 3;
	};

	/*
   Method to draw the shape.
   @overrides @ Bit
  */

	Polygon.prototype._draw = function () {
		var char, d, i, isPoints, isRadiusX, isRadiusY, j, k, len, p, point, radiusX, radiusY, ref, ref1, step;
		p = this._props;
		radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
		radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
		isRadiusX = radiusX === this._prevRadiusX;
		isRadiusY = radiusY === this._prevRadiusY;
		isPoints = p.points === this._prevPoints;
		if (!(isRadiusX && isRadiusY && isPoints)) {
			step = 360 / this._props.points;
			if (this._radialPoints == null) {
				this._radialPoints = [];
			} else {
				this._radialPoints.length = 0;
			}
			for (i = j = 0, ref = this._props.points; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
				this._radialPoints.push(h.getRadialPoint({
					radius: this._props.radius,
					radiusX: this._props.radiusX,
					radiusY: this._props.radiusY,
					angle: i * step,
					center: {
						x: p.width / 2,
						y: p.height / 2
					}
				}));
			}
			d = '';
			ref1 = this._radialPoints;
			for (i = k = 0, len = ref1.length; k < len; i = ++k) {
				point = ref1[i];
				char = i === 0 ? 'M' : 'L';
				d += "" + char + point.x.toFixed(4) + "," + point.y.toFixed(4) + " ";
			}
			this._prevPoints = p.points;
			this._prevRadiusX = radiusX;
			this._prevRadiusY = radiusY;
			this.el.setAttribute('d', d += 'z');
		}
		return Polygon.__super__._draw.apply(this, arguments);
	};

	/*
   Method to get length of the shape.
   @overrides @ Bit
  */

	Polygon.prototype._getLength = function () {
		return this._getPointsPerimiter(this._radialPoints);
	};

	return Polygon;
}(Bit);

var Polygon$1 = Polygon;

var Cross;
var extend$5 = function extend(child, parent) {
  for (var key in parent) {
    if (hasProp$5.call(parent, key)) child[key] = parent[key];
  }function ctor() {
    this.constructor = child;
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
};
var hasProp$5 = {}.hasOwnProperty;
Cross = function (superClass) {
  extend$5(Cross, superClass);

  function Cross() {
    return Cross.__super__.constructor.apply(this, arguments);
  }

  Cross.prototype._declareDefaults = function () {
    Cross.__super__._declareDefaults.apply(this, arguments);
    return this._defaults.tag = 'path';
  };

  Cross.prototype._draw = function () {
    var d, isRadiusX, isRadiusY, line1, line2, p, radiusX, radiusY, x, x1, x2, y, y1, y2;
    Cross.__super__._draw.apply(this, arguments);
    p = this._props;
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    isRadiusX = radiusX === this._prevRadiusX;
    isRadiusY = radiusY === this._prevRadiusY;
    if (isRadiusX && isRadiusY) {
      return;
    }
    x = this._props.width / 2;
    y = this._props.height / 2;
    x1 = x - radiusX;
    x2 = x + radiusX;
    line1 = "M" + x1 + "," + y + " L" + x2 + "," + y;
    y1 = y - radiusY;
    y2 = y + radiusY;
    line2 = "M" + x + "," + y1 + " L" + x + "," + y2;
    d = line1 + " " + line2;
    this.el.setAttribute('d', d);
    this._prevRadiusX = radiusX;
    return this._prevRadiusY = radiusY;
  };

  Cross.prototype._getLength = function () {
    var radiusX, radiusY;
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    return 2 * (radiusX + radiusY);
  };

  return Cross;
}(Bit);

var Cross$1 = Cross;

// istanbul ignore next

var Curve = function (_Bit) {
  babelHelpers.inherits(Curve, _Bit);

  function Curve() {
    babelHelpers.classCallCheck(this, Curve);
    return babelHelpers.possibleConstructorReturn(this, (Curve.__proto__ || Object.getPrototypeOf(Curve)).apply(this, arguments));
  }

  babelHelpers.createClass(Curve, [{
    key: '_declareDefaults',

    /*
      Method to declare module's defaults.
      @private
      @overrides @ Bit
    */
    value: function _declareDefaults() {
      babelHelpers.get(Curve.prototype.__proto__ || Object.getPrototypeOf(Curve.prototype), '_declareDefaults', this).call(this);
      this._defaults.tag = 'path';
    }
    /*
      Method to draw the module.
      @private
      @overrides @ Bit
    */

  }, {
    key: '_draw',
    value: function _draw() {
      babelHelpers.get(Curve.prototype.__proto__ || Object.getPrototypeOf(Curve.prototype), '_draw', this).call(this);
      var p = this._props;

      var radiusX = p.radiusX != null ? p.radiusX : p.radius;
      var radiusY = p.radiusY != null ? p.radiusY : p.radius;

      var isRadiusX = radiusX === this._prevRadiusX;
      var isRadiusY = radiusY === this._prevRadiusY;
      var isPoints = p.points === this._prevPoints;
      // skip if nothing changed
      if (isRadiusX && isRadiusY && isPoints) {
        return;
      }

      var x = p.width / 2;
      var y = p.height / 2;
      var x1 = x - radiusX;
      var x2 = x + radiusX;

      var d = 'M' + x1 + ' ' + y + ' Q ' + x + ' ' + (y - 2 * radiusY) + ' ' + x2 + ' ' + y;

      // set the `d` attribute and save it to `_prevD`
      this.el.setAttribute('d', d);
      // save the properties
      this._prevPoints = p.points;
      this._prevRadiusX = radiusX;
      this._prevRadiusY = radiusY;
    }
  }, {
    key: '_getLength',
    value: function _getLength() {
      var p = this._props;

      var radiusX = p.radiusX != null ? p.radiusX : p.radius;
      var radiusY = p.radiusY != null ? p.radiusY : p.radius;

      var dRadius = radiusX + radiusY;
      var sqrt = Math.sqrt((3 * radiusX + radiusY) * (radiusX + 3 * radiusY));

      return .5 * Math.PI * (3 * dRadius - sqrt);
    }
  }]);
  return Curve;
}(Bit);

var Equal;
var extend$6 = function extend(child, parent) {
  for (var key in parent) {
    if (hasProp$6.call(parent, key)) child[key] = parent[key];
  }function ctor() {
    this.constructor = child;
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
};
var hasProp$6 = {}.hasOwnProperty;
Equal = function (superClass) {
  extend$6(Equal, superClass);

  function Equal() {
    return Equal.__super__.constructor.apply(this, arguments);
  }

  Equal.prototype._declareDefaults = function () {
    Equal.__super__._declareDefaults.apply(this, arguments);
    this._defaults.tag = 'path';
    return this._defaults.points = 2;
  };

  Equal.prototype._draw = function () {
    var d, i, isPoints, isRadiusX, isRadiusY, j, p, radiusX, radiusY, ref, x, x1, x2, y, yStart, yStep;
    Equal.__super__._draw.apply(this, arguments);
    p = this._props;
    if (!this._props.points) {
      return;
    }
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    isRadiusX = radiusX === this._prevRadiusX;
    isRadiusY = radiusY === this._prevRadiusY;
    isPoints = p.points === this._prevPoints;
    if (isRadiusX && isRadiusY && isPoints) {
      return;
    }
    x = this._props.width / 2;
    y = this._props.height / 2;
    x1 = x - radiusX;
    x2 = x + radiusX;
    d = '';
    yStep = 2 * radiusY / (this._props.points - 1);
    yStart = y - radiusY;
    for (i = j = 0, ref = this._props.points; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      y = "" + (i * yStep + yStart);
      d += "M" + x1 + ", " + y + " L" + x2 + ", " + y + " ";
    }
    this.el.setAttribute('d', d);
    this._prevPoints = p.points;
    this._prevRadiusX = radiusX;
    return this._prevRadiusY = radiusY;
  };

  Equal.prototype._getLength = function () {
    return 2 * (this._props.radiusX != null ? this._props.radiusX : this._props.radius);
  };

  return Equal;
}(Bit);

var Equal$1 = Equal;

var BitsMap;
BitsMap = function () {
  function BitsMap() {
    this.addShape = h.bind(this.addShape, this);
  }

  BitsMap.prototype.bit = Bit;

  BitsMap.prototype.custom = Custom;

  BitsMap.prototype.circle = Circle$1;

  BitsMap.prototype.line = Line$1;

  BitsMap.prototype.zigzag = Zigzag$1;

  BitsMap.prototype.rect = Rect$1;

  BitsMap.prototype.polygon = Polygon$1;

  BitsMap.prototype.cross = Cross$1;

  BitsMap.prototype.equal = Equal$1;

  BitsMap.prototype.curve = Curve;

  BitsMap.prototype.getShape = function (name) {
    return this[name] || h.error("no \"" + name + "\" shape available yet, please choose from this list:", ['circle', 'line', 'zigzag', 'rect', 'polygon', 'cross', 'equal', 'curve']);
  };

  /*
    Method to add shape to the map.
    @public
    @param {String} Name of the shape module.
    @param {Object} Shape module class.
   */

  BitsMap.prototype.addShape = function (name, Module) {
    return this[name] = Module;
  };

  return BitsMap;
}();

var shapesMap = new BitsMap();

/* istanbul ignore next */

(function () {
	'use strict';

	var cancel, i, isOldBrowser, lastTime, vendors, vp, w;
	vendors = ['webkit', 'moz'];
	i = 0;
	w = window;
	while (i < vendors.length && !w.requestAnimationFrame) {
		vp = vendors[i];
		w.requestAnimationFrame = w[vp + 'RequestAnimationFrame'];
		cancel = w[vp + 'CancelAnimationFrame'];
		w.cancelAnimationFrame = cancel || w[vp + 'CancelRequestAnimationFrame'];
		++i;
	}
	isOldBrowser = !w.requestAnimationFrame || !w.cancelAnimationFrame;
	if (/iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent) || isOldBrowser) {
		lastTime = 0;
		w.requestAnimationFrame = function (callback) {
			var nextTime, now;
			now = Date.now();
			nextTime = Math.max(lastTime + 16, now);
			return setTimeout(function () {
				callback(lastTime = nextTime);
			}, nextTime - now);
		};
		w.cancelAnimationFrame = clearTimeout;
	}
})();

/* istanbul ignore next */

(function (root) {
  var offset, ref, ref1;
  if (root.performance == null) {
    root.performance = {};
  }
  Date.now = Date.now || function () {
    return new Date().getTime();
  };
  if (root.performance.now == null) {
    offset = ((ref = root.performance) != null ? (ref1 = ref.timing) != null ? ref1.navigationStart : void 0 : void 0) ? performance.timing.navigationStart : Date.now();
    return root.performance.now = function () {
      return Date.now() - offset;
    };
  }
})(window);

var Tweener = function () {
  function Tweener() {
    babelHelpers.classCallCheck(this, Tweener);

    this._vars();
    this._listenVisibilityChange();
    return this;
  }

  babelHelpers.createClass(Tweener, [{
    key: '_vars',
    value: function _vars() {
      this.tweens = [];
      this._loop = this._loop.bind(this);
      this._onVisibilityChange = this._onVisibilityChange.bind(this);
    }
    /*
      Main animation loop. Should have only one concurrent loop.
      @private
      @returns this
    */

  }, {
    key: '_loop',
    value: function _loop() {
      if (!this._isRunning) {
        return false;
      }
      this._update(window.performance.now());
      if (!this.tweens.length) {
        return this._isRunning = false;
      }
      requestAnimationFrame(this._loop);
      return this;
    }
    /*
      Method to start animation loop.
      @private
    */

  }, {
    key: '_startLoop',
    value: function _startLoop() {
      if (this._isRunning) {
        return;
      };this._isRunning = true;
      requestAnimationFrame(this._loop);
    }
    /*
      Method to stop animation loop.
      @private
    */

  }, {
    key: '_stopLoop',
    value: function _stopLoop() {
      this._isRunning = false;
    }
    /*
      Method to update every tween/timeline on animation frame.
      @private
    */

  }, {
    key: '_update',
    value: function _update(time) {
      var i = this.tweens.length;
      while (i--) {
        // cache the current tween
        var tween = this.tweens[i];
        if (tween && tween._update(time) === true) {
          this.remove(tween);
          tween._onTweenerFinish();
          tween._prevTime = undefined;
        }
      }
    }
    /*
      Method to add a Tween/Timeline to loop pool.
      @param {Object} Tween/Timeline to add.
    */

  }, {
    key: 'add',
    value: function add(tween) {
      // return if tween is already running
      if (tween._isRunning) {
        return;
      }
      tween._isRunning = true;
      this.tweens.push(tween);
      this._startLoop();
    }
    /*
      Method stop updating all the child tweens/timelines.
      @private
    */

  }, {
    key: 'removeAll',
    value: function removeAll() {
      this.tweens.length = 0;
    }
    /*
      Method to remove specific tween/timeline form updating.
      @private
    */

  }, {
    key: 'remove',
    value: function remove(tween) {
      var index = typeof tween === 'number' ? tween : this.tweens.indexOf(tween);

      if (index !== -1) {
        tween = this.tweens[index];
        if (tween) {
          tween._isRunning = false;
          this.tweens.splice(index, 1);
          tween._onTweenerRemove();
        }
      }
    }

    /*
      Method to initialize event listeners to visibility change events.
      @private
    */

  }, {
    key: '_listenVisibilityChange',
    value: function _listenVisibilityChange() {
      if (typeof document.hidden !== "undefined") {
        this._visibilityHidden = "hidden";
        this._visibilityChange = "visibilitychange";
      } else if (typeof document.mozHidden !== "undefined") {
        this._visibilityHidden = "mozHidden";
        this._visibilityChange = "mozvisibilitychange";
      } else if (typeof document.msHidden !== "undefined") {
        this._visibilityHidden = "msHidden";
        this._visibilityChange = "msvisibilitychange";
      } else if (typeof document.webkitHidden !== "undefined") {
        this._visibilityHidden = "webkitHidden";
        this._visibilityChange = "webkitvisibilitychange";
      }

      document.addEventListener(this._visibilityChange, this._onVisibilityChange, false);
    }
    /*
      Method that will fire on visibility change.
    */

  }, {
    key: '_onVisibilityChange',
    value: function _onVisibilityChange() {
      if (document[this._visibilityHidden]) {
        this._savePlayingTweens();
      } else {
        this._restorePlayingTweens();
      }
    }
    /*
      Method to save all playing tweens.
      @private
    */

  }, {
    key: '_savePlayingTweens',
    value: function _savePlayingTweens() {
      this._savedTweens = this.tweens.slice(0);
      for (var i = 0; i < this._savedTweens.length; i++) {
        this._savedTweens[i].pause();
      }
    }
    /*
      Method to restore all playing tweens.
      @private
    */

  }, {
    key: '_restorePlayingTweens',
    value: function _restorePlayingTweens() {
      for (var i = 0; i < this._savedTweens.length; i++) {
        this._savedTweens[i].resume();
      }
    }
  }]);
  return Tweener;
}();

var t = new Tweener();

var BezierEasing;
var bezierEasing;
var indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }return -1;
};
/**
 * Copyright (c) 2014 Gaëtan Renaudeau http://goo.gl/El3k7u
 * Adopted from https://github.com/gre/bezier-easing
 */

BezierEasing = function () {
  function BezierEasing(o) {
    this.vars();
    return this.generate;
  }

  BezierEasing.prototype.vars = function () {
    return this.generate = h.bind(this.generate, this);
  };

  BezierEasing.prototype.generate = function (mX1, mY1, mX2, mY2) {
    var A, B, C, NEWTON_ITERATIONS, NEWTON_MIN_SLOPE, SUBDIVISION_MAX_ITERATIONS, SUBDIVISION_PRECISION, _precomputed, arg, binarySubdivide, calcBezier, calcSampleValues, f, float32ArraySupported, getSlope, getTForX, i, j, kSampleStepSize, kSplineTableSize, mSampleValues, newtonRaphsonIterate, precompute, str;
    if (arguments.length < 4) {
      return this.error('Bezier function expects 4 arguments');
    }
    for (i = j = 0; j < 4; i = ++j) {
      arg = arguments[i];
      if (typeof arg !== "number" || isNaN(arg) || !isFinite(arg)) {
        return this.error('Bezier function expects 4 arguments');
      }
    }
    if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) {
      return this.error('Bezier x values should be > 0 and < 1');
    }
    NEWTON_ITERATIONS = 4;
    NEWTON_MIN_SLOPE = 0.001;
    SUBDIVISION_PRECISION = 0.0000001;
    SUBDIVISION_MAX_ITERATIONS = 10;
    kSplineTableSize = 11;
    kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
    float32ArraySupported = indexOf.call(global, 'Float32Array') >= 0;
    A = function A(aA1, aA2) {
      return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    };
    B = function B(aA1, aA2) {
      return 3.0 * aA2 - 6.0 * aA1;
    };
    C = function C(aA1) {
      return 3.0 * aA1;
    };
    calcBezier = function calcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    };
    getSlope = function getSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    };
    newtonRaphsonIterate = function newtonRaphsonIterate(aX, aGuessT) {
      var currentSlope, currentX;
      i = 0;
      while (i < NEWTON_ITERATIONS) {
        currentSlope = getSlope(aGuessT, mX1, mX2);

        /* istanbul ignore if */
        if (currentSlope === 0.0) {
          return aGuessT;
        }
        currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
        ++i;
      }
      return aGuessT;
    };
    calcSampleValues = function calcSampleValues() {
      i = 0;
      while (i < kSplineTableSize) {
        mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        ++i;
      }
    };

    /* istanbul ignore next */
    binarySubdivide = function binarySubdivide(aX, aA, aB) {
      var currentT, currentX, isBig;
      currentX = void 0;
      currentT = void 0;
      i = 0;
      while (true) {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
        isBig = Math.abs(currentX) > SUBDIVISION_PRECISION;
        if (!(isBig && ++i < SUBDIVISION_MAX_ITERATIONS)) {
          break;
        }
      }
      return currentT;
    };
    getTForX = function getTForX(aX) {
      var currentSample, delta, dist, guessForT, initialSlope, intervalStart, lastSample;
      intervalStart = 0.0;
      currentSample = 1;
      lastSample = kSplineTableSize - 1;
      while (currentSample !== lastSample && mSampleValues[currentSample] <= aX) {
        intervalStart += kSampleStepSize;
        ++currentSample;
      }
      --currentSample;
      delta = mSampleValues[currentSample + 1] - mSampleValues[currentSample];
      dist = (aX - mSampleValues[currentSample]) / delta;
      guessForT = intervalStart + dist * kSampleStepSize;
      initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT);
      } else {

        /* istanbul ignore next */
        if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
        }
      }
    };
    precompute = function precompute() {
      var _precomputed;
      _precomputed = true;
      if (mX1 !== mY1 || mX2 !== mY2) {
        return calcSampleValues();
      }
    };
    mSampleValues = !float32ArraySupported ? new Array(kSplineTableSize) : new Float32Array(kSplineTableSize);
    _precomputed = false;
    f = function f(aX) {
      if (!_precomputed) {
        precompute();
      }
      if (mX1 === mY1 && mX2 === mY2) {
        return aX;
      }
      if (aX === 0) {
        return 0;
      }
      if (aX === 1) {
        return 1;
      }
      return calcBezier(getTForX(aX), mY1, mY2);
    };
    str = "bezier(" + [mX1, mY1, mX2, mY2] + ")";
    f.toStr = function () {
      return str;
    };
    return f;
  };

  BezierEasing.prototype.error = function (msg) {
    return h.error(msg);
  };

  return BezierEasing;
}();

bezierEasing = new BezierEasing();

var bezier = bezierEasing;

var PathEasing = function () {
  PathEasing.prototype._vars = function () {
    this._precompute = h.clamp(this.o.precompute || 1450, 100, 10000);
    this._step = 1 / this._precompute;
    this._rect = this.o.rect || 100;
    this._approximateMax = this.o.approximateMax || 5;
    this._eps = this.o.eps || 0.001;
    return this._boundsPrevProgress = -1;
  };

  function PathEasing(path, o1) {
    this.o = o1 != null ? o1 : {};
    if (path === 'creator') {
      return;
    }
    this.path = h.parsePath(path);
    if (this.path == null) {
      return h.error('Error while parsing the path');
    }
    this._vars();
    this.path.setAttribute('d', this._normalizePath(this.path.getAttribute('d')));
    this.pathLength = this.path.getTotalLength();
    this.sample = h.bind(this.sample, this);
    this._hardSample = h.bind(this._hardSample, this);
    this._preSample();
    this;
  }

  PathEasing.prototype._preSample = function () {
    var i, j, length, point, progress, ref, results;
    this._samples = [];
    results = [];
    for (i = j = 0, ref = this._precompute; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      progress = i * this._step;
      length = this.pathLength * progress;
      point = this.path.getPointAtLength(length);
      results.push(this._samples[i] = {
        point: point,
        length: length,
        progress: progress
      });
    }
    return results;
  };

  PathEasing.prototype._findBounds = function (array, p) {
    var buffer, direction, end, i, j, len, loopEnd, pointP, pointX, ref, ref1, start, value;
    if (p === this._boundsPrevProgress) {
      return this._prevBounds;
    }
    if (this._boundsStartIndex == null) {
      this._boundsStartIndex = 0;
    }
    len = array.length;
    if (this._boundsPrevProgress > p) {
      loopEnd = 0;
      direction = 'reverse';
    } else {
      loopEnd = len;
      direction = 'forward';
    }
    if (direction === 'forward') {
      start = array[0];
      end = array[array.length - 1];
    } else {
      start = array[array.length - 1];
      end = array[0];
    }
    for (i = j = ref = this._boundsStartIndex, ref1 = loopEnd; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
      value = array[i];
      pointX = value.point.x / this._rect;
      pointP = p;
      if (direction === 'reverse') {
        buffer = pointX;
        pointX = pointP;
        pointP = buffer;
      }
      if (pointX < pointP) {
        start = value;
        this._boundsStartIndex = i;
      } else {
        end = value;
        break;
      }
    }
    this._boundsPrevProgress = p;
    return this._prevBounds = {
      start: start,
      end: end
    };
  };

  PathEasing.prototype.sample = function (p) {
    var bounds, res;
    p = h.clamp(p, 0, 1);
    bounds = this._findBounds(this._samples, p);
    res = this._checkIfBoundsCloseEnough(p, bounds);
    if (res != null) {
      return res;
    }
    return this._findApproximate(p, bounds.start, bounds.end);
  };

  PathEasing.prototype._checkIfBoundsCloseEnough = function (p, bounds) {
    var point, y;
    point = void 0;
    y = this._checkIfPointCloseEnough(p, bounds.start.point);
    if (y != null) {
      return y;
    }
    return this._checkIfPointCloseEnough(p, bounds.end.point);
  };

  PathEasing.prototype._checkIfPointCloseEnough = function (p, point) {
    if (h.closeEnough(p, point.x / this._rect, this._eps)) {
      return this._resolveY(point);
    }
  };

  PathEasing.prototype._approximate = function (start, end, p) {
    var deltaP, percentP;
    deltaP = end.point.x - start.point.x;
    percentP = (p - start.point.x / this._rect) / (deltaP / this._rect);
    return start.length + percentP * (end.length - start.length);
  };

  PathEasing.prototype._findApproximate = function (p, start, end, approximateMax) {
    var approximation, args, newPoint, point, x;
    if (approximateMax == null) {
      approximateMax = this._approximateMax;
    }
    approximation = this._approximate(start, end, p);
    point = this.path.getPointAtLength(approximation);
    x = point.x / this._rect;
    if (h.closeEnough(p, x, this._eps)) {
      return this._resolveY(point);
    } else {
      if (--approximateMax < 1) {
        return this._resolveY(point);
      }
      newPoint = {
        point: point,
        length: approximation
      };
      args = p < x ? [p, start, newPoint, approximateMax] : [p, newPoint, end, approximateMax];
      return this._findApproximate.apply(this, args);
    }
  };

  PathEasing.prototype._resolveY = function (point) {
    return 1 - point.y / this._rect;
  };

  PathEasing.prototype._normalizePath = function (path) {
    var commands, endIndex, normalizedPath, points, startIndex, svgCommandsRegexp;
    svgCommandsRegexp = /[M|L|H|V|C|S|Q|T|A]/gim;
    points = path.split(svgCommandsRegexp);
    points.shift();
    commands = path.match(svgCommandsRegexp);
    startIndex = 0;
    points[startIndex] = this._normalizeSegment(points[startIndex]);
    endIndex = points.length - 1;
    points[endIndex] = this._normalizeSegment(points[endIndex], this._rect || 100);
    return normalizedPath = this._joinNormalizedPath(commands, points);
  };

  PathEasing.prototype._joinNormalizedPath = function (commands, points) {
    var command, i, j, len1, normalizedPath, space;
    normalizedPath = '';
    for (i = j = 0, len1 = commands.length; j < len1; i = ++j) {
      command = commands[i];
      space = i === 0 ? '' : ' ';
      normalizedPath += "" + space + command + points[i].trim();
    }
    return normalizedPath;
  };

  PathEasing.prototype._normalizeSegment = function (segment, value) {
    var i, j, lastPoint, len1, nRgx, pairs, parsedX, point, space, x;
    if (value == null) {
      value = 0;
    }
    segment = segment.trim();
    nRgx = /(-|\+)?((\d+(\.(\d|\e(-|\+)?)+)?)|(\.?(\d|\e|(\-|\+))+))/gim;
    pairs = this._getSegmentPairs(segment.match(nRgx));
    lastPoint = pairs[pairs.length - 1];
    x = lastPoint[0];
    parsedX = Number(x);
    if (parsedX !== value) {
      segment = '';
      lastPoint[0] = value;
      for (i = j = 0, len1 = pairs.length; j < len1; i = ++j) {
        point = pairs[i];
        space = i === 0 ? '' : ' ';
        segment += "" + space + point[0] + "," + point[1];
      }
    }
    return segment;
  };

  PathEasing.prototype._getSegmentPairs = function (array) {
    var i, j, len1, newArray, pair, value;
    if (array.length % 2 !== 0) {
      h.error('Failed to parse the path - segment pairs are not even.', array);
    }
    newArray = [];
    for (i = j = 0, len1 = array.length; j < len1; i = j += 2) {
      value = array[i];
      pair = [array[i], array[i + 1]];
      newArray.push(pair);
    }
    return newArray;
  };

  PathEasing.prototype.create = function (path, o) {
    var handler;
    handler = new PathEasing(path, o);
    handler.sample.path = handler.path;
    return handler.sample;
  };

  return PathEasing;
}();

var create;
var easing$1;
var getNearest;
var mix;
var parseIfEasing;
var sort;
var slice = [].slice;
easing$1 = null;

parseIfEasing = function parseIfEasing(item) {
  if (typeof item.value === 'number') {
    return item.value;
  } else {
    return easing$1.parseEasing(item.value);
  }
};

sort = function sort(a, b) {
  var returnValue;
  a.value = parseIfEasing(a);
  b.value = parseIfEasing(b);
  returnValue = 0;
  a.to < b.to && (returnValue = -1);
  a.to > b.to && (returnValue = 1);
  return returnValue;
};

getNearest = function getNearest(array, progress) {
  var i, index, j, len, value;
  index = 0;
  for (i = j = 0, len = array.length; j < len; i = ++j) {
    value = array[i];
    index = i;
    if (value.to > progress) {
      break;
    }
  }
  return index;
};

mix = function mix() {
  var args;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  if (args.length > 1) {
    args = args.sort(sort);
  } else {
    args[0].value = parseIfEasing(args[0]);
  }
  return function (progress) {
    var index, value;
    index = getNearest(args, progress);
    if (index !== -1) {
      value = args[index].value;
      if (index === args.length - 1 && progress > args[index].to) {
        return 1;
      }
      if (typeof value === 'function') {
        return value(progress);
      } else {
        return value;
      }
    }
  };
};

create = function create(e) {
  easing$1 = e;
  return mix;
};

var mix$1 = create;

/*
  Method to bootstrap approximation function.
  @private
  @param   {Object} Samples Object.
  @returns {Function} Approximate function.
*/
var _proximate = function _proximate(samples) {
  var n = samples.base,
      samplesAmount = Math.pow(10, n),
      samplesStep = 1 / samplesAmount;

  function RoundNumber(input, numberDecimals) {
    numberDecimals = +numberDecimals || 0; // +var magic!

    var multiplyer = Math.pow(10.0, numberDecimals);

    return Math.round(input * multiplyer) / multiplyer;
  }

  var cached = function cached(p) {
    var newKey = RoundNumber(p, n),
        sample = samples[newKey.toString()];

    if (Math.abs(p - newKey) < samplesStep) {
      return sample;
    }

    if (p > newKey) {
      var nextIndex = newKey + samplesStep;
      var nextValue = samples[nextIndex];
    } else {
      var nextIndex = newKey - samplesStep;
      var nextValue = samples[nextIndex];
    }

    var dLength = nextIndex - newKey;
    var dValue = nextValue - sample;
    if (dValue < samplesStep) {
      return sample;
    }

    var progressScale = (p - newKey) / dLength;
    var coef = nextValue > sample ? -1 : 1;
    var scaledDifference = coef * progressScale * dValue;

    return sample + scaledDifference;
  };

  cached.getSamples = function () {
    return samples;
  };

  return cached;
};
/*
    Method to take samples of the function and call the _proximate
    method with the dunction and samples. Or if samples passed - pipe
    them to the _proximate method without sampling.
    @private
    @param {Function} Function to sample.
    @param {Number, Object, String} Precision or precomputed samples.
  */
var _sample = function _sample(fn) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;


  var nType = typeof n === 'undefined' ? 'undefined' : babelHelpers.typeof(n);

  var samples = {};
  if (nType === 'number') {
    var p = 0,
        samplesCount = Math.pow(10, n),
        step = 1 / samplesCount;

    samples[0] = fn(0);
    for (var i = 0; i < samplesCount - 1; i++) {
      p += step;

      var index = parseFloat(p.toFixed(n));
      samples[index] = fn(p);
    }
    samples[1] = fn(1);

    samples.base = n;
  } else if (nType === 'object') {
    samples = n;
  } else if (nType === 'string') {
    samples = JSON.parse(n);
  }

  return Approximate._sample._proximate(samples);
};

var Approximate = { _sample: _sample, _proximate: _proximate };
Approximate._sample._proximate = Approximate._proximate;

var approximate = Approximate._sample;

var sin = Math.sin;

var PI = Math.PI;

var Easing = function () {
  function Easing() {}

  Easing.prototype.bezier = bezier;

  Easing.prototype.PathEasing = PathEasing;

  Easing.prototype.path = new PathEasing('creator').create;

  Easing.prototype.approximate = approximate;

  Easing.prototype.inverse = function (p) {
    return 1 - p;
  };

  Easing.prototype.linear = {
    none: function none(k) {
      return k;
    }
  };

  Easing.prototype.ease = {
    "in": bezier.apply(Easing, [0.42, 0, 1, 1]),
    out: bezier.apply(Easing, [0, 0, 0.58, 1]),
    inout: bezier.apply(Easing, [0.42, 0, 0.58, 1])
  };

  Easing.prototype.sin = {
    "in": function _in(k) {
      return 1 - Math.cos(k * PI / 2);
    },
    out: function out(k) {
      return sin(k * PI / 2);
    },
    inout: function inout(k) {
      return 0.5 * (1 - Math.cos(PI * k));
    }
  };

  Easing.prototype.quad = {
    "in": function _in(k) {
      return k * k;
    },
    out: function out(k) {
      return k * (2 - k);
    },
    inout: function inout(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k;
      }
      return -0.5 * (--k * (k - 2) - 1);
    }
  };

  Easing.prototype.cubic = {
    "in": function _in(k) {
      return k * k * k;
    },
    out: function out(k) {
      return --k * k * k + 1;
    },
    inout: function inout(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
      }
      return 0.5 * ((k -= 2) * k * k + 2);
    }
  };

  Easing.prototype.quart = {
    "in": function _in(k) {
      return k * k * k * k;
    },
    out: function out(k) {
      return 1 - --k * k * k * k;
    },
    inout: function inout(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k;
      }
      return -0.5 * ((k -= 2) * k * k * k - 2);
    }
  };

  Easing.prototype.quint = {
    "in": function _in(k) {
      return k * k * k * k * k;
    },
    out: function out(k) {
      return --k * k * k * k * k + 1;
    },
    inout: function inout(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k;
      }
      return 0.5 * ((k -= 2) * k * k * k * k + 2);
    }
  };

  Easing.prototype.expo = {
    "in": function _in(k) {
      if (k === 0) {
        return 0;
      } else {
        return Math.pow(1024, k - 1);
      }
    },
    out: function out(k) {
      if (k === 1) {
        return 1;
      } else {
        return 1 - Math.pow(2, -10 * k);
      }
    },
    inout: function inout(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      if ((k *= 2) < 1) {
        return 0.5 * Math.pow(1024, k - 1);
      }
      return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    }
  };

  Easing.prototype.circ = {
    "in": function _in(k) {
      return 1 - Math.sqrt(1 - k * k);
    },
    out: function out(k) {
      return Math.sqrt(1 - --k * k);
    },
    inout: function inout(k) {
      if ((k *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - k * k) - 1);
      }
      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }
  };

  Easing.prototype.back = {
    "in": function _in(k) {
      var s;
      s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },
    out: function out(k) {
      var s;
      s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },
    inout: function inout(k) {
      var s;
      s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }
  };

  Easing.prototype.elastic = {
    "in": function _in(k) {
      var a, p, s;
      s = void 0;
      p = 0.4;
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      a = 1;
      s = p / 4;
      return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    },
    out: function out(k) {
      var a, p, s;
      s = void 0;
      p = 0.4;
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      a = 1;
      s = p / 4;
      return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
    },
    inout: function inout(k) {
      var a, p, s;
      s = void 0;
      p = 0.4;
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      a = 1;
      s = p / 4;
      if ((k *= 2) < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
      }
      return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }
  };

  Easing.prototype.bounce = {
    "in": function _in(k) {
      return 1 - easing.bounce.out(1 - k);
    },
    out: function out(k) {
      if (k < 1 / 2.75) {
        return 7.5625 * k * k;
      } else if (k < 2 / 2.75) {
        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
      } else if (k < 2.5 / 2.75) {
        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
      } else {
        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
      }
    },
    inout: function inout(k) {
      if (k < 0.5) {
        return easing.bounce["in"](k * 2) * 0.5;
      }
      return easing.bounce.out(k * 2 - 1) * 0.5 + 0.5;
    }
  };

  Easing.prototype.parseEasing = function (easing) {
    var easingParent, type;
    if (easing == null) {
      easing = 'linear.none';
    }
    type = typeof easing === 'undefined' ? 'undefined' : babelHelpers.typeof(easing);
    if (type === 'string') {
      if (easing.charAt(0).toLowerCase() === 'm') {
        return this.path(easing);
      } else {
        easing = this._splitEasing(easing);
        easingParent = this[easing[0]];
        if (!easingParent) {
          h.error("Easing with name \"" + easing[0] + "\" was not found, fallback to \"linear.none\" instead");
          return this['linear']['none'];
        }
        return easingParent[easing[1]];
      }
    }
    if (h.isArray(easing)) {
      return this.bezier.apply(this, easing);
    }
    if ('function') {
      return easing;
    }
  };

  Easing.prototype._splitEasing = function (string) {
    var firstPart, secondPart, split;
    if (typeof string === 'function') {
      return string;
    }
    if (typeof string === 'string' && string.length) {
      split = string.split('.');
      firstPart = split[0].toLowerCase() || 'linear';
      secondPart = split[1].toLowerCase() || 'none';
      return [firstPart, secondPart];
    } else {
      return ['linear', 'none'];
    }
  };

  return Easing;
}();

var easing = new Easing();

easing.mix = mix$1(easing);

// import h from '../h';

var Tween = function (_Module) {
  babelHelpers.inherits(Tween, _Module);
  babelHelpers.createClass(Tween, [{
    key: '_declareDefaults',

    /*
      Method do declare defaults with this._defaults object.
      @private
    */
    value: function _declareDefaults() {
      // DEFAULTS
      this._defaults = {
        /* duration of the tween [0..∞] */
        duration: 350,
        /* delay of the tween [-∞..∞] */
        delay: 0,
        /* repeat of the tween [0..∞], means how much to
           repeat the tween regardless first run,
           for instance repeat: 2 will make the tween run 3 times */
        repeat: 0,
        /* speed of playback [0..∞], speed that is less then 1
           will slowdown playback, for instance .5 will make tween
           run 2x slower. Speed of 2 will speedup the tween to 2x. */
        speed: 1,
        /*  flip onUpdate's progress on each even period.
            note that callbacks order won't flip at least
            for now (under consideration). */
        isYoyo: false,
        /* easing for the tween, could be any easing type [link to easing-types.md] */
        easing: 'Sin.Out',
        /*
          Easing for backward direction of the tweenthe tween,
          if `null` - fallbacks to `easing` property.
          forward direction in `yoyo` period is treated as backward for the easing.
        */
        backwardEasing: null,
        /* custom tween's name */
        name: null,
        /* custom tween's base name */
        nameBase: 'Tween',
        /*
          onProgress callback runs before any other callback.
          @param {Number}   The entire, not eased, progress
                            of the tween regarding repeat option.
          @param {Boolean}  The direction of the tween.
                            `true` for forward direction.
                            `false` for backward direction(tween runs in reverse).
        */
        onProgress: null,
        /*
          onStart callback runs on very start of the tween just after onProgress
          one. Runs on very end of the tween if tween is reversed.
          @param {Boolean}  Direction of the tween.
                            `true` for forward direction.
                            `false` for backward direction(tween runs in reverse).
        */
        onStart: null,
        onRefresh: null,
        onComplete: null,
        onRepeatStart: null,
        onRepeatComplete: null,
        onFirstUpdate: null,
        onUpdate: null,
        isChained: false,
        // playback callbacks
        onPlaybackStart: null,
        onPlaybackPause: null,
        onPlaybackStop: null,
        onPlaybackComplete: null,
        // context which all callbacks will be called with
        callbacksContext: null
      };
    }
    /*
      API method to play the Tween.
      @public
      @param  {Number} Shift time in milliseconds.
      @return {Object} Self.
    */

  }, {
    key: 'play',
    value: function play() {
      var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this._state === 'play' && this._isRunning) {
        return this;
      }
      this._props.isReversed = false;
      this._subPlay(shift, 'play');
      this._setPlaybackState('play');
      return this;
    }
    /*
      API method to play the Tween in reverse.
      @public
      @param  {Number} Shift time in milliseconds.
      @return {Object} Self.
    */

  }, {
    key: 'playBackward',
    value: function playBackward() {
      var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this._state === 'reverse' && this._isRunning) {
        return this;
      }
      this._props.isReversed = true;
      this._subPlay(shift, 'reverse');
      this._setPlaybackState('reverse');
      return this;
    }
    /*
      API method to pause Tween.
      @public
      @returns {Object} Self.
    */

  }, {
    key: 'pause',
    value: function pause() {
      if (this._state === 'pause' || this._state === 'stop') {
        return this;
      }
      this._removeFromTweener();
      this._setPlaybackState('pause');
      return this;
    }
    /*
      API method to stop the Tween.
      @public
      @param   {Number} Progress [0..1] to set when stopped.
      @returns {Object} Self.
    */

  }, {
    key: 'stop',
    value: function stop(progress) {
      if (this._state === 'stop') {
        return this;
      }

      this._wasUknownUpdate = undefined;

      var stopProc = progress != null ? progress
      /* if no progress passsed - set 1 if tween
         is playingBackward, otherwise set to 0 */
      : this._state === 'reverse' ? 1 : 0;

      this.setProgress(stopProc);

      this.reset();
      return this;
    }
    /*
      API method to replay(restart) the Tween.
      @public
      @param   {Number} Shift time in milliseconds.
      @returns {Object} Self.
    */

  }, {
    key: 'replay',
    value: function replay() {
      var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.reset();
      this.play(shift);
      return this;
    }
    /*
      API method to replay(restart) backward the Tween.
      @public
      @param   {Number} Shift time in milliseconds.
      @returns {Object} Self.
    */

  }, {
    key: 'replayBackward',
    value: function replayBackward() {
      var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.reset();
      this.playBackward(shift);
      return this;
    }
    /*
      API method to resume the Tween.
      @public
      @param  {Number} Shift time in milliseconds.
      @return {Object} Self.
    */

  }, {
    key: 'resume',
    value: function resume() {
      var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this._state !== 'pause') {
        return this;
      }

      switch (this._prevState) {
        case 'play':
          this.play(shift);
          break;
        case 'reverse':
          this.playBackward(shift);
          break;
      }

      return this;
    }
    /*
      API method to set progress on tween.
      @public
      @param {Number} Progress to set.
      @returns {Object} Self.
    */

  }, {
    key: 'setProgress',
    value: function setProgress(progress) {
      var p = this._props;
      // set start time if there is no one yet.
      !p.startTime && this._setStartTime();
      // reset play time
      this._playTime = null;
      // progress should be in range of [0..1]
      progress < 0 && (progress = 0);
      progress > 1 && (progress = 1);
      // update self with calculated time
      this._update(p.startTime - p.delay + progress * p.repeatTime);
      return this;
    }
    /*
      Method to set tween's speed.
      @public
      @param {Number} Speed value.
      @returns this.
    */

  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      this._props.speed = speed;
      // if playing - normalize _startTime and _prevTime to the current point.
      if (this._state === 'play' || this._state === 'reverse') {
        this._setResumeTime(this._state);
      }
      return this;
    }
    /*
      Method to reset tween's state and properties.
      @public
      @returns this.
    */

  }, {
    key: 'reset',
    value: function reset() {
      this._removeFromTweener();
      this._setPlaybackState('stop');
      this._progressTime = 0;
      this._isCompleted = false;
      this._isStarted = false;
      this._isFirstUpdate = false;
      this._wasUknownUpdate = undefined;
      this._prevTime = undefined;
      this._prevYoyo = undefined;
      // this._props.startTime  = undefined;
      this._props.isReversed = false;
      return this;
    }

    // ^ PUBLIC  METHOD(S) ^
    // v PRIVATE METHOD(S) v

    /*
      Method to launch play. Used as launch
      method for bothplay and reverse methods.
      @private
      @param  {Number} Shift time in milliseconds.
      @param  {String} Play or reverse state.
      @return {Object} Self.
    */

  }, {
    key: '_subPlay',
    value: function _subPlay() {
      var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var state = arguments[1];

      var resumeTime,
          startTime,
          p = this._props,

      // check if direction of playback changes,
      // if so, the _progressTime needs to be flipped
      _state = this._state,
          _prevState = this._prevState,
          isPause = _state === 'pause',
          wasPlay = _state === 'play' || isPause && _prevState === 'play',
          wasReverse = _state === 'reverse' || isPause && _prevState === 'reverse',
          isFlip = wasPlay && state === 'reverse' || wasReverse && state === 'play';

      // if tween was ended, set progress to 0 if not, set to elapsed progress
      this._progressTime = this._progressTime >= p.repeatTime ? 0 : this._progressTime;
      // flip the _progressTime if playback direction changed
      if (isFlip) {
        this._progressTime = p.repeatTime - this._progressTime;
      }
      // set resume time and normalize prev/start times
      this._setResumeTime(state, shift);
      // add self to tweener = play
      t.add(this);
      return this;
    }
    /*
      Method to set _resumeTime, _startTime and _prevTime.
      @private
      @param {String} Current state. [play, reverse]
      @param {Number} Time shift. *Default* is 0.
    */

  }, {
    key: '_setResumeTime',
    value: function _setResumeTime(state) {
      var shift = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      // get current moment as resume time
      this._resumeTime = performance.now();
      // set start time regarding passed `shift` and `procTime`
      var startTime = this._resumeTime - Math.abs(shift) - this._progressTime;
      this._setStartTime(startTime, false);
      // if we have prevTime - we need to normalize
      // it for the current resume time
      if (this._prevTime != null) {
        this._prevTime = state === 'play' ? this._normPrevTimeForward() : this._props.endTime - this._progressTime;
      }
    }
    /*
      Method recalculate _prevTime for forward direction.
      @private
      @return {Number} Normalized prev time.
    */

  }, {
    key: '_normPrevTimeForward',
    value: function _normPrevTimeForward() {
      var p = this._props;
      return p.startTime + this._progressTime - p.delay;
    }
    /*
      Constructor of the class.
      @private
    */

  }]);

  function Tween() {
    var _ret;

    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    babelHelpers.classCallCheck(this, Tween);

    var _this = babelHelpers.possibleConstructorReturn(this, (Tween.__proto__ || Object.getPrototypeOf(Tween)).call(this, o));

    _this._props.name == null && _this._setSelfName();
    return _ret = _this, babelHelpers.possibleConstructorReturn(_this, _ret);
  }
  /*
    Method to set self name to generic one.
    @private
  */


  babelHelpers.createClass(Tween, [{
    key: '_setSelfName',
    value: function _setSelfName() {
      var globalName = '_' + this._props.nameBase + 's';
      // track amount of tweens globally
      t[globalName] = t[globalName] == null ? 1 : ++t[globalName];
      // and set generic tween's name  || Tween # ||
      this._props.name = this._props.nameBase + ' ' + t[globalName];
    }
    /*
      Method set playback state string.
      @private
      @param {String} State name
    */

  }, {
    key: '_setPlaybackState',
    value: function _setPlaybackState(state) {
      // save previous state
      this._prevState = this._state;
      this._state = state;

      // callbacks
      var wasPause = this._prevState === 'pause',
          wasStop = this._prevState === 'stop',
          wasPlay = this._prevState === 'play',
          wasReverse = this._prevState === 'reverse',
          wasPlaying = wasPlay || wasReverse,
          wasStill = wasStop || wasPause;

      if ((state === 'play' || state === 'reverse') && wasStill) {
        this._playbackStart();
      }
      if (state === 'pause' && wasPlaying) {
        this._playbackPause();
      }
      if (state === 'stop' && (wasPlaying || wasPause)) {
        this._playbackStop();
      }
    }
    /*
      Method to declare some vars.
      @private
    */

  }, {
    key: '_vars',
    value: function _vars() {
      this.progress = 0;
      this._prevTime = undefined;
      this._progressTime = 0;
      this._negativeShift = 0;
      this._state = 'stop';
      // if negative delay was specified,
      // save it to _negativeShift property and
      // reset it back to 0
      if (this._props.delay < 0) {
        this._negativeShift = this._props.delay;
        this._props.delay = 0;
      }

      return this._calcDimentions();
    }
    /*
      Method to calculate tween's dimentions.
      @private
    */

  }, {
    key: '_calcDimentions',
    value: function _calcDimentions() {
      this._props.time = this._props.duration + this._props.delay;
      this._props.repeatTime = this._props.time * (this._props.repeat + 1);
    }
    /*
      Method to extend defaults by options and put them in _props.
      @private
    */

  }, {
    key: '_extendDefaults',
    value: function _extendDefaults() {
      // save callback overrides object with fallback to empty one
      this._callbackOverrides = this._o.callbackOverrides || {};
      delete this._o.callbackOverrides;
      // call the _extendDefaults @ Module
      babelHelpers.get(Tween.prototype.__proto__ || Object.getPrototypeOf(Tween.prototype), '_extendDefaults', this).call(this);

      var p = this._props;
      p.easing = easing.parseEasing(p.easing);
      p.easing._parent = this;

      // parse only present backward easing to prevent parsing as `linear.none`
      // because we need to fallback to `easing` in `_setProgress` method
      if (p.backwardEasing != null) {
        p.backwardEasing = easing.parseEasing(p.backwardEasing);
        p.backwardEasing._parent = this;
      }
    }
    /*
      Method for setting start and end time to props.
      @private
      @param {Number(Timestamp)}, {Null} Start time.
      @param {Boolean} Should reset flags.
      @returns this
    */

  }, {
    key: '_setStartTime',
    value: function _setStartTime(time) {
      var isResetFlags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var p = this._props,
          shiftTime = p.shiftTime || 0;
      // reset flags
      if (isResetFlags) {
        this._isCompleted = false;this._isRepeatCompleted = false;
        this._isStarted = false;
      }
      // set start time to passed time or to the current moment
      var startTime = time == null ? performance.now() : time;
      // calculate bounds
      // - negativeShift is negative delay in options hash
      // - shift time is shift of the parent
      p.startTime = startTime + p.delay + this._negativeShift + shiftTime;
      p.endTime = p.startTime + p.repeatTime - p.delay;
      // set play time to the startTimes
      // if playback controls are used - use _resumeTime as play time,
      // else use shifted startTime -- shift is needed for timelines append chains
      this._playTime = this._resumeTime != null ? this._resumeTime : startTime + shiftTime;
      this._resumeTime = null;

      return this;
    }
    /*
      Method to update tween's progress.
      @private
      @param {Number} Current update time.
      -- next params only present when parent Timeline calls the method.
      @param {Number} Previous Timeline's update time.
      @param {Boolean} Was parent in yoyo period.
      @param {Number} [-1, 0, 1] If update is on edge.
                     -1 = edge jump in negative direction.
                      0 = no edge jump.
                      1 = edge jump in positive direction.
    */

  }, {
    key: '_update',
    value: function _update(time, timelinePrevTime, wasYoyo, onEdge) {
      var p = this._props;
      // if we don't the _prevTime thus the direction we are heading to,
      // but prevTime was passed thus we are child of a Timeline
      // set _prevTime to passed one and pretent that there was unknown
      // update to not to block start/complete callbacks
      if (this._prevTime == null && timelinePrevTime != null) {

        if (this._props.speed && this._playTime) {
          // play point + ( speed * delta )
          this._prevTime = this._playTime + this._props.speed * (timelinePrevTime - this._playTime);
        }
        // this._prevTime = timelinePrevTime;
        this._wasUknownUpdate = true;
      }

      // var before = time;
      // cache vars
      var startPoint = p.startTime - p.delay;
      // if speed param was defined - calculate
      // new time regarding speed
      if (p.speed && this._playTime) {
        // play point + ( speed * delta )
        time = this._playTime + p.speed * (time - this._playTime);
      }

      // due to javascript precision issues, after speed mapping
      // we can get very close number that was made from progress of 1
      // and in fact represents `endTime` if so, set the time to `endTime`
      if (Math.abs(p.endTime - time) < 0.00000001) {
        time = p.endTime;
      }

      // if parent is onEdge but not very start nor very end
      if (onEdge && wasYoyo != null) {
        var T = this._getPeriod(time),
            isYoyo = !!(p.isYoyo && this._props.repeat && T % 2 === 1);

        // for timeline
        // notify children about edge jump
        if (this._timelines) {
          for (var i = 0; i < this._timelines.length; i++) {
            this._timelines[i]._update(time, timelinePrevTime, wasYoyo, onEdge);
          }
        }
        // forward edge direction
        if (onEdge === 1) {
          // jumped from yoyo period?
          if (wasYoyo) {
            this._prevTime = time + 1;
            this._repeatStart(time, isYoyo);
            this._start(time, isYoyo);
          } else {
            this._prevTime = time - 1;
            this._repeatComplete(time, isYoyo);
            this._complete(time, isYoyo);
          }
          // backward edge direction
        } else if (onEdge === -1) {
          // jumped from yoyo period?
          if (wasYoyo) {
            this._prevTime = time - 1;
            this._repeatComplete(time, isYoyo);
            this._complete(time, isYoyo);
          } else {
            // call _start callbacks only if prev time was in active area
            // not always true for append chains
            if (this._prevTime >= p.startTime && this._prevTime <= p.endTime) {
              this._prevTime = time + 1;
              this._repeatStart(time, isYoyo);
              this._start(time, isYoyo);
              // reset isCOmpleted immediately to prevent onComplete cb
              this._isCompleted = true;
            }
          }
        }
        // reset the _prevTime - drop one frame to undestand
        // where we are heading
        this._prevTime = undefined;
      }
      // if in active area and not ended - save progress time
      // for pause/play purposes.
      if (time > startPoint && time < p.endTime) {
        this._progressTime = time - startPoint;
      }
      // else if not started or ended set progress time to 0
      else if (time <= startPoint) {
          this._progressTime = 0;
        } else if (time >= p.endTime) {
          // set progress time to repeat time + tiny cofficient
          // to make it extend further than the end time
          this._progressTime = p.repeatTime + .00000000001;
        }
      // reverse time if _props.isReversed is set
      if (p.isReversed) {
        time = p.endTime - this._progressTime;
      }
      // We need to know what direction we are heading to,
      // so if we don't have the previous update value - this is very first
      // update, - skip it entirely and wait for the next value
      if (this._prevTime == null) {
        this._prevTime = time;
        this._wasUknownUpdate = true;
        return false;
      }

      // ====== AFTER SKIPPED FRAME ======

      // handle onProgress callback
      if (time >= startPoint && time <= p.endTime) {
        this._progress((time - startPoint) / p.repeatTime, time);
      }
      /*
        if time is inside the active area of the tween.
        active area is the area from start time to end time,
        with all the repeat and delays in it
      */
      if (time >= p.startTime && time <= p.endTime) {
        this._updateInActiveArea(time);
      } else {
        // if was in active area - update in inactive area but just once -
        // right after the active area
        if (this._isInActiveArea) {
          this._updateInInactiveArea(time);
        } else if (!this._isRefreshed) {
          // onRefresh callback
          // before startTime
          if (time < p.startTime && this.progress !== 0) {
            this._refresh(true);
            this._isRefreshed = true;
            // after endTime
          }
          // else if ( time > p.endTime ) { }
        }
      }

      this._prevTime = time;
      return time >= p.endTime || time <= startPoint;
    }
    /*
      Method to handle tween's progress in inactive area.
      @private
      @param {Number} Current update time.
    */

  }, {
    key: '_updateInInactiveArea',
    value: function _updateInInactiveArea(time) {
      if (!this._isInActiveArea) {
        return;
      }
      var p = this._props;
      // complete if time is larger then end time
      if (time > p.endTime && !this._isCompleted) {
        this._progress(1, time);
        // get period number
        var T = this._getPeriod(p.endTime),
            isYoyo = p.isYoyo && T % 2 === 0;

        this._setProgress(isYoyo ? 0 : 1, time, isYoyo);
        this._repeatComplete(time, isYoyo);
        this._complete(time, isYoyo);
      }
      // if was active and went to - inactive area "-"
      if (time < this._prevTime && time < p.startTime && !this._isStarted && !this._isCompleted) {
        // if was in active area and didn't fire onStart callback
        this._progress(0, time, false);
        this._setProgress(0, time, false);
        this._isRepeatStart = false;
        this._repeatStart(time, false);
        this._start(time, false);
      }
      this._isInActiveArea = false;
    }
    /*
      Method to handle tween's progress in active area.
      @private
      @param {Number} Current update time.
    */

  }, {
    key: '_updateInActiveArea',
    value: function _updateInActiveArea(time) {

      var props = this._props,
          delayDuration = props.delay + props.duration,
          startPoint = props.startTime - props.delay,
          elapsed = (time - props.startTime + props.delay) % delayDuration,
          TCount = Math.round((props.endTime - props.startTime + props.delay) / delayDuration),
          T = this._getPeriod(time),
          TValue = this._delayT,
          prevT = this._getPeriod(this._prevTime),
          TPrevValue = this._delayT;

      // "zero" and "one" value regarding yoyo and it's period
      var isYoyo = props.isYoyo && T % 2 === 1,
          isYoyoPrev = props.isYoyo && prevT % 2 === 1,
          yoyoZero = isYoyo ? 1 : 0,
          yoyoOne = 1 - yoyoZero;

      if (time === props.endTime) {
        this._wasUknownUpdate = false;
        // if `time` is equal to `endTime`, T represents the next period,
        // so we need to decrement T and calculate "one" value regarding yoyo
        var isYoyo = props.isYoyo && (T - 1) % 2 === 1;
        this._setProgress(isYoyo ? 0 : 1, time, isYoyo);
        if (time > this._prevTime) {
          this._isRepeatCompleted = false;
        }
        this._repeatComplete(time, isYoyo);
        return this._complete(time, isYoyo);
      }

      // reset callback flags
      this._isCompleted = false;
      this._isRefreshed = false;
      // if time is inside the duration area of the tween
      if (startPoint + elapsed >= props.startTime) {
        this._isInActiveArea = true;this._isRepeatCompleted = false;
        this._isRepeatStart = false;this._isStarted = false;
        // active zone or larger then end
        var elapsed2 = (time - props.startTime) % delayDuration,
            proc = elapsed2 / props.duration;
        // |=====|=====|=====| >>>
        //      ^1^2
        var isOnEdge = T > 0 && prevT < T;
        // |=====|=====|=====| <<<
        //      ^2^1
        var isOnReverseEdge = prevT > T;

        // for use in timeline
        this._onEdge = 0;
        isOnEdge && (this._onEdge = 1);
        isOnReverseEdge && (this._onEdge = -1);

        if (this._wasUknownUpdate) {
          if (time > this._prevTime) {
            this._start(time, isYoyo);
            this._repeatStart(time, isYoyo);
            this._firstUpdate(time, isYoyo);
          }
          // if backward direction and 
          // if ( time < this._prevTime && time !== this._props.startTime ) {
          if (time < this._prevTime) {
            this._complete(time, isYoyo);
            this._repeatComplete(time, isYoyo);
            this._firstUpdate(time, isYoyo);
            // reset isCompleted immediately
            this._isCompleted = false;
          }
        }

        if (isOnEdge) {
          // if not just after delay
          // |---=====|---=====|---=====| >>>
          //            ^1 ^2
          // because we have already handled
          // 1 and onRepeatComplete in delay gap
          if (this.progress !== 1) {
            // prevT
            var isThisYoyo = props.isYoyo && (T - 1) % 2 === 1;
            this._repeatComplete(time, isThisYoyo);
          }
          // if on edge but not at very start
          // |=====|=====|=====| >>>
          // ^!    ^here ^here 
          if (prevT >= 0) {
            this._repeatStart(time, isYoyo);
          }
        }

        if (time > this._prevTime) {
          //  |=====|=====|=====| >>>
          // ^1  ^2
          if (!this._isStarted && this._prevTime <= props.startTime) {
            this._start(time, isYoyo);
            this._repeatStart(time, isYoyo);
            // it was zero anyways

            // restart flags immediately in case if we will
            // return to '-' inactive area on the next step
            this._isStarted = false;
            this._isRepeatStart = false;
          }
          this._firstUpdate(time, isYoyo);
        }

        if (isOnReverseEdge) {
          // if on edge but not at very end
          // |=====|=====|=====| <<<
          //       ^here ^here ^not here
          if (this.progress !== 0 && this.progress !== 1 && prevT != TCount) {
            this._repeatStart(time, isYoyoPrev);
          }
          // if on very end edge
          // |=====|=====|=====| <<<
          //       ^!    ^! ^2 ^1
          // we have handled the case in this._wasUknownUpdate
          // block so filter that
          if (prevT === TCount && !this._wasUknownUpdate) {
            this._complete(time, isYoyo);
            this._repeatComplete(time, isYoyo);
            this._firstUpdate(time, isYoyo);
            // reset isComplete flag call
            // cuz we returned to active area
            // this._isRepeatCompleted = false;
            this._isCompleted = false;
          }
          this._repeatComplete(time, isYoyo);
        }

        if (prevT === 'delay') {
          // if just before delay gap
          // |---=====|---=====|---=====| <<<
          //               ^2    ^1
          if (T < TPrevValue) {
            this._repeatComplete(time, isYoyo);
          }
          // if just after delay gap
          // |---=====|---=====|---=====| >>>
          //            ^1  ^2
          if (T === TPrevValue && T > 0) {
            this._repeatStart(time, isYoyo);
          }
        }

        // swap progress and repeatStart based on direction
        if (time > this._prevTime) {
          // if progress is equal 0 and progress grows
          if (proc === 0) {
            this._repeatStart(time, isYoyo);
          }
          if (time !== props.endTime) {
            this._setProgress(isYoyo ? 1 - proc : proc, time, isYoyo);
          }
        } else {
          if (time !== props.endTime) {
            this._setProgress(isYoyo ? 1 - proc : proc, time, isYoyo);
          }
          // if progress is equal 0 and progress grows
          if (proc === 0) {
            this._repeatStart(time, isYoyo);
          }
        }

        if (time === props.startTime) {
          this._start(time, isYoyo);
        }
        // delay gap - react only once
      } else if (this._isInActiveArea) {
        // because T will be string of "delay" here,
        // let's normalize it be setting to TValue
        var t = T === 'delay' ? TValue : T,
            isGrows = time > this._prevTime;
        // decrement period if forward direction of update
        isGrows && t--;
        // calculate normalized yoyoZero value
        yoyoZero = props.isYoyo && t % 2 === 1 ? 1 : 0;
        // if was in active area and previous time was larger
        // |---=====|---=====|---=====| <<<
        //   ^2 ^1    ^2 ^1    ^2 ^1
        if (time < this._prevTime) {
          this._setProgress(yoyoZero, time, yoyoZero === 1);
          this._repeatStart(time, yoyoZero === 1);
        }
        // set 1 or 0 regarding direction and yoyo
        this._setProgress(isGrows ? 1 - yoyoZero : yoyoZero, time, yoyoZero === 1);
        // if time grows
        if (time > this._prevTime) {
          // if reverse direction and in delay gap, then progress will be 0
          // if so we don't need to call the onRepeatComplete callback
          // |---=====|---=====|---=====| <<<
          //   ^0       ^0       ^0   
          // OR we have flipped 0 to 1 regarding yoyo option
          if (this.progress !== 0 || yoyoZero === 1) {
            // since we repeatComplete for previous period
            // invert isYoyo option
            // is elapsed is 0 - count as previous period
            this._repeatComplete(time, yoyoZero === 1);
          }
        }
        // set flag to indicate inactive area
        this._isInActiveArea = false;
      }
      // we've got the first update now
      this._wasUknownUpdate = false;
    }
    /*
      Method to remove the Tween from the tweener.
      @private
      @returns {Object} Self.
    */

  }, {
    key: '_removeFromTweener',
    value: function _removeFromTweener() {
      t.remove(this);return this;
    }
    /*
      Method to get current period number.
      @private
      @param {Number} Time to get the period for.
      @returns {Number} Current period number.
    */

  }, {
    key: '_getPeriod',
    value: function _getPeriod(time) {
      var p = this._props,
          TTime = p.delay + p.duration,
          dTime = p.delay + time - p.startTime,
          T = dTime / TTime,

      // if time if equal to endTime we need to set the elapsed
      // time to 0 to fix the occasional precision js bug, which
      // causes 0 to be something like 1e-12
      elapsed = time < p.endTime ? dTime % TTime : 0;
      // If the latest period, round the result, otherwise floor it.
      // Basically we always can floor the result, but because of js
      // precision issues, sometimes the result is 2.99999998 which
      // will result in 2 instead of 3 after the floor operation.
      T = time >= p.endTime ? Math.round(T) : Math.floor(T);
      // if time is larger then the end time
      if (time > p.endTime) {
        // set equal to the periods count
        T = Math.round((p.endTime - p.startTime + p.delay) / TTime);
        // if in delay gap, set _delayT to current
        // period number and return "delay"
      } else if (elapsed > 0 && elapsed < p.delay) {
        this._delayT = T;T = 'delay';
      }
      // if the end of period and there is a delay
      return T;
    }
    /*
      Method to set Tween's progress and call onUpdate callback.
      @private
      @override @ Module
      @param {Number} Progress to set.
      @param {Number} Current update time.
      @param {Boolean} Is yoyo perido. Used in Timeline to pass to Tween.
      @returns {Object} Self.
    */

  }, {
    key: '_setProgress',
    value: function _setProgress(proc, time, isYoyo) {
      var p = this._props,
          isYoyoChanged = p.wasYoyo !== isYoyo,
          isForward = time > this._prevTime;

      this.progress = proc;
      // get the current easing for `forward` direction regarding `yoyo`
      if (isForward && !isYoyo || !isForward && isYoyo) {
        this.easedProgress = p.easing(proc);
        // get the current easing for `backward` direction regarding `yoyo`
      } else if (!isForward && !isYoyo || isForward && isYoyo) {
        var easing = p.backwardEasing != null ? p.backwardEasing : p.easing;

        this.easedProgress = easing(proc);
      }

      if (p.prevEasedProgress !== this.easedProgress || isYoyoChanged) {
        if (p.onUpdate != null && typeof p.onUpdate === 'function') {
          p.onUpdate.call(p.callbacksContext || this, this.easedProgress, this.progress, isForward, isYoyo);
        }
      }
      p.prevEasedProgress = this.easedProgress;
      p.wasYoyo = isYoyo;
      return this;
    }
    /*
      Method to set tween's state to start and call onStart callback.
      @method _start
      @private
      @param {Number} Progress to set.
      @param {Boolean} Is yoyo period.
    */

  }, {
    key: '_start',
    value: function _start(time, isYoyo) {
      if (this._isStarted) {
        return;
      }
      var p = this._props;
      if (p.onStart != null && typeof p.onStart === 'function') {
        p.onStart.call(p.callbacksContext || this, time > this._prevTime, isYoyo);
      }
      this._isCompleted = false;this._isStarted = true;
      this._isFirstUpdate = false;
    }
    /*
      Method to call onPlaybackStart callback
      @private
    */

  }, {
    key: '_playbackStart',
    value: function _playbackStart() {
      var p = this._props;
      if (p.onPlaybackStart != null && typeof p.onPlaybackStart === 'function') {
        p.onPlaybackStart.call(p.callbacksContext || this);
      }
    }
    /*
      Method to call onPlaybackPause callback
      @private
    */

  }, {
    key: '_playbackPause',
    value: function _playbackPause() {
      var p = this._props;
      if (p.onPlaybackPause != null && typeof p.onPlaybackPause === 'function') {
        p.onPlaybackPause.call(p.callbacksContext || this);
      }
    }
    /*
      Method to call onPlaybackStop callback
      @private
    */

  }, {
    key: '_playbackStop',
    value: function _playbackStop() {
      var p = this._props;
      if (p.onPlaybackStop != null && typeof p.onPlaybackStop === 'function') {
        p.onPlaybackStop.call(p.callbacksContext || this);
      }
    }
    /*
      Method to call onPlaybackComplete callback
      @private
    */

  }, {
    key: '_playbackComplete',
    value: function _playbackComplete() {
      var p = this._props;
      if (p.onPlaybackComplete != null && typeof p.onPlaybackComplete === 'function') {
        p.onPlaybackComplete.call(p.callbacksContext || this);
      }
    }
    /*
      Method to set tween's state to complete.
      @method _complete
      @private
      @param {Number} Current time.
      @param {Boolean} Is yoyo period.
    */

  }, {
    key: '_complete',
    value: function _complete(time, isYoyo) {
      if (this._isCompleted) {
        return;
      }
      var p = this._props;
      if (p.onComplete != null && typeof p.onComplete === 'function') {
        p.onComplete.call(p.callbacksContext || this, time > this._prevTime, isYoyo);
      }

      this._isCompleted = true;this._isStarted = false;
      this._isFirstUpdate = false;
      // reset _prevYoyo for timeline usage
      this._prevYoyo = undefined;
    }

    /*
      Method to run onFirstUpdate callback.
      @method _firstUpdate
      @private
      @param {Number} Current update time.
      @param {Boolean} Is yoyo period.
    */

  }, {
    key: '_firstUpdate',
    value: function _firstUpdate(time, isYoyo) {
      if (this._isFirstUpdate) {
        return;
      }
      var p = this._props;
      if (p.onFirstUpdate != null && typeof p.onFirstUpdate === 'function') {
        // onFirstUpdate should have tween pointer
        p.onFirstUpdate.tween = this;
        p.onFirstUpdate.call(p.callbacksContext || this, time > this._prevTime, isYoyo);
      }
      this._isFirstUpdate = true;
    }
    /*
      Method call onRepeatComplete calback and set flags.
      @private
      @param {Number} Current update time.
      @param {Boolean} Is repeat period.
    */

  }, {
    key: '_repeatComplete',
    value: function _repeatComplete(time, isYoyo) {
      if (this._isRepeatCompleted) {
        return;
      }
      var p = this._props;
      if (p.onRepeatComplete != null && typeof p.onRepeatComplete === 'function') {
        p.onRepeatComplete.call(p.callbacksContext || this, time > this._prevTime, isYoyo);
      }
      this._isRepeatCompleted = true;
      // this._prevYoyo = null;
    }

    /*
      Method call onRepeatStart calback and set flags.
      @private
      @param {Number} Current update time.
      @param {Boolean} Is yoyo period.
    */

  }, {
    key: '_repeatStart',
    value: function _repeatStart(time, isYoyo) {
      if (this._isRepeatStart) {
        return;
      }
      var p = this._props;
      if (p.onRepeatStart != null && typeof p.onRepeatStart === 'function') {
        p.onRepeatStart.call(p.callbacksContext || this, time > this._prevTime, isYoyo);
      }
      this._isRepeatStart = true;
    }
    /*
      Method to launch onProgress callback.
      @method _progress
      @private
      @param {Number} Progress to set.
    */

  }, {
    key: '_progress',
    value: function _progress(progress, time) {
      var p = this._props;
      if (p.onProgress != null && typeof p.onProgress === 'function') {
        p.onProgress.call(p.callbacksContext || this, progress, time > this._prevTime);
      }
    }
    /*
      Method to launch onRefresh callback.
      @method _refresh
      @private
      @param {Boolean} If refresh even before start time.
    */

  }, {
    key: '_refresh',
    value: function _refresh(isBefore) {
      var p = this._props;
      if (p.onRefresh != null) {
        var context = p.callbacksContext || this,
            progress = isBefore ? 0 : 1;

        p.onRefresh.call(context, isBefore, p.easing(progress), progress);
      }
    }
    /*
      Method which is called when the tween is removed from tweener.
      @private
    */

  }, {
    key: '_onTweenerRemove',
    value: function _onTweenerRemove() {}
    /*
      Method which is called when the tween is removed
      from tweener when finished.
      @private
    */

  }, {
    key: '_onTweenerFinish',
    value: function _onTweenerFinish() {
      this._setPlaybackState('stop');
      this._playbackComplete();
    }
    /*
      Method to set property[s] on Tween.
      @private
      @override @ Module
      @param {Object, String} Hash object of key/value pairs, or property name.
      @param {_} Property's value to set.
    */

  }, {
    key: '_setProp',
    value: function _setProp(obj, value) {
      babelHelpers.get(Tween.prototype.__proto__ || Object.getPrototypeOf(Tween.prototype), '_setProp', this).call(this, obj, value);
      this._calcDimentions();
    }
    /*
      Method to set single property.
      @private
      @override @ Module
      @param {String} Name of the property.
      @param {Any} Value for the property.
    */

  }, {
    key: '_assignProp',
    value: function _assignProp(key, value) {
      // fallback to defaults
      if (value == null) {
        value = this._defaults[key];
      }
      // parse easing
      if (key === 'easing') {
        value = easing.parseEasing(value);
        value._parent = this;
      }
      // handle control callbacks overrides
      var control = this._callbackOverrides[key],
          isntOverriden = !value || !value.isMojsCallbackOverride;
      if (control && isntOverriden) {
        value = this._overrideCallback(value, control);
      }
      // call super on Module
      babelHelpers.get(Tween.prototype.__proto__ || Object.getPrototypeOf(Tween.prototype), '_assignProp', this).call(this, key, value);
    }
    /*
      Method to override callback for controll pupropes.
      @private
      @param {String}    Callback name.
      @parma {Function}  Method to call  
    */

  }, {
    key: '_overrideCallback',
    value: function _overrideCallback(callback, fun) {
      var isCallback = callback && typeof callback === 'function',
          override = function callbackOverride() {
        // call overriden callback if it exists
        isCallback && callback.apply(this, arguments);
        // call the passed cleanup function
        fun.apply(this, arguments);
      };
      // add overridden flag
      override.isMojsCallbackOverride = true;
      return override;
    }

    // _visualizeProgress(time) {
    //   var str = '|',
    //       procStr = ' ',
    //       p = this._props,
    //       proc = p.startTime - p.delay;

    //   while ( proc < p.endTime ) {
    //     if (p.delay > 0 ) {
    //       var newProc = proc + p.delay;
    //       if ( time > proc && time < newProc ) {
    //         procStr += ' ^ ';
    //       } else {
    //         procStr += '   ';
    //       }
    //       proc = newProc;
    //       str  += '---';
    //     }
    //     var newProc = proc + p.duration;
    //     if ( time > proc && time < newProc ) {
    //       procStr += '  ^   ';
    //     } else if (time === proc) {
    //       procStr += '^     ';
    //     } else if (time === newProc) {
    //       procStr += '    ^ ';
    //     } else {
    //       procStr += '      ';
    //     }
    //     proc = newProc;
    //     str += '=====|';
    //   }

    //   console.log(str);
    //   console.log(procStr);
    // }

  }]);
  return Tween;
}(Module);

var Timeline = function (_Tween) {
  babelHelpers.inherits(Timeline, _Tween);
  babelHelpers.createClass(Timeline, [{
    key: 'add',

    /*
      API method to add child tweens/timelines.
      @public
      @param {Object, Array} Tween/Timeline or an array of such.
      @returns {Object} Self.
    */
    value: function add() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this._pushTimelineArray(args);
      this._calcDimentions();
      return this;
    }
    /*
      API method to append the Tween/Timeline to the end of the
      timeline. Each argument is treated as a new append.
      Array of tweens is treated as a parallel sequence. 
      @public
      @param {Object, Array} Tween/Timeline to append or array of such.
      @returns {Object} Self.
    */

  }, {
    key: 'append',
    value: function append() {
      for (var _len2 = arguments.length, timeline = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        timeline[_key2] = arguments[_key2];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = timeline[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var tm = _step.value;

          if (h.isArray(tm)) {
            this._appendTimelineArray(tm);
          } else {
            this._appendTimeline(tm, this._timelines.length);
          }
          this._calcDimentions();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
    /*
      API method to stop the Tween.
      @public
      @param   {Number} Progress [0..1] to set when stopped.
      @returns {Object} Self.
    */

  }, {
    key: 'stop',
    value: function stop(progress) {
      babelHelpers.get(Timeline.prototype.__proto__ || Object.getPrototypeOf(Timeline.prototype), 'stop', this).call(this, progress);
      this._stopChildren(progress);
      return this;
    }
    /*
      Method to reset tween's state and properties.
      @public
      @overrides @ Tween
      @returns this.
    */

  }, {
    key: 'reset',
    value: function reset() {
      babelHelpers.get(Timeline.prototype.__proto__ || Object.getPrototypeOf(Timeline.prototype), 'reset', this).call(this);
      this._resetChildren();
      return this;
    }
    /*
      Method to call `reset` method on all children.
      @private
    */

  }, {
    key: '_resetChildren',
    value: function _resetChildren() {
      for (var i = 0; i < this._timelines.length; i++) {
        this._timelines[i].reset();
      }
    }
    /*
      Method to call `stop` method on all children.
      @private
      @param   {Number} Progress [0..1] to set when stopped.
    */

  }, {
    key: '_stopChildren',
    value: function _stopChildren(progress) {
      for (var i = this._timelines.length - 1; i >= 0; i--) {
        this._timelines[i].stop(progress);
      }
    }
    /*
      Method to set tween's state to complete.
      @private
      @overrides @ Tween
      @param {Number} Current time.
      @param {Boolean} Is yoyo period.
    */
    // _complete ( time, isYoyo ) {
    //   // this._updateChildren( 1, time, isYoyo );
    //   // this._setProgress( 1, time, isYoyo );
    //   super._complete( time, isYoyo );
    //   // this._resetChildren();
    // }

    // ^ PUBLIC  METHOD(S) ^
    // v PRIVATE METHOD(S) v

    /*
      Method to append Tween/Timeline array or mix of such.
      @private
      @param {Array} Array of Tweens/Timelines.
    */

  }, {
    key: '_appendTimelineArray',
    value: function _appendTimelineArray(timelineArray) {
      var i = timelineArray.length,
          time = this._props.repeatTime - this._props.delay,
          len = this._timelines.length;

      while (i--) {
        this._appendTimeline(timelineArray[i], len, time);
      }
    }
    /*
      Method to append a single timeline to the Timeline.
      @private
      @param {Object} Tween/Timline to append.
      @param {Number} Index of the append.
      @param {Number} Shift time.
    */

  }, {
    key: '_appendTimeline',
    value: function _appendTimeline(timeline, index, time) {
      // if timeline is a module with timeline property then extract it
      if (timeline.timeline instanceof Timeline) {
        timeline = timeline.timeline;
      }
      if (timeline.tween instanceof Tween) {
        timeline = timeline.tween;
      }

      var shift = time != null ? time : this._props.duration;
      shift += timeline._props.shiftTime || 0;
      timeline.index = index;this._pushTimeline(timeline, shift);
    }
    /*
      PrivateMethod to push Tween/Timeline array.
      @private
      @param {Array} Array of Tweens/Timelines.
    */

  }, {
    key: '_pushTimelineArray',
    value: function _pushTimelineArray(array) {
      for (var i = 0; i < array.length; i++) {
        var tm = array[i];
        // recursive push to handle arrays of arrays
        if (h.isArray(tm)) {
          this._pushTimelineArray(tm);
        } else {
          this._pushTimeline(tm);
        }
      };
    }
    /*
      Method to push a single Tween/Timeline.
      @private
      @param {Object} Tween or Timeline to push.
      @param {Number} Number of milliseconds to shift the start time
                      of the Tween/Timeline.
    */

  }, {
    key: '_pushTimeline',
    value: function _pushTimeline(timeline, shift) {
      // if timeline is a module with timeline property then extract it
      if (timeline.timeline instanceof Timeline) {
        timeline = timeline.timeline;
      }
      if (timeline.tween instanceof Tween) {
        timeline = timeline.tween;
      }
      // add self delay to the timeline
      shift != null && timeline._setProp({ 'shiftTime': shift });
      this._timelines.push(timeline);
      this._recalcDuration(timeline);
    }
    /*
      Method set progress on self and child Tweens/Timelines.
      @private
      @param {Number} Progress to set.
      @param {Number} Current update time.
    */

  }, {
    key: '_setProgress',
    value: function _setProgress(p, time, isYoyo) {
      // we need to pass self previous time to children
      // to prevent initial _wasUnknownUpdate nested waterfall
      // if not yoyo option set, pass the previous time
      // otherwise, pass previous or next time regarding yoyo period.

      // COVER CURRENT SWAPPED ORDER
      this._updateChildren(p, time, isYoyo);

      Tween.prototype._setProgress.call(this, p, time);
    }
  }, {
    key: '_updateChildren',
    value: function _updateChildren(p, time, isYoyo) {
      var coef = time > this._prevTime ? -1 : 1;
      if (this._props.isYoyo && isYoyo) {
        coef *= -1;
      }
      var timeToTimelines = this._props.startTime + p * this._props.duration,
          prevTimeToTimelines = timeToTimelines + coef,
          len = this._timelines.length;

      for (var i = 0; i < len; i++) {
        // specify the children's array update loop direction
        // if time > prevTime go from 0->length else from length->0
        // var j = ( time > this._prevTime ) ? i : (len-1) - i ;
        var j = timeToTimelines > prevTimeToTimelines ? i : len - 1 - i;
        this._timelines[j]._update(timeToTimelines, prevTimeToTimelines, this._prevYoyo, this._onEdge);
      }
      this._prevYoyo = isYoyo;
    }
    /*
      Method calculate self duration based on timeline's duration.
      @private
      @param {Object} Tween or Timeline to calculate.
    */

  }, {
    key: '_recalcDuration',
    value: function _recalcDuration(timeline) {
      var p = timeline._props,
          timelineTime = p.repeatTime / p.speed + (p.shiftTime || 0) + timeline._negativeShift;

      this._props.duration = Math.max(timelineTime, this._props.duration);
    }
    /*
      Method calculate self duration from skretch.
      @private
    */

  }, {
    key: '_recalcTotalDuration',
    value: function _recalcTotalDuration() {
      var i = this._timelines.length;
      this._props.duration = 0;
      while (i--) {
        var tm = this._timelines[i];
        // recalc total duration on child timelines
        tm._recalcTotalDuration && tm._recalcTotalDuration();
        // add the timeline's duration to selft duration
        this._recalcDuration(tm);
      }
      this._calcDimentions();
    }
    /*
      Method set start and end times.
      @private
      @param {Number, Null} Time to start with.
    */

  }, {
    key: '_setStartTime',
    value: function _setStartTime(time) {
      var isReset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      babelHelpers.get(Timeline.prototype.__proto__ || Object.getPrototypeOf(Timeline.prototype), '_setStartTime', this).call(this, time);
      this._startTimelines(this._props.startTime, isReset);
    }
    /*
      Method calculate self duration based on timeline's duration.
      @private
      @param {Number, Null} Time to start with.
    */

  }, {
    key: '_startTimelines',
    value: function _startTimelines(time) {
      var isReset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var p = this._props,
          isStop = this._state === 'stop';

      time == null && (time = this._props.startTime);

      for (var i = 0; i < this._timelines.length; i++) {
        var tm = this._timelines[i];
        tm._setStartTime(time, isReset);
        // if from `_subPlay` and `_prevTime` is set and state is `stop`
        // prevTime normalizing is for play/pause functionality, so no
        // need to normalize if the timeline is in `stop` state.
        if (!isReset && tm._prevTime != null && !isStop) {
          tm._prevTime = tm._normPrevTimeForward();
        }
      }
    }
    /*
      Method to launch onRefresh callback.
      @method _refresh
      @private
      @overrides @ Tween
      @param {Boolean} If refresh even before start time.
    */

  }, {
    key: '_refresh',
    value: function _refresh(isBefore) {
      var len = this._timelines.length;
      for (var i = 0; i < len; i++) {
        this._timelines[i]._refresh(isBefore);
      }
      babelHelpers.get(Timeline.prototype.__proto__ || Object.getPrototypeOf(Timeline.prototype), '_refresh', this).call(this, isBefore);
    }
    /*
      Method do declare defaults by this._defaults object
      @private
    */

  }, {
    key: '_declareDefaults',
    value: function _declareDefaults() {
      // if duration was passed on initialization stage, warn user and reset it.
      if (this._o.duration != null) {
        h.error('Duration can not be declared on Timeline, but "' + this._o.duration + '" is. You probably want to use Tween instead.');
        this._o.duration = 0;
      }
      babelHelpers.get(Timeline.prototype.__proto__ || Object.getPrototypeOf(Timeline.prototype), '_declareDefaults', this).call(this);
      // remove default 
      this._defaults.duration = 0;
      this._defaults.easing = 'Linear.None';
      this._defaults.backwardEasing = 'Linear.None';
      this._defaults.nameBase = 'Timeline';
    }
  }]);

  function Timeline() {
    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    babelHelpers.classCallCheck(this, Timeline);
    return babelHelpers.possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, o));
  }
  /*
    Method to declare some vars.
    @private
  */


  babelHelpers.createClass(Timeline, [{
    key: '_vars',
    value: function _vars() {
      this._timelines = [];
      babelHelpers.get(Timeline.prototype.__proto__ || Object.getPrototypeOf(Timeline.prototype), '_vars', this).call(this);
    }
  }]);
  return Timeline;
}(Tween);

/*
  Class to define a module ancestor
  with timeline and tween options and functionality.
  All runable modules should inherit from this class.

  @class Tweenable
*/

var Tweenable = function (_Module) {
  babelHelpers.inherits(Tweenable, _Module);
  babelHelpers.createClass(Tweenable, [{
    key: 'play',

    /*
      `play` method for the timeline.
      @public
      @param {Number} Time shift.
      @returns this.
    */
    value: function play() {
      this.timeline.play.apply(this.timeline, arguments);
      return this;
    }
    /*
      `playBackward` method for the timeline.
      @public
      @param {Number} Time shift.
      @returns this.
    */

  }, {
    key: 'playBackward',
    value: function playBackward() {
      this.timeline.playBackward.apply(this.timeline, arguments);
      return this;
    }
    /*
      `pause` method for the timeline.
      @public
      @returns this.
    */

  }, {
    key: 'pause',
    value: function pause() {
      this.timeline.pause.apply(this.timeline, arguments);
      return this;
    }
    /*
      `stop` method for the timeline.
      @public
      @param {Number} [0...1] Progress to set on stop.
                              *Default* is `0` if `play`
                              and `1` if `playBAckward`.
      @returns this.
    */

  }, {
    key: 'stop',
    value: function stop() {
      this.timeline.stop.apply(this.timeline, arguments);
      return this;
    }
    /*
      `reset` method for the timeline.
      @public
      @returns this.
    */

  }, {
    key: 'reset',
    value: function reset() {
      this.timeline.reset.apply(this.timeline, arguments);
      return this;
    }
    /*
      `replay` method for the timeline.
      @public
      @returns this.
    */

  }, {
    key: 'replay',
    value: function replay() {
      this.timeline.replay.apply(this.timeline, arguments);
      return this;
    }
    /*
      `replay` method for the timeline.
      @public
      @returns this.
    */

  }, {
    key: 'replayBackward',
    value: function replayBackward() {
      this.timeline.replayBackward.apply(this.timeline, arguments);
      return this;
    }
    /*
      `resume` method for the timeline.
      @public
      @param {Number} Time shift.
      @returns this.
    */

  }, {
    key: 'resume',
    value: function resume() {
      var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.timeline.resume.apply(this.timeline, arguments);
      return this;
    }
    /*
      `setProgress` method for the timeline.
      @public
      @param {Number} [0...1] Progress value.
      @returns this.
    */

  }, {
    key: 'setProgress',
    value: function setProgress() {
      this.timeline.setProgress.apply(this.timeline, arguments);
      return this;
    }
    /*
      setSpeed method for the timeline.
      @param {Number} Speed value.
      @returns this.
    */

  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      this.timeline.setSpeed.apply(this.timeline, arguments);
      return this;
    }

    // ^ PUBLIC  METHOD(S) ^
    // v PRIVATE METHOD(S) v

  }]);

  function Tweenable() {
    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    babelHelpers.classCallCheck(this, Tweenable);

    // pipe function for _o object
    // before creating tween/timeline
    var _this = babelHelpers.possibleConstructorReturn(this, (Tweenable.__proto__ || Object.getPrototypeOf(Tweenable)).call(this, o));
    // super of Module


    _this._transformTweenOptions();
    // make tween only if isTweenLess option is not set
    !_this._o.isTweenLess && _this._makeTween();
    // make timeline only if isTimelineLess option is not set
    !_this._o.isTimelineLess && _this._makeTimeline();
    return _this;
  }
  /*
    Placeholder method that should be overrided
    and will be called before tween/timeline creation.
    @private
  */


  babelHelpers.createClass(Tweenable, [{
    key: '_transformTweenOptions',
    value: function _transformTweenOptions() {}
    /*
      Method to create tween.
      @private
    */

  }, {
    key: '_makeTween',
    value: function _makeTween() {
      // pass callbacks context
      this._o.callbacksContext = this._o.callbacksContext || this;
      this.tween = new Tween(this._o);
      // make timeline property point to tween one is "no timeline" mode
      this._o.isTimelineLess && (this.timeline = this.tween);
    }
    /*
      Method to create timeline.
      @private
      @param {Object} Timeline's options.
                      An object which contains "timeline" property with
                      timeline options.
    */

  }, {
    key: '_makeTimeline',
    value: function _makeTimeline() {
      // pass callbacks context
      this._o.timeline = this._o.timeline || {};
      this._o.timeline.callbacksContext = this._o.callbacksContext || this;
      this.timeline = new Timeline(this._o.timeline);
      // set the flag to indicate that real timeline is present
      this._isTimeline = true;
      // if tween exist - add it to the timeline there is some
      // modules like burst and stagger that have no tween
      this.tween && this.timeline.add(this.tween);
    }
  }]);
  return Tweenable;
}(Module);

/*
  The Thenable class adds .then public method and
  the ability to chain API calls.
*/

var Thenable = function (_Tweenable) {
  babelHelpers.inherits(Thenable, _Tweenable);

  function Thenable() {
    babelHelpers.classCallCheck(this, Thenable);
    return babelHelpers.possibleConstructorReturn(this, (Thenable.__proto__ || Object.getPrototypeOf(Thenable)).apply(this, arguments));
  }

  babelHelpers.createClass(Thenable, [{
    key: 'then',

    /*
      Method to create a then record for the module.
      @public
      @param    {Object} Options for the next animation.
      @returns  {Object} this.
    */
    value: function then(o) {
      // return if nothing was passed
      if (o == null || !Object.keys(o).length) {
        return 1;
      }
      // merge then options with the current ones
      var prevRecord = this._history[this._history.length - 1],
          prevModule = this._modules[this._modules.length - 1],
          merged = this._mergeThenOptions(prevRecord, o);

      this._resetMergedFlags(merged);
      // create a submodule of the same type as the master module
      var module = new this.constructor(merged);
      // set `this` as amster module of child module
      module._masterModule = this;
      // save the modules to the _modules array
      this._modules.push(module);
      // add module's tween into master timeline
      this.timeline.append(module);

      return this;
    }

    // ^ PUBLIC  METHOD(S) ^
    // v PRIVATE METHOD(S) v

    /*
      Method to reset some flags on merged options object.
      @private
      @param   {Object} Options object.
      @returns {Object} Options object.
    */

  }, {
    key: '_resetMergedFlags',
    value: function _resetMergedFlags(obj) {
      // set the submodule to be without timeline for perf reasons
      obj.isTimelineLess = true;
      // reset isShowStart flag for the submodules
      obj.isShowStart = false;
      // reset isRefreshState flag for the submodules
      obj.isRefreshState = false;
      // set the submodule callbacks context
      obj.callbacksContext = this._props.callbacksContext || this;
      // set previous module
      obj.prevChainModule = h.getLastItem(this._modules);
      // pass the `this` as master module
      obj.masterModule = this;
      return obj;
    }
    /*
      Method to initialize properties.
      @private
    */

  }, {
    key: '_vars',
    value: function _vars() {
      babelHelpers.get(Thenable.prototype.__proto__ || Object.getPrototypeOf(Thenable.prototype), '_vars', this).call(this);
      // save _master module
      this._masterModule = this._o.masterModule;
      // set isChained flag based on prevChainModule option
      this._isChained = !!this._masterModule;
      // we are expect that the _o object
      // have been already extended by defaults
      var initialRecord = h.cloneObj(this._props);
      for (var key in this._arrayPropertyMap) {
        if (this._o[key]) {
          var preParsed = this._parsePreArrayProperty(key, this._o[key]);
          initialRecord[key] = preParsed;
        }
      }

      this._history = [initialRecord];
      // the array holds all modules in the then chain
      this._modules = [this];
      // the props that to exclude from then merge
      this._nonMergeProps = { shape: 1 };
    }
    /*
      Method to merge two options into one. Used in .then chains.
      @private
      @param {Object} Start options for the merge.
      @param {Object} End options for the merge.
      @returns {Object} Merged options.
    */

  }, {
    key: '_mergeThenOptions',
    value: function _mergeThenOptions(start, end) {
      var o = {};
      this._mergeStartLoop(o, start);
      this._mergeEndLoop(o, start, end);
      this._history.push(o);
      return o;
    }
    /*
      Method to pipe startValue of the delta.
      @private
      @param {String} Start property name.
      @param {Any} Start property value.
      @returns {Any} Start property value.
    */

  }, {
    key: '_checkStartValue',
    value: function _checkStartValue(name, value) {
      return value;
    }
    /*
      Originally part of the _mergeThenOptions.
      Loops thru start object and copies all the props from it.
      @param {Object} An object to copy in.
      @parma {Object} Start options object.
    */

  }, {
    key: '_mergeStartLoop',
    value: function _mergeStartLoop(o, start) {
      // loop thru start options object
      for (var key in start) {
        var value = start[key];
        if (start[key] == null) {
          continue;
        };
        // copy all values from start if not tween prop or duration
        if (!h.isTweenProp(key) || key === 'duration') {
          // if delta - copy only the end value
          if (this._isDelta(value)) {
            o[key] = h.getDeltaEnd(value);
          } else {
            o[key] = value;
          }
        }
      }
    }
    /*
      Originally part of the _mergeThenOptions.
      Loops thru start object and merges all the props from it.
      @param {Object} An object to copy in.
      @parma {Object} Start options object.
      @parma {Object} End options object.
    */

  }, {
    key: '_mergeEndLoop',
    value: function _mergeEndLoop(o, start, end) {
      var endKeys = Object.keys(end);

      for (var key in end) {
        // just copy parent option
        if (key == 'parent') {
          o[key] = end[key];continue;
        };

        // get key/value of the end object
        // endKey - name of the property, endValue - value of the property
        var endValue = end[key],
            startValue = start[key] != null ? start[key] : this._defaults[key];

        startValue = this._checkStartValue(key, startValue);
        if (endValue == null) {
          continue;
        };
        // make ∆ of start -> end
        // if key name is radiusX/radiusY and
        // the startValue is not set fallback to radius value
        var isSubRadius = key === 'radiusX' || key === 'radiusY';
        if (isSubRadius && startValue == null) {
          startValue = start.radius;
        }

        var isSubRadius = key === 'scaleX' || key === 'scaleY';
        if (isSubRadius && startValue == null) {
          startValue = start.scale;
        }

        o[key] = this._mergeThenProperty(key, startValue, endValue);
      }
    }
    /*
      Method to merge `start` and `end` for a property in then record.
      @private
      @param {String} Property name.
      @param {Any}    Start value of the property.
      @param {Any}    End value of the property.
    */

  }, {
    key: '_mergeThenProperty',
    value: function _mergeThenProperty(key, startValue, endValue) {
      // if isnt tween property
      var isBoolean = typeof endValue === 'boolean',
          curve,
          easing;

      if (!h.isTweenProp(key) && !this._nonMergeProps[key] && !isBoolean) {

        if (h.isObject(endValue) && endValue.to != null) {
          curve = endValue.curve;
          easing = endValue.easing;
          endValue = endValue.to;
        }

        // if end value is delta - just save it
        if (this._isDelta(endValue)) {
          return this._parseDeltaValues(key, endValue);
        } else {
          var parsedEndValue = this._parsePreArrayProperty(key, endValue);
          // if end value is not delta - merge with start value
          if (this._isDelta(startValue)) {
            var _ref;

            // if start value is delta - take the end value
            // as start value of the new delta
            return _ref = {}, babelHelpers.defineProperty(_ref, h.getDeltaEnd(startValue), parsedEndValue), babelHelpers.defineProperty(_ref, 'easing', easing), babelHelpers.defineProperty(_ref, 'curve', curve), _ref;
            // if both start and end value are not ∆ - make ∆
          } else {
            var _ref2;

            return _ref2 = {}, babelHelpers.defineProperty(_ref2, startValue, parsedEndValue), babelHelpers.defineProperty(_ref2, 'easing', easing), babelHelpers.defineProperty(_ref2, 'curve', curve), _ref2;
          }
        }
        // copy the tween values unattended
      } else {
        return endValue;
      }
    }
    /*
      Method to retreive array's length and return -1 for
      all other types.
      @private
      @param {Array, Any} Array to get the width for.
      @returns {Number} Array length or -1 if not array.
    */

  }, {
    key: '_getArrayLength',
    value: function _getArrayLength(arr) {
      return h.isArray(arr) ? arr.length : -1;
    }
    /*
      Method to check if the property is delta property.
      @private
      @param {Any} Parameter value to check.
      @returns {Boolean}
    */

  }, {
    key: '_isDelta',
    value: function _isDelta(optionsValue) {
      var isObject = h.isObject(optionsValue);
      isObject = isObject && !optionsValue.unit;
      return !(!isObject || h.isArray(optionsValue) || h.isDOM(optionsValue));
    }
    /*
      Method to check if the module is first in `then` chain.
      @private
      @returns {Boolean} If the module is the first in module chain.
    */

  }, {
    key: '_isFirstInChain',
    value: function _isFirstInChain() {
      return !this._masterModule;
    }
    /*
      Method to check if the module is last in `then` chain.
      @private
      @returns {Boolean} If the module is the last in module chain.
    */

  }, {
    key: '_isLastInChain',
    value: function _isLastInChain() {
      var master = this._masterModule;
      // if there is no master field - check the modules length
      // if module length is 1 thus there is no modules chain 
      // it is the last one, otherwise it isnt
      if (!master) {
        return this._modules.length === 1;
      }
      // if there is master - check if it is the last item in _modules chain
      return this === h.getLastItem(master._modules);
    }
  }]);
  return Thenable;
}(Tweenable);

var Tuneable = function (_Thenable) {
  babelHelpers.inherits(Tuneable, _Thenable);

  function Tuneable() {
    babelHelpers.classCallCheck(this, Tuneable);
    return babelHelpers.possibleConstructorReturn(this, (Tuneable.__proto__ || Object.getPrototypeOf(Tuneable)).apply(this, arguments));
  }

  babelHelpers.createClass(Tuneable, [{
    key: 'tune',

    /*
      Method to start the animation with optional new options.
      @public
      @param {Object} New options to set on the run.
      @returns {Object} this.
    */
    value: function tune(o) {
      // if options object was passed
      if (o && Object.keys(o).length) {
        this._transformHistory(o);
        this._tuneNewOptions(o);
        // restore array prop values because _props
        // contain them as parsed arrays
        // but we need the as strings to store in history
        // and merge in history chains
        this._history[0] = h.cloneObj(this._props);
        for (var key in this._arrayPropertyMap) {
          if (o[key] != null) {
            this._history[0][key] = this._preparsePropValue(key, o[key]);
          }
        }

        this._tuneSubModules();
        this._resetTweens();
      }
      return this;
    }
    /*
      Method to regenerate all the random properties form initial object.
      @public
      @returns this.
    */

  }, {
    key: 'generate',
    value: function generate() {
      return this.tune(this._o);
    }

    // ^ PUBLIC  METHOD(S) ^
    // v PRIVATE METHOD(S) v

    /*
      Method to preparse options in object.
      @private
      @param {Object} Object to preparse properties on.
      @returns {Object} Passed object with preparsed props.
    */
    // _preParseOptions ( o ) {
    //   for (var key in o) {
    //     o[key] = this._preparsePropValue( key, o[key] );
    //   }
    //   return o;
    // }
    /*
      Method to transform history rewrite new options object chain on run.
      @private
      @param {Object} New options to tune for.
    */

  }, {
    key: '_transformHistory',
    value: function _transformHistory(o) {
      for (var key in o) {
        var value = o[key];
        // don't transform for childOptions
        // if ( key === 'childOptions' ) { continue; }
        this._transformHistoryFor(key, this._preparsePropValue(key, value));
      }
    }
    /*
      Method to transform history chain for specific key/value.
      @param {String} Name of the property to transform history for.
      @param {Any} The new property's value.
    */

  }, {
    key: '_transformHistoryFor',
    value: function _transformHistoryFor(key, value) {
      for (var i = 0; i < this._history.length; i++) {
        if (value = this._transformHistoryRecord(i, key, value)) {
          // break if no further history modifications needed
          if (value == null) {
            break;
          }
        }
      }
    }
    /*
      Method to transform history recod with key/value.
      @param {Number} Index of the history record to transform.
      @param {String} Property name to transform.
      @param {Any} Property value to transform to.
      @param {Object} Optional the current history record.
      @param {Object} Optional the next history record.
      @returns {Boolean} Returns true if no further
                         history modifications is needed.
    */

  }, {
    key: '_transformHistoryRecord',
    value: function _transformHistoryRecord(index, key, newVal, currRecord, nextRecord) {
      // newVal = this._parseProperty( key, newVal );
      if (newVal == null) {
        return null;
      }

      // fallback to history records, if wasn't specified
      currRecord = currRecord == null ? this._history[index] : currRecord;
      nextRecord = nextRecord == null ? this._history[index + 1] : nextRecord;

      var oldVal = currRecord[key],
          nextVal = nextRecord == null ? null : nextRecord[key];

      // if index is 0 - always save the newVal
      // and return non-delta for subsequent modifications
      if (index === 0) {
        currRecord[key] = newVal;
        // always return on tween properties
        if (h.isTweenProp(key) && key !== 'duration') {
          return null;
        }
        // nontween properties
        var isRewriteNext = this._isRewriteNext(oldVal, nextVal),
            returnVal = this._isDelta(newVal) ? h.getDeltaEnd(newVal) : newVal;
        return isRewriteNext ? returnVal : null;
      } else {
        // if was delta and came none-deltta - rewrite
        // the start of the delta and stop
        if (this._isDelta(oldVal)) {
          currRecord[key] = babelHelpers.defineProperty({}, newVal, h.getDeltaEnd(oldVal));
          return null;
        } else {
          // if the old value is not delta and the new one is
          currRecord[key] = newVal;
          // if the next item has the same value - return the
          // item for subsequent modifications or stop
          return this._isRewriteNext(oldVal, nextVal) ? newVal : null;
        }
      }
    }
    /*
      Method to check if the next item should
      be rewrited in transform history operation.
      @private
      @param {Any} Current value.
      @param {Any} Next value.
      @returns {Boolean} If need to rewrite the next value.
    */

  }, {
    key: '_isRewriteNext',
    value: function _isRewriteNext(currVal, nextVal) {
      // return false if nothing to rewrite next
      if (nextVal == null && currVal != null) {
        return false;
      }

      var isEqual = currVal === nextVal,
          isNextDelta = this._isDelta(nextVal),
          isDelta = this._isDelta(currVal),
          isValueDeltaChain = false,
          isDeltaChain = false;

      if (isDelta && isNextDelta) {
        if (h.getDeltaEnd(currVal) == h.getDeltaStart(nextVal)) {
          isDeltaChain = true;
        }
      } else if (isNextDelta) {
        isValueDeltaChain = h.getDeltaStart(nextVal) === '' + currVal;
      }

      return isEqual || isValueDeltaChain || isDeltaChain;
    }
    /*
      Method to tune new history options to all the submodules.
      @private
    */

  }, {
    key: '_tuneSubModules',
    value: function _tuneSubModules() {
      for (var i = 1; i < this._modules.length; i++) {
        this._modules[i]._tuneNewOptions(this._history[i]);
      }
    }
    /*
      Method to set new options on run.
      @param {Boolean} If foreign context.
      @private
    */

  }, {
    key: '_resetTweens',
    value: function _resetTweens() {
      var i = 0,
          shift = 0,
          tweens = this.timeline._timelines;

      // if `isTimelineLess` return
      if (tweens == null) {
        return;
      }

      for (var i = 0; i < tweens.length; i++) {
        var tween = tweens[i],
            prevTween = tweens[i - 1];

        shift += prevTween ? prevTween._props.repeatTime : 0;
        this._resetTween(tween, this._history[i], shift);
      }
      this.timeline._setProp(this._props.timeline);
      this.timeline._recalcTotalDuration();
    }
    /*
      Method to reset tween with new options.
      @param {Object} Tween to reset.
      @param {Object} Tween's to reset tween with.
      @param {Number} Optional number to shift tween start time.
    */

  }, {
    key: '_resetTween',
    value: function _resetTween(tween, o) {
      var shift = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      o.shiftTime = shift;tween._setProp(o);
    }
  }]);
  return Tuneable;
}(Thenable);

var h$1 = require('./h');
var Bit$1 = require('./shapes/bit');
var shapesMap$1 = require('./shapes/shapesMap');
// TODO
//  - refactor
//    - add setIfChanged to Module
//  --
//  - tween for every prop

var Shape = function (_Tunable) {
  babelHelpers.inherits(Shape, _Tunable);

  function Shape() {
    babelHelpers.classCallCheck(this, Shape);
    return babelHelpers.possibleConstructorReturn(this, (Shape.__proto__ || Object.getPrototypeOf(Shape)).apply(this, arguments));
  }

  babelHelpers.createClass(Shape, [{
    key: '_declareDefaults',

    /*
      Method to declare module's defaults.
      @private
    */
    value: function _declareDefaults() {
      // DEFAULTS / APIs
      this._defaults = {
        // where to append the module to [selector, HTMLElement]
        parent: document.body,
        // class name for the `el`
        className: '',
        // Possible values: [circle, line, zigzag, rect, polygon, cross, equal ]
        shape: 'circle',
        // ∆ :: Possible values: [color name, rgb, rgba, hex]
        stroke: 'transparent',
        // ∆ :: Possible values: [ 0..1 ]
        strokeOpacity: 1,
        // Possible values: ['butt' | 'round' | 'square']
        strokeLinecap: '',
        // ∆ :: Possible values: [ number ]
        strokeWidth: 2,
        // ∆ :: Units :: Possible values: [ number, string ]
        strokeDasharray: 0,
        // ∆ :: Units :: Possible values: [ number, string ]
        strokeDashoffset: 0,
        // ∆ :: Possible values: [color name, rgb, rgba, hex]
        fill: 'deeppink',
        // ∆ :: Possible values: [ 0..1 ]
        fillOpacity: 1,
        // {Boolean} - if should hide module with `opacity` instead of `display`
        isSoftHide: true,
        // {Boolean} - if should trigger composite layer for the `el`
        isForce3d: false,
        // ∆ :: Units :: Possible values: [ number, string ]
        left: '50%',
        // ∆ :: Units :: Possible values: [ number, string ]
        top: '50%',
        // ∆ :: Units :: Possible values: [ number, string ]
        x: 0,
        // ∆ :: Units :: Possible values: [ number, string ]
        y: 0,
        // ∆ :: Possible values: [ number ]
        angle: 0,
        // ∆ :: Possible values: [ number ]
        scale: 1,
        // ∆ :: Possible values: [ number ] Fallbacks to `scale`.
        scaleX: null,
        // ∆ :: Possible values: [ number ] Fallbacks to `scale`.
        scaleY: null,
        // ∆ :: Possible values: [ number, string ]
        origin: '50% 50%',
        // ∆ :: Possible values: [ 0..1 ]
        opacity: 1,
        // ∆ :: Units :: Possible values: [ number, string ]
        rx: 0,
        // ∆ :: Units :: Possible values: [ number, string ]
        ry: 0,
        // ∆ :: Possible values: [ number ]
        points: 3,
        // ∆ :: Possible values: [ number ]
        radius: 50,
        // ∆ :: Possible values: [ number ]
        radiusX: null,
        // ∆ :: Possible values: [ number ]
        radiusY: null,
        // Possible values: [ boolean ]
        isShowStart: false,
        // Possible values: [ boolean ]
        isShowEnd: true,
        // Possible values: [ boolean ]
        isRefreshState: true,
        // Possible values: [ number > 0 ]
        duration: 400,
        // Possible values: [ number ]

        /* technical ones: */
        // explicit width of the module canvas
        width: null,
        // explicit height of the module canvas
        height: null,
        // Possible values: [ number ]
        // sizeGap:          0,
        /* [boolean] :: If should have child shape. */
        isWithShape: true,
        // context for all the callbacks
        callbacksContext: this
      };
    }
    /*
      Method to start the animation with optional new options.
      @public
      @overrides @ Tunable
      @param {Object} New options to set on the run.
      @returns {Object} this.
    */

  }, {
    key: 'tune',
    value: function tune(o) {
      babelHelpers.get(Shape.prototype.__proto__ || Object.getPrototypeOf(Shape.prototype), 'tune', this).call(this, o);
      // update shapeModule's size to the max in `then` chain
      this._getMaxSizeInChain();
      return this;
    }
    /*
      Method to create a then record for the module.
      @public
      @overrides @ Thenable
      @param    {Object} Options for the next animation.
      @returns  {Object} this.
    */

  }, {
    key: 'then',
    value: function then(o) {
      // this._makeTimeline()
      babelHelpers.get(Shape.prototype.__proto__ || Object.getPrototypeOf(Shape.prototype), 'then', this).call(this, o);
      // update shapeModule's size to the max in `then` chain
      this._getMaxSizeInChain();
      return this;
    }

    // ^ PUBLIC  METHOD(S) ^
    // v PRIVATE METHOD(S) v

    /*
      Method to declare variables.
      @overrides Thenable
    */

  }, {
    key: '_vars',
    value: function _vars() {
      // call _vars method on Thenable
      babelHelpers.get(Shape.prototype.__proto__ || Object.getPrototypeOf(Shape.prototype), '_vars', this).call(this);
      this._lastSet = {};
      // save previous module in the chain
      this._prevChainModule = this._o.prevChainModule;
      // should draw on foreign svg canvas
      this.isForeign = !!this._o.ctx;
      // this._o.isTimelineLess = true;
      // should take an svg element as self bit
      return this.isForeignBit = !!this._o.shape;
    }
    /*
      Method to initialize modules presentation.
      @private
      @overrides Module
    */

  }, {
    key: '_render',
    value: function _render() {
      if (!this._isRendered && !this._isChained) {
        // create `mojs` shape element
        this.el = document.createElement('div');
        // set name on the `el`
        this.el.setAttribute('data-name', 'mojs-shape');
        // set class on the `el`
        this.el.setAttribute('class', this._props.className);
        // create shape module
        this._createShape();
        // append `el` to parent
        this._props.parent.appendChild(this.el);
        // set position styles on the el
        this._setElStyles();
        // set initial position for the first module in the chain
        this._setProgress(0, 0);
        // show at start if `isShowStart`
        if (this._props.isShowStart) {
          this._show();
        } else {
          this._hide();
        }
        // set `_isRendered` hatch
        this._isRendered = true;
      } else if (this._isChained) {
        // save elements from master module
        this.el = this._masterModule.el;
        this.shapeModule = this._masterModule.shapeModule;
      }

      return this;
    }
    /*
      Method to set el styles on initialization.
      @private
    */

  }, {
    key: '_setElStyles',
    value: function _setElStyles() {
      if (!this.el) {
        return;
      }
      // if (!this.isForeign) {
      var p = this._props,
          style = this.el.style,
          width = p.shapeWidth,
          height = p.shapeHeight;

      style.position = 'absolute';
      this._setElSizeStyles(width, height);

      if (p.isForce3d) {
        var name = 'backface-visibility';
        style['' + name] = 'hidden';
        style['' + h$1.prefix.css + name] = 'hidden';
      }
      // }
    }
    /*
      Method to set `width`/`height`/`margins` to the `el` styles.
      @param {Number} Width.
      @param {height} Height.
    */

  }, {
    key: '_setElSizeStyles',
    value: function _setElSizeStyles(width, height) {
      var style = this.el.style;
      style.width = width + 'px';
      style.height = height + 'px';
      style['margin-left'] = -width / 2 + 'px';
      style['margin-top'] = -height / 2 + 'px';
    }
    /*
      Method to draw shape.
      @private
    */

  }, {
    key: '_draw',
    value: function _draw() {
      if (!this.shapeModule) {
        return;
      }

      var p = this._props,
          bP = this.shapeModule._props;
      // set props on bit
      // bP.x                    = this._origin.x;
      // bP.y                    = this._origin.y;
      bP.rx = p.rx;
      bP.ry = p.ry;
      bP.stroke = p.stroke;
      bP['stroke-width'] = p.strokeWidth;
      bP['stroke-opacity'] = p.strokeOpacity;
      bP['stroke-dasharray'] = p.strokeDasharray;
      bP['stroke-dashoffset'] = p.strokeDashoffset;
      bP['stroke-linecap'] = p.strokeLinecap;
      bP['fill'] = p.fill;
      bP['fill-opacity'] = p.fillOpacity;
      bP.radius = p.radius;
      bP.radiusX = p.radiusX;
      bP.radiusY = p.radiusY;
      bP.points = p.points;

      this.shapeModule._draw();
      this._drawEl();
    }
    /*
      Method to set current modules props to main div el.
      @private
    */

  }, {
    key: '_drawEl',
    value: function _drawEl() {
      // return;
      if (this.el == null) {
        return true;
      }
      var p = this._props;
      var style = this.el.style;

      // style.opacity = p.opacity;
      this._isPropChanged('opacity') && (style.opacity = p.opacity);
      if (!this.isForeign) {
        this._isPropChanged('left') && (style.left = p.left);
        this._isPropChanged('top') && (style.top = p.top);

        var isX = this._isPropChanged('x'),
            isY = this._isPropChanged('y'),
            isTranslate = isX || isY,
            isScaleX = this._isPropChanged('scaleX'),
            isScaleY = this._isPropChanged('scaleY'),
            isScale = this._isPropChanged('scale'),
            isScale = isScale || isScaleX || isScaleY,
            isRotate = this._isPropChanged('angle');

        if (isTranslate || isScale || isRotate) {
          var transform = this._fillTransform();
          style[h$1.prefix.css + 'transform'] = transform;
          style['transform'] = transform;
        }

        if (this._isPropChanged('origin') || this._deltas['origin']) {
          var origin = this._fillOrigin();
          style[h$1.prefix.css + 'transform-origin'] = origin;
          style['transform-origin'] = origin;
        }
      }
    }
    /*
      Method to check if property changed after the latest check.
      @private
      @param {String} Name of the property to check.
      @returns {Boolean}
    */

  }, {
    key: '_isPropChanged',
    value: function _isPropChanged(name) {
      // if there is no recod for the property - create it
      if (this._lastSet[name] == null) {
        this._lastSet[name] = {};
      }
      if (this._lastSet[name].value !== this._props[name]) {
        this._lastSet[name].value = this._props[name];
        return true;
      } else {
        return false;
      }
    }
    /*
      Method to tune new option on run.
      @private
      @override @ Module
      @param {Object}  Option to tune on run.
    */

  }, {
    key: '_tuneNewOptions',
    value: function _tuneNewOptions(o) {
      // call super on Module
      babelHelpers.get(Shape.prototype.__proto__ || Object.getPrototypeOf(Shape.prototype), '_tuneNewOptions', this).call(this, o);
      // return if empty object
      if (!(o != null && Object.keys(o).length)) {
        return 1;
      }

      // this._calcSize();
      this._setElStyles();
    }
    /*
      Method to get max radiusX value.
      @private
      @param {String} Radius name.
    */

  }, {
    key: '_getMaxRadius',
    value: function _getMaxRadius(name) {
      var selfSize, selfSizeX;
      selfSize = this._getRadiusSize('radius');
      return this._getRadiusSize(name, selfSize);
    }
    /*
      Method to increase calculated size based on easing.
      @private
    */

  }, {
    key: '_increaseSizeWithEasing',
    value: function _increaseSizeWithEasing() {
      var p = this._props,
          easing = this._o.easing,
          isStringEasing = easing && typeof easing === 'string';

      switch (isStringEasing && easing.toLowerCase()) {
        case 'elastic.out':
        case 'elastic.inout':
          p.size *= 1.25;
          break;
        case 'back.out':
        case 'back.inout':
          p.size *= 1.1;
      }
    }
    /*
      Method to increase calculated size based on bit ratio.
      @private
    */
    // _increaseSizeWithBitRatio () {
    //   var p   = this._props;
    //   // p.size *= this.shape._props.ratio;
    //   p.size += 2 * p.sizeGap;
    // }
    /*
      Method to get maximum radius size with optional fallback.
      @private
      @param {Object}
        @param key {String} Name of the radius - [radius|radiusX|radiusY].
        @param @optional fallback {Number}  Optional number to set if there
                                            is no value for the key.
    */

  }, {
    key: '_getRadiusSize',
    value: function _getRadiusSize(name) {
      var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var delta = this._deltas[name];
      // if value is delta value
      if (delta != null) {
        // get maximum number between start and end values of the delta
        return Math.max(Math.abs(delta.end), Math.abs(delta.start));
      } else if (this._props[name] != null) {
        // else get the value from props object
        return parseFloat(this._props[name]);
      } else {
        return fallback;
      }
    }
    /*
      Method to get max shape canvas size and save it to _props.
      @private
    */

  }, {
    key: '_getShapeSize',
    value: function _getShapeSize() {
      var p = this._props,

      // get maximum stroke value
      stroke = this._getMaxStroke();
      // save shape `width` and `height` to `_props`
      p.shapeWidth = p.width != null ? p.width : 2 * this._getMaxRadius('radiusX') + stroke;

      p.shapeHeight = p.height != null ? p.height : 2 * this._getMaxRadius('radiusY') + stroke;
    }
    /*
      Method to create shape.
      @private
    */

  }, {
    key: '_createShape',
    value: function _createShape() {
      // calculate max shape canvas size and set to _props
      this._getShapeSize();
      // don't create actual shape if !`isWithShape`
      if (!this._props.isWithShape) {
        return;
      }

      var p = this._props;
      // get shape's class
      var Shape = shapesMap$1.getShape(this._props.shape);
      // create `_shape` module
      this.shapeModule = new Shape({
        width: p.shapeWidth,
        height: p.shapeHeight,
        parent: this.el
      });
    }
    /*
      Method to get max size in `then` chain
      @private
    */

  }, {
    key: '_getMaxSizeInChain',
    value: function _getMaxSizeInChain() {
      var p = this._props,
          maxW = 0,
          maxH = 0;

      for (var i = 0; i < this._modules.length; i++) {
        this._modules[i]._getShapeSize();
        maxW = Math.max(maxW, this._modules[i]._props.shapeWidth);
        maxH = Math.max(maxH, this._modules[i]._props.shapeHeight);
      }

      this.shapeModule && this.shapeModule._setSize(maxW, maxH);
      this._setElSizeStyles(maxW, maxH);
    }
    /*
      Method to get max value of the strokeWidth.
      @private
    */

  }, {
    key: '_getMaxStroke',
    value: function _getMaxStroke() {
      var p = this._props;
      var dStroke = this._deltas['strokeWidth'];
      return dStroke != null ? Math.max(dStroke.start, dStroke.end) : p.strokeWidth;
    }
    /*
      Method to draw current progress of the deltas.
      @private
      @override @ Module
      @param   {Number}  EasedProgress to set - [0..1].
      @param   {Number}  Progress to set - [0..1].
    */

  }, {
    key: '_setProgress',
    value: function _setProgress(easedProgress, progress) {
      // call the super on Module
      Module.prototype._setProgress.call(this, easedProgress, progress);
      // draw current progress
      this._draw(easedProgress);
    }
    /*
      Method to add callback overrides to passed object.
      @private
      @param {Object} Object to add the overrides to.
    */

  }, {
    key: '_applyCallbackOverrides',
    value: function _applyCallbackOverrides(obj) {
      var it = this,
          p = this._props;
      // specify control functions for the module
      obj.callbackOverrides = {
        onUpdate: function onUpdate(ep, p) {
          return it._setProgress(ep, p);
        },
        onStart: function onStart(isFwd) {
          // don't touch main `el` onStart in chained elements
          if (it._isChained) {
            return;
          };
          if (isFwd) {
            it._show();
          } else {
            if (!p.isShowStart) {
              it._hide();
            }
          }
        },
        onComplete: function onComplete(isFwd) {
          // don't touch main `el` if not the last in `then` chain
          if (!it._isLastInChain()) {
            return;
          }
          if (isFwd) {
            if (!p.isShowEnd) {
              it._hide();
            }
          } else {
            it._show();
          }
        },
        onRefresh: function onRefresh(isBefore) {
          p.isRefreshState && isBefore && it._refreshBefore();
        }
      };
    }
    /*
      Method to setup tween and timeline options before creating them.
      @override @ Tweenable
      @private  
    */

  }, {
    key: '_transformTweenOptions',
    value: function _transformTweenOptions() {
      this._applyCallbackOverrides(this._o);
    }
    /*
      Method to create transform string.
      @private
      @returns {String} Transform string.
    */

  }, {
    key: '_fillTransform',
    value: function _fillTransform() {
      var p = this._props,
          scaleX = p.scaleX != null ? p.scaleX : p.scale,
          scaleY = p.scaleY != null ? p.scaleY : p.scale,
          scale = scaleX + ', ' + scaleY;
      return 'translate(' + p.x + ', ' + p.y + ') rotate(' + p.angle + 'deg) scale(' + scale + ')';
    }
    /*
      Method to create transform-origin string.
      @private
      @returns {String} Transform string.
    */

  }, {
    key: '_fillOrigin',
    value: function _fillOrigin() {
      var p = this._props,
          str = '';
      for (var i = 0; i < p.origin.length; i++) {
        str += p.origin[i].string + ' ';
      }
      return str;
    }
    /*
      Method to refresh state befor startTime.
      @private
    */

  }, {
    key: '_refreshBefore',
    value: function _refreshBefore() {
      // call setProgress with eased and normal progress
      this._setProgress(this.tween._props.easing(0), 0);

      if (this._props.isShowStart) {
        this._show();
      } else {
        this._hide();
      }
    }
    /*
      Method that gets called on `soft` show of the module,
      it should restore transform styles of the module.
      @private
      @overrides @ Module
    */

  }, {
    key: '_showByTransform',
    value: function _showByTransform() {
      // reset the cache of the scale prop
      this._lastSet.scale = null;
      // draw el accroding to it's props
      this._drawEl();
    }
  }]);
  return Shape;
}(Tuneable);

/*
  *TODO:*
  ---
  - tweak then chains
*/

var ShapeSwirl = function (_Shape) {
  babelHelpers.inherits(ShapeSwirl, _Shape);

  function ShapeSwirl() {
    babelHelpers.classCallCheck(this, ShapeSwirl);
    return babelHelpers.possibleConstructorReturn(this, (ShapeSwirl.__proto__ || Object.getPrototypeOf(ShapeSwirl)).apply(this, arguments));
  }

  babelHelpers.createClass(ShapeSwirl, [{
    key: '_declareDefaults',

    /*
      Method to declare _defaults and other default objects.
      @private
      @override @ Shape
    */
    value: function _declareDefaults() {
      babelHelpers.get(ShapeSwirl.prototype.__proto__ || Object.getPrototypeOf(ShapeSwirl.prototype), '_declareDefaults', this).call(this);

      /* _DEFAULTS ARE - Shape DEFAULTS + THESE: */

      /* [boolean] :: If shape should follow sinusoidal path. */
      this._defaults.isSwirl = true;
      /* ∆ :: [number > 0] :: Degree size of the sinusoidal path. */
      this._defaults.swirlSize = 10;
      /* ∆ :: [number > 0] :: Frequency of the sinusoidal path. */
      this._defaults.swirlFrequency = 3;
      /* ∆ :: [number > 0] :: Sinusoidal path length scale. */
      this._defaults.pathScale = 1;
      /* ∆ :: [number] :: Degree shift for the sinusoidal path. */
      this._defaults.degreeShift = 0;
      /* ∆ :: [number] :: Radius of the shape. */
      this._defaults.radius = 5;
      // ∆ :: Units :: Possible values: [ number, string ]
      this._defaults.x = 0;
      // ∆ :: Units :: Possible values: [ number, string ]
      this._defaults.y = 0;
      // ∆ :: Possible values: [ number ]
      this._defaults.scale = { 1: 0 };
      /* [number: -1, 1] :: Directon of Swirl. */
      this._defaults.direction = 1;
    }

    // ^ PUBLIC  METHOD(S) ^
    // v PRIVATE METHOD(S) v

    /*
      Method to copy _o options to _props with
      fallback to _defaults.
      @private
      @override @ Module
    */

  }, {
    key: '_extendDefaults',
    value: function _extendDefaults() {
      babelHelpers.get(ShapeSwirl.prototype.__proto__ || Object.getPrototypeOf(ShapeSwirl.prototype), '_extendDefaults', this).call(this);
      this._calcPosData();
    }
    /*
      Method to tune new oprions to _o and _props object.
      @private
      @overrides @ Module
      @param {Object} Options object to tune to.
    */

  }, {
    key: '_tuneNewOptions',
    value: function _tuneNewOptions(o) {
      if (o == null) {
        return;
      }

      babelHelpers.get(ShapeSwirl.prototype.__proto__ || Object.getPrototypeOf(ShapeSwirl.prototype), '_tuneNewOptions', this).call(this, o);
      if (o.x != null || o.y != null) {
        this._calcPosData();
      }
    }
    /*
      Method to calculate Swirl's position data.
      @private
    */

  }, {
    key: '_calcPosData',
    value: function _calcPosData() {
      var x = this._getPosValue('x'),
          y = this._getPosValue('y'),
          angle = 90 + Math.atan(y.delta / x.delta || 0) * h.RAD_TO_DEG;

      this._posData = {
        radius: Math.sqrt(x.delta * x.delta + y.delta * y.delta),
        angle: x.delta < 0 ? angle + 180 : angle,
        x: x, y: y
      };
      // set the last position to _props
      // this._calcSwirlXY( 1 );
    }
    /*
      Gets `x` or `y` position value.
      @private
      @param {String} Name of the property.
    */

  }, {
    key: '_getPosValue',
    value: function _getPosValue(name) {
      var delta = this._deltas[name];
      if (delta) {
        // delete from deltas to prevent normal
        delete this._deltas[name];
        return {
          start: delta.start.value,
          end: delta.end.value,
          delta: delta.delta,
          units: delta.end.unit
        };
      } else {
        var pos = h.parseUnit(this._props[name]);
        return { start: pos.value, end: pos.value, delta: 0, units: pos.unit };
      }
    }
    /*
      Method to calculate the progress of the Swirl.
      @private
      @overrides @ Shape
      @param {Numer} Eased progress of the Swirl in range of [0..1]
      @param {Numer} Progress of the Swirl in range of [0..1]
    */

  }, {
    key: '_setProgress',
    value: function _setProgress(easedProgress, progress) {
      this._progress = easedProgress;
      this._calcCurrentProps(easedProgress, progress);
      this._calcSwirlXY(easedProgress);
      // this._calcOrigin();
      this._draw(easedProgress);
    }
    /*
      Method to calculate x/y for Swirl's progress
      @private
      @mutates _props
      @param {Number} Current progress in [0...1]
    */

  }, {
    key: '_calcSwirlXY',
    value: function _calcSwirlXY(proc) {
      var p = this._props,
          angle = this._posData.angle + p.degreeShift,
          point = h.getRadialPoint({
        angle: p.isSwirl ? angle + this._getSwirl(proc) : angle,
        radius: proc * this._posData.radius * p.pathScale,
        center: {
          x: this._posData.x.start,
          y: this._posData.y.start
        }
      });
      // if foreign svg canvas - set position without units
      var x = point.x,
          y = point.y,
          smallNumber = 0.000001;

      // remove very small numbers to prevent exponential forms
      if (x > 0 && x < smallNumber) {
        x = smallNumber;
      }
      if (y > 0 && y < smallNumber) {
        y = smallNumber;
      }
      if (x < 0 && x > -smallNumber) {
        x = -smallNumber;
      }
      if (y < 0 && y > -smallNumber) {
        y = -smallNumber;
      }

      p.x = this._o.ctx ? x : '' + x + this._posData.x.units;
      p.y = this._o.ctx ? y : '' + y + this._posData.y.units;
    }
    /*
      Method to get progress of the swirl.
      @private
      @param {Number} Progress of the Swirl.
      @returns {Number} Progress of the swirl.
    */

  }, {
    key: '_getSwirl',
    value: function _getSwirl(proc) {
      var p = this._props;
      return p.direction * p.swirlSize * Math.sin(p.swirlFrequency * proc);
    }
    /*
      Method to draw shape.
      If !isWithShape - draw self el only, but not shape.
      @private
      @overrides @ Shape.
    */

  }, {
    key: '_draw',
    value: function _draw() {
      // call _draw or just _drawEl @ Shape depending if there is `shape`
      var methodName = this._props.isWithShape ? '_draw' : '_drawEl';
      Shape.prototype[methodName].call(this);
    }
  }]);
  return ShapeSwirl;
}(Shape);

// import Shape    from './shape';

var Burst = function (_Tunable) {
  babelHelpers.inherits(Burst, _Tunable);

  function Burst() {
    babelHelpers.classCallCheck(this, Burst);
    return babelHelpers.possibleConstructorReturn(this, (Burst.__proto__ || Object.getPrototypeOf(Burst)).apply(this, arguments));
  }

  babelHelpers.createClass(Burst, [{
    key: '_declareDefaults',

    /*
      Method to declare defaults.
      @override @ ShapeSwirl.
    */
    value: function _declareDefaults() {
      this._defaults = {
        /* [number > 0] :: Quantity of Burst particles. */
        count: 5,
        /* [0 < number < 360] :: Degree of the Burst. */
        degree: 360,
        /* ∆ :: [number > 0] :: Radius of the Burst. */
        radius: { 0: 50 },
        /* ∆ :: [number > 0] :: X radius of the Burst. */
        radiusX: null,
        /* ∆ :: [number > 0] :: Y radius of the Burst. */
        radiusY: null,
        /* [number >= 0] :: width of the main swirl. */
        width: 0,
        /* [number >= 0] :: height of the main swirl. */
        height: 0
      };
    }
    /*
      Method to create a then record for the module.
      @public
      overrides @ Thenable
      @param    {Object} Options for the next animation.
      @returns  {Object} this.
    */

  }, {
    key: 'then',
    value: function then(o) {
      // remove tween properties (not callbacks)
      this._removeTweenProperties(o);

      var newMaster = this._masterThen(o),
          newSwirls = this._childThen(o);

      this._setSwirlDuration(newMaster, this._calcPackTime(newSwirls));

      this.timeline._recalcTotalDuration();
      return this;
    }
    /*
      Method to start the animation with optional new options.
      @public
      @param {Object} New options to set on the run.
      @returns {Object} this.
    */

  }, {
    key: 'tune',
    value: function tune(o) {
      if (o == null) {
        return this;
      }
      // save timeline options to _timelineOptions
      // and delete the timeline options on o
      // cuz masterSwirl should not get them
      this._saveTimelineOptions(o);

      // add new timeline properties to timeline
      this.timeline._setProp(this._timelineOptions);

      // remove tween options (not callbacks)
      this._removeTweenProperties(o);

      // tune _props
      this._tuneNewOptions(o);

      // tune master swirl
      this.masterSwirl.tune(o);

      // tune child swirls
      this._tuneSwirls(o);

      // recalc time for modules
      this._recalcModulesTime();
      return this;
    }

    // ^ PUBLIC  METHODS ^
    // v PRIVATE METHODS v

    /*
      Method to copy `_o` options to `_props` object
      with fallback to `_defaults`.
      @private
      @overrides @ Module
    */

  }, {
    key: '_extendDefaults',
    value: function _extendDefaults() {
      // remove tween properties (not callbacks)
      this._removeTweenProperties(this._o);
      babelHelpers.get(Burst.prototype.__proto__ || Object.getPrototypeOf(Burst.prototype), '_extendDefaults', this).call(this);
    }
    /*
      Method to remove all tween (excluding
      callbacks) props from object.
      @private
      @param {Object} Object which should be cleaned
                      up from tween properties.
    */

  }, {
    key: '_removeTweenProperties',
    value: function _removeTweenProperties(o) {
      for (var key in h.tweenOptionMap) {
        // remove all items that are not declared in _defaults
        if (this._defaults[key] == null) {
          delete o[key];
        }
      }
    }
    /*
      Method to recalc modules chain tween
      times after tuning new options.
      @private
    */

  }, {
    key: '_recalcModulesTime',
    value: function _recalcModulesTime() {
      var modules = this.masterSwirl._modules,
          swirls = this._swirls,
          shiftTime = 0;

      for (var i = 0; i < modules.length; i++) {
        var tween = modules[i].tween,
            packTime = this._calcPackTime(swirls[i]);
        tween._setProp({ 'duration': packTime, 'shiftTime': shiftTime });
        shiftTime += packTime;
      }

      this.timeline._recalcTotalDuration();
    }
    /*
      Method to tune Swirls with new options.
      @private
      @param {Object} New options.
    */

  }, {
    key: '_tuneSwirls',
    value: function _tuneSwirls(o) {
      // get swirls in first pack
      var pack0 = this._swirls[0];
      for (var i = 0; i < pack0.length; i++) {
        var swirl = pack0[i],
            option = this._getChildOption(o || {}, i);

        // since the `degreeShift` participate in
        // children position calculations, we need to keep
        // the old `degreeShift` value if new not set
        var isDegreeShift = option.degreeShift != null;
        if (!isDegreeShift) {
          option.degreeShift = this._swirls[0][i]._props.degreeShift;
        }

        this._addBurstProperties(option, i);

        // after burst position calculation - delete the old `degreeShift`
        // from the options, since anyways we have copied it from the swirl
        if (!isDegreeShift) {
          delete option.degreeShift;
        }

        swirl.tune(option);
        this._refreshBurstOptions(swirl._modules, i);
      }
    }
    /*
      Method to refresh burst x/y/angle options on further chained 
      swirls, because they will be overriden after `tune` call on
      very first swirl.
      @param {Array} Chained modules array
      param {Number} Index of the first swirl in the chain.
    */

  }, {
    key: '_refreshBurstOptions',
    value: function _refreshBurstOptions(modules, i) {
      for (var j = 1; j < modules.length; j++) {
        var module = modules[j],
            options = {};
        this._addBurstProperties(options, i, j);
        module._tuneNewOptions(options);
      }
    }
    /*
      Method to call then on masterSwirl.
      @param {Object} Then options.
      @returns {Object} New master swirl.
    */

  }, {
    key: '_masterThen',
    value: function _masterThen(o) {
      this.masterSwirl.then(o);
      // get the latest master swirl in then chain
      var newMasterSwirl = h.getLastItem(this.masterSwirl._modules);
      // save to masterSwirls
      this._masterSwirls.push(newMasterSwirl);
      return newMasterSwirl;
    }
    /*
      Method to call then on child swilrs.
      @param {Object} Then options.
      @return {Array} Array of new Swirls.
    */

  }, {
    key: '_childThen',
    value: function _childThen(o) {
      var pack = this._swirls[0],
          newPack = [];

      for (var i = 0; i < pack.length; i++) {
        // get option by modulus
        var options = this._getChildOption(o, i);
        var swirl = pack[i];
        var lastSwirl = h.getLastItem(swirl._modules);
        // add new Master Swirl as parent of new childswirl
        options.parent = this.el;

        this._addBurstProperties(options, i, this._masterSwirls.length - 1);

        swirl.then(options);

        // save the new item in `then` chain
        newPack.push(h.getLastItem(swirl._modules));
      }
      // save the pack to _swirls object
      this._swirls[this._masterSwirls.length - 1] = newPack;
      return newPack;
    }
    /*
      Method to initialize properties.
      @private
      @overrides @ Thenable
    */

  }, {
    key: '_vars',
    value: function _vars() {
      babelHelpers.get(Burst.prototype.__proto__ || Object.getPrototypeOf(Burst.prototype), '_vars', this).call(this);
      // just buffer timeline for calculations
      this._bufferTimeline = new Timeline();
    }
    /*
      Method for initial render of the module.
    */

  }, {
    key: '_render',
    value: function _render() {
      this._o.isWithShape = false;
      this._o.isSwirl = this._props.isSwirl;
      this._o.callbacksContext = this;
      // save timeline options and remove from _o
      // cuz the master swirl should not get them
      this._saveTimelineOptions(this._o);

      this.masterSwirl = new MainSwirl(this._o);
      this._masterSwirls = [this.masterSwirl];
      this.el = this.masterSwirl.el;

      this._renderSwirls();
    }
    /*
      Method for initial render of swirls.
      @private
    */

  }, {
    key: '_renderSwirls',
    value: function _renderSwirls() {
      var p = this._props,
          pack = [];

      for (var i = 0; i < p.count; i++) {
        var option = this._getChildOption(this._o, i);
        pack.push(new ChildSwirl(this._addOptionalProps(option, i)));
      }
      this._swirls = { 0: pack };
      this._setSwirlDuration(this.masterSwirl, this._calcPackTime(pack));
    }
    /*
      Method to save timeline options to _timelineOptions
      and delete the property on the object.
      @private
      @param {Object} The object to save the timeline options from.
    */

  }, {
    key: '_saveTimelineOptions',
    value: function _saveTimelineOptions(o) {
      this._timelineOptions = o.timeline;
      delete o.timeline;
    }
    /*
      Method to calculate total time of array of
      concurrent tweens.
      @param   {Array}  Pack to calculate the total time for.
      @returns {Number} Total pack duration.
    */

  }, {
    key: '_calcPackTime',
    value: function _calcPackTime(pack) {
      var maxTime = 0;
      for (var i = 0; i < pack.length; i++) {
        var tween = pack[i].tween,
            p = tween._props;

        maxTime = Math.max(p.repeatTime / p.speed, maxTime);
      }

      return maxTime;
    }
    /*
      Method to set duration for Swirl.
      @param {Object} Swirl instance to set the duration to.
      @param {Number} Duration to set.
    */

  }, {
    key: '_setSwirlDuration',
    value: function _setSwirlDuration(swirl, duration) {
      swirl.tween._setProp('duration', duration);
      var isRecalc = swirl.timeline && swirl.timeline._recalcTotalDuration;
      isRecalc && swirl.timeline._recalcTotalDuration();
    }
    /*
      Method to get childOption form object call by modulus.
      @private
      @param   {Object} Object to look in.
      @param   {Number} Index of the current Swirl.
      @returns {Object} Options for the current swirl.
    */

  }, {
    key: '_getChildOption',
    value: function _getChildOption(obj, i) {
      var options = {};
      for (var key in obj.children) {
        options[key] = this._getPropByMod(key, i, obj.children);
      }
      return options;
    }
    /*
      Method to get property by modulus.
      @private
      @param {String} Name of the property.
      @param {Number} Index for the modulus.
      @param {Object} Source object to check in.
      @returns {Any} Property.
    */

  }, {
    key: '_getPropByMod',
    value: function _getPropByMod(name, index) {
      var sourceObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var prop = sourceObj[name];
      return h.isArray(prop) ? prop[index % prop.length] : prop;
    }
    /*
      Method to add optional Swirls' properties to passed object.
      @private
      @param {Object} Object to add the properties to.
      @param {Number} Index of the property.
    */

  }, {
    key: '_addOptionalProps',
    value: function _addOptionalProps(options, index) {
      options.index = index;
      options.parent = this.masterSwirl.el;

      this._addBurstProperties(options, index);

      return options;
    }
    /*
      Method to add Burst options to object.
      @private
      @param {Object} Options to add the properties to.
      @param {Number} Index of the Swirl.
      @param {Number} Index of the main swirl.
    */

  }, {
    key: '_addBurstProperties',
    value: function _addBurstProperties(options, index, i) {
      // save index of the module
      var mainIndex = this._index;
      // temporary change the index to parse index based properties like stagger
      this._index = index;
      // parse degree shift for the bit
      var degreeShift = this._parseProperty('degreeShift', options.degreeShift || 0);
      // put the index of the module back
      this._index = mainIndex;

      var p = this._props,
          degreeCnt = p.degree % 360 === 0 ? p.count : p.count - 1 || 1,
          step = p.degree / degreeCnt,
          pointStart = this._getSidePoint('start', index * step + degreeShift, i),
          pointEnd = this._getSidePoint('end', index * step + degreeShift, i);

      options.x = this._getDeltaFromPoints('x', pointStart, pointEnd);
      options.y = this._getDeltaFromPoints('y', pointStart, pointEnd);

      options.angle = this._getBitAngle(options.angle || 0, degreeShift, index);
    }
    /* 
      Method to get shapes angle in burst so
      it will follow circular shape.
       
       @param    {Number, Object} Base angle.
       @param    {Number}         Angle shift for the bit
       @param    {Number}         Shape's index in burst.
       @returns  {Number}         Angle in burst.
    */

  }, {
    key: '_getBitAngle',
    value: function _getBitAngle() {
      var angleProperty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var angleShift = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var i = arguments[2];

      var p = this._props,
          degCnt = p.degree % 360 === 0 ? p.count : p.count - 1 || 1,
          step = p.degree / degCnt,
          angle = i * step + 90;

      angle += angleShift;
      // if not delta option
      if (!this._isDelta(angleProperty)) {
        angleProperty += angle;
      } else {
        var delta = {},
            keys = Object.keys(angleProperty),
            start = keys[0],
            end = angleProperty[start];

        start = h.parseStringOption(start, i);
        end = h.parseStringOption(end, i);
        // new start = newEnd
        delta[parseFloat(start) + angle] = parseFloat(end) + angle;

        angleProperty = delta;
      }
      return angleProperty;
    }
    /*
      Method to get radial point on `start` or `end`.
      @private
      @param {String} Name of the side - [start, end].
      @param {Number} Angle of the radial point.
      @param {Number} Index of the main swirl.
      @returns radial point.
    */

  }, {
    key: '_getSidePoint',
    value: function _getSidePoint(side, angle, i) {
      var p = this._props,
          sideRadius = this._getSideRadius(side, i);

      return h.getRadialPoint({
        radius: sideRadius.radius,
        radiusX: sideRadius.radiusX,
        radiusY: sideRadius.radiusY,
        angle: angle,
        // center:  { x: p.center, y: p.center }
        center: { x: 0, y: 0 }
      });
    }
    /*
      Method to get radius of the side.
      @private
      @param {String} Name of the side - [start, end].
      @param {Number} Index of the main swirl.
      @returns {Object} Radius.
    */

  }, {
    key: '_getSideRadius',
    value: function _getSideRadius(side, i) {
      return {
        radius: this._getRadiusByKey('radius', side, i),
        radiusX: this._getRadiusByKey('radiusX', side, i),
        radiusY: this._getRadiusByKey('radiusY', side, i)
      };
    }
    /*
      Method to get radius from ∆ or plain property.
      @private
      @param {String} Key name.
      @param {String} Side name - [start, end].
      @param {Number} Index of the main swirl.
      @returns {Number} Radius value.
    */

  }, {
    key: '_getRadiusByKey',
    value: function _getRadiusByKey(key, side) {
      var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var swirl = this._masterSwirls[i],
          deltas = swirl._deltas,
          props = swirl._props;

      if (deltas[key] != null) {
        return deltas[key][side];
      } else if (props[key] != null) {
        return props[key];
      }
    }
    /*
      Method to get delta from start and end position points.
      @private
      @param {String} Key name.
      @param {Object} Start position point.
      @param {Object} End position point.
      @returns {Object} Delta of the end/start.
    */

  }, {
    key: '_getDeltaFromPoints',
    value: function _getDeltaFromPoints(key, pointStart, pointEnd) {
      var delta = {};
      if (pointStart[key] === pointEnd[key]) {
        delta = pointStart[key];
      } else {
        delta[pointStart[key]] = pointEnd[key];
      }
      return delta;
    }
    /*
      Method to create timeline.
      @private
      @override @ Tweenable
    */

  }, {
    key: '_makeTimeline',
    value: function _makeTimeline() {
      // restore timeline options that were deleted in _render method
      this._o.timeline = this._timelineOptions;
      babelHelpers.get(Burst.prototype.__proto__ || Object.getPrototypeOf(Burst.prototype), '_makeTimeline', this).call(this);
      this.timeline.add(this.masterSwirl, this._swirls[0]);
    }
    /*
      Method to make Tween for the module.
      @private
      @override @ Tweenable
    */

  }, {
    key: '_makeTween',
    value: function _makeTween() {} /* don't create any tween */
    /*
      Override `_hide` and `_show` methods on module
      since we don't have to hide nor show on the module.
    */

  }, {
    key: '_hide',
    value: function _hide() {/* do nothing */}
  }, {
    key: '_show',
    value: function _show() {/* do nothing */}
  }]);
  return Burst;
}(Tuneable);

var ChildSwirl = function (_ShapeSwirl) {
  babelHelpers.inherits(ChildSwirl, _ShapeSwirl);

  function ChildSwirl() {
    babelHelpers.classCallCheck(this, ChildSwirl);
    return babelHelpers.possibleConstructorReturn(this, (ChildSwirl.__proto__ || Object.getPrototypeOf(ChildSwirl)).apply(this, arguments));
  }

  babelHelpers.createClass(ChildSwirl, [{
    key: '_declareDefaults',
    value: function _declareDefaults() {
      babelHelpers.get(ChildSwirl.prototype.__proto__ || Object.getPrototypeOf(ChildSwirl.prototype), '_declareDefaults', this).call(this);
      this._defaults.isSwirl = false;
      this._o.duration = this._o.duration != null ? this._o.duration : 700;
    }
    // disable degreeshift calculations

  }, {
    key: '_calcSwirlXY',
    value: function _calcSwirlXY(proc) {
      var degreeShift = this._props.degreeShift;

      this._props.degreeShift = 0;
      babelHelpers.get(ChildSwirl.prototype.__proto__ || Object.getPrototypeOf(ChildSwirl.prototype), '_calcSwirlXY', this).call(this, proc);
      this._props.degreeShift = degreeShift;
    }
  }]);
  return ChildSwirl;
}(ShapeSwirl);

var MainSwirl = function (_ChildSwirl) {
  babelHelpers.inherits(MainSwirl, _ChildSwirl);

  function MainSwirl() {
    babelHelpers.classCallCheck(this, MainSwirl);
    return babelHelpers.possibleConstructorReturn(this, (MainSwirl.__proto__ || Object.getPrototypeOf(MainSwirl)).apply(this, arguments));
  }

  babelHelpers.createClass(MainSwirl, [{
    key: '_declareDefaults',
    value: function _declareDefaults() {
      babelHelpers.get(MainSwirl.prototype.__proto__ || Object.getPrototypeOf(MainSwirl.prototype), '_declareDefaults', this).call(this);
      this._defaults.scale = 1;
      this._defaults.width = 0;
      this._defaults.height = 0;
      this._defaults.radius = { 25: 75 };
      // this._defaults.duration = 2000;
    }
  }]);
  return MainSwirl;
}(ChildSwirl);

Burst.ChildSwirl = ChildSwirl;
Burst.MainSwirl = MainSwirl;

var h$3 = require('../h');
var Delta = function () {
  function Delta() {
    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    babelHelpers.classCallCheck(this, Delta);

    this._o = o;
    this._createTween(o.tweenOptions);
    // initial properties render
    !this._o.isChained && this.refresh(true);
  }
  /*
    Method to call `_refresh` method on `tween`.
    Use switch between `0` and `1` progress for delta value.
    @public
    @param {Boolean} If refresh before start time or after.
    @returns this.
  */


  babelHelpers.createClass(Delta, [{
    key: 'refresh',
    value: function refresh(isBefore) {
      this._previousValues = [];

      var deltas = this._o.deltas;
      for (var i = 0; i < deltas.length; i++) {
        var name = deltas[i].name;
        this._previousValues.push({
          name: name, value: this._o.props[name]
        });
      }

      this.tween._refresh(isBefore);
      return this;
    }
    /*
      Method to restore all saved properties from `_previousValues` array.
      @public
      @returns this.
    */

  }, {
    key: 'restore',
    value: function restore() {
      var prev = this._previousValues;
      for (var i = 0; i < prev.length; i++) {
        var record = prev[i];
        this._o.props[record.name] = record.value;
      }
      return this;
    }
    /*
      Method to create tween of the delta.
      @private
      @param {Object} Options object.
    */

  }, {
    key: '_createTween',
    value: function _createTween() {
      var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var it = this;
      o.callbackOverrides = {
        onUpdate: function onUpdate(ep, p) {
          it._calcCurrentProps(ep, p);
        }
      };

      // if not chained - add the onRefresh callback
      // to refresh the tween when needed
      if (!this._o.isChained) {
        o.callbackOverrides.onRefresh = function (isBefore, ep, p) {
          it._calcCurrentProps(ep, p);
        };
      }

      o.callbacksContext = this._o.callbacksContext;
      this.tween = new Tween(o);
    }
    /*
      Method to calculate current progress of the deltas.
      @private
      @param {Number} Eased progress to calculate - [0..1].
      @param {Number} Progress to calculate - [0..1].
    */

  }, {
    key: '_calcCurrentProps',
    value: function _calcCurrentProps(easedProgress, p) {
      var deltas = this._o.deltas;
      for (var i = 0; i < deltas.length; i++) {
        var type = deltas[i].type;
        this['_calcCurrent_' + type](deltas[i], easedProgress, p);
      }
    }
    /*
      Method to calc the current color delta value.
      @param {Object} Delta
      @param {Number} Eased progress [0..1].
      @param {Number} Plain progress [0..1].
    */

  }, {
    key: '_calcCurrent_color',
    value: function _calcCurrent_color(delta, ep, p) {
      var r,
          g,
          b,
          a,
          start = delta.start,
          d = delta.delta;
      if (!delta.curve) {
        r = parseInt(start.r + ep * d.r, 10);
        g = parseInt(start.g + ep * d.g, 10);
        b = parseInt(start.b + ep * d.b, 10);
        a = parseFloat(start.a + ep * d.a);
      } else {
        var cp = delta.curve(p);
        r = parseInt(cp * (start.r + p * d.r), 10);
        g = parseInt(cp * (start.g + p * d.g), 10);
        b = parseInt(cp * (start.b + p * d.b), 10);
        a = parseFloat(cp * (start.a + p * d.a));
      }
      this._o.props[delta.name] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
    /*
      Method to calc the current number delta value.
      @param {Object} Delta
      @param {Number} Eased progress [0..1].
      @param {Number} Plain progress [0..1].
    */

  }, {
    key: '_calcCurrent_number',
    value: function _calcCurrent_number(delta, ep, p) {
      this._o.props[delta.name] = !delta.curve ? delta.start + ep * delta.delta : delta.curve(p) * (delta.start + p * delta.delta);
    }
    /*
      Method to calc the current number with units delta value.
      @param {Object} Delta
      @param {Number} Eased progress [0..1].
      @param {Number} Plain progress [0..1].
    */

  }, {
    key: '_calcCurrent_unit',
    value: function _calcCurrent_unit(delta, ep, p) {
      var currentValue = !delta.curve ? delta.start.value + ep * delta.delta : delta.curve(p) * (delta.start.value + p * delta.delta);

      this._o.props[delta.name] = '' + currentValue + delta.end.unit;
    }
    /*
      Method to calc the current array delta value.
      @param {Object} Delta
      @param {Number} Eased progress [0..1].
      @param {Number} Plain progress [0..1].
    */

  }, {
    key: '_calcCurrent_array',
    value: function _calcCurrent_array(delta, ep, p) {
      // var arr,
      var name = delta.name,
          props = this._o.props,
          string = '';

      // to prevent GC bothering with arrays garbage
      // if ( h.isArray( props[name] ) ) {
      //   arr = props[name];
      //   arr.length = 0;
      // } else { arr = []; }

      // just optimization to prevent curve
      // calculations on every array item
      var proc = delta.curve ? delta.curve(p) : null;

      for (var i = 0; i < delta.delta.length; i++) {
        var item = delta.delta[i],
            dash = !delta.curve ? delta.start[i].value + ep * item.value : proc * (delta.start[i].value + p * item.value);

        string += '' + dash + item.unit + ' ';
        // arr.push({
        //   string: `${dash}${item.unit}`,
        //   value:  dash,
        //   unit:   item.unit,
        // });
      }
      props[name] = string;
    }
  }]);
  return Delta;
}();

/*
  This module's target is to parse options object,
  find deltas in it and send them to `Delta` classes.
  The `Delta` class is dull - they expect actual parsed deltas
  and separated tween options, so we should parse them here.
  The timeline of the module controls the `Delta` modules' tweens.

  @param {Object} props Object to set deltas result to (pass to the Delta classes).
  @param {Object} options Object to parse the deltas from.
  @param {Function} onUpdate onUpdate callback.
  @param optional {Object} arrayPropertyMap List of properties with truthy
                                            values which describe properties
                                            that should be parsed as arrays.
  @param optional {Object} numberPropertyMap List of properties with truthy
                                            values which describe properties
                                            that should be parsed as numbers
                                            without units.
*/

// TODO:
// - colors with curves change alpha level too
// const html = new mojs.Html({
//   el: '#js-el',
//   x: { 0: 100 },
//   onUpdate () {
//     console.log(this._props.originX);
//   },
//   originX: { 'white': 'black', curve: 'M0,100 L100, 0' },
//   customProperties: {
//     originX: {
//       type: 'color',
//       default: 'cyan'
//     },
//     draw() { console.log('draw'); }
//   }
// });


var easing$2 = require('../easing/easing');
var h$2 = require('../h');
// get tween properties
var obj$1 = {};
Tween.prototype._declareDefaults.call(obj$1);
var keys$1 = Object.keys(obj$1._defaults);
for (var i$1 = 0; i$1 < keys$1.length; i$1++) {
  obj$1._defaults[keys$1[i$1]] = 1;
}
obj$1._defaults['timeline'] = 1;
var TWEEN_PROPERTIES$1 = obj$1._defaults;

var Deltas = function () {
  function Deltas() {
    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    babelHelpers.classCallCheck(this, Deltas);

    this._o = o;

    this._shortColors = {
      transparent: 'rgba(0,0,0,0)',
      none: 'rgba(0,0,0,0)',
      aqua: 'rgb(0,255,255)',
      black: 'rgb(0,0,0)',
      blue: 'rgb(0,0,255)',
      fuchsia: 'rgb(255,0,255)',
      gray: 'rgb(128,128,128)',
      green: 'rgb(0,128,0)',
      lime: 'rgb(0,255,0)',
      maroon: 'rgb(128,0,0)',
      navy: 'rgb(0,0,128)',
      olive: 'rgb(128,128,0)',
      purple: 'rgb(128,0,128)',
      red: 'rgb(255,0,0)',
      silver: 'rgb(192,192,192)',
      teal: 'rgb(0,128,128)',
      white: 'rgb(255,255,255)',
      yellow: 'rgb(255,255,0)',
      orange: 'rgb(255,128,0)'
    };

    this._ignoreDeltasMap = { prevChainModule: 1, masterModule: 1 };

    this._parseDeltas(o.options);
    this._createDeltas();
    this._createTimeline(this._mainTweenOptions);
  }
  /*
    Method to call `refresh` on all child `delta` objects.
    @public
    @param {Boolean} If before start time (true) or after end time (false).
  */


  babelHelpers.createClass(Deltas, [{
    key: 'refresh',
    value: function refresh(isBefore) {
      for (var i = 0; i < this._deltas.length; i++) {
        this._deltas[i].refresh(isBefore);
      }
      return this;
    }
    /*
      Method to call `restore` on all child `delta` objects.
      @public
    */

  }, {
    key: 'restore',
    value: function restore() {
      for (var i = 0; i < this._deltas.length; i++) {
        this._deltas[i].restore();
      }
      return this;
    }
    /*
      Method to create Timeline.
      @private
      @param {Object} Timeline options.
    */

  }, {
    key: '_createTimeline',
    value: function _createTimeline() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // const o = this._o;
      // opts.timeline = opts.timeline || {};
      // opts.timeline.callbackOverrides = {
      //   onUpdate:   o.onUpdate,
      //   onRefresh:  o.onUpdate
      // }
      // send callbacksContext to timeline if set
      // o.callbacksContext && (opts.timeline.callbacksContext = o.callbacksContext);
      // opts.timeline
      this.timeline = new Timeline();
      this.timeline.add(this._deltas);
    }
    /*
      Method to create Deltas from parsed options.
      @private
    */

  }, {
    key: '_createDeltas',
    value: function _createDeltas() {
      this._deltas = [];

      // create main delta object
      this._deltas.push(this._createDelta(this._mainDeltas, this._mainTweenOptions));

      // create child delta object
      for (var i = 0; i < this._childDeltas.length; i++) {
        var delta = this._childDeltas[i];
        this._deltas.push(this._createDelta([delta.delta], delta.tweenOptions));
      }
    }
    /*
      Method to create Delta object with passed options.
      @private
      @param {Array} Array of deltas.
      @param {Object} Tween properties.
      @returns {Object} Delta object
    */

  }, {
    key: '_createDelta',
    value: function _createDelta(deltas, tweenOptions) {
      var o = this._o;
      return new Delta({
        deltas: deltas, tweenOptions: tweenOptions,
        props: o.props,
        isChained: o.isChained,
        callbacksContext: o.callbacksContext
      });
    }
    /*
      Method to parse delta objects from options.
      @private
      @param {Object} Options object to parse the deltas from.
    */

  }, {
    key: '_parseDeltas',
    value: function _parseDeltas(obj) {
      // spilt main animation properties and main tween properties
      var mainSplit = this._splitTweenOptions(obj);
      // main animation properties
      var opts = mainSplit.delta;
      // main tween properties
      this._mainTweenOptions = mainSplit.tweenOptions;

      this._mainDeltas = [];
      this._childDeltas = [];
      var keys = Object.keys(opts);
      // loop thru all properties without tween ones
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // is property is delta - parse it
        if (this._isDelta(opts[key]) && !this._ignoreDeltasMap[key]) {
          var delta = this._splitAndParseDelta(key, opts[key]);
          // if parsed object has no tween values - it's delta of the main object
          if (!delta.tweenOptions) {
            this._mainDeltas.push(delta.delta);
          }
          // otherwise it is distinct delta object
          else {
              this._childDeltas.push(delta);
            }
        }
      }
    }
    /*
      Method to split tween values and parse single delta record.
      @private
      @param {String} Property name.
      @param {Object} Raw delta object.
      @returns {Object} Split object.
                  @param {Object} tweenOptions Tween properties.
                  @param {Object} delta Parsed delta.
    */

  }, {
    key: '_splitAndParseDelta',
    value: function _splitAndParseDelta(name, object) {
      var split = this._splitTweenOptions(object);
      // parse delta in the object
      split.delta = this._parseDelta(name, split.delta);
      return split;
    }
    /*
      Method to parse delta by delegating the variables to _parse*Delta methods.
      @private
      @param {String} Property name.
      @param {Object} Raw delta object.
      @param {Number} Module index.
    */

  }, {
    key: '_parseDelta',
    value: function _parseDelta(name, object, index) {
      // if name is in _o.customProps - parse it regarding the type
      return this._o.customProps && this._o.customProps[name] != null ? this._parseDeltaByCustom(name, object, index) : this._parseDeltaByGuess(name, object, index);
    }
    /**
      Method to parse delta by taking the type from the customProps object.
      @private
      @param {String} Property name.
      @param {Object} Raw delta object.
      @param {Number} Module index.
    */

  }, {
    key: '_parseDeltaByCustom',
    value: function _parseDeltaByCustom(name, object, index) {
      return this._parseNumberDelta(name, object, index);
      // const customRecord = this._o.customProps[name];
      // switch ( customRecord.type.toLowerCase() ) {
      //   case 'color':  { return this._parseColorDelta( name, object ); }
      //   case 'array':  { return this._parseArrayDelta( name, object ); }
      //   case 'number': { return this._parseNumberDelta( name, object, index ); }
      //   case 'unit':   { return this._parseUnitDelta( name, object, index ); }
      // }
    }
    /**
      Method to parse delta by reasoning about it's value.
      @private
      @param {String} Property name.
      @param {Object} Raw delta object.
      @param {Number} Module index.
    */

  }, {
    key: '_parseDeltaByGuess',
    value: function _parseDeltaByGuess(name, object, index) {
      var _preparseDelta2 = this._preparseDelta(object);

      var start = _preparseDelta2.start;

      var o = this._o;

      // color values
      if (isNaN(parseFloat(start)) && !start.match(/rand\(/) && !start.match(/stagger\(/)) {
        return this._parseColorDelta(name, object);
        // array values
      } else if (o.arrayPropertyMap && o.arrayPropertyMap[name]) {
        return this._parseArrayDelta(name, object);
        // unit or number values
      } else {
        return o.numberPropertyMap && o.numberPropertyMap[name] ?
        // if the property is in the number property map - parse it like number
        this._parseNumberDelta(name, object, index)
        // otherwise - like number with units
        : this._parseUnitDelta(name, object, index);
      }
    }
    /*
      Method to separate tween options from delta properties.
      @param {Object} Object for separation.
      @returns {Object} Object that contains 2 objects
                          - one delta options
                          - one tween options ( could be empty if no tween opts )
    */

  }, {
    key: '_splitTweenOptions',
    value: function _splitTweenOptions(delta) {
      delta = babelHelpers.extends({}, delta);

      var keys = Object.keys(delta),
          tweenOptions = {};
      var isTween = null;

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (TWEEN_PROPERTIES$1[key]) {
          if (delta[key] != null) {
            tweenOptions[key] = delta[key];
            isTween = true;
          }
          delete delta[key];
        }
      }
      return {
        delta: delta,
        tweenOptions: isTween ? tweenOptions : undefined
      };
    }
    /*
      Method to check if the property is delta property.
      @private
      @param {Any} Parameter value to check.
      @returns {Boolean}
    */

  }, {
    key: '_isDelta',
    value: function _isDelta(optionsValue) {
      var isObject = h$2.isObject(optionsValue);
      isObject = isObject && !optionsValue.unit;
      return !(!isObject || h$2.isArray(optionsValue) || h$2.isDOM(optionsValue));
    }
    /*
      Method to parse color delta values.
      @private
      @param {String} Name of the property.
      @param {Any} Property value.
      @returns {Object} Parsed delta.
    */

  }, {
    key: '_parseColorDelta',
    value: function _parseColorDelta(key, value) {
      if (key === 'strokeLinecap') {
        h$2.warn('Sorry, stroke-linecap property is not animatable yet, using the start(#{start}) value instead', value);
        return {};
      }
      var preParse = this._preparseDelta(value);

      var startColorObj = this._makeColorObj(preParse.start),
          endColorObj = this._makeColorObj(preParse.end);

      var delta = {
        type: 'color',
        name: key,
        start: startColorObj,
        end: endColorObj,
        curve: preParse.curve,
        delta: {
          r: endColorObj.r - startColorObj.r,
          g: endColorObj.g - startColorObj.g,
          b: endColorObj.b - startColorObj.b,
          a: endColorObj.a - startColorObj.a
        }
      };
      return delta;
    }
    /*
      Method to parse array delta values.
      @private
      @param {String} Name of the property.
      @param {Any} Property value.
      @returns {Object} Parsed delta.
    */

  }, {
    key: '_parseArrayDelta',
    value: function _parseArrayDelta(key, value) {
      var preParse = this._preparseDelta(value);

      var startArr = this._strToArr(preParse.start),
          endArr = this._strToArr(preParse.end);

      h$2.normDashArrays(startArr, endArr);

      for (var i = 0; i < startArr.length; i++) {
        var end = endArr[i];
        h$2.mergeUnits(startArr[i], end, key);
      }

      var delta = {
        type: 'array',
        name: key,
        start: startArr,
        end: endArr,
        delta: h$2.calcArrDelta(startArr, endArr),
        curve: preParse.curve
      };

      return delta;
    }
    /*
      Method to parse numeric delta values with units.
      @private
      @param {String} Name of the property.
      @param {Any} Property value.
      @param {Number} Index of the module.
      @returns {Object} Parsed delta.
    */

  }, {
    key: '_parseUnitDelta',
    value: function _parseUnitDelta(key, value, index) {
      var preParse = this._preparseDelta(value);

      var end = h$2.parseUnit(h$2.parseStringOption(preParse.end, index)),
          start = h$2.parseUnit(h$2.parseStringOption(preParse.start, index));

      h$2.mergeUnits(start, end, key);
      var delta = {
        type: 'unit',
        name: key,
        start: start,
        end: end,
        delta: end.value - start.value,
        curve: preParse.curve
      };
      return delta;
    }
    /*
      Method to parse numeric delta values without units.
      @private
      @param {String} Name of the property.
      @param {Any} Property value.
      @param {Number} Index of the module.
      @returns {Object} Parsed delta.
    */

  }, {
    key: '_parseNumberDelta',
    value: function _parseNumberDelta(key, value, index) {
      var preParse = this._preparseDelta(value);

      var end = parseFloat(h$2.parseStringOption(preParse.end, index)),
          start = parseFloat(h$2.parseStringOption(preParse.start, index));

      var delta = {
        type: 'number',
        name: key,
        start: start,
        end: end,
        delta: end - start,
        curve: preParse.curve
      };

      return delta;
    }
    /*
      Method to extract `curve` and `start`/`end` values.
      @private
      @param {Object} Delta object.
      @returns {Object} Preparsed delta.
                @property {String} Start value.
                @property {String, Number} End value.
    */

  }, {
    key: '_preparseDelta',
    value: function _preparseDelta(value) {
      // clone value object
      value = babelHelpers.extends({}, value);
      // parse curve if exist
      var curve = value.curve;
      if (curve != null) {
        curve = easing$2.parseEasing(curve);
        curve._parent = this;
      }
      delete value.curve;
      // parse start and end values
      var start = Object.keys(value)[0],
          end = value[start];

      return { start: start, end: end, curve: curve };
    }
    /*
      Method to parse color into usable object.
      @private
      @param {String} Color string.
      @returns {Object} Parsed color value.
    */

  }, {
    key: '_makeColorObj',
    value: function _makeColorObj(color) {
      // HEX
      var colorObj = {};
      if (color[0] === '#') {
        var result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(color);
        if (result) {
          var r = result[1].length === 2 ? result[1] : result[1] + result[1],
              g = result[2].length === 2 ? result[2] : result[2] + result[2],
              b = result[3].length === 2 ? result[3] : result[3] + result[3];

          colorObj = {
            r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16), a: 1
          };
        }
      }

      // not HEX
      // shorthand color and rgb()
      if (color[0] !== '#') {
        var isRgb = color[0] === 'r' && color[1] === 'g' && color[2] === 'b';
        var rgbColor = void 0;
        // rgb color
        if (isRgb) {
          rgbColor = color;
        };
        // shorthand color name
        if (!isRgb) {
          if (!this._shortColors[color]) {
            h$2.div.style.color = color;
            rgbColor = h$2.computedStyle(h$2.div).color;
          } else {
            rgbColor = this._shortColors[color];
          }
        }

        var regexString1 = '^rgba?\\((\\d{1,3}),\\s?(\\d{1,3}),',
            regexString2 = '\\s?(\\d{1,3}),?\\s?(\\d{1}|0?\\.\\d{1,})?\\)$',
            _result = new RegExp(regexString1 + regexString2, 'gi').exec(rgbColor),
            alpha = parseFloat(_result[4] || 1);

        if (_result) {
          colorObj = {
            r: parseInt(_result[1], 10),
            g: parseInt(_result[2], 10),
            b: parseInt(_result[3], 10),
            a: alpha != null && !isNaN(alpha) ? alpha : 1
          };
        }
      }

      return colorObj;
    }
    /*
      Method to parse string into array.
      @private
      @param {String, Number} String or number to parse.
      @returns {Array} Parsed array.
    */

  }, {
    key: '_strToArr',
    value: function _strToArr(string) {
      var arr = [];
      // plain number
      if (typeof string === 'number' && !isNaN(string)) {
        arr.push(h$2.parseUnit(string));
        return arr;
      }
      // string array
      string.trim().split(/\s+/gim).forEach(function (str) {
        arr.push(h$2.parseUnit(h$2.parseIfRand(str)));
      });
      return arr;
    }
  }]);
  return Deltas;
}();

// get tween properties
var obj = {};
Tween.prototype._declareDefaults.call(obj);
var keys = Object.keys(obj._defaults);
for (var i = 0; i < keys.length; i++) {
  obj._defaults[keys[i]] = 1;
}
obj._defaults['timeline'] = 1;
var TWEEN_PROPERTIES = obj._defaults;

/*
  TODO:

    - change _props to _propsObj for animations
    - current values in deltas
*/

var Html = function (_Thenable) {
  babelHelpers.inherits(Html, _Thenable);

  function Html() {
    babelHelpers.classCallCheck(this, Html);
    return babelHelpers.possibleConstructorReturn(this, (Html.__proto__ || Object.getPrototypeOf(Html)).apply(this, arguments));
  }

  babelHelpers.createClass(Html, [{
    key: '_declareDefaults',
    value: function _declareDefaults() {
      this._defaults = {
        x: 0,
        y: 0,
        z: 0,

        skewX: 0,
        skewY: 0,

        // angle:      0,
        angleX: 0,
        angleY: 0,
        angleZ: 0,

        scale: 1,
        scaleX: 1,
        scaleY: 1,

        isSoftHide: true,
        isShowStart: true,
        isShowEnd: true,
        isForce3d: false,
        isRefreshState: true

      };
      // exclude from automatic drawing
      this._drawExclude = { el: 1 };
      // properties that cause 3d layer
      this._3dProperties = ['angleX', 'angleY', 'z'];
      // properties that have array values
      this._arrayPropertyMap = { transformOrigin: 1, backgroundPosition: 1 };
      // properties that have no units
      this._numberPropertyMap = {
        opacity: 1, scale: 1, scaleX: 1, scaleY: 1,
        // angle: 1,
        angleX: 1, angleY: 1, angleZ: 1,
        skewX: 1, skewY: 1
      };
      // properties that should be prefixed 
      this._prefixPropertyMap = { transform: 1, transformOrigin: 1 };
      // save prefix
      this._prefix = h.prefix.css;
    }
  }, {
    key: 'then',
    value: function then(o) {
      // return if nothing was passed
      if (o == null || !Object.keys(o).length) {
        return 1;
      }

      // get the last item in `then` chain
      var prevModule = h.getLastItem(this._modules);
      // set deltas to the finish state
      prevModule.deltas.refresh(false);
      // copy finish state to the last history record
      this._history[this._history.length - 1] = prevModule._o;
      // call super
      babelHelpers.get(Html.prototype.__proto__ || Object.getPrototypeOf(Html.prototype), 'then', this).call(this, o);
      // restore the _props
      prevModule.deltas.restore();

      return this;
    }
    /*
      Method to pipe startValue of the delta.
      @private
      @ovarrides @ Thenable
      @param {String} Start property name.
      @param {Any} Start property value.
      @returns {Any} Start property value.
    */

  }, {
    key: '_checkStartValue',
    value: function _checkStartValue(key, value) {
      if (value == null) {
        // return default value for transforms
        if (this._defaults[key] != null) {
          return this._defaults[key];
        }
        // return default value from _customProps
        if (this._customProps[key] != null) {
          return this._customProps[key];
        }
        // try to get the default value
        if (h.defaultStyles[key] != null) {
          return h.defaultStyles[key];
        }
        // at the end return 0
        return 0;
      }

      return value;
    }
    /*
      Method to draw _props to el.
      @private
    */

  }, {
    key: '_draw',
    value: function _draw() {
      var p = this._props;
      for (var i = 0; i < this._drawProps.length; i++) {
        var name = this._drawProps[i];
        this._setStyle(name, p[name]);
      }
      // draw transforms
      this._drawTransform();
      // call custom transform callback if exist
      this._customDraw && this._customDraw(this._props.el, this._props);
    }
    /*
      Method to set transform on element.
      @private
    */

  }, {
    key: '_drawTransform',
    value: function _drawTransform() {
      var p = this._props;
      var string = !this._is3d ? 'translate(' + p.x + ', ' + p.y + ')\n          rotate(' + p.angleZ + 'deg)\n          skew(' + p.skewX + 'deg, ' + p.skewY + 'deg)\n          scale(' + p.scaleX + ', ' + p.scaleY + ')' : 'translate3d(' + p.x + ', ' + p.y + ', ' + p.z + ')\n          rotateX(' + p.angleX + 'deg)\n          rotateY(' + p.angleY + 'deg)\n          rotateZ(' + p.angleZ + 'deg)\n          skew(' + p.skewX + 'deg, ' + p.skewY + 'deg)\n          scale(' + p.scaleX + ', ' + p.scaleY + ')';

      this._setStyle('transform', string);
    }
    /*
      Method to render on initialization.
      @private
      @overrides @ Module
    */

  }, {
    key: '_render',
    value: function _render() {
      // return immediately if not the first in `then` chain
      if (this._o.prevChainModule) {
        return;
      }

      var p = this._props;

      for (var i = 0; i < this._renderProps.length; i++) {
        var name = this._renderProps[i],
            value = p[name];

        value = typeof value === 'number' ? value + 'px' : value;
        this._setStyle(name, value);
      }

      this._draw();

      if (!p.isShowStart) {
        this._hide();
      }
    }
    /*
      Method to set style on el.
      @private
      @param {String} Style property name.
      @param {String} Style property value.
    */

  }, {
    key: '_setStyle',
    value: function _setStyle(name, value) {
      if (this._state[name] !== value) {
        var style = this._props.el.style;
        // set style
        style[name] = value;
        // if prefix needed - set it
        if (this._prefixPropertyMap[name]) {
          style['' + this._prefix + name] = value;
        }
        // cache the last set value
        this._state[name] = value;
      }
    }
    /*
      Method to copy `_o` options to `_props` object.
      @private
    */

  }, {
    key: '_extendDefaults',
    value: function _extendDefaults() {
      this._props = this._o.props || {};
      // props for intial render only
      this._renderProps = [];
      // props for draw on every frame update
      this._drawProps = [];
      // save custom properties if present
      this._saveCustomProperties(this._o);
      // copy the options
      var o = babelHelpers.extends({}, this._o);
      // extend options with defaults
      o = this._addDefaults(o);

      var keys = Object.keys(o);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // include the property if it is not in drawExclude object
        // and not in defaults = not a transform
        var isInclude = !this._drawExclude[key] && // not in exclude map
        this._defaults[key] == null && // not transform property
        !TWEEN_PROPERTIES[key]; // not tween property

        var isCustom = this._customProps[key];
        // copy all non-delta properties to the props
        // if not delta then add the property to render
        // list that is called on initialization
        // otherwise add it to the draw list that will
        // be drawed on each frame
        if (!h.isDelta(o[key]) && !TWEEN_PROPERTIES[key]) {
          this._parseOption(key, o[key]);
          if (key === 'el') {
            this._props.el = h.parseEl(o.el);
            this.el = this._props.el;
          }
          if (isInclude && !isCustom) {
            this._renderProps.push(key);
          }
          // copy delta prop but not transforms
          // otherwise push it to draw list that gets traversed on every draw
        } else if (isInclude && !isCustom) {
          this._drawProps.push(key);
        }
      }

      this._createDeltas(o);
    }
    /*
      Method to save customProperties to _customProps.
      @param {Object} Options of the module.
    */

  }, {
    key: '_saveCustomProperties',
    value: function _saveCustomProperties() {
      var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._customProps = o.customProperties || {};
      this._customProps = babelHelpers.extends({}, this._customProps);
      this._customDraw = this._customProps.draw;
      delete this._customProps.draw;
      delete o.customProperties;

      this._copyDefaultCustomProps();

      // if ( this._customProps ) {}
      // this._customProps = this._customProps || {};
    }
  }, {
    key: '_copyDefaultCustomProps',
    value: function _copyDefaultCustomProps() {
      for (var key in this._customProps) {
        if (this._o[key] == null) {
          this._o[key] = this._customProps[key];
        }
      }
    }
    /*
      Method to reset some flags on merged options object.
      @private
      @overrides @ Thenable
      @param   {Object} Options object.
      @returns {Object} Options object.
    */

  }, {
    key: '_resetMergedFlags',
    value: function _resetMergedFlags(o) {
      babelHelpers.get(Html.prototype.__proto__ || Object.getPrototypeOf(Html.prototype), '_resetMergedFlags', this).call(this, o);
      o.props = this._props;
      o.customProperties = this._customProps;
      return o;
    }
    /*
      Method to parse option value.
      @private
      @param {String} Option name.
      @param {Any} Option value.
    */

  }, {
    key: '_parseOption',
    value: function _parseOption(key, value) {
      babelHelpers.get(Html.prototype.__proto__ || Object.getPrototypeOf(Html.prototype), '_parseOption', this).call(this, key, value);
      // at this point the property is parsed
      var parsed = this._props[key];
      // cast it to string if it is array
      if (h.isArray(parsed)) {
        this._props[key] = this._arrToString(parsed);
      }
    }
    /*
      Method cast array to string value.
      @private
      @param {Array} Array of parsed numbers with units.
      @returns {String} Casted array.
    */

  }, {
    key: '_arrToString',
    value: function _arrToString(arr) {
      var string = '';
      for (var i = 0; i < arr.length; i++) {
        string += arr[i].string + ' ';
      }
      return string;
    }
    /*
      Method to add defauls to passed object.
      @private
      @param {Object} Object to add defaults to.
    */

  }, {
    key: '_addDefaults',
    value: function _addDefaults(obj) {
      // flag that after all defaults are set will indicate
      // if user have set the 3d transform
      this._is3d = false;

      for (var key in this._defaults) {
        // skip property if it is listed in _skipProps
        // if (this._skipProps && this._skipProps[key]) { continue; }

        // copy the properties to the _o object
        // if it's null - set the default value
        if (obj[key] == null) {
          // scaleX and scaleY should fallback to scale
          if (key === 'scaleX' || key === 'scaleY') {
            obj[key] = obj['scale'] != null ? obj['scale'] : this._defaults['scale'];
          } else {
            obj[key] = this._defaults[key];
          }
        } else {
          // get if 3d property was set.
          if (this._3dProperties.indexOf(key) !== -1) {
            this._is3d = true;
          }
        }
      }

      if (this._o.isForce3d) {
        this._is3d = true;
      }

      return obj;
    }
    /*
      Lifecycle method to declare variables.
      @private
    */

  }, {
    key: '_vars',
    value: function _vars() {
      // set deltas to the last value, so the _props with
      // end values will be copied to the _history, it is
      // crucial for `then` chaining
      this.deltas.refresh(false);
      // call super vars
      babelHelpers.get(Html.prototype.__proto__ || Object.getPrototypeOf(Html.prototype), '_vars', this).call(this);
      // state of set properties
      this._state = {};
      // restore delta values that we have refreshed before
      this.deltas.restore(false);
    }
    /*
      Method to create deltas from passed object.
      @private
      @param {Object} Options object to pass to the Deltas.
    */

  }, {
    key: '_createDeltas',
    value: function _createDeltas(options) {
      this.deltas = new Deltas({
        options: options,
        props: this._props,
        arrayPropertyMap: this._arrayPropertyMap,
        numberPropertyMap: this._numberPropertyMap,
        customProps: this._customProps,
        callbacksContext: options.callbacksContext || this,
        isChained: !!this._o.prevChainModule
      });

      // if chained module set timeline to deltas' timeline 
      if (this._o.prevChainModule) {
        this.timeline = this.deltas.timeline;
      }
    }
    /* @overrides @ Tweenable */

  }, {
    key: '_makeTween',
    value: function _makeTween() {}
  }, {
    key: '_makeTimeline',
    value: function _makeTimeline() {
      // do not create timeline if module if chained
      if (this._o.prevChainModule) {
        return;
      }
      // add callbacks overrides
      this._o.timeline = this._o.timeline || {};
      this._addCallbackOverrides(this._o.timeline);
      babelHelpers.get(Html.prototype.__proto__ || Object.getPrototypeOf(Html.prototype), '_makeTimeline', this).call(this);
      this.timeline.add(this.deltas);
    }
    /*
      Method to add callback overrides to passed object object.
      @param {Object} Object to add overrides on.
    */

  }, {
    key: '_addCallbackOverrides',
    value: function _addCallbackOverrides(o) {
      var it = this;
      var p = this._props;
      o.callbackOverrides = {
        onUpdate: this._draw,
        onRefresh: this._props.isRefreshState ? this._draw : void 0,
        onStart: function onStart(isFwd) {
          // don't touch main `el` onStart in chained elements
          if (it._isChained) {
            return;
          };
          // show if was hidden at start
          if (isFwd && !p.isShowStart) {
            it._show();
          }
          // hide if should be hidden at start
          else {
              if (!p.isShowStart) {
                it._hide();
              }
            }
        },
        onComplete: function onComplete(isFwd) {
          // don't touch main `el` if not the last in `then` chain
          if (it._isChained) {
            return;
          }
          if (isFwd) {
            if (!p.isShowEnd) {
              it._hide();
            }
          } else if (!p.isShowEnd) {
            it._show();
          }
        }
      };
    }

    /*
      Method that gets called on `soft` show of the module,
      it should restore transform styles of the module.
      @private
      @overrides @ Module
    */

  }, {
    key: '_showByTransform',
    value: function _showByTransform() {
      this._drawTransform();
    }

    /*
      Method to merge `start` and `end` for a property in then record.
      @private
      @param {String} Property name.
      @param {Any}    Start value of the property.
      @param {Any}    End value of the property.
    */
    // !! COVER !!

  }, {
    key: '_mergeThenProperty',
    value: function _mergeThenProperty(key, startValue, endValue) {
      // if isnt tween property
      var isBoolean = typeof endValue === 'boolean',
          curve,
          easing;

      if (!h.isTweenProp(key) && !this._nonMergeProps[key] && !isBoolean) {

        var TWEEN_PROPS = {};
        if (h.isObject(endValue) && endValue.to != null) {
          for (var _key in endValue) {
            if (TWEEN_PROPERTIES[_key] || _key === 'curve') {
              TWEEN_PROPS[_key] = endValue[_key];
              delete endValue[_key];
            }
          }
          // curve    = endValue.curve;
          // easing   = endValue.easing;
          endValue = endValue.to;
        }

        // if end value is delta - just save it
        if (this._isDelta(endValue)) {

          var _TWEEN_PROPS = {};
          for (var _key2 in endValue) {
            if (TWEEN_PROPERTIES[_key2] || _key2 === 'curve') {
              _TWEEN_PROPS[_key2] = endValue[_key2];
              delete endValue[_key2];
            }
          }
          var result = this._parseDeltaValues(key, endValue);

          return babelHelpers.extends({}, result, _TWEEN_PROPS);
        } else {
          var parsedEndValue = this._parsePreArrayProperty(key, endValue);
          // if end value is not delta - merge with start value
          if (this._isDelta(startValue)) {
            // if start value is delta - take the end value
            // as start value of the new delta
            return babelHelpers.extends(babelHelpers.defineProperty({}, h.getDeltaEnd(startValue), parsedEndValue), TWEEN_PROPS);
            // if both start and end value are not ∆ - make ∆
          } else {
            return babelHelpers.extends(babelHelpers.defineProperty({}, startValue, parsedEndValue), TWEEN_PROPS);
          }
        }
        // copy the tween values unattended
      } else {
        return endValue;
      }
    }
  }]);
  return Html;
}(Thenable);

var Stagger = function (_Tunable) {
  babelHelpers.inherits(Stagger, _Tunable);

  function Stagger(options, Module) {
    var _ret;

    babelHelpers.classCallCheck(this, Stagger);

    var _this = babelHelpers.possibleConstructorReturn(this, (Stagger.__proto__ || Object.getPrototypeOf(Stagger)).call(this));

    return _ret = _this._init(options, Module), babelHelpers.possibleConstructorReturn(_this, _ret);
  }
  /*
    Method to create then chain on child modules.
    @param {Object} Then options.
    @return {Object} this.
  */


  babelHelpers.createClass(Stagger, [{
    key: 'then',
    value: function then(o) {
      if (o == null) {
        return this;
      }
      for (var i = 0; i < this._modules.length; i++) {
        // get child module's option and pass to the child `then`
        this._modules[i].then(this._getOptionByIndex(i, o));
      }
      this.timeline._recalcTotalDuration();
      return this;
    }
    /*
      Method to tune child modules.
      @param {Object} Tune options.
      @return {Object} this.
    */

  }, {
    key: 'tune',
    value: function tune(o) {
      if (o == null) {
        return this;
      }
      for (var i = 0; i < this._modules.length; i++) {
        // get child module's option and pass to the child `then`
        this._modules[i].tune(this._getOptionByIndex(i, o));
      }
      this.timeline._recalcTotalDuration();
      return this;
    }
    /*
      Method to generate child modules.
      @return {Object} this.
    */

  }, {
    key: 'generate',
    value: function generate() {
      for (var i = 0; i < this._modules.length; i++) {
        // get child module's option and pass to the child `then`
        this._modules[i].generate();
      }
      this.timeline._recalcTotalDuration();
      return this;
    }
    /*
      Method to get an option by modulo and name.
      @param {String} Name of the property to get.
      @param {Number} Index for the modulo calculation.
      @param {Object} Options hash to look in.
      @return {Any} Property.
    */

  }, {
    key: '_getOptionByMod',
    value: function _getOptionByMod(name, i, store) {
      var props = store[name];
      // if not dom list then clone it to array
      if (props + '' === '[object NodeList]' || props + '' === '[object HTMLCollection]') props = Array.prototype.slice.call(props, 0);
      // get the value in array or return the value itself
      var value = h.isArray(props) ? props[i % props.length] : props;
      // check if value has the stagger expression, if so parse it
      return h.parseIfStagger(value, i);
    }
    /*
      Method to get option by modulo of index.
      @param {Number} Index for modulo calculations.
      @param {Object} Options hash to look in.
    */

  }, {
    key: '_getOptionByIndex',
    value: function _getOptionByIndex(i, store) {
      var _this2 = this;

      var options = {};
      Object.keys(store).forEach(function (key) {
        return options[key] = _this2._getOptionByMod(key, i, store);
      });
      return options;
    }
    /*
      Method to get total child modules quantity.
      @param  {String} Name of quantifier in options hash.
      @param  {Object} Options hash object.
      @return {Number} Number of child object that should be defined.
    */

  }, {
    key: '_getChildQuantity',
    value: function _getChildQuantity(name, store) {
      // if number was set
      if (typeof name === 'number') {
        return name;
      }

      var quantifier = store[name];
      if (h.isArray(quantifier)) {
        return quantifier.length;
      } else if (quantifier + '' === '[object NodeList]') {
        return quantifier.length;
      } else if (quantifier + '' === '[object HTMLCollection]') {
        return Array.prototype.slice.call(quantifier, 0).length;
      } else if (quantifier instanceof HTMLElement) {
        return 1;
      } else if (typeof quantifier == 'string') {
        return 1;
      }
    }
    /*
      Method to make stagger form options
      @param {Object} Options.
      @param {Object} Child class.
    */

  }, {
    key: '_init',
    value: function _init(options, Module) {
      var count = this._getChildQuantity(options.quantifier || 'el', options);
      this._createTimeline(options);this._modules = [];
      for (var i = 0; i < count; i++) {
        // get child module's option
        var option = this._getOptionByIndex(i, options);
        option.isRunLess = true;
        // set index of the module
        option.index = i;
        // create child module
        var module = new Module(option);this._modules.push(module);
        // add child module's timeline to the self timeline
        this.timeline.add(module);
      }
      return this;
    }
    /*
      Method to create timeline.
      @param {Object} Timeline options.
    */

  }, {
    key: '_createTimeline',
    value: function _createTimeline() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.timeline = new Timeline(options.timeline);
    }

    /* @overrides @ Tweenable */

  }, {
    key: '_makeTween',
    value: function _makeTween() {}
  }, {
    key: '_makeTimeline',
    value: function _makeTimeline() {}
  }]);
  return Stagger;
}(Tuneable);

function stagger (Module) {
  return function (options) {
    return new Stagger(options, Module);
  };
};

/*
  Class for toggling opacity on bunch of elements
  @class Spriter
  @todo
    - add isForce3d option
    - add run new option merging
    - add then chains
*/

var Spriter = function () {
  babelHelpers.createClass(Spriter, [{
    key: '_declareDefaults',

    /*
      Defaults/APIs
    */
    value: function _declareDefaults() {
      this._defaults = {
        /*
          Duration
          @property duration
          @type     {Number}
        */
        duration: 500,
        /*
          Delay
          @property delay
          @type     {Number}
        */
        delay: 0,
        /*
          Easing. Please see the 
          [timeline module parseEasing function](timeline.coffee.html#parseEasing)
          for all avaliable options.
           @property easing
          @type     {String, Function}
        */
        easing: 'linear.none',
        /*
          Repeat times count
          
          @property repeat
          @type     {Number}
        */
        repeat: 0,
        /*
          Yoyo option defines if animation should be altered on repeat.
          
          @property yoyo
          @type     {Boolean}
        */
        yoyo: false,
        /*
          isRunLess option prevents animation from running immediately after
          initialization.
          
          @property isRunLess
          @type     {Boolean}
        */
        isRunLess: false,
        /*
          isShowEnd option defines if the last frame should be shown when
          animation completed.
          
          @property isShowEnd
          @type     {Boolean}
        */
        isShowEnd: false,
        /*
          onStart callback will be called once on animation start.
          
          @property onStart
          @type     {Function}
        */
        onStart: null,
        /*
          onUpdate callback will be called on every frame of the animation.
          The current progress in range **[0,1]** will be passed to the callback.
          
          @property onUpdate
          @type     {Function}
        */
        onUpdate: null,
        /*
          onComplete callback will be called once on animation complete.
          
          @property onComplete
          @type     {Function}
        */
        onComplete: null
      };
    }
  }]);

  function Spriter() {
    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    babelHelpers.classCallCheck(this, Spriter);

    this.o = o;
    if (!this.o.el) {
      return h.error('No "el" option specified, aborting');
    }
    this._vars();this._declareDefaults();this._extendDefaults();this._parseFrames();
    if (this._frames.length <= 2) h.warn('Spriter: only ' + this._frames.length + ' frames found');
    if (this._frames.length < 1) h.error("Spriter: there is no frames to animate, aborting");
    this._createTween();
    return this;
  }
  /*
    Method to declare some variables.
    
    @method run
    @param  {Object} New options
    @todo   Implement new object merging
  */


  babelHelpers.createClass(Spriter, [{
    key: '_vars',
    value: function _vars() {
      this._props = h.cloneObj(this.o);
      this.el = this.o.el;
      this._frames = [];
    }
    /*
      Method to run the spriter on demand.
      
      @method run
      @param  {Object} New options
      @todo   Implement new object merging
    */

  }, {
    key: 'run',
    value: function run(o) {
      return this.timeline.play();
    }
    /*
      Method to extend _props by options(this.o)
      
      @method _extendDefaults
    */

  }, {
    key: '_extendDefaults',
    value: function _extendDefaults() {
      return h.extend(this._props, this._defaults);
    }
    /*
      Method to parse frames as child nodes of el.
      
      @method _parseFrames
    */

  }, {
    key: '_parseFrames',
    value: function _parseFrames() {
      this._frames = Array.prototype.slice.call(this.el.children, 0);
      this._frames.forEach(function (frame, i) {
        return frame.style.opacity = 0;
      });
      this._frameStep = 1 / this._frames.length;
    }

    /*
      Method to create tween and timeline and supply callbacks.
      
      @method _createTween
    */

  }, {
    key: '_createTween',
    value: function _createTween() {
      var _this = this;

      this._tween = new Tween({
        duration: this._props.duration,
        delay: this._props.delay,
        yoyo: this._props.yoyo,
        repeat: this._props.repeat,
        easing: this._props.easing,
        onStart: function onStart() {
          return _this._props.onStart && _this._props.onStart();
        },
        onComplete: function onComplete() {
          return _this._props.onComplete && _this._props.onComplete();
        },
        onUpdate: function onUpdate(p) {
          return _this._setProgress(p);
        }
      });
      this.timeline = new Timeline();this.timeline.add(this._tween);
      if (!this._props.isRunLess) this._startTween();
    }

    /*
      Method to start tween
      
      @method _startTween
    */

  }, {
    key: '_startTween',
    value: function _startTween() {
      var _this2 = this;

      setTimeout(function () {
        return _this2.timeline.play();
      }, 1);
    }
    /*
      Method to set progress of the sprite
      
      @method _setProgress
      @param  {Number} Progress in range **[0,1]**
    */

  }, {
    key: '_setProgress',
    value: function _setProgress(p) {
      // get the frame number
      var proc = Math.floor(p / this._frameStep);
      // react only if frame changes
      if (this._prevFrame != this._frames[proc]) {
        // if previous frame isnt current one, hide it
        if (this._prevFrame) {
          this._prevFrame.style.opacity = 0;
        }
        // if end of animation and isShowEnd flag was specified
        // then show the last frame else show current frame
        var currentNum = p === 1 && this._props.isShowEnd ? proc - 1 : proc;
        // show the current frame
        if (this._frames[currentNum]) {
          this._frames[currentNum].style.opacity = 1;
        }
        // set previous frame as current
        this._prevFrame = this._frames[proc];
      }
      if (this._props.onUpdate) {
        this._props.onUpdate(p);
      }
    }
  }]);
  return Spriter;
}();

/*!
  LegoMushroom @legomushroom http://legomushroom.com
  MIT License 2014
 */

/* istanbul ignore next */

var Main;
Main = function () {
  function Main(o) {
    this.o = o != null ? o : {};
    if (window.isAnyResizeEventInited) {
      return;
    }
    this.vars();
    this.redefineProto();
  }

  Main.prototype.vars = function () {
    window.isAnyResizeEventInited = true;
    this.allowedProtos = [HTMLDivElement, HTMLFormElement, HTMLLinkElement, HTMLBodyElement, HTMLParagraphElement, HTMLFieldSetElement, HTMLLegendElement, HTMLLabelElement, HTMLButtonElement, HTMLUListElement, HTMLOListElement, HTMLLIElement, HTMLHeadingElement, HTMLQuoteElement, HTMLPreElement, HTMLBRElement, HTMLFontElement, HTMLHRElement, HTMLModElement, HTMLParamElement, HTMLMapElement, HTMLTableElement, HTMLTableCaptionElement, HTMLImageElement, HTMLTableCellElement, HTMLSelectElement, HTMLInputElement, HTMLTextAreaElement, HTMLAnchorElement, HTMLObjectElement, HTMLTableColElement, HTMLTableSectionElement, HTMLTableRowElement];
    return this.timerElements = {
      img: 1,
      textarea: 1,
      input: 1,
      embed: 1,
      object: 1,
      svg: 1,
      canvas: 1,
      tr: 1,
      tbody: 1,
      thead: 1,
      tfoot: 1,
      a: 1,
      select: 1,
      option: 1,
      optgroup: 1,
      dl: 1,
      dt: 1,
      br: 1,
      basefont: 1,
      font: 1,
      col: 1,
      iframe: 1
    };
  };

  Main.prototype.redefineProto = function () {
    var i, it, proto, t;
    it = this;
    return t = function () {
      var j, len, ref, results;
      ref = this.allowedProtos;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        proto = ref[i];
        if (proto.prototype == null) {
          continue;
        }
        results.push(function (proto) {
          var listener, remover;
          listener = proto.prototype.addEventListener || proto.prototype.attachEvent;
          (function (listener) {
            var wrappedListener;
            wrappedListener = function wrappedListener() {
              var option;
              if (this !== window || this !== document) {
                option = arguments[0] === 'onresize' && !this.isAnyResizeEventInited;
                option && it.handleResize({
                  args: arguments,
                  that: this
                });
              }
              return listener.apply(this, arguments);
            };
            if (proto.prototype.addEventListener) {
              return proto.prototype.addEventListener = wrappedListener;
            } else if (proto.prototype.attachEvent) {
              return proto.prototype.attachEvent = wrappedListener;
            }
          })(listener);
          remover = proto.prototype.removeEventListener || proto.prototype.detachEvent;
          return function (remover) {
            var wrappedRemover;
            wrappedRemover = function wrappedRemover() {
              this.isAnyResizeEventInited = false;
              this.iframe && this.removeChild(this.iframe);
              return remover.apply(this, arguments);
            };
            if (proto.prototype.removeEventListener) {
              return proto.prototype.removeEventListener = wrappedRemover;
            } else if (proto.prototype.detachEvent) {
              return proto.prototype.detachEvent = wrappedListener;
            }
          }(remover);
        }(proto));
      }
      return results;
    }.call(this);
  };

  Main.prototype.handleResize = function (args) {
    var computedStyle, el, iframe, isEmpty, isNoPos, isStatic, ref;
    el = args.that;
    if (!this.timerElements[el.tagName.toLowerCase()]) {
      iframe = document.createElement('iframe');
      el.appendChild(iframe);
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.position = 'absolute';
      iframe.style.zIndex = -999;
      iframe.style.opacity = 0;
      iframe.style.top = 0;
      iframe.style.left = 0;
      computedStyle = window.getComputedStyle ? getComputedStyle(el) : el.currentStyle;
      isNoPos = el.style.position === '';
      isStatic = computedStyle.position === 'static' && isNoPos;
      isEmpty = computedStyle.position === '' && el.style.position === '';
      if (isStatic || isEmpty) {
        el.style.position = 'relative';
      }
      if ((ref = iframe.contentWindow) != null) {
        ref.onresize = function (_this) {
          return function (e) {
            return _this.dispatchEvent(el);
          };
        }(this);
      }
      el.iframe = iframe;
    } else {
      this.initTimer(el);
    }
    return el.isAnyResizeEventInited = true;
  };

  Main.prototype.initTimer = function (el) {
    var height, width;
    width = 0;
    height = 0;
    return this.interval = setInterval(function (_this) {
      return function () {
        var newHeight, newWidth;
        newWidth = el.offsetWidth;
        newHeight = el.offsetHeight;
        if (newWidth !== width || newHeight !== height) {
          _this.dispatchEvent(el);
          width = newWidth;
          return height = newHeight;
        }
      };
    }(this), this.o.interval || 62.5);
  };

  Main.prototype.dispatchEvent = function (el) {
    var e;
    if (document.createEvent) {
      e = document.createEvent('HTMLEvents');
      e.initEvent('onresize', false, false);
      return el.dispatchEvent(e);
    } else if (document.createEventObject) {
      e = document.createEventObject();
      return el.fireEvent('onresize', e);
    } else {
      return false;
    }
  };

  Main.prototype.destroy = function () {
    var i, it, j, len, proto, ref, results;
    clearInterval(this.interval);
    this.interval = null;
    window.isAnyResizeEventInited = false;
    it = this;
    ref = this.allowedProtos;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      proto = ref[i];
      if (proto.prototype == null) {
        continue;
      }
      results.push(function (proto) {
        var listener;
        listener = proto.prototype.addEventListener || proto.prototype.attachEvent;
        if (proto.prototype.addEventListener) {
          proto.prototype.addEventListener = Element.prototype.addEventListener;
        } else if (proto.prototype.attachEvent) {
          proto.prototype.attachEvent = Element.prototype.attachEvent;
        }
        if (proto.prototype.removeEventListener) {
          return proto.prototype.removeEventListener = Element.prototype.removeEventListener;
        } else if (proto.prototype.detachEvent) {
          return proto.prototype.detachEvent = Element.prototype.detachEvent;
        }
      }(proto));
    }
    return results;
  };

  return Main;
}();

var resize = new Main();

var bind = function bind(fn, me) {
  return function () {
    return fn.apply(me, arguments);
  };
};

var MotionPath = function () {
  MotionPath.prototype.defaults = {
    path: null,
    curvature: {
      x: '75%',
      y: '50%'
    },
    isCompositeLayer: true,
    delay: 0,
    duration: 1000,
    easing: null,
    repeat: 0,
    yoyo: false,
    onStart: null,
    onComplete: null,
    onUpdate: null,
    offsetX: 0,
    offsetY: 0,
    angleOffset: null,
    pathStart: 0,
    pathEnd: 1,
    motionBlur: 0,
    transformOrigin: null,
    isAngle: false,
    isReverse: false,
    isRunLess: false,
    isPresetPosition: true
  };

  function MotionPath(o1) {
    this.o = o1 != null ? o1 : {};
    this.calcHeight = bind(this.calcHeight, this);
    if (this.vars()) {
      return;
    }
    this.createTween();
    this;
  }

  MotionPath.prototype.vars = function () {
    this.getScaler = h.bind(this.getScaler, this);
    this.resize = resize;
    this.props = h.cloneObj(this.defaults);
    this.extendOptions(this.o);
    this.isMotionBlurReset = h.isSafari || h.isIE;
    this.isMotionBlurReset && (this.props.motionBlur = 0);
    this.history = [h.cloneObj(this.props)];
    return this.postVars();
  };

  MotionPath.prototype.curveToPath = function (o) {
    var angle, curvature, curvatureX, curvatureY, curvePoint, curveXPoint, dX, dY, endPoint, path, percent, radius, start;
    path = document.createElementNS(h.NS, 'path');
    start = o.start;
    endPoint = {
      x: start.x + o.shift.x,
      y: start.x + o.shift.y
    };
    curvature = o.curvature;
    dX = o.shift.x;
    dY = o.shift.y;
    radius = Math.sqrt(dX * dX + dY * dY);
    percent = radius / 100;
    angle = Math.atan(dY / dX) * (180 / Math.PI) + 90;
    if (o.shift.x < 0) {
      angle = angle + 180;
    }
    curvatureX = h.parseUnit(curvature.x);
    curvatureX = curvatureX.unit === '%' ? curvatureX.value * percent : curvatureX.value;
    curveXPoint = h.getRadialPoint({
      center: {
        x: start.x,
        y: start.y
      },
      radius: curvatureX,
      angle: angle
    });
    curvatureY = h.parseUnit(curvature.y);
    curvatureY = curvatureY.unit === '%' ? curvatureY.value * percent : curvatureY.value;
    curvePoint = h.getRadialPoint({
      center: {
        x: curveXPoint.x,
        y: curveXPoint.y
      },
      radius: curvatureY,
      angle: angle + 90
    });
    path.setAttribute('d', "M" + start.x + "," + start.y + " Q" + curvePoint.x + "," + curvePoint.y + " " + endPoint.x + "," + endPoint.y);
    return path;
  };

  MotionPath.prototype.postVars = function () {
    this.props.pathStart = h.clamp(this.props.pathStart, 0, 1);
    this.props.pathEnd = h.clamp(this.props.pathEnd, this.props.pathStart, 1);
    this.angle = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.blurX = 0;
    this.blurY = 0;
    this.prevCoords = {};
    this.blurAmount = 20;
    this.props.motionBlur = h.clamp(this.props.motionBlur, 0, 1);
    this.onUpdate = this.props.onUpdate;
    if (!this.o.el) {
      h.error('Missed "el" option. It could be a selector, DOMNode or another module.');
      return true;
    }
    this.el = this.parseEl(this.props.el);
    this.props.motionBlur > 0 && this.createFilter();
    this.path = this.getPath();
    if (!this.path.getAttribute('d')) {
      h.error('Path has no coordinates to work with, aborting');
      return true;
    }
    this.len = this.path.getTotalLength();
    this.slicedLen = this.len * (this.props.pathEnd - this.props.pathStart);
    this.startLen = this.props.pathStart * this.len;
    this.fill = this.props.fill;
    if (this.fill != null) {
      this.container = this.parseEl(this.props.fill.container);
      this.fillRule = this.props.fill.fillRule || 'all';
      this.getScaler();
      if (this.container != null) {
        this.removeEvent(this.container, 'onresize', this.getScaler);
        return this.addEvent(this.container, 'onresize', this.getScaler);
      }
    }
  };

  MotionPath.prototype.addEvent = function (el, type, handler) {
    return el.addEventListener(type, handler, false);
  };

  MotionPath.prototype.removeEvent = function (el, type, handler) {
    return el.removeEventListener(type, handler, false);
  };

  MotionPath.prototype.createFilter = function () {
    var div, svg;
    div = document.createElement('div');
    this.filterID = "filter-" + h.getUniqID();
    div.innerHTML = "<svg id=\"svg-" + this.filterID + "\"\n    style=\"visibility:hidden; width:0px; height:0px\">\n  <filter id=\"" + this.filterID + "\" y=\"-20\" x=\"-20\" width=\"40\" height=\"40\">\n    <feOffset\n      id=\"blur-offset\" in=\"SourceGraphic\"\n      dx=\"0\" dy=\"0\" result=\"offset2\"></feOffset>\n    <feGaussianblur\n      id=\"blur\" in=\"offset2\"\n      stdDeviation=\"0,0\" result=\"blur2\"></feGaussianblur>\n    <feMerge>\n      <feMergeNode in=\"SourceGraphic\"></feMergeNode>\n      <feMergeNode in=\"blur2\"></feMergeNode>\n    </feMerge>\n  </filter>\n</svg>";
    svg = div.querySelector("#svg-" + this.filterID);
    this.filter = svg.querySelector('#blur');
    this.filterOffset = svg.querySelector('#blur-offset');
    document.body.insertBefore(svg, document.body.firstChild);
    this.el.style['filter'] = "url(#" + this.filterID + ")";
    return this.el.style[h.prefix.css + "filter"] = "url(#" + this.filterID + ")";
  };

  MotionPath.prototype.parseEl = function (el) {
    if (typeof el === 'string') {
      return document.querySelector(el);
    }
    if (el instanceof HTMLElement) {
      return el;
    }
    if (el._setProp != null) {
      this.isModule = true;
      return el;
    }
  };

  MotionPath.prototype.getPath = function () {
    var path;
    path = h.parsePath(this.props.path);
    if (path) {
      return path;
    }
    if (this.props.path.x || this.props.path.y) {
      return this.curveToPath({
        start: {
          x: 0,
          y: 0
        },
        shift: {
          x: this.props.path.x || 0,
          y: this.props.path.y || 0
        },
        curvature: {
          x: this.props.curvature.x || this.defaults.curvature.x,
          y: this.props.curvature.y || this.defaults.curvature.y
        }
      });
    }
  };

  MotionPath.prototype.getScaler = function () {
    var end, size, start;
    this.cSize = {
      width: this.container.offsetWidth || 0,
      height: this.container.offsetHeight || 0
    };
    start = this.path.getPointAtLength(0);
    end = this.path.getPointAtLength(this.len);
    size = {};
    this.scaler = {};
    size.width = end.x >= start.x ? end.x - start.x : start.x - end.x;
    size.height = end.y >= start.y ? end.y - start.y : start.y - end.y;
    switch (this.fillRule) {
      case 'all':
        this.calcWidth(size);
        return this.calcHeight(size);
      case 'width':
        this.calcWidth(size);
        return this.scaler.y = this.scaler.x;
      case 'height':
        this.calcHeight(size);
        return this.scaler.x = this.scaler.y;
    }
  };

  MotionPath.prototype.calcWidth = function (size) {
    this.scaler.x = this.cSize.width / size.width;
    return !isFinite(this.scaler.x) && (this.scaler.x = 1);
  };

  MotionPath.prototype.calcHeight = function (size) {
    this.scaler.y = this.cSize.height / size.height;
    return !isFinite(this.scaler.y) && (this.scaler.y = 1);
  };

  MotionPath.prototype.run = function (o) {
    var fistItem, key, value;
    if (o) {
      fistItem = this.history[0];
      for (key in o) {
        value = o[key];
        if (h.callbacksMap[key] || h.tweenOptionMap[key]) {
          h.warn("the property \"" + key + "\" property can not be overridden on run yet");
          delete o[key];
        } else {
          this.history[0][key] = value;
        }
      }
      this.tuneOptions(o);
    }
    return this.startTween();
  };

  MotionPath.prototype.createTween = function () {
    this.tween = new Tween({
      duration: this.props.duration,
      delay: this.props.delay,
      yoyo: this.props.yoyo,
      repeat: this.props.repeat,
      easing: this.props.easing,
      onStart: function (_this) {
        return function () {
          var ref;
          return (ref = _this.props.onStart) != null ? ref.apply(_this) : void 0;
        };
      }(this),
      onComplete: function (_this) {
        return function () {
          var ref;
          _this.props.motionBlur && _this.setBlur({
            blur: {
              x: 0,
              y: 0
            },
            offset: {
              x: 0,
              y: 0
            }
          });
          return (ref = _this.props.onComplete) != null ? ref.apply(_this) : void 0;
        };
      }(this),
      onUpdate: function (_this) {
        return function (p) {
          return _this.setProgress(p);
        };
      }(this),
      onFirstUpdate: function (_this) {
        return function (isForward, isYoyo) {
          if (!isForward) {
            return _this.history.length > 1 && _this.tuneOptions(_this.history[0]);
          }
        };
      }(this)
    });
    this.timeline = new Timeline();
    this.timeline.add(this.tween);
    !this.props.isRunLess && this.startTween();
    return this.props.isPresetPosition && this.setProgress(0, true);
  };

  MotionPath.prototype.startTween = function () {
    return setTimeout(function (_this) {
      return function () {
        var ref;
        return (ref = _this.timeline) != null ? ref.play() : void 0;
      };
    }(this), 1);
  };

  MotionPath.prototype.setProgress = function (p, isInit) {
    var len, point, x, y;
    len = this.startLen + (!this.props.isReverse ? p * this.slicedLen : (1 - p) * this.slicedLen);
    point = this.path.getPointAtLength(len);
    x = point.x + this.props.offsetX;
    y = point.y + this.props.offsetY;
    this._getCurrentAngle(point, len, p);
    this._setTransformOrigin(p);
    this._setTransform(x, y, p, isInit);
    return this.props.motionBlur && this.makeMotionBlur(x, y);
  };

  MotionPath.prototype.setElPosition = function (x, y, p) {
    var composite, isComposite, rotate, transform;
    rotate = this.angle !== 0 ? "rotate(" + this.angle + "deg)" : '';
    isComposite = this.props.isCompositeLayer && h.is3d;
    composite = isComposite ? 'translateZ(0)' : '';
    transform = "translate(" + x + "px," + y + "px) " + rotate + " " + composite;
    return h.setPrefixedStyle(this.el, 'transform', transform);
  };

  MotionPath.prototype.setModulePosition = function (x, y) {
    this.el._setProp({
      shiftX: x + "px",
      shiftY: y + "px",
      angle: this.angle
    });
    return this.el._draw();
  };

  MotionPath.prototype._getCurrentAngle = function (point, len, p) {
    var atan, isTransformFunOrigin, prevPoint, x1, x2;
    isTransformFunOrigin = typeof this.props.transformOrigin === 'function';
    if (this.props.isAngle || this.props.angleOffset != null || isTransformFunOrigin) {
      prevPoint = this.path.getPointAtLength(len - 1);
      x1 = point.y - prevPoint.y;
      x2 = point.x - prevPoint.x;
      atan = Math.atan(x1 / x2);
      !isFinite(atan) && (atan = 0);
      this.angle = atan * h.RAD_TO_DEG;
      if (typeof this.props.angleOffset !== 'function') {
        return this.angle += this.props.angleOffset || 0;
      } else {
        return this.angle = this.props.angleOffset.call(this, this.angle, p);
      }
    } else {
      return this.angle = 0;
    }
  };

  MotionPath.prototype._setTransform = function (x, y, p, isInit) {
    var transform;
    if (this.scaler) {
      x *= this.scaler.x;
      y *= this.scaler.y;
    }
    transform = null;
    if (!isInit) {
      transform = typeof this.onUpdate === "function" ? this.onUpdate(p, {
        x: x,
        y: y,
        angle: this.angle
      }) : void 0;
    }
    if (this.isModule) {
      return this.setModulePosition(x, y);
    } else {
      if (typeof transform !== 'string') {
        return this.setElPosition(x, y, p);
      } else {
        return h.setPrefixedStyle(this.el, 'transform', transform);
      }
    }
  };

  MotionPath.prototype._setTransformOrigin = function (p) {
    var isTransformFunOrigin, tOrigin;
    if (this.props.transformOrigin) {
      isTransformFunOrigin = typeof this.props.transformOrigin === 'function';
      tOrigin = !isTransformFunOrigin ? this.props.transformOrigin : this.props.transformOrigin(this.angle, p);
      return h.setPrefixedStyle(this.el, 'transform-origin', tOrigin);
    }
  };

  MotionPath.prototype.makeMotionBlur = function (x, y) {
    var absoluteAngle, coords, dX, dY, signX, signY, tailAngle;
    tailAngle = 0;
    signX = 1;
    signY = 1;
    if (this.prevCoords.x == null || this.prevCoords.y == null) {
      this.speedX = 0;
      this.speedY = 0;
    } else {
      dX = x - this.prevCoords.x;
      dY = y - this.prevCoords.y;
      if (dX > 0) {
        signX = -1;
      }
      if (signX < 0) {
        signY = -1;
      }
      this.speedX = Math.abs(dX);
      this.speedY = Math.abs(dY);
      tailAngle = Math.atan(dY / dX) * (180 / Math.PI) + 90;
    }
    absoluteAngle = tailAngle - this.angle;
    coords = this.angToCoords(absoluteAngle);
    this.blurX = h.clamp(this.speedX / 16 * this.props.motionBlur, 0, 1);
    this.blurY = h.clamp(this.speedY / 16 * this.props.motionBlur, 0, 1);
    this.setBlur({
      blur: {
        x: 3 * this.blurX * this.blurAmount * Math.abs(coords.x),
        y: 3 * this.blurY * this.blurAmount * Math.abs(coords.y)
      },
      offset: {
        x: 3 * signX * this.blurX * coords.x * this.blurAmount,
        y: 3 * signY * this.blurY * coords.y * this.blurAmount
      }
    });
    this.prevCoords.x = x;
    return this.prevCoords.y = y;
  };

  MotionPath.prototype.setBlur = function (o) {
    if (!this.isMotionBlurReset) {
      this.filter.setAttribute('stdDeviation', o.blur.x + "," + o.blur.y);
      this.filterOffset.setAttribute('dx', o.offset.x);
      return this.filterOffset.setAttribute('dy', o.offset.y);
    }
  };

  MotionPath.prototype.extendDefaults = function (o) {
    var key, results, value;
    results = [];
    for (key in o) {
      value = o[key];
      results.push(this[key] = value);
    }
    return results;
  };

  MotionPath.prototype.extendOptions = function (o) {
    var key, results, value;
    results = [];
    for (key in o) {
      value = o[key];
      results.push(this.props[key] = value);
    }
    return results;
  };

  MotionPath.prototype.then = function (o) {
    var it, key, opts, prevOptions, value;
    prevOptions = this.history[this.history.length - 1];
    opts = {};
    for (key in prevOptions) {
      value = prevOptions[key];
      if (!h.callbacksMap[key] && !h.tweenOptionMap[key] || key === 'duration') {
        if (o[key] == null) {
          o[key] = value;
        }
      } else {
        if (o[key] == null) {
          o[key] = void 0;
        }
      }
      if (h.tweenOptionMap[key]) {
        opts[key] = key !== 'duration' ? o[key] : o[key] != null ? o[key] : prevOptions[key];
      }
    }
    this.history.push(o);
    it = this;
    opts.onUpdate = function (_this) {
      return function (p) {
        return _this.setProgress(p);
      };
    }(this);
    opts.onStart = function (_this) {
      return function () {
        var ref;
        return (ref = _this.props.onStart) != null ? ref.apply(_this) : void 0;
      };
    }(this);
    opts.onComplete = function (_this) {
      return function () {
        var ref;
        return (ref = _this.props.onComplete) != null ? ref.apply(_this) : void 0;
      };
    }(this);
    opts.onFirstUpdate = function () {
      return it.tuneOptions(it.history[this.index]);
    };
    opts.isChained = !o.delay;
    this.timeline.append(new Tween(opts));
    return this;
  };

  MotionPath.prototype.tuneOptions = function (o) {
    this.extendOptions(o);
    return this.postVars();
  };

  MotionPath.prototype.angToCoords = function (angle) {
    var radAngle, x, y;
    angle = angle % 360;
    radAngle = (angle - 90) * Math.PI / 180;
    x = Math.cos(radAngle);
    y = Math.sin(radAngle);
    x = x < 0 ? Math.max(x, -0.7) : Math.min(x, .7);
    y = y < 0 ? Math.max(y, -0.7) : Math.min(y, .7);
    return {
      x: x * 1.428571429,
      y: y * 1.428571429
    };
  };

  return MotionPath;
}();

var mojs$1 = {
  revision: '0.288.1', isDebug: true, helpers: h,
  Shape: Shape, ShapeSwirl: ShapeSwirl, Burst: Burst, Html: Html, stagger: stagger, Spriter: Spriter, MotionPath: MotionPath,
  Tween: Tween, Timeline: Timeline, Tweenable: Tweenable, Thenable: Thenable, Tunable: Tuneable, Module: Module,
  tweener: t, easing: easing, shapesMap: shapesMap, _pool: { Delta: Delta, Deltas: Deltas }
};

// functions alias
mojs$1.h = mojs$1.helpers;
mojs$1.delta = mojs$1.h.delta;
// custom shape add function and class
mojs$1.addShape = mojs$1.shapesMap.addShape;
mojs$1.CustomShape = mojs$1.shapesMap.custom;
// module alias
mojs$1.Transit = mojs$1.Shape;
mojs$1.Swirl = mojs$1.ShapeSwirl;