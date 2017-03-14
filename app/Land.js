class Land {
    constructor(opts) {
        this.ctx = opts.ctx;
        this.img = opts.img;
        this.imgW = this.img.width;
        this.imgH = this.img.height;
        this.x = opts.x;
        this.y = opts.y;
        this.speed = 0.15;
    };

    draw(delta) {
        ctx = this.ctx;
        this.x = this.x - this.speed * delta;
        if (this.x <= -this.imgW) {
            this.x += this.imgW * 4;
        }

        ctx.drawImage(this.img, 0, 0, this.imgW, this.imgH, this.x, this.y, this.imgW, this.imgH);
    }
}

export default Land