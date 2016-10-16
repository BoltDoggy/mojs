'use strict';

/**
 * Adds two numbers together, returning the sum.
 */
function add(n, m) {
  return n + m;
}

/*
 * This is the main entry point for your package.
 *
 * You can import other modules here, including external packages. When
 * bundling using rollup you can mark those modules as external and have them
 * excluded or, if they have a jsnext:main entry in their package.json let
 * rollup bundle them into your dist file.
 */

/**
 * Multiply two numbers together, returning the product.
 *
 * This function illustrates an export from an entry point that uses imports
 * from other files. It also illustrates tail-call optimizations in ES6,
 * otherwise the `negative` parameter wouldn't be here.
 */
function multiply(n, m) {
	var negative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	if (n === 0 || m === 0) {
		return 0;
	} else if (n === 1) {
		return m;
	} else if (m === 1) {
		return n;
	} else if (n < 0 && m < 0) {
		return multiply(-n, -m);
	} else if (n < 0) {
		return multiply(-n, m, !negative);
	} else if (m < 0) {
		return multiply(n, -m, !negative);
	}

	var result = n;
	while (--m) {
		result = add(result, n);
	}
	return negative ? -result : result;
}

module.exports = multiply;