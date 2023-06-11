const path = require('path');
const fs = require('fs');

const Cache = require('@serum-enterprises/cache');
const IO = require('./IO');

class ReadOnly extends IO {
	/**
	 * Create a new ReadOnly Instance
	 * If the Data Directory does not exist, it will be created
	 * @param {string} dataDir 
	 * @param {Cache | number | null} cache
	 * @throws {TypeError} if dataDir is not a String
	 * @throws {TypeError} if cache is not an instance of Cache, a positive Integer indicating the maximum size of the Cache (in Bytes), or null
	 * @throws {Error} on a File System Error
	 * @public
	 */
	constructor(dataDir, cache = null) {
		super(dataDir, cache);
	}

	/**
	 * Read the File specified by filename
	 * Resolves to a Buffer with the Content of the File
	 * Rejects with a TypeError if filename is not a String
	 * Rejects with a RangeError if filename does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error (e.g. the File does not exist)
	 * @param {string} filename 
	 * @returns {Promise<Buffer>}
	 * @public
	 * @async
	 */
	async readFile(filename) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		if (this.cache.has(resolvedFilename))
			return this.cache.get(resolvedFilename);

		const data = await fs.promises.readFile(resolvedFilename);

		this.cache.set(resolvedFilename, data);

		return data;
	}

	/**
	 * Read the Directory specified by dirname
	 * Resolves to an Array of fs.Dirent Objects
	 * Rejects with a TypeError if dirname is not a String
	 * Rejects with a RangeError if dirname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error (e.g. the Directory does not exist)
	 * @param {string} dirname 
	 * @returns {Promise<fs.Dirent[]>}
	 * @public
	 * @async
	 */
	async readDir(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirname = path.resolve(this.dataDir, dirname);

		if (!resolvedDirname.startsWith(this.dataDir))
			throw new RangeError('Expected dirname to be inside the Data Directory');

		return await fs.promises.readdir(resolvedDirname, { withFileTypes: true });
	}

	/**
	 * Get Information about the Entry specified by pathname
	 * Resolves to an instance of fs.Stats
	 * Rejects with a TypeError if pathname is not a String
	 * Rejects with a RangeError if pathname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error (e.g. the Entry does not exist)
	 * @param {string} pathname 
	 * @returns {Promise<fs.Stats>}
	 * @public
	 * @async
	 */
	async info(pathname) {
		if (typeof pathname !== 'string')
			throw new TypeError('Expected pathname to be a String');

		const resolvedPathname = path.resolve(this.dataDir, pathname);

		if (!resolvedPathname.startsWith(this.dataDir))
			throw new RangeError('Expected pathname to be inside the Data Directory');

		return await fs.promises.lstat(resolvedPathname);
	}

	/**
	 * Resolve the Path specified by pathname
	 * Resolves to a String with the resolved Path
	 * Rejects with a TypeError if pathname is not a String
	 * Resolved with a RangeError if pathname is not inside the Data Directory
	 * Rejects with a RangeError if the resolved pathname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error (e.g. the Entry does not exist)
	 * @param {string} pathname 
	 * @returns {string}
	 * @public
	 * @async
	 */
	async resolvePath(pathname) {
		if (typeof pathname !== 'string')
			throw new TypeError('Expected pathname to be a String');

		const resolvedEntry = path.resolve(this.dataDir, pathname);

		if (!resolvedEntry.startsWith(this.dataDir))
			throw new RangeError('Expected pathname to be inside the Data Directory');

		const resolvedPath = await fs.promises.realpath(resolvedEntry);

		if (!resolvedPath.startsWith(this.dataDir))
			throw new RangeError('Expected the resolved pathname to be inside the Data Directory');

		return resolvedPath;
	}

	/**
	 * Synchronously read the File specified by filename
	 * @param {string} filename 
	 * @returns {Buffer}
	 * @throws {TypeError} if filename is not a String
	 * @throws {RangeError} if filename does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error (e.g. the File does not exist)
	 * @public
	 */
	readFileSync(filename) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		if (this.cache.has(resolvedFilename))
			return this.cache.get(resolvedFilename);

		const data = fs.readFileSync(resolvedFilename);

		this.cache.set(resolvedFilename, data);

		return data;
	}

	/**
	 * Synchronously read the Directory specified by dirname
	 * @param {string} dirname 
	 * @returns {fs.Dirent[]}
	 * @throws {TypeError} if dirname is not a String
	 * @throws {RangeError} if dirname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error (e.g. the Directory does not exist)
	 * @public
	 */
	readDirSync(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirname = path.resolve(this.dataDir, dirname);

		if (!resolvedDirname.startsWith(this.dataDir))
			throw new RangeError('Expected dirname to be inside the Data Directory');

		return fs.readdirSync(resolvedDirname, { withFileTypes: true });
	}

	/**
	 * Synchronously get Information about the Entry specified by pathname
	 * @param {string} pathname 
	 * @returns {fs.Stats}
	 * @throws {TypeError} if pathname is not a String
	 * @throws {RangeError} if pathname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error (e.g. the Entry does not exist)
	 * @public
	 */
	infoSync(pathname) {
		if (typeof pathname !== 'string')
			throw new TypeError('Expected pathname to be a String');

		const resolvedPathname = path.resolve(this.dataDir, pathname);

		if (!resolvedPathname.startsWith(this.dataDir))
			throw new RangeError('Expected pathname to be inside the Data Directory');

		return fs.lstatSync(resolvedPathname);
	}

	/**
	 * Synchronously resolve the Path specified by pathname
	 * @param {string} pathname 
	 * @returns {string}
	 * @throws {TypeError} if pathname is not a String
	 * @throws {RangeError} if pathname does not resolve to a Path in the Data Directory
	 * @throws {RangeError} if the resolved pathname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error (e.g. the Entry does not exist)
	 * @public
	 */
	resolvePathSync(entry) {
		if (typeof entry !== 'string')
			throw new TypeError('Expected entry to be a String');

		const resolvedEntry = path.resolve(this.dataDir, entry);

		if (!resolvedEntry.startsWith(this.dataDir))
			throw new RangeError('Expected entry to be inside the Data Directory');

		const resolvedPath = fs.realpathSync(resolvedEntry);

		if (!resolvedPath.startsWith(this.dataDir))
			throw new RangeError('Expected resolved Path to be inside the Data Directory');

		return resolvedPath;
	}
}

module.exports = ReadOnly;