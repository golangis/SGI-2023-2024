class MyCountdownTimer {
	constructor(duration, callback) {
		this.duration = duration;
		this.totalTime = duration;
		this.callback = callback;
		this.running = false;
		this.intervalId = null;
	}

	start() {
		if (!this.running) {
			this.running = true;
			this.duration = this.totalTime;
			this.wasStarted = true;
			this.intervalId = setInterval(() => {
				this.duration--;

				if (this.duration <= 0) {
					this.pause();
					this.wasStarted = false;
					if (this.callback) {
						this.callback();
					}
				}
			}, 1000);

			return true;
		}
		return false;
	}

	pause() {
		clearInterval(this.intervalId);
		this.running = false;
	}

	resume() {
		if (!this.running && this.duration > 0 && this.wasStarted) {
			this.running = true;
			this.intervalId = setInterval(() => {
				1000;
				this.duration--;

				if (this.duration <= 0) {
					this.pause();
					if (this.callback) {
						this.callback();
					}
				}
			}, 1000);
		}
	}

	isRunning() {
		return this.running;
	}

	getTimeLeft() {
		return this.duration;
	}
}

export { MyCountdownTimer };
