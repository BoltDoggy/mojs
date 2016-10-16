import babel from 'rollup-plugin-babel';

export default {
	entry: 'test.js',
	plugins: [babel()],
	format: 'es',
	dest: 'build/test.js'
};
