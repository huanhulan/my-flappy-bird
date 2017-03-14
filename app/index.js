import Fly from './Fly';
import '../src/style.css'
class Game {
    constructor(opts) {
        this.ctx = opts.ctx;
        this.imgsArr = ["birds", "land", "pipe1", "pipe2", "sky"];
        this.roles = [];
        this.pipes = [];
        this.isStart = false;
        // running or over
        this.isRuing = false;
        this.lastFrameTime = new Date();
        this.curFrameTime = 0;
        this.delta = 0;
        this.hero = null;
        this.score = 0;
        // record last passed pipe
        this.lastId;
    }

    start() {
        var self = this;
        Fly.loadImages(self.imgsArr, function(imgList) {
            self.isRuing = true;

            self.initRoles(imgList);

            self.render(imgList);

            self.bindEvent();
        });
    }

    drawText(txt) {
        this.ctx.save();
        this.ctx.fillStyle = "#fefefe";
        this.ctx.fillText(txt, this.ctx.canvas.width / 2 - 50, this.ctx.canvas.height / 2 - 50);
        this.ctx.textBaseline = 'middle';
        this.ctx.font = "italic 100px sans-serif";
        this.ctx.textAlign = 'center';
        this.ctx.restore();
    }

    gameOver() {
        this.drawText(`your score is ${this.score}`);
        this.isRuing = false;
    }

    initRoles(imgList) {
        var skyImg = imgList["sky"],
            landImg = imgList["land"],
            pipeDownImg = imgList["pipe1"],
            pipeUpImg = imgList["pipe2"],
            self = this;


        // draw sky
        var totalSkyNo = Math.ceil(window.innerWidth / skyImg.width) + 2;
        for (let i = 0; i < totalSkyNo; i++) {
            var sky = new Fly.Sky({
                ctx: ctx,
                img: skyImg,
                x: i * skyImg.width,
                totalSkyNo: totalSkyNo
            });

            self.roles.push(sky);
        }

        // draw pipe
        var totalPipeNo = Math.ceil(window.innerWidth / pipeDownImg.width);
        for (let i = 0; i < totalPipeNo; i++) {
            let pipe = new Fly.Pipe({
                ctx: ctx,
                imgUp: pipeUpImg,
                imgDown: pipeDownImg,
                x: pipeUpImg.width * 3 * i + 300,
                id: i,
                totalPipeNo: totalPipeNo
            });
            self.pipes.push(pipe);
            self.roles.push(pipe);
        }

        // draw bird
        var bird = new Fly.Bird({
            ctx: ctx,
            img: imgList["birds"]
        });

        self.hero = bird;
    }

    render(imgList) {
        var self = this,
            landImg = imgList["land"],
            cv = this.ctx.canvas,
            i = 3,
            id = setInterval(() => {
                if (--i === 0) {
                    this.isStart = true;
                    clearInterval(id);
                }
            }, 1000);

        (function draw() {
            self.ctx.clearRect(0, 0, cv.width, cv.height);
            self.ctx.beginPath();
            self.curFrameTime = new Date();

            if (self.isStart) {
                self.curFrameTime = new Date();
                self.delta = self.curFrameTime - self.lastFrameTime;
            } else {
                self.delta = 0;
            }
            self.lastFrameTime = self.curFrameTime;
            self.roles.forEach(function(role) {
                role.draw(self.delta);
            });
            // draw the bird of this frame
            self.hero.draw(self.delta);
            if (i) {
                self.drawText(`${i} ${'second'+(i>1?'s':'')} to start`);
            }
            // collision detection
            // 1 bird fly beyond sky
            // 2 bird get on the ground
            // 3 bird collide with pipe
            if (self.hero.y <= 0 || self.hero.y >= (cv.height - landImg.height) ||
                self.ctx.isPointInPath(self.hero.x, self.hero.y)) {
                self.gameOver();
            } else {
                self.pipes.forEach(function(pipe) {
                    if (self.hero.x >= pipe.x && self.hero.x <= (pipe.x + pipe.imgW) && self.lastId !== pipe.id) {
                        self.score += 1;
                        self.lastId = pipe.id;
                    }
                })
            }

            if (self.isRuing) {
                window.requestAnimationFrame(draw);
            }
        })();
    }

    bindEvent() {
        document.body.addEventListener("click", () => {
            if (this.isStart) {
                this.hero.speed = -0.3;
            }
        });
    }
}

var cv = document.createElement('canvas');
cv.width = 600 * (window.innerWidth / window.innerHeight);
cv.height = 600;
cv.id = "#cv";
cv.style.border = "1px solid red";
document.body.append(cv);

var ctx = cv.getContext("2d");
var game = new Game({
    ctx: ctx
});
game.start();