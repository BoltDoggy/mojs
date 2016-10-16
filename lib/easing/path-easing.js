/*
* @Author: 王春岩 <Bolt>
* @Date:   2016-10-13 20:55:10
* @Last Modified by:   Bolt
* @Last Modified time: 2016-10-13 21:06:32
*/

'use strict';

import h from '../h.js'

let PathEasing = (function() {
  PathEasing.prototype._vars = function() {
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

  PathEasing.prototype._preSample = function() {
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

  PathEasing.prototype._findBounds = function(array, p) {
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

  PathEasing.prototype.sample = function(p) {
    var bounds, res;
    p = h.clamp(p, 0, 1);
    bounds = this._findBounds(this._samples, p);
    res = this._checkIfBoundsCloseEnough(p, bounds);
    if (res != null) {
      return res;
    }
    return this._findApproximate(p, bounds.start, bounds.end);
  };

  PathEasing.prototype._checkIfBoundsCloseEnough = function(p, bounds) {
    var point, y;
    point = void 0;
    y = this._checkIfPointCloseEnough(p, bounds.start.point);
    if (y != null) {
      return y;
    }
    return this._checkIfPointCloseEnough(p, bounds.end.point);
  };

  PathEasing.prototype._checkIfPointCloseEnough = function(p, point) {
    if (h.closeEnough(p, point.x / this._rect, this._eps)) {
      return this._resolveY(point);
    }
  };

  PathEasing.prototype._approximate = function(start, end, p) {
    var deltaP, percentP;
    deltaP = end.point.x - start.point.x;
    percentP = (p - (start.point.x / this._rect)) / (deltaP / this._rect);
    return start.length + percentP * (end.length - start.length);
  };

  PathEasing.prototype._findApproximate = function(p, start, end, approximateMax) {
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

  PathEasing.prototype._resolveY = function(point) {
    return 1 - (point.y / this._rect);
  };

  PathEasing.prototype._normalizePath = function(path) {
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

  PathEasing.prototype._joinNormalizedPath = function(commands, points) {
    var command, i, j, len1, normalizedPath, space;
    normalizedPath = '';
    for (i = j = 0, len1 = commands.length; j < len1; i = ++j) {
      command = commands[i];
      space = i === 0 ? '' : ' ';
      normalizedPath += "" + space + command + (points[i].trim());
    }
    return normalizedPath;
  };

  PathEasing.prototype._normalizeSegment = function(segment, value) {
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

  PathEasing.prototype._getSegmentPairs = function(array) {
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

  PathEasing.prototype.create = function(path, o) {
    var handler;
    handler = new PathEasing(path, o);
    handler.sample.path = handler.path;
    return handler.sample;
  };

  return PathEasing;

})();

export default PathEasing;