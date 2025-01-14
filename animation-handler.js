

class TextAnim {
  constructor(
    message,
    name,
    duration,
    loop = false,
    frame_time = 100,
    callbacks = {}
  ) {
    this.message = message;
    this.name = name;
    this.frame_time = frame_time;
    this.total_time = this.parseDuration(duration); // Total TextAnim duration
    this.frames = [];

    this.isPlaying = false;
    this.isPaused = false;
    this.currentFrameIndex = 0;
    this.elapsedTime = 0;

    this.loop = loop; // true for infinite, number for limited repeats
    this.callbacks = callbacks; // Lifecycle hooks
  }

  parseDuration(duration) {
    if (typeof duration === "number") return duration;
    if (duration.endsWith("ms")) return parseInt(duration);
    if (duration.endsWith("s")) return parseInt(duration) * 1000;
    if (duration.endsWith("m")) return parseInt(duration) * 60 * 1000;
    if (duration.endsWith("h")) return parseInt(duration) * 60 * 60 * 1000;
    if (duration.endsWith("f")) return parseInt(duration) * this.frame_time;
    return 0;
  }

  build(frames) {
    const keys = Object.keys(frames).sort(
      (a, b) => this.parseDuration(a) - this.parseDuration(b)
    );

    // Calculate total frame time based on the percentage
    let totalPercentage = 0;
    this.frames = keys.map((key, index) => {
      const frame = frames[key];
      const percentage = parseFloat(key);

      // Calculate frame duration based on the percentage of the total time
      const duration = this.total_time * (percentage / 100);
      totalPercentage += percentage;

      return new Frame(frame.ascii, duration, this.parseDuration(key));
    });

    // If the total percentage is less than 100%, we can evenly distribute the missing time
    const remainingTime = this.total_time - totalPercentage;
    if (remainingTime > 0) {
      const additionalDuration = remainingTime / this.frames.length;
      this.frames.forEach((frame) => {
        frame.duration += additionalDuration;
      });
    }
  }

  async play() {
    if (this.isPlaying) return; // Prevent multiple play calls
    this.isPlaying = true;
    this.isPaused = false;

    let repeatCount = this.loop === true ? Infinity : this.loop || 1;
    for (let i = 0; i < repeatCount; i++) {
      this.reset();
      if (this.callbacks.onStart) this.callbacks.onStart();
      await this.runTextAnimLoop();
      if (this.callbacks.onEnd) this.callbacks.onEnd();
    }
  }

  async runTextAnimLoop() {
    while (this.isPlaying && this.currentFrameIndex < this.frames.length) {
      const currentFrame = this.frames[this.currentFrameIndex];
  
      // Adjust duration accounting for any elapsed time
      let frameDuration = this.isPaused
        ? currentFrame.duration - this.elapsedTime
        : currentFrame.duration;
  
      const frameContent = currentFrame.getContent(
        Date.now(),
        this.getFrameContext()
      );
  
      try {
        await this.message.edit(frameContent); // Await the async edit
      } catch (error) {
        console.error("Error updating message:", error);
      }
  
      this.elapsedTime = 0; // Reset elapsed time for the current frame
  
      if (this.callbacks.onFrameChange)
        this.callbacks.onFrameChange(currentFrame);
  
      const startTime = Date.now();
      while (Date.now() - startTime < frameDuration) {
        if (!this.isPlaying) return; // Stop if stop() is called
        if (this.isPaused) {
          this.elapsedTime = Date.now() - startTime;
          return;
        }
        await this.sleep(10); // Small delay to reduce CPU load
      }
  
      this.currentFrameIndex++;
      if (this.currentFrameIndex >= this.frames.length) {
        break; // End of frames, check for loop in play()
      }
    }
  }
  

  pause() {
    if (this.isPlaying) {
      this.isPaused = true;
      if (this.callbacks.onPause) this.callbacks.onPause();
    }
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.reset();
    if (this.callbacks.onStop) this.callbacks.onStop();
  }

  reset() {
    this.currentFrameIndex = 0;
    this.elapsedTime = 0;
  }

  setSpeed(multiplier) {
    this.frames.forEach((frame) => (frame.duration /= multiplier));
  }

  skipToFrame(index) {
    if (index >= 0 && index < this.frames.length) {
      this.currentFrameIndex = index;
    }
  }

  addFrame(timeKey, frame) {
    this.frames.push(
      new Frame(frame.ascii, frame.duration, this.parseDuration(timeKey))
    );
    this.frames.sort((a, b) => a.startTime - b.startTime);
  }

  removeFrame(index) {
    this.frames.splice(index, 1);
  }

  getFrameContext() {
    return {
      current: this.frames[this.currentFrameIndex]?.ascii,
      last: this.frames[this.currentFrameIndex - 1]?.ascii || null,
      next: this.frames[this.currentFrameIndex + 1]?.ascii || null,
    };
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

class Frame {
  constructor(ascii, duration, startTime) {
    this.ascii = ascii;
    this.duration = duration;
    this.startTime = startTime;
  }

  getContent(currentTime, frameContext) {
    if (typeof this.ascii === "function") {
      return this.ascii(currentTime, frameContext);
    }
    return this.ascii;
  }
}

function f(ascii, duration = null) {
  return { ascii, duration };
}


module.exports = {TextAnim,Frame,f};
