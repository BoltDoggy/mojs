/*
* @Author: 王春岩 <Bolt>
* @Date:   2016-10-16 15:36:28
* @Last Modified by:   Bolt
* @Last Modified time: 2016-10-16 16:03:58
*/

'use strict';

/* istanbul ignore next */
var Circle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import Bit from './bit'

Circle = (function(superClass) {
  extend(Circle, superClass);

  function Circle() {
    return Circle.__super__.constructor.apply(this, arguments);
  }

  Circle.prototype._declareDefaults = function() {
    Circle.__super__._declareDefaults.apply(this, arguments);
    return this._defaults.shape = 'ellipse';
  };

  Circle.prototype._draw = function() {
    var rx, ry;
    rx = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    ry = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    this._setAttrIfChanged('rx', rx);
    this._setAttrIfChanged('ry', ry);
    this._setAttrIfChanged('cx', this._props.width / 2);
    this._setAttrIfChanged('cy', this._props.height / 2);
    return Circle.__super__._draw.apply(this, arguments);
  };

  Circle.prototype._getLength = function() {
    var radiusX, radiusY;
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    return 2 * Math.PI * Math.sqrt((radiusX * radiusX + radiusY * radiusY) / 2);
  };

  return Circle;

})(Bit);

export default Circle;