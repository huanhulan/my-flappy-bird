import Fly from './Fly';
import '../src/style.css'
import Worker from 'worker-loader!./scoreWorker';

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
        this.worker = opts.worker;
        var self = this;

        this.getScroe = function() {
            var pipes = self.pipes.map(function(pipe) {
                return {
                    id: pipe.id,
                    imgW: pipe.imgW,
                    imgH: pipe.imgH,
                    x: pipe.x,
                    upY: pipe.upY,
                    downY: pipe.downY
                };
            });
            var msg = {
                pipes: pipes,
                x: self.hero.x,
                y: self.hero.y,
                score: self.score,
                lastId: self.lastId
            };
            self.worker.postMessage(msg);
            self.worker.onmessage = function(e) {
                if (e.data.gameOver === true) {
                    return self.gameOver();
                } else {
                    self.lastId = e.data.lastId;
                    self.score = e.data.score;
                }
            }
        }
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
        var textWidth = this.ctx.measureText(txt).width;
        this.ctx.save();
        this.ctx.fillStyle = "#fefefe";
        this.ctx.fillText(txt, this.ctx.canvas.width / 2 - textWidth / 2, this.ctx.canvas.height / 2);
        this.ctx.textBaseline = 'middle';
        this.ctx.font = "italic 100px sans-serif";
        this.ctx.textAlign = 'center';
        this.ctx.restore();
    }

    gameOver() {
        this.drawText(`your score is ${this.score}, click to restart.`);
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
                ctx: this.ctx,
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
                ctx: this.ctx,
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
            ctx: this.ctx,
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
            self.ctx.closePath();
            // collision detection
            // 1 bird fly beyond sky
            // 2 bird get on the ground
            // 3 bird collide with pipe
            if (self.hero.y <= 0 || self.hero.y >= (cv.height - landImg.height)) {
                self.gameOver();
            } else {
                self.getScroe();
            }

            if (self.isRuing) {
                window.requestAnimationFrame(draw);
            }
        })();
    }

    restart() {
        this.roles = [];
        this.pipes = [];
        this.isStart = false;
        this.isRuing = false;
        this.lastFrameTime = new Date();
        this.curFrameTime = 0;
        this.delta = 0;
        this.hero = null;
        this.score = 0;
        this.lastId;
        return this.start();
    }

    bindEvent() {
        var self = this;

        function handleTap(e) {
            if (self.isStart && self.isRuing) {
                self.hero.speed = -0.3;
            }
            if (!self.isRuing) {
                self.restart()
            }
        }
        document.body.addEventListener("mousedown", handleTap);
        document.body.addEventListener("touchend", handleTap);
    }
}

window.onload = function() {
    var scoreWorker = new Worker;
    var cv = document.createElement('canvas');
    cv.width = 600 * (window.innerWidth / window.innerHeight);
    cv.height = 600;
    cv.id = "#cv";
    cv.style.border = "1px solid red";
    document.body.appendChild(cv);

    var ctx = cv.getContext("2d");
    var game = new Game({
        ctx: ctx,
        worker: scoreWorker
    });
    game.start();
};