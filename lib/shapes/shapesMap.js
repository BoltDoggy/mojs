/*
* @Author: 王春岩 <Bolt>
* @Date:   2016-10-16 15:37:36
* @Last Modified by:   Bolt
* @Last Modified time: 2016-10-16 16:14:34
*/

'use strict';

var BitsMap;
import Bit from './bit'
import Custom from './custom'
import Circle from './circle'
import Line from './line'
import Zigzag from './zigzag'
import Rect from './rect'
import Polygon from './polygon'
import Cross from './cross'
import Curve from './curve'
import Equal from './equal'
import h from '../h'

BitsMap = (function() {
  function BitsMap() {
    this.addShape = h.bind(this.addShape, this);
  }

  BitsMap.prototype.bit = Bit;

  BitsMap.prototype.custom = Custom;

  BitsMap.prototype.circle = Circle;

  BitsMap.prototype.line = Line;

  BitsMap.prototype.zigzag = Zigzag;

  BitsMap.prototype.rect = Rect;

  BitsMap.prototype.polygon = Polygon;

  BitsMap.prototype.cross = Cross;

  BitsMap.prototype.equal = Equal;

  BitsMap.prototype.curve = Curve;

  BitsMap.prototype.getShape = function(name) {
    return this[name] || h.error("no \"" + name + "\" shape available yet, please choose from this list:", ['circle', 'line', 'zigzag', 'rect', 'polygon', 'cross', 'equal', 'curve']);
  };


  /*
    Method to add shape to the map.
    @public
    @param {String} Name of the shape module.
    @param {Object} Shape module class.
   */

  BitsMap.prototype.addShape = function(name, Module) {
    return this[name] = Module;
  };

  return BitsMap;

})();

export default new BitsMap;
