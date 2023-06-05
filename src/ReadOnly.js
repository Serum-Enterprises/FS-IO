const Cache = require('@serum-enterprises/cache');

const IO = require('./IO');

const path = require('path');
const fs = require('fs');

class ReadOnly extends IO {
	/**
	 * Create a new IO.ReadOnly Instance
	 * @param {string} dataDir 
	 * @param {Cache | number | null} cache 
	 */
	constructor(dataDir, cache = null) {
		super(dataDir, cache);
	}

	/**
	 * Read the File specified by filename
	 * Resolves to a Buffer with the Content of the File
	 * Rejects with a TypeError if filename is not a String
	 * Rejects with a RangeError if filename does not resolve to a Path in the Data Directory
	 * Rejects on a File System Error (e.g. the File does not exist)
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
	 * Rejects on a File System Error (e.g. the Directory does not exist)
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
	 * Get Information about the Entry specified by entry
	 * Resolves to a fs.Stats Object
	 * Rejects with a TypeError if entry is not a String
	 * Rejects with a RangeError if entry does not resolve to a Path in the Data Directory
	 * Rejects on a File System Error (e.g. the Entry does not exist)
	 * @param {string} entry 
	 * @returns {Promise<fs.Stats>}
	 * @public
	 * @async
	 */
	async info(entry) {
		if (typeof entry !== 'string')
			throw new TypeError('Expected entry to be a String');

		const resolvedEntry = path.resolve(this.dataDir, entry);

		if (!resolvedEntry.startsWith(this.dataDir))
			throw new RangeError('Expected entry to be inside the Data Directory');

		return await fs.promises.lstat(resolvedEntry);
	}

	/**
	 * Read the File specified by filename synchronously
	 * @param {string} filename 
	 * @returns {Buffer}
	 * @throws {TypeError} - If filename is not a String
	 * @throws {RangeError} - If filename does not resolve to a Path in the Data Directory
	 * @throws {Error} - On a File System Error (e.g. the File does not exist)
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
	 * Read the Directory specified by dirname synchronously
	 * @param {string} dirname 
	 * @returns {fs.Dirent[]}
	 * @throws {TypeError} - If dirname is not a String
	 * @throws {RangeError} - If dirname does not resolve to a Path in the Data Directory
	 * @throws {Error} - On a File System Error (e.g. the Directory does not exist)
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
	 * Synchronously get Information about the Entry specified by entry
	 * @param {string} entry 
	 * @returns {fs.Stats}
	 * @throws {TypeError} - If entry is not a String
	 * @throws {RangeError} - If entry does not resolve to a Path in the Data Directory
	 * @throws {Error} - On a File System Error (e.g. the Entry does not exist)
	 * @public
	 */
	infoSync(entry) {
		if (typeof entry !== 'string')
			throw new TypeError('Expected entry to be a String');

		const resolvedEntry = path.resolve(this.dataDir, entry);

		if (!resolvedEntry.startsWith(this.dataDir))
			throw new RangeError('Expected entry to be inside the Data Directory');

		return fs.lstatSync(resolvedEntry);
	}
}

module.exports = ReadOnly;