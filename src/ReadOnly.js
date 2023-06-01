const Cache = require('@serum-enterprises/cache');
const Result = require('../lib/Result.class');

const IO = require('./IO');

const path = require('path');
const fs = require('fs');

class ReadOnly extends IO {
	/**
	 * Create a new ReadOnlyIO Instance
	 * @param {string} dataDir 
	 * @param {Cache | number | null} cache 
	 */
	constructor(dataDir, cache = null) {
		super(dataDir, cache);
	}

	/**
	 * Read the File specified by filename
	 * @param {string} filename 
	 * @returns {Promise<Result<Buffer, Error>>}
	 * @throws {TypeError} - If filename is not a String
	 * @public
	 * @async
	 */
	async readFile(filename) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		if (this.cache.has(resolvedFilename))
			return Result.OK(this.cache.get(resolvedFilename));

		return fs.promises.readFile(resolvedFilename)
			.then(data => {
				this.cache.set(resolvedFilename, data);
				return Result.OK(data);
			})
			.catch(Result.E);
	}

	/**
	 * Check if the Entry specified by filename is a File
	 * @param {string} filename 
	 * @returns {Promise<Result<boolean, Error>>}
	 * @throws {TypeError} - If filename is not a String
	 * @public
	 * @async
	 */
	async isFile(filename) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		if (this.cache.has(resolvedFilename))
			return Result.OK(true);

		return fs.promises.lstat(resolvedFilename)
			.then(stat => Result.OK(stat.isFile()))
			.catch(Result.E);
	}

	/**
	 * Read the Directory specified by dirname
	 * @param {string} dirname 
	 * @returns {Promise<Result<fs.Dirent[], Error>>}
	 * @throws {TypeError} - If dirname is not a String
	 * @public
	 * @async
	 */
	async readDir(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirname = path.resolve(this.dataDir, dirname);

		if (!resolvedDirname.startsWith(this.dataDir))
			return Result.E(new Error('Expected dirname to be inside the Data Directory'));

		return fs.promises.readdir(resolvedDirname, { withFileTypes: true })
			.then(Result.OK)
			.catch(Result.E);
	}

	/**
	 * Check if the Entry specified by dirname is a Directory
	 * @param {string} dirname 
	 * @returns {Promise<Result<boolean, Error>>}
	 * @throws {TypeError} - If dirname is not a String
	 * @public
	 * @async
	 */
	async isDir(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirname = path.resolve(this.dataDir, dirname);

		if (!resolvedDirname.startsWith(this.dataDir))
			return Result.E(new Error('Expected dirname to be inside the Data Directory'));

		return fs.promises.lstat(resolvedDirname)
			.then(stat => Result.OK(stat.isDirectory()))
			.catch(Result.E);
	}

	/**
	 * Check if the Entry specified by linkname is a Symbolic Link
	 * @param {string} linkname 
	 * @returns {Promise<Result<boolean, Error>>}
	 * @throws {TypeError} - If linkname is not a String
	 * @public
	 * @async
	 */
	async isSymLink(linkname) {
		if (typeof linkname !== 'string')
			throw new TypeError('Expected linkname to be a String');

		const resolvedLinkname = path.resolve(this.dataDir, linkname);

		if (!resolvedLinkname.startsWith(this.dataDir))
			return Result.E(new Error('Expected linkname to be inside the Data Directory'));

		return fs.promises.lstat(resolvedLinkname)
			.then(stat => Result.OK(stat.isSymbolicLink()))
			.catch(Result.E);
	}

	/**
	 * Read the File specified by filename synchronously
	 * @param {string} filename 
	 * @returns {Result<Buffer, Error>}
	 * @throws {TypeError} - If filename is not a String
	 * @public
	 */
	readFileSync(filename) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		if (this.cache.has(resolvedFilename))
			return Result.OK(this.cache.get(resolvedFilename));

		try {
			const data = fs.readFileSync(resolvedFilename);
			this.cache.set(resolvedFilename, data);
			return Result.OK(data);
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Check if the Entry specified by filename is a File synchronously
	 * @param {string} filename 
	 * @returns {Result<boolean, Error>}
	 * @throws {TypeError} - If filename is not a String
	 * @public
	 */
	isFileSync(filename) {
		if (typeof filename !== 'string')
			throw new TypeError('Expected filename to be a String');

		const resolvedFilename = path.resolve(this.dataDir, filename);

		if (!resolvedFilename.startsWith(this.dataDir))
			return Result.E(new Error('Expected filename to be inside the Data Directory'));

		if (this.cache.has(resolvedFilename))
			return Result.OK(true);

		try {
			return Result.OK(!!fs.lstatSync(resolvedFilename, { throwIfNoEntry: false })?.isFile());
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Read the Directory specified by dirname synchronously
	 * @param {string} dirname 
	 * @returns {Result<fs.Dirent[], Error>}
	 * @throws {TypeError} - If dirname is not a String
	 * @public
	 */
	readDirSync(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirname = path.resolve(this.dataDir, dirname);

		if (!resolvedDirname.startsWith(this.dataDir))
			return Result.E(new Error('Expected dirname to be inside the Data Directory'));

		try {
			return Result.OK(fs.readdirSync(resolvedDirname, { withFileTypes: true }));
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Check if the Entry specified by dirname is a Directory synchronously
	 * @param {string} dirname 
	 * @returns {Result<boolean, Error>}
	 * @throws {TypeError} - If dirname is not a String
	 * @public
	 */
	isDirSync(dirname) {
		if (typeof dirname !== 'string')
			throw new TypeError('Expected dirname to be a String');

		const resolvedDirname = path.resolve(this.dataDir, dirname);

		if (!resolvedDirname.startsWith(this.dataDir))
			return Result.E(new Error('Expected dirname to be inside the Data Directory'));

		try {
			return Result.OK(!!fs.lstatSync(resolvedDirname, { throwIfNoEntry: false })?.isDirectory());
		}
		catch (err) {
			return Result.E(err);
		}
	}

	/**
	 * Check if the Entry specified by linkname is a Symbolic Link synchronously
	 * @param {string} linkname 
	 * @returns {Result<boolean, Error>}
	 * @throws {TypeError} - If linkname is not a String
	 * @public
	 */
	isSymLinkSync(linkname) {
		if (typeof linkname !== 'string')
			throw new TypeError('Expected linkname to be a String');

		const resolvedLinkname = path.resolve(this.dataDir, linkname);

		if (!resolvedLinkname.startsWith(this.dataDir))
			return Result.E(new Error('Expected linkname to be inside the Data Directory'));

		try {
			return Result.OK(!!fs.lstatSync(resolvedLinkname, { throwIfNoEntry: false })?.isSymbolicLink());
		}
		catch (err) {
			return Result.E(err);
		}
	}
}

module.exports = ReadOnly;