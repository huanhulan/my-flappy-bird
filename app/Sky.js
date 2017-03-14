class Sky {
    constructor(opts) {
        this.ctx = opts.ctx;
        this.img = opts.img;
        this.imgW = this.img.width;
        this.imgH = this.img.height;
        this.x = opts.x;
        this.y = 0;
        this.speed = 0.15;
    }

    draw(delta) {
        var ctx = this.ctx;

        this.x = this.x - this.speed * delta;

        if (this.x <= -this.imgW) {
            this.x += this.imgW * 2;
        }
        ctx.save();
        ctx.drawImage(this.img, 0, 0, this.imgW, this.imgH, this.x, this.y, this.imgW, this.imgH);
        ctx.restore();
    }
}

export default Sky