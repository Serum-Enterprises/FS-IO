const Cache = require('@serum-enterprises/cache');
const IO = require('../src/IO');

describe('Testing IO', () => {
	test('constructor', () => {
		expect(() => new IO(null)).toThrow(new TypeError('Expected dataDir to be a String'));
		expect(() => new IO('/dataDir', 'invalid')).toThrow(new TypeError('Expected cache to be an instance of Cache, a positive Integer indicating the maximum size of the Cache (in Bytes), or null'));
		expect(() => new IO('/dataDir', -1)).toThrow(new TypeError('Expected cache to be an instance of Cache, a positive Integer indicating the maximum size of the Cache (in Bytes), or null'));
		expect(() => new IO('/dataDir', 0.5)).toThrow(new TypeError('Expected cache to be an instance of Cache, a positive Integer indicating the maximum size of the Cache (in Bytes), or null'));
		expect(new IO('/dataDir', 0)).toBeInstanceOf(IO);
		expect(new IO('/dataDir')).toBeInstanceOf(IO);
	});

	test('dataDir', () => {
		const io = new IO('/dataDir');

		expect(io.dataDir).toBe('/dataDir');
	});

	test('cache', () => {
		const cache = new Cache(2048);

		const io = new IO('/dataDir', cache);

		expect(io.cache).toBeInstanceOf(Cache);
	});
});
