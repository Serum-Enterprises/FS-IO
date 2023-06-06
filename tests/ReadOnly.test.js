const Cache = require('@serum-enterprises/cache');
const ReadOnly = require('../src/ReadOnly');

const fs = require('fs');
const path = require('path');

describe('Testing IO.ReadOnly', () => {
	test('readFile', () => {
		const dataDir = './data';
		const data = Buffer.from('Hello World!');
		const cache = new Cache(2048);
		const io = new ReadOnly(dataDir, cache);

		// Check the Type Guards
		expect(io.readFile()).rejects.toThrow(new TypeError('Expected filename to be a String'));
		expect(io.readFile('../')).rejects.toThrow(new RangeError('Expected filename to be inside the Data Directory'));

		// This File will be returned from the Cache
		cache.set(path.resolve(dataDir, 'test.txt'), data);
		expect(io.readFile('./test.txt')).resolves.toBe(data);

		// Mock the fs.promises.readFile function once to load any Data from Disk
		fs.promises.readFile = jest.fn().mockResolvedValueOnce(data);
		expect(io.readFile('./A.txt')).resolves.toBe(data);
		expect(fs.promises.readFile).toHaveBeenCalled();
	});

	test('readDir', () => {
		const dataDir = './data';
		const data = Buffer.from('Hello World!');
		const cache = new Cache(2048);
		const io = new ReadOnly(dataDir, cache);

		// Check the Type Guards
		expect(io.readDir()).rejects.toThrow(new TypeError('Expected dirname to be a String'));
		expect(io.readDir('../')).rejects.toThrow(new RangeError('Expected dirname to be inside the Data Directory'));

		// Mock the fs.promises.readdir function once to load any Data from Disk
		fs.promises.readdir = jest.fn().mockResolvedValueOnce(['A.txt', 'B.txt']);
		expect(io.readDir('./')).resolves.toEqual(['A.txt', 'B.txt']);
		expect(fs.promises.readdir).toHaveBeenCalled();
	});

	test('info', () => {
		const dataDir = './data';
		const data = Buffer.from('Hello World!');
		const cache = new Cache(2048);
		const io = new ReadOnly(dataDir, cache);

		// Check the Type Guards
		expect(io.info()).rejects.toThrow(new TypeError('Expected entry to be a String'));
		expect(io.info('../')).rejects.toThrow(new RangeError('Expected entry to be inside the Data Directory'));

		// Mock the fs.promises.lstat function once to load any Data from Disk
		fs.promises.lstat = jest.fn().mockResolvedValueOnce({
			isFile: true,
			isDirectory: false,
			isSymbolicLink: false,
			size: data.length,
		});
		expect(io.info('./test.txt')).resolves.toEqual({
			isFile: true,
			isDirectory: false,
			isSymbolicLink: false,
			size: data.length,
		});
		expect(fs.promises.lstat).toHaveBeenCalled();
	});

	test('readFileSync', () => {
		const dataDir = './data';
		const data = Buffer.from('Hello World!');
		const cache = new Cache(2048);
		const io = new ReadOnly(dataDir, cache);

		// Check the Type Guards
		expect(() => io.readFileSync()).toThrow(new TypeError('Expected filename to be a String'));
		expect(() => io.readFileSync('../')).toThrow(new RangeError('Expected filename to be inside the Data Directory'));

		// This File will be returned from the Cache
		cache.set(path.resolve(dataDir, 'test.txt'), data);
		expect(io.readFileSync('./test.txt')).toBe(data);

		// Mock the fs.readFileSync function once to load any Data from Disk
		fs.readFileSync = jest.fn().mockReturnValueOnce(data);
		expect(io.readFileSync('./A.txt')).toBe(data);
		expect(fs.readFileSync).toHaveBeenCalled();
	});

	test('readDirSync', () => {
		const dataDir = './data';
		const data = Buffer.from('Hello World!');
		const cache = new Cache(2048);
		const io = new ReadOnly(dataDir, cache);

		// Check the Type Guards
		expect(() => io.readDirSync()).toThrow(new TypeError('Expected dirname to be a String'));
		expect(() => io.readDirSync('../')).toThrow(new RangeError('Expected dirname to be inside the Data Directory'));

		// Mock the fs.readdirSync function once to load any Data from Disk
		fs.readdirSync = jest.fn().mockReturnValueOnce(['A.txt', 'B.txt']);
		expect(io.readDirSync('./')).toEqual(['A.txt', 'B.txt']);
		expect(fs.readdirSync).toHaveBeenCalled();
	});

	test('infoSync', () => {
		const dataDir = './data';
		const data = Buffer.from('Hello World!');
		const cache = new Cache(2048);
		const io = new ReadOnly(dataDir, cache);

		// Check the Type Guards
		expect(() => io.infoSync()).toThrow(new TypeError('Expected entry to be a String'));
		expect(() => io.infoSync('../')).toThrow(new RangeError('Expected entry to be inside the Data Directory'));

		// Mock the fs.lstatSync function once to load any Data from Disk
		fs.lstatSync = jest.fn().mockReturnValueOnce({
			isFile: true,
			isDirectory: false,
			isSymbolicLink: false,
			size: data.length,
		});
		expect(io.infoSync('./test.txt')).toEqual({
			isFile: true,
			isDirectory: false,
			isSymbolicLink: false,
			size: data.length,
		});
		expect(fs.lstatSync).toHaveBeenCalled();
	});
});
