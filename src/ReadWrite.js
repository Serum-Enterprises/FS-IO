const Cache = require('@serum-enterprises/cache');
const ReadOnly = require('./ReadOnly');

const entry = require('path');
const fs = require('fs');

class ReadWrite extends ReadOnly {
	/**
	 * Create a new IO.ReadWrite Instance
	 * @param {string} dataDir 
	 * @param {Cache | number | null} cache 
	 */
	constructor(dataDir, cache = null) {
		super(dataDir, cache);
	}

	/**
	 * Write data to a File specified by filename (Overwrites existing Files and creates new Files)
	 * Rejects with a TypeError if filename is not a String
	 * Rejects with a TypeError if data is not an instance of Buffer
	 * Rejects with a RangeError if filename is not inside the Data Directory
	 * Rejects on a File System Error (e.g. the File does not exist)
	 * @param {string} filename 
	 * @param {Buffer} data 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async writeFile(filename, data) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		if (!(data instanceof Buffer))
			throw new TypeError('Expected data to be an instance of Buffer');

		const resolvedFilename = entry.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		await fs.promises.writeFile(resolvedFilename, data);

		this.cache.set(resolvedFilename, data);
	}

	/**
	 * Recursively create a new Directory Structure specified by dirname
	 * Rejects with a TypeError if dirname is not a String
	 * Rejects with a RangeError if dirname is not inside the Data Directory
	 * Rejects on a File System Error
	 * @param {string} dirname 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async createDir(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirectory = entry.resolve(this.dataDir, dirname);

		if (!resolvedDirectory.startsWith(this.dataDir))
			throw new RangeError('Expected dirname to be inside the Data Directory');

		await fs.promises.mkdir(resolvedDirectory, { recursive: true });
	}

	/**
	 * Create a Symbolic Link specified by filename that points to target
	 * Rejects with a TypeError if target is not a String
	 * Rejects with a TypeError if filename is not a String
	 * Rejects with a RangeError if target is not inside the Data Directory
	 * Rejects with a RangeError if filename is not inside the Data Directory
	 * Rejects on a File System Error
	 * @param {string} target 
	 * @param {string} filename
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async createSymLink(target, filename) {
		if (typeof target !== 'string')
			throw new TypeError('Expected target to be a String');

		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedTarget = entry.resolve(this.dataDir, target);
		const resolvedFilename = entry.resolve(this.dataDir, filename);

		if (!resolvedTarget.startsWith(this.dataDir))
			throw new RangeError('Expected target to be inside the Data Directory');

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		await fs.promises.symlink(resolvedTarget, resolvedFilename);
	}

	/**
	 * Create a Hard Link specified by filename that points to target.
	 * Rejects with a TypeError if target is not a String
	 * Rejects with a TypeError if filename is not a String
	 * Rejects with a RangeError if target is not inside the Data Directory
	 * Rejects with a RangeError if filename is not inside the Data Directory
	 * Rejects on a File System Error
	 * @param {string} target 
	 * @param {string} filename 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async createHardLink(target, filename) {
		if (typeof target !== 'string')
			throw new TypeError('Expected target to be a String');

		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedTarget = entry.resolve(this.dataDir, target);
		const resolvedFilename = entry.resolve(this.dataDir, filename);

		if (!resolvedTarget.startsWith(this.dataDir))
			throw new RangeError('Expected target to be inside the Data Directory');

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		await fs.promises.link(resolvedTarget, resolvedFilename);
	}

	/**
	 * Rename an Entry specified by oldPath to newPath.
	 * Rejects with a TypeError if oldPath is not a String
	 * Rejects with a TypeError if newPath is not a String
	 * Rejects with a RangeError if oldPath is not inside the Data Directory
	 * Rejects with a RangeError if newPath is not inside the Data Directory
	 * Rejects on a File System Error
	 * @param {string} oldPath 
	 * @param {string} newPath 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async rename(oldPath, newPath) {
		if (typeof oldPath !== 'string')
			throw new TypeError('Expected oldPath to be a String');

		if (typeof newPath !== 'string')
			throw new TypeError('Expected newPath to be a String');

		const resolvedOldPath = entry.resolve(this.dataDir, oldPath);
		const resolvedNewPath = entry.resolve(this.dataDir, newPath);

		if (!resolvedOldPath.startsWith(this.dataDir))
			throw new RangeError('Expected oldPath to be inside the Data Directory');

		if (!resolvedNewPath.startsWith(this.dataDir))
			throw new RangeError('Expected newPath to be inside the Data Directory');

		await fs.promises.rename(resolvedOldPath, resolvedNewPath);

		if (this.cache.has(resolvedOldPath))
			this.cache.rename(resolvedOldPath, resolvedNewPath);
	}

	/**
	 * Delete an Entry specified by entry.
	 * Rejects with a TypeError if entry is not a String
	 * Rejects with a RangeError if entry is not inside the Data Directory
	 * Rejects on a File System Error
	 * @param {string} entry 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async delete(entry) {
		if (typeof entry !== 'string')
			throw new TypeError('Expected entry to be a String');

		const resolvedPath = entry.resolve(this.dataDir, entry);

		if (!resolvedPath.startsWith(this.dataDir))
			throw new RangeError('Expected path to be inside the Data Directory');

		await fs.promises.unlink(resolvedPath);

		this.cache.delete(resolvedPath);
	}

	/**
	 * Syncronously write data to a File specified by filename.
	 * @param {string} filename 
	 * @param {Buffer} data 
	 * @returns {void}
	 * @throws {TypeError} - If filename is not a String
	 * @throws {TypeError} - If data is not an instance of Buffer
	 * @throws {RangeError} - If filename is not inside the Data Directory
	 * @throws {Error} - If a File System Error occurs
	 * @public
	 */
	writeFileSync(filename, data) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		if (!(data instanceof Buffer))
			throw new TypeError('Expected data to be an instance of Buffer');

		const resolvedFilename = entry.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		fs.writeFileSync(resolvedFilename, data);

		this.cache.set(resolvedFilename, data);
	}

	/**
	 * Syncronously and recursively create a Directory Structure specified by dirname.
	 * @param {string} dirname 
	 * @returns {void}
	 * @throws {TypeError} - If dirname is not a String
	 * @throws {RangeError} - If dirname is not inside the Data Directory
	 * @throws {Error} - If a File System Error occurs
	 * @public
	 */
	createDirSync(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirectory = entry.resolve(this.dataDir, dirname);

		if (!resolvedDirectory.startsWith(this.dataDir))
			throw new RangeError('Expected dirname to be inside the Data Directory');

		fs.mkdirSync(resolvedDirectory, { recursive: true });
	}

	/**
	 * Syncronously create a Symbolic Link specified by filename that points to target.
	 * @param {string} target 
	 * @param {string} filename 
	 * @returns {void}
	 * @throws {TypeError} - If target is not a String
	 * @throws {TypeError} - If filename is not a String
	 * @throws {RangeError} - If target is not inside the Data Directory
	 * @throws {RangeError} - If filename is not inside the Data Directory
	 * @throws {Error} - If a File System Error occurs
	 * @public
	 */
	createSymLinkSync(target, filename) {
		if (typeof target !== 'string')
			throw new TypeError('Expected target to be a String');

		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedTarget = entry.resolve(this.dataDir, target);
		const resolvedFilename = entry.resolve(this.dataDir, filename);

		if (!resolvedTarget.startsWith(this.dataDir))
			throw new RangeError('Expected target to be inside the Data Directory');

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		fs.symlinkSync(resolvedTarget, resolvedFilename);

	}

	/**
	 * Syncronously create a Hard Link specified by filename that points to target.
	 * @param {string} target 
	 * @param {string} filename 
	 * @returns {void}
	 * @throws {TypeError} - If target is not a String
	 * @throws {TypeError} - If filename is not a String
	 * @throws {RangeError} - If target is not inside the Data Directory
	 * @throws {RangeError} - If filename is not inside the Data Directory
	 * @throws {Error} - If a File System Error occurs
	 * @public
	 */
	createHardLinkSync(target, filename) {
		if (typeof target !== 'string')
			throw new TypeError('Expected target to be a String');

		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedTarget = entry.resolve(this.dataDir, target);
		const resolvedFilename = entry.resolve(this.dataDir, filename);

		if (!resolvedTarget.startsWith(this.dataDir))
			throw new RangeError('Expected target to be inside the Data Directory');

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		fs.linkSync(resolvedTarget, resolvedFilename);
	}

	/**
	 * Synchronously rename an Entry specified by oldPath to newPath.
	 * @param {string} oldPath 
	 * @param {string} newPath 
	 * @returns {void}
	 * @throws {TypeError} - If oldPath is not a String
	 * @throws {TypeError} - If newPath is not a String
	 * @throws {RangeError} - If oldPath is not inside the Data Directory
	 * @throws {RangeError} - If newPath is not inside the Data Directory
	 * @throws {Error} - If a File System Error occurs
	 * @public
	 */
	renameSync(oldPath, newPath) {
		if (typeof oldPath !== 'string')
			throw new TypeError('Expected oldPath to be a String');

		if (typeof newPath !== 'string')
			throw new TypeError('Expected newPath to be a String');

		const resolvedOldPath = entry.resolve(this.dataDir, oldPath);
		const resolvedNewPath = entry.resolve(this.dataDir, newPath);

		if (!resolvedOldPath.startsWith(this.dataDir))
			throw new RangeError('Expected oldPath to be inside the Data Directory');

		if (!resolvedNewPath.startsWith(this.dataDir))
			throw new RangeError('Expected newPath to be inside the Data Directory');

		fs.renameSync(resolvedOldPath, resolvedNewPath);

		this.cache.rename(resolvedOldPath, resolvedNewPath);
	}

	/**
	 * Synchronously delete an Entry specified by path.
	 * @param {string} path 
	 * @returns {void}
	 * @throws {TypeError} - If path is not a String
	 * @throws {RangeError} - If path is not inside the Data Directory
	 * @throws {Error} - If a File System Error occurs
	 * @public
	 */
	deleteSync(path) {
		if (typeof path !== 'string')
			throw new TypeError('Expected path to be a String');

		const resolvedPath = path.resolve(this.dataDir, path);

		if (!resolvedPath.startsWith(this.dataDir))
			throw new RangeError('Expected path to be inside the Data Directory');

		fs.unlinkSync(resolvedPath);

		this.cache.delete(resolvedPath);
	}
}

module.exports = ReadWrite;