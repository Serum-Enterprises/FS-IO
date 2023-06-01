const Cache = require('@serum-enterprises/cache');
const Result = require('./Result.class');

const ReadOnly = require('./ReadOnlyIO.class');

const path = require('path');
const fs = require('fs');

class ReadWrite extends ReadOnly {
	/**
	 * Create a new ReadWriteIO Instance
	 * @param {string} dataDir 
	 * @param {Cache | number | null} cache 
	 */
	constructor(dataDir, cache = null) {
		super(dataDir, cache);
	}

	/**
	 * Write data to a File specified by filename.
	 * If the File does not exist, it will be created.
	 * If the File does exist, it will be overwritten.
	 * @param {string} filename 
	 * @param {Buffer} data 
	 * @returns {Promise<Result<void, Error>>}
	 * @throws {TypeError} - If filename is not a String
	 * @throws {TypeError} - If data is not an instance of Buffer
	 * @public
	 * @async
	 */
	async writeFile(filename, data) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		if (!(data instanceof Buffer))
			throw new TypeError('Expected data to be an instance of Buffer');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		return fs.promises.writeFile(resolvedFilename, data)
			.then(() => {
				this.cache.set(resolvedFilename, data);
				return Result.OK();
			})
			.catch((err) => Result.E(err));
	}

	/**
	 * Recursively create a new Directory specified by dirname.
	 * @param {string} dirname 
	 * @returns {Promise<Result<void, Error>>}
	 * @throws {TypeError} - If dirname is not a String
	 * @public
	 * @async
	 */
	async createDir(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirectory = path.resolve(this.dataDir, dirname);

		if (!resolvedDirectory.startsWith(this.dataDir))
			return Result.E(new Error('Expected dirname to be inside the Data Directory'));

		return fs.promises.mkdir(resolvedDirectory, { recursive: true })
			.then(() => Result.OK())
			.catch((err) => Result.E(err));
	}

	/**
	 * Create a Symbolic Link specified by filename that points to target.
	 * @param {string} target 
	 * @param {string} filename
	 * @returns {Promise<Result<void, Error>>}
	 * @throws {TypeError} - If target is not a String
	 * @throws {TypeError} - If filename is not a String
	 * @public
	 * @async
	 */
	async createSymLink(target, filename) {
		if (typeof target !== 'string')
			throw new TypeError('Expected target to be a String');

		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedTarget = path.resolve(this.dataDir, target);
		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedTarget.startsWith(this.dataDir))
			return Result.E(new Error('Expected target to be inside the Data Directory'));

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		return fs.promises.symlink(resolvedTarget, resolvedFilename)
			.then(() => Result.OK())
			.catch((err) => Result.E(err));
	}

	/**
	 * Create a Hard Link specified by filename that points to target.
	 * @param {string} target 
	 * @param {string} filename 
	 * @returns {Promise<Result<void, Error>>}
	 * @throws {TypeError} - If target is not a String
	 * @throws {TypeError} - If filename is not a String
	 * @public
	 * @async
	 */
	async createHardLink(target, filename) {
		if (typeof target !== 'string')
			throw new TypeError('Expected target to be a String');

		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedTarget = path.resolve(this.dataDir, target);
		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedTarget.startsWith(this.dataDir))
			return Result.E(new Error('Expected target to be inside the Data Directory'));

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		return fs.promises.link(resolvedTarget, resolvedFilename)
			.then(() => Result.OK())
			.catch((err) => Result.E(err));
	}

	/**
	 * Rename an Entry specified by oldPath to newPath.
	 * @param {string} oldPath 
	 * @param {string} newPath 
	 * @returns {Promise<Result<void, Error>>}
	 * @throws {TypeError} - If oldPath is not a String
	 * @throws {TypeError} - If newPath is not a String
	 * @public
	 * @async
	 */
	async rename(oldPath, newPath) {
		if (typeof oldPath !== 'string')
			throw new TypeError('Expected oldPath to be a String');

		if (typeof newPath !== 'string')
			throw new TypeError('Expected newPath to be a String');

		const resolvedOldPath = path.resolve(this.dataDir, oldPath);
		const resolvedNewPath = path.resolve(this.dataDir, newPath);

		if (!resolvedOldPath.startsWith(this.dataDir))
			return Result.E(new Error('Expected oldPath to be inside the Data Directory'));

		if (!resolvedNewPath.startsWith(this.dataDir))
			return Result.E(new Error('Expected newPath to be inside the Data Directory'));

		return fs.promises.rename(resolvedOldPath, resolvedNewPath)
			.then(() => {
				if (this.cache.has(resolvedOldPath))
					this.cache.rename(resolvedOldPath, resolvedNewPath);

				return Result.OK();
			})
			.catch((err) => Result.E(err));
	}

	/**
	 * Delete an Entry specified by path.
	 * @param {string} path 
	 * @returns {Promise<Result<void, Error>>}
	 * @throws {TypeError} - If path is not a String
	 * @public
	 * @async
	 */
	async delete(path) {
		if (typeof path !== 'string')
			throw new TypeError('Expected path to be a String');

		const resolvedPath = path.resolve(this.dataDir, path);

		if (!resolvedPath.startsWith(this.dataDir))
			return Result.E(new Error('Expected path to be inside the Data Directory'));

		return fs.promises.unlink(resolvedPath)
			.then(() => {
				this.cache.delete(resolvedPath);

				return Result.OK();
			})
			.catch((err) => Result.E(err));
	}

	/**
	 * Syncronously write data to a File specified by filename.
	 * @param {string} filename 
	 * @param {Buffer} data 
	 * @returns {Result<void, Error>}
	 * @throws {TypeError} - If filename is not a String
	 * @throws {TypeError} - If data is not an instance of Buffer
	 * @public
	 */
	writeFileSync(filename, data) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		if (!(data instanceof Buffer))
			throw new TypeError('Expected data to be an instance of Buffer');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		try {
			fs.writeFileSync(resolvedFilename, data);

			this.cache.set(resolvedFilename, data);

			return Result.OK();
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Syncronously and recursively create a Directory specified by dirname.
	 * @param {string} dirname 
	 * @returns {Result<void, Error>}
	 * @throws {TypeError} - If dirname is not a String
	 * @public
	 */
	createDirSync(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirectory = path.resolve(this.dataDir, dirname);

		if (!resolvedDirectory.startsWith(this.dataDir))
			return Result.E(new Error('Expected dirname to be inside the Data Directory'));

		try {
			fs.mkdirSync(resolvedDirectory, { recursive: true });

			return Result.OK();
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Syncronously create a Symbolic Link specified by filename that points to target.
	 * @param {string} target 
	 * @param {string} filename 
	 * @returns {Result<void, Error>}
	 * @throws {TypeError} - If target is not a String
	 * @throws {TypeError} - If filename is not a String
	 * @public
	 */
	createSymLinkSync(target, filename) {
		if (typeof target !== 'string')
			throw new TypeError('Expected target to be a String');

		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedTarget = path.resolve(this.dataDir, target);
		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedTarget.startsWith(this.dataDir))
			return Result.E(new Error('Expected target to be inside the Data Directory'));

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		try {
			fs.symlinkSync(resolvedTarget, resolvedFilename);

			return Result.OK();
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Syncronously create a Hard Link specified by filename that points to target.
	 * @param {string} target 
	 * @param {string} filename 
	 * @returns {Result<void, Error>}
	 * @throws {TypeError} - If target is not a String
	 * @throws {TypeError} - If filename is not a String
	 * @public
	 */
	createHardLinkSync(target, filename) {
		if (typeof target !== 'string')
			throw new TypeError('Expected target to be a String');

		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedTarget = path.resolve(this.dataDir, target);
		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedTarget.startsWith(this.dataDir))
			return Result.E(new Error('Expected target to be inside the Data Directory'));

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		try {
			fs.linkSync(resolvedTarget, resolvedFilename);

			return Result.OK();
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Synchronously rename an Entry specified by oldPath to newPath.
	 * @param {string} oldPath 
	 * @param {string} newPath 
	 * @returns {Result<void, Error>}
	 * @throws {TypeError} - If oldPath is not a String
	 * @throws {TypeError} - If newPath is not a String
	 * @public
	 */
	renameSync(oldPath, newPath) {
		if (typeof oldPath !== 'string')
			throw new TypeError('Expected oldPath to be a String');

		if (typeof newPath !== 'string')
			throw new TypeError('Expected newPath to be a String');

		const resolvedOldPath = path.resolve(this.dataDir, oldPath);
		const resolvedNewPath = path.resolve(this.dataDir, newPath);

		if (!resolvedOldPath.startsWith(this.dataDir))
			return Result.E(new Error('Expected oldPath to be inside the Data Directory'));

		if (!resolvedNewPath.startsWith(this.dataDir))
			return Result.E(new Error('Expected newPath to be inside the Data Directory'));

		try {
			fs.renameSync(resolvedOldPath, resolvedNewPath);

			this.cache.rename(resolvedOldPath, resolvedNewPath);

			return Result.OK();
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Synchronously delete an Entry specified by path.
	 * @param {string} path 
	 * @returns {Result<void, Error>}
	 * @throws {TypeError} - If path is not a String
	 * @public
	 */
	deleteSync(path) {
		if(typeof path !== 'string')
			throw new TypeError('Expected path to be a String');

		const resolvedPath = path.resolve(this.dataDir, path);
		
		if (!resolvedPath.startsWith(this.dataDir))
			return Result.E(new Error('Expected path to be inside the Data Directory'));

		try {
			fs.unlinkSync(resolvedPath);

			this.cache.delete(resolvedPath);

			return Result.OK();
		}
		catch (err) {
			return Result.E(err);
		}
	}
}

module.exports = ReadWrite;