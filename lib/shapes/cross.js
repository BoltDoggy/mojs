/*
* @Author: 王春岩 <Bolt>
* @Date:   2016-10-16 15:36:33
* @Last Modified by:   Bolt
* @Last Modified time: 2016-10-16 16:04:54
*/

'use strict';

/* istanbul ignore next */
var Cross,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import Bit from './bit'

Cross = (function(superClass) {
  extend(Cross, superClass);

  function Cross() {
    return Cross.__super__.constructor.apply(this, arguments);
  }

  Cross.prototype._declareDefaults = function() {
    Cross.__super__._declareDefaults.apply(this, arguments);
    return this._defaults.tag = 'path';
  };

  Cross.prototype._draw = function() {
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

  Cross.prototype._getLength = function() {
    var radiusX, radiusY;
    radiusX = this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    radiusY = this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    return 2 * (radiusX + radiusY);
  };

  return Cross;

})(Bit);

export default Cross;
