const fs = require("fs");
const os = require("os");

/**
 * Information about a File System Entry
 */
class Info {
	/**
	 * @type {fs.Stats}
	 */
	#stats;

	/**
	 * Create a new Info Instance
	 * @param {fs.Stats} stats
	 */
	constructor(stats) {
		if (!(stats instanceof fs.Stats))
			throw new TypeError("Expected stats to be an instance of fs.Stats");

		this.#stats = stats;
	}

	/**
	 * Get Permissions (e.g. 0o777) as a decimal Number
	 * @returns {number}
	 * @public
	 */
	get permissions() {
		return this.#stats.mode & 0o777;
	}
	
	/**
	 * Get the Hardlink Count of this Entry
	 * @returns {number}
	 * @public
	 */
	get linkCount() {
		return this.#stats.nlink;
	}
	
	/**
	 * Get the UID (User ID) of this Entry
	 * @returns {number}
	 * @public
	 */
	get uid() {
		return this.#stats.uid;
	}
	
	/**
	 * Get the GID (Group ID) of this Entry
	 * @returns {number}
	 * @public
	 */
	get gid() {
		return this.#stats.gid;
	}
	
	/**
	 * Get the OS Block Size for File System Operations
	 * @returns {number}
	 * @public
	 */
	get osBlockSize() {
		return this.#stats.blksize;
	}
	
	/**
	 * Get the Number of Blocks allocated to this Entry
	 * @returns {number}
	 * @public
	 */
	get blocks() {
		return this.#stats.blocks;
	}
	
	/**
	 * Get the INode Number of this Entry
	 * @returns {number}
	 * @public
	 */
	get inode() {
		return this.#stats.ino;
	}
	
	/**
	 * Get the Size of this Entry in Bytes
	 * @returns {number}
	 * @public
	 */
	get size() {
		return this.#stats.size;
	}
	
	/**
	 * Get the last Access Time of this Entry as a Unix Timestamp
	 * @returns {number}
	 * @public
	 */
	get lastAccessed() {
		return this.#stats.atimeMs;
	}
	
	/**
	 * Get the last Modification Time of this Entry as a Unix Timestamp
	 * @returns {number}
	 * @public
	 */
	get lastModified() {
		return this.#stats.mtimeMs;
	}
	
	/**
	 * Get the last Change Time of this Entry as a Unix Timestamp
	 * @returns {number}
	 * @public
	 */
	get lastChanged() {
		return this.#stats.ctimeMs;
	}

	/**
	 * Get the Creation Time of this Entry as a Unix Timestamp
	 * @returns {number}
	 * @public
	 */
	get createdAt() {
		return this.#stats.birthtimeMs;
	}

	/**
	 * Get the Device ID of this Entry
	 * @returns {number}
	 * @public
	 */
	get dev() {
		return this.#stats.dev;
	}
	
	/**
	 * Get the Device ID of this Entry
	 * @returns {number}
	 * @public
	 */
	get rdev() {
		return this.#stats.rdev;
	}

	/**
	 * Check if this Entry is a File
	 * @returns {boolean}
	 * @public
	 */
	isFile() {
		return this.#stats.isFile();
	}

	/**
	 * Check if this Entry is a Directory
	 * @returns {boolean}
	 * @public
	 */
	isDirectory() {
		return this.#stats.isDirectory();
	}

	/**
	 * Check if this Entry is a Block Device
	 * @returns {boolean}
	 * @public
	 */
	isBlockDevice() {
		return this.#stats.isBlockDevice();
	}

	/**
	 * Check if this Entry is a Character Device
	 * @returns {boolean}
	 * @public
	 */
	isCharacterDevice() {
		return this.#stats.isCharacterDevice();
	}

	/**
	 * Check if this Entry is a Symbolic Link
	 * @returns {boolean}
	 * @public
	 */
	isSymbolicLink() {
		return this.#stats.isSymbolicLink();
	}

	/**
	 * Check if this Entry is a FIFO Pipe
	 * @returns {boolean}
	 * @public
	 */
	isFIFO() {
		return this.#stats.isFIFO();
	}

	/**
	 * Check if this Entry is a Socket
	 * @returns {boolean}
	 * @public
	 */
	isSocket() {
		return this.#stats.isSocket();
	}

	/**
	 * Check if the current User can Read this Entry
	 * @returns {boolean}
	 * @public
	 */
	canRead() {
		return !!(((os.userInfo().uid === this.uid) && (this.permissions & 0o400)) ||
			((os.userInfo().gid === this.gid) && (this.permissions & 0o040)) ||
			(this.permissions & 0o004))
	}

	/**
	 * Check if the current User can Write to this Entry
	 * @returns {boolean}
	 * @public
	 */
	canWrite() {
		return !!(((os.userInfo().uid === this.uid) && (this.permissions & 0o200)) ||
			((os.userInfo().gid === this.gid) && (this.permissions & 0o020)) ||
			(this.permissions & 0o002));
	}

	/**
	 * Check if the current User can Execute this Entry
	 * @returns {boolean}
	 * @public
	 */
	canExecute() {
		return !!(((os.userInfo().uid === this.uid) && (this.permissions & 0o100)) ||
			((os.userInfo().gid === this.gid) && (this.permissions & 0o010)) ||
			(this.permissions & 0o001));
	}
}

module.exports = Info;