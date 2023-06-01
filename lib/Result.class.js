class Result {
	#value;
	#error;

	static OK(value) {
		return new Result(value);
	}

	static E(error) {
		return new Result(undefined, error);
	}

	constructor(value, error = undefined) {
		this.#value = value;
		this.#error = error;
	}

	get OK() {
		return this.#value;
	}

	get E() {
		return this.#error;
	}

	isOK() {
		return this.#error === undefined;
	}

	isE() {
		return this.#error !== undefined;
	}

	expectOK(error) {
		if (this.isOK())
			return this.#value;

		if (typeof error === 'string')
			throw new Error(error);
		else if (error instanceof Error)
			throw error;
		else
			throw new TypeError('Expected error to be a String or an instance of Error');
	}
}

module.exports = Result;