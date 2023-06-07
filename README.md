# FS-IO

This Node.js module, FS-IO, is a Filesystem IO Library with built in LFU Cache written in NodeJS. It provides a Base Class `IO.IO` which is extended by `IO.ReadOnly` and `IO.ReadWrite` Classes. The `IO.ReadOnly` Class provides read-only file and directory operations, while the `IO.ReadWrite` Class extends this with write and delete operations. It has the option to include a preexisting Cache or internally create a new Cache, as well as disabling caching altogether.

## Installation

```bash
npm install @serum-enterprises/fs-io
```

## Usage

This Module features two very important additions to classic Filesystem Operations:

1. A built in LFU Cache, which can be disabled or replaced with a preexisting Cache. This optimized File Access and reduces the amount of Disk I/O. It is limited to an Amount in Bytes, which can be set on initialization.

2. A Data Directory, which is the Base Directory for all Filesystem Operations. This allows for a more secure and controlled Filesystem Access, as well as a more convenient way to access Files and Directories. It is NOT possible to read or write outside of the Data Directory.

### IO.IO

The `IO.IO` class provides a base implementation for file and directory operations. It takes a data directory path and an optional cache as parameters and only features getters for these properties. It is not intended to be used directly, altough can be used for Type-Checking.

It has the following Interface (written in Typescript for your convenience):

```typescript
class IO {
	private readonly _dataDir: string;
	private readonly _cache: Cache;

	public constructor(dataDir: string, cache?: Cache | number | null);

	public get dataDir(): string;
	public get cache(): Cache;
}
```

Note that the `cache` getter will always return a cache, even if it was not provided on initialization. In this case, it will return a cache with a maximum size of 0 bytes.

### IO.ReadOnly

The `IO.ReadOnly` class extends the `IO.IO` class and adds read-only file and directory operations.

```typescript
class ReadOnly extends IO {
	public constructor(dataDir: string, cache?: Cache | number | null);

	public async readFile(filename: string): Promise<Buffer>;
	public async readDir(dirname: string): Promise<fs.Dirent[]>;
	public async info(entry: string): Promise<fs.Stats>;

	public readFileSync(filename: string): Buffer;
	public readDirSync(dirname: string): fs.Dirent[];
	public infoSync(entry: string): fs.Stats;
}
```

### IO.ReadWrite

The `IO.ReadWrite` class extends the `IO.ReadOnly` class and adds write and delete operations.

```typescript
class ReadWrite extends ReadOnly {
	public constructor(dataDir: string, cache?: Cache | number | null);

	public async writeFile(filename: string, data: Buffer): Promise<void>;
	public async createDir(dirname: string): Promise<void>;
	public async createSymLink(target: string, filename: string): Promise<void>;
	public async createHardLink(target: string, filename: string): Promise<void>;
	public async rename(oldPath: string, newPath: string): Promise<void>;
	public async delete(entry: string): Promise<void>;

	public writeFileSync(filename: string, data: Buffer): void;
	public createDirSync(dirname: string): void;
	public createSymLinkSync(target: string, filename: string): void;
	public createHardLinkSync(target: string, filename: string): void;
	public renameSync(oldPath: string, newPath: string): void;
	public deleteSync(entry: string): void;
}
```

## Tests

This Module is currently under development and does not feature any tests yet. Altough all Methods are tested manually and should work as intended.

## License

MIT License

Copyright (c) 2023 Serum Enterprises

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.