class MyTimer {
	constructor() {
		this.startTime = null;
		this.pauseTime = null;
		this.isRunning = false;
	}

	start() {
		if (!this.isRunning) {
			this.startTime = Date.now();
			this.isRunning = true;
		}
	}

	pause() {
		if (this.isRunning) {
			this.pauseTime = Date.now();
			this.isRunning = false;
		}
	}

	resume() {
		if (!this.isRunning && this.startTime !== null) {
			const elapsedPausedTime = this.pauseTime
				? Date.now() - this.pauseTime
				: 0;
			this.startTime += elapsedPausedTime;
			this.isRunning = true;
			this.pauseTime = null;
		}
	}

	reset() {
		this.startTime = null;
		this.pauseTime = null;
		this.isRunning = false;
	}

	checkTheTime() {
		if (this.isRunning) {
			return Date.now() - this.startTime;
		} else if (this.startTime !== null && this.pauseTime !== null) {
			return this.pauseTime - this.startTime;
		} else {
			return 0;
		}
	}
}

export { MyTimer };
