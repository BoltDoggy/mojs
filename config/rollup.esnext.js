import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'lib/index.js',
	plugins: [nodeResolve({jsnext: true})],
	format: 'es',
	dest: 'dist/mojs.js'
};
