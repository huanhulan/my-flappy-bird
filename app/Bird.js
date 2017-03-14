class Bird {
    constructor(opts) {
        this.ctx = opts.ctx;
        this.img = opts.img;

        this.imgW = this.img.width / 3;
        this.imgH = this.img.height;

        // index for current frame
        this.frameIndex = 0;
        this.speed = 0;
        this.gravity = 0.0005;
        // initial position
        this.x = opts.x || 100;
        this.y = opts.y || 100;

        this.maxSpeed = 0.5;
        // max rotation angle
        this.maxAngle = 45;
    }

    draw(delta) {
        this.speed += this.gravity * delta;
        this.y += this.speed * delta + 0.5 * this.gravity * delta * delta;
        var curAngle = this.speed / this.maxSpeed * this.maxAngle;

        // change rotation angle
        if (curAngle > this.maxAngle) curAngle = this.maxAngle;
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(curAngle / 180 * Math.PI);
        this.ctx.drawImage(this.img, this.imgW * this.frameIndex, 0, this.imgW, this.imgH, -1 / 2 * this.imgW, -1 / 2 * this.imgH, this.imgW, this.imgH);
        this.ctx.restore();
        // get next index
        this.frameIndex++;
        this.frameIndex %= 3;
    }
}

export default Bird