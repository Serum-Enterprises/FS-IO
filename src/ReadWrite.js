const path = require('path');
const fs = require('fs');

const Cache = require('@serum-enterprises/cache');
const ReadOnly = require('./ReadOnly');

class ReadWrite extends ReadOnly {
	/**
	 * Create a new ReadWrite Instance
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
	 * Write data to a File specified by filename
	 * Overwrites the File if it already exists and creates the File if it does not
	 * Rejects with a TypeError if filename is not a String
	 * Rejects with a TypeError if data is not an instance of Buffer
	 * Rejects with a RangeError if filename does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error
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

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		await fs.promises.writeFile(resolvedFilename, data);

		this.cache.set(resolvedFilename, data);
	}

	/**
	 * Recursively create a new Directory specified by dirname
	 * Rejects with a TypeError if dirname is not a String
	 * Rejects with a RangeError if dirname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error
	 * @param {string} dirname 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async createDir(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirectory = path.resolve(this.dataDir, dirname);

		if (!resolvedDirectory.startsWith(this.dataDir))
			throw new RangeError('Expected dirname to be inside the Data Directory');

		await fs.promises.mkdir(resolvedDirectory, { recursive: true });
	}

	/**
	 * Create a Symbolic Link specified by destinationPathname that points to sourcePathname
	 * Rejects with a TypeError if sourcePathname is not a String
	 * Rejects with a TypeError if destinationPathname is not a String
	 * Rejects with a RangeError if sourcePathname does not resolve to a Path in the Data Directory
	 * Rejects with a RangeError if destinationPathname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error
	 * @param {string} sourcePathname 
	 * @param {string} destinationPathname
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async createSymLink(sourcePathname, destinationPathname) {
		if (typeof sourcePathname !== 'string')
			throw new TypeError('Expected sourcePathname to be a String');

		if (typeof destinationPathname !== 'string')
			throw new TypeError('Expected destinationPathname to be a String');

		const resolvedSourcePathname = path.resolve(this.dataDir, sourcePathname);
		const resolvedDestinationPathname = path.resolve(this.dataDir, destinationPathname);

		if (!resolvedSourcePathname.startsWith(this.dataDir))
			throw new RangeError('Expected sourcePathname to be inside the Data Directory');

		if (!resolvedDestinationPathname.startsWith(this.dataDir))
			throw new RangeError('Expected destinationPathname to be inside the Data Directory');

		await fs.promises.symlink(resolvedSourcePathname, resolvedDestinationPathname);
	}

	/**
	 * Create a Hard Link specified by destinationPathname that points to sourcePathname
	 * Rejects with a TypeError if sourcePathname is not a String
	 * Rejects with a TypeError if destinationPathname is not a String
	 * Rejects with a RangeError if sourcePathname does not resolve to a Path in the Data Directory
	 * Rejects with a RangeError if destinationPathname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error
	 * @param {string} sourcePathname
	 * @param {string} destinationPathname
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async createHardLink(sourcePathname, destinationPathname) {
		if (typeof sourcePathname !== 'string')
			throw new TypeError('Expected sourcePathname to be a String');

		if (typeof destinationPathname !== 'string')
			throw new TypeError('Expected destinationPathname to be a String');

		const resolvedSourcePathname = path.resolve(this.dataDir, sourcePathname);
		const resolvedDestinationPathname = path.resolve(this.dataDir, destinationPathname);

		if (!resolvedSourcePathname.startsWith(this.dataDir))
			throw new RangeError('Expected sourcePathname to be inside the Data Directory');

		if (!resolvedDestinationPathname.startsWith(this.dataDir))
			throw new RangeError('Expected destinationPathname to be inside the Data Directory');

		await fs.promises.link(resolvedSourcePathname, resolvedDestinationPathname);
	}

	/**
	 * Rename an Entry specified by oldPathname to newPathname
	 * Rejects with a TypeError if oldPathname is not a String
	 * Rejects with a TypeError if newPathname is not a String
	 * Rejects with a RangeError if oldPathname does not resolve to a Path in the Data Directory
	 * Rejects with a RangeError if newPathname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error
	 * @param {string} oldPathname 
	 * @param {string} newPathname 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async rename(oldPathname, newPathname) {
		if (typeof oldPathname !== 'string')
			throw new TypeError('Expected oldPathname to be a String');

		if (typeof newPathname !== 'string')
			throw new TypeError('Expected newPathname to be a String');

		const resolvedOldPathname = path.resolve(this.dataDir, oldPathname);
		const resolvedNewPathname = path.resolve(this.dataDir, newPathname);

		if (!resolvedOldPathname.startsWith(this.dataDir))
			throw new RangeError('Expected oldPathname to be inside the Data Directory');

		if (!resolvedNewPathname.startsWith(this.dataDir))
			throw new RangeError('Expected newPathname to be inside the Data Directory');

		await fs.promises.rename(resolvedOldPathname, resolvedNewPathname);

		if (this.cache.has(resolvedOldPathname))
			this.cache.rename(resolvedOldPathname, resolvedNewPathname);
	}

	/**
	 * Copy a File specified by sourcePathname to a Destination specified by destinationPathname
	 * Rejects with a TypeError if sourcePathname is not a String
	 * Rejects with a TypeError if destinationPathname is not a String
	 * Rejects with a RangeError if sourcePathname does not resolve to a Path in the Data Directory
	 * Rejects with a RangeError if destinationPathname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error
	 * @param {string} sourcePathname 
	 * @param {string} destinationPathname 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async copyFile(sourcePathname, destinationPathname) {
		if (typeof sourcePathname !== 'string')
			throw new TypeError('Expected sourcePathname to be a String');

		if (typeof destinationPathname !== 'string')
			throw new TypeError('Expected destinationPathname to be a String');

		const resolvedSourcePathname = path.resolve(this.dataDir, sourcePathname);
		const resolvedDestinationPathname = path.resolve(this.dataDir, destinationPathname);

		if (!resolvedSourcePathname.startsWith(this.dataDir))
			throw new RangeError('Expected sourcePathname to be inside the Data Directory');

		if (!resolvedDestinationPathname.startsWith(this.dataDir))
			throw new RangeError('Expected destinationPathname to be inside the Data Directory');

		return await fs.promises.copyFile(sourcePathname, destinationPathname, fs.constants.COPYFILE_FICLONE);
	}

	/**
	 * Delete an Entry specified by pathname
	 * Rejects with a TypeError if pathname is not a String
	 * Rejects with a RangeError if pathname does not resolve to a Path in the Data Directory
	 * Rejects with an Error on a File System Error
	 * @param {string} pathname 
	 * @returns {Promise<void>}
	 * @public
	 * @async
	 */
	async delete(pathname) {
		if (typeof pathname !== 'string')
			throw new TypeError('Expected pathname to be a String');

		const resolvedPath = pathname.resolve(this.dataDir, pathname);

		if (!resolvedPath.startsWith(this.dataDir))
			throw new RangeError('Expected pathname to be inside the Data Directory');

		await fs.promises.unlink(resolvedPath);

		this.cache.delete(resolvedPath);
	}

	/**
	 * Syncronously write data to a File specified by filename
	 * Overwrites the File if it already exists and creates the File if it does not
	 * @param {string} filename 
	 * @param {Buffer} data 
	 * @returns {void}
	 * @throws {TypeError} if filename is not a String
	 * @throws {TypeError} if data is not an instance of Buffer
	 * @throws {RangeError} if filename does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error
	 * @public
	 */
	writeFileSync(filename, data) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		if (!(data instanceof Buffer))
			throw new TypeError('Expected data to be an instance of Buffer');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			throw new RangeError('Expected filename to be inside the Data Directory');

		fs.writeFileSync(resolvedFilename, data);

		this.cache.set(resolvedFilename, data);
	}

	/**
	 * Syncronously and recursively create a Directory Structure specified by dirname.
	 * @param {string} dirname 
	 * @returns {void}
	 * @throws {TypeError} if dirname is not a String
	 * @throws {RangeError} if dirname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error
	 * @public
	 */
	createDirSync(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirectory = path.resolve(this.dataDir, dirname);

		if (!resolvedDirectory.startsWith(this.dataDir))
			throw new RangeError('Expected dirname to be inside the Data Directory');

		fs.mkdirSync(resolvedDirectory, { recursive: true });
	}

	/**
	 * Syncronously create a Symbolic Link specified by destinationPathname that points to sourcePathname
	 * @param {string} sourcePathname 
	 * @param {string} destinationPathname 
	 * @returns {void}
	 * @throws {TypeError} if sourcePathname is not a String
	 * @throws {TypeError} if destinationPathname is not a String
	 * @throws {RangeError} if sourcePathname does not resolve to a Path in the Data Directory
	 * @throws {RangeError} if destinationPathname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error
	 * @public
	 */
	createSymLinkSync(sourcePathname, destinationPathname) {
		if (typeof sourcePathname !== 'string')
			throw new TypeError('Expected sourcePathname to be a String');

		if (typeof destinationPathname !== 'string')
			throw new TypeError('Expected destinationPathname to be a String');

		const resolvedSourcePathname = path.resolve(this.dataDir, sourcePathname);
		const resolvedDestinationPathname = path.resolve(this.dataDir, destinationPathname);

		if (!resolvedSourcePathname.startsWith(this.dataDir))
			throw new RangeError('Expected sourcePathname to be inside the Data Directory');

		if (!resolvedDestinationPathname.startsWith(this.dataDir))
			throw new RangeError('Expected destinationPathname to be inside the Data Directory');

		fs.symlinkSync(resolvedSourcePathname, resolvedDestinationPathname);
	}

	/**
	 * Syncronously create a Hard Link specified by destinationPathname that points to sourcePathname
	 * @param {string} sourcePathname 
	 * @param {string} destinationPathname 
	 * @returns {void}
	 * @throws {TypeError} if sourcePathname is not a String
	 * @throws {TypeError} if destinationPathname is not a String
	 * @throws {RangeError} if sourcePathname does not resolve to a Path in the Data Directory
	 * @throws {RangeError} if destinationPathname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error
	 * @public
	 */
	createHardLinkSync(sourcePathname, destinationPathname) {
		if (typeof sourcePathname !== 'string')
			throw new TypeError('Expected sourcePathname to be a String');

		if (typeof destinationPathname !== 'string')
			throw new TypeError('Expected destinationPathname to be a String');

		const resolvedSourcePathname = path.resolve(this.dataDir, sourcePathname);
		const resolvedDestinationPathname = path.resolve(this.dataDir, destinationPathname);

		if (!resolvedSourcePathname.startsWith(this.dataDir))
			throw new RangeError('Expected sourcePathname to be inside the Data Directory');

		if (!resolvedDestinationPathname.startsWith(this.dataDir))
			throw new RangeError('Expected destinationPathname to be inside the Data Directory');

		fs.linkSync(resolvedSourcePathname, resolvedDestinationPathname);
	}

	/**
	 * Synchronously rename an Entry specified by oldPathname to newPathname
	 * @param {string} oldPathname 
	 * @param {string} newPathname 
	 * @returns {void}
	 * @throws {TypeError} if oldPathname is not a String
	 * @throws {TypeError} if newPathname is not a String
	 * @throws {RangeError} if oldPathname does not resolve to a Path in the Data Directory
	 * @throws {RangeError} if newPathname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error
	 * @public
	 */
	renameSync(oldPathname, newPathname) {
		if (typeof oldPathname !== 'string')
			throw new TypeError('Expected oldPathname to be a String');

		if (typeof newPathname !== 'string')
			throw new TypeError('Expected newPathname to be a String');

		const resolvedOldPathname = path.resolve(this.dataDir, oldPathname);
		const resolvedNewPathname = path.resolve(this.dataDir, newPathname);

		if (!resolvedOldPathname.startsWith(this.dataDir))
			throw new RangeError('Expected oldPathname to be inside the Data Directory');

		if (!resolvedNewPathname.startsWith(this.dataDir))
			throw new RangeError('Expected newPathname to be inside the Data Directory');

		fs.renameSync(resolvedOldPathname, resolvedNewPathname);

		this.cache.rename(resolvedOldPathname, resolvedNewPathname);
	}

	/**
	 * Synchronously copy a File specified by sourcePathname to a Destination specified by destinationPathname
	 * @param {string} sourcePathname 
	 * @param {string} destinationPathname 
	 * @returns {void}
	 * @throws {TypeError} if sourcePathname is not a String
	 * @throws {TypeError} if destinationPathname is not a String
	 * @throws {RangeError} if sourcePathname does not resolve to a Path in the Data Directory
	 * @throws {RangeError} if destinationPathname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error
	 * @public
	 */
	copyFile(sourcePathname, destinationPathname) {
		if (typeof sourcePathname !== 'string')
			throw new TypeError('Expected sourcePathname to be a String');

		if (typeof destinationPathname !== 'string')
			throw new TypeError('Expected destinationPathname to be a String');

		const resolvedSourcePathname = path.resolve(this.dataDir, sourcePathname);
		const resolvedDestinationPathname = path.resolve(this.dataDir, destinationPathname);

		if (!resolvedSourcePathname.startsWith(this.dataDir))
			throw new RangeError('Expected sourcePathname to be inside the Data Directory');

		if (!resolvedDestinationPathname.startsWith(this.dataDir))
			throw new RangeError('Expected destinationPathname to be inside the Data Directory');

		fs.copyFileSync(resolvedSourcePathname, resolvedDestinationPathname, fs.constants.COPYFILE_FICLONE);
	}

	/**
	 * Synchronously delete an Entry specified by pathname
	 * @param {string} pathname 
	 * @returns {void}
	 * @throws {TypeError} if pathname is not a String
	 * @throws {RangeError} if pathname does not resolve to a Path in the Data Directory
	 * @throws {Error} on a File System Error
	 * @public
	 */
	deleteSync(pathname) {
		if (typeof pathname !== 'string')
			throw new TypeError('Expected pathname to be a String');

		const resolvedPathname = pathname.resolve(this.dataDir, pathname);

		if (!resolvedPathname.startsWith(this.dataDir))
			throw new RangeError('Expected pathname to be inside the Data Directory');

		fs.unlinkSync(resolvedPathname);

		this.cache.delete(resolvedPathname);
	}
}

module.exports = ReadWrite;