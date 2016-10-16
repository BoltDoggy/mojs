/*
* @Author: 王春岩 <Bolt>
* @Date:   2016-10-13 21:10:51
* @Last Modified by:   Bolt
* @Last Modified time: 2016-10-16 16:00:28
*/

'use strict';

import bezier from './bezier-easing'
import PathEasing from './path-easing'
import mix from './mix'
import approximate from './approximate'
import h from '../h'

const sin = Math.sin;

const PI = Math.PI;

const Easing = (function() {
  function Easing() {}

  Easing.prototype.bezier = bezier;

  Easing.prototype.PathEasing = PathEasing;

  Easing.prototype.path = (new PathEasing('creator')).create;

  Easing.prototype.approximate = approximate;

  Easing.prototype.inverse = function(p) {
    return 1 - p;
  };

  Easing.prototype.linear = {
    none: function(k) {
      return k;
    }
  };

  Easing.prototype.ease = {
    "in": bezier.apply(Easing, [0.42, 0, 1, 1]),
    out: bezier.apply(Easing, [0, 0, 0.58, 1]),
    inout: bezier.apply(Easing, [0.42, 0, 0.58, 1])
  };

  Easing.prototype.sin = {
    "in": function(k) {
      return 1 - Math.cos(k * PI / 2);
    },
    out: function(k) {
      return sin(k * PI / 2);
    },
    inout: function(k) {
      return 0.5 * (1 - Math.cos(PI * k));
    }
  };

  Easing.prototype.quad = {
    "in": function(k) {
      return k * k;
    },
    out: function(k) {
      return k * (2 - k);
    },
    inout: function(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k;
      }
      return -0.5 * (--k * (k - 2) - 1);
    }
  };

  Easing.prototype.cubic = {
    "in": function(k) {
      return k * k * k;
    },
    out: function(k) {
      return --k * k * k + 1;
    },
    inout: function(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
      }
      return 0.5 * ((k -= 2) * k * k + 2);
    }
  };

  Easing.prototype.quart = {
    "in": function(k) {
      return k * k * k * k;
    },
    out: function(k) {
      return 1 - (--k * k * k * k);
    },
    inout: function(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k;
      }
      return -0.5 * ((k -= 2) * k * k * k - 2);
    }
  };

  Easing.prototype.quint = {
    "in": function(k) {
      return k * k * k * k * k;
    },
    out: function(k) {
      return --k * k * k * k * k + 1;
    },
    inout: function(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k;
      }
      return 0.5 * ((k -= 2) * k * k * k * k + 2);
    }
  };

  Easing.prototype.expo = {
    "in": function(k) {
      if (k === 0) {
        return 0;
      } else {
        return Math.pow(1024, k - 1);
      }
    },
    out: function(k) {
      if (k === 1) {
        return 1;
      } else {
        return 1 - Math.pow(2, -10 * k);
      }
    },
    inout: function(k) {
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
    "in": function(k) {
      return 1 - Math.sqrt(1 - k * k);
    },
    out: function(k) {
      return Math.sqrt(1 - (--k * k));
    },
    inout: function(k) {
      if ((k *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - k * k) - 1);
      }
      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }
  };

  Easing.prototype.back = {
    "in": function(k) {
      var s;
      s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },
    out: function(k) {
      var s;
      s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },
    inout: function(k) {
      var s;
      s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }
  };

  Easing.prototype.elastic = {
    "in": function(k) {
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
    out: function(k) {
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
    inout: function(k) {
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
    "in": function(k) {
      return 1 - easing.bounce.out(1 - k);
    },
    out: function(k) {
      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
      } else {
        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
      }
    },
    inout: function(k) {
      if (k < 0.5) {
        return easing.bounce["in"](k * 2) * 0.5;
      }
      return easing.bounce.out(k * 2 - 1) * 0.5 + 0.5;
    }
  };

  Easing.prototype.parseEasing = function(easing) {
    var easingParent, type;
    if (easing == null) {
      easing = 'linear.none';
    }
    type = typeof easing;
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

  Easing.prototype._splitEasing = function(string) {
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

})();

const easing = new Easing;

easing.mix = mix(easing);

export default easing;
