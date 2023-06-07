const Cache = require('@serum-enterprises/cache');

const fs = require('fs');
const path = require('path');

class IO {
	/**
	 * @type {string}
	 */
	#dataDir;

	/**
	 * @type {Cache}
	 */
	#cache;

	/**
	 * Create a new IO Instance
	 * If the Data Directory does not exist, it will be created
	 * @param {string} dataDir 
	 * @param {Cache | number | null} cache
	 * @throws {TypeError} - If dataDir is not a String
	 * @throws {TypeError} - If cache is not an instance of Cache, a positive Integer indicating the maximum size of the Cache (in Bytes), or null
	 * @public
	 */
	constructor(dataDir, cache = null) {
		if (typeof dataDir !== 'string')
			throw new TypeError('Expected dataDir to be a String');

		if (cache === null)
			this.#cache = new Cache(0);
		else if (Number.isSafeInteger(cache) && cache >= 0)
			this.#cache = new Cache(cache);
		else if (cache instanceof Cache)
			this.#cache = cache;
		else
			throw new TypeError('Expected cache to be an instance of Cache, a positive Integer indicating the maximum size of the Cache (in Bytes), or null');

		const resolvedDataDir = path.resolve(dataDir);
		fs.mkdirSync(resolvedDataDir, { recursive: true });

		this.#dataDir = path.resolve(dataDir);
	}

	/**
	 * Get the Data Directory
	 * @returns {string}
	 * @public
	 */
	get dataDir() {
		return this.#dataDir;
	}

	/**
	 * Get the Cache
	 * @returns {Cache}
	 * @public
	 */
	get cache() {
		return this.#cache;
	}
}

module.exports = IO;