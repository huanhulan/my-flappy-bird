class Pipe {
    constructor(opt) {
        this.ctx = opt.ctx;

        this.imgUp = opt.imgUp;
        this.imgDown = opt.imgDown;
        this.id = opt.id;
        this.imgW = this.imgUp.width;
        this.imgH = this.imgUp.height;
        this.x = opt.x;
        // generate random height;
        this.upY = 0;
        this.downY = 0;
        this.speed = 0.15;
        this.pipeSpace = 150;
        // generate the first pipe group
        this.initPipeY();
    }

    draw(delta) {
        var ctx = this.ctx;
        this.x = this.x - this.speed * delta;

        if (this.x <= -this.imgW) {
            // *3 because the margin between two pipes is the 3 times width of a single width of a pipe;
            // we need 6 pipe
            this.x += this.imgW * 3 * 6;
            // generate new pipe
            this.initPipeY();
        }
        ctx.save();
        ctx.drawImage(this.imgUp, 0, 0, this.imgW, this.imgH, this.x, this.upY, this.imgW, this.imgH);
        ctx.drawImage(this.imgDown, 0, 0, this.imgW, this.imgH, this.x, this.downY, this.imgW, this.imgH);
        ctx.restore();

        // draw the path of pipes
        this.initPath();
    }

    initPipeY() {
        var pipeTopHeight = Math.floor(Math.random() * 200) + 50;
        // the y coordiation for the upside pipe
        this.upY = pipeTopHeight - this.imgH;
        // the y coordiation for the downside pipe
        this.downY = pipeTopHeight + this.pipeSpace;
    }

    // for collision detection
    initPath() {
        var ctx = this.ctx;
        ctx.rect(this.x, this.upY, this.imgW, this.imgH);
        ctx.rect(this.x, this.downY, this.imgW, this.imgH);
    }
}

export default Pipe