/*
* @Author: 王春岩 <Bolt>
* @Date:   2016-10-16 15:37:00
* @Last Modified by:   Bolt
* @Last Modified time: 2016-10-16 16:06:13
*/

'use strict';

/* istanbul ignore next */
var Equal,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import Bit from './bit'

Equal = (function(superClass) {
  extend(Equal, superClass);

  function Equal() {
    return Equal.__super__.constructor.apply(this, arguments);
  }

  Equal.prototype._declareDefaults = function() {
    Equal.__super__._declareDefaults.apply(this, arguments);
    this._defaults.tag = 'path';
    return this._defaults.points = 2;
  };

  Equal.prototype._draw = function() {
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

  Equal.prototype._getLength = function() {
    return 2 * (this._props.radiusX != null ? this._props.radiusX : this._props.radius);
  };

  return Equal;

})(Bit);

export default Equal;

