class Animation {
    constructor(message,name,duration,frame_time = 100) {
        this.message = message;
        this.name = name;
        this.duration = duration;
        this.frame_time = frame_time;
        this.current_frame = 0;
        this.frames = this.load_frames();
        this.frames = [];
        this._init();
    }

    _init() {}

    build(frames) {
        
    }
}

class Frame {
    constructor(ascii,duration) {
        this.ascii = ascii;
        this.duration = duration;
    }
}

function f(ascii,duration) {
    return new Frame(ascii, duration);
}