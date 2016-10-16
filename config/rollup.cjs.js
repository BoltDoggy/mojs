import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

import buble from 'rollup-plugin-buble';

export default {
	entry: 'lib/index.js',
	plugins: [babel({
		presets: ['es2015-rollup', 'stage-3'],
		plugins: ['external-helpers-2'],
	    externalHelpers: false
	}), nodeResolve({jsnext: true}), buble()],
	moduleName: 'mojs',
	targets: [
	    { dest: 'dist/mojs.cjs.js', format: 'cjs' },
	    { dest: 'dist/mojs.umd.js', format: 'umd' }
	]
};
