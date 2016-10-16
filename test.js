import test from 'ava';
import fn from './lib/index';

test('title', t => {
	t.is(fn(1,8), 8);
});
