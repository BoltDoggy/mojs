/*
* @Author: 王春岩 <Bolt>
* @Date:   2016-10-16 15:27:38
* @Last Modified by:   Bolt
* @Last Modified time: 2016-10-16 15:34:48
*/

'use strict';

/* istanbul ignore next */
(function(root) {
  var offset, ref, ref1;
  if (root.performance == null) {
    root.performance = {};
  }
  Date.now = Date.now || function() {
    return (new Date).getTime();
  };
  if (root.performance.now == null) {
    offset = ((ref = root.performance) != null ? (ref1 = ref.timing) != null ? ref1.navigationStart : void 0 : void 0) ? performance.timing.navigationStart : Date.now();
    return root.performance.now = function() {
      return Date.now() - offset;
    };
  }
})(window);