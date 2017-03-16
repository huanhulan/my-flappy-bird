onmessage = function(e) {
    var d = e.data;
    var pipes = d.pipes;
    var x = d.x;
    var y = d.y;
    var score = d.score;
    var lastId = d.lastId;
    var res = {};
    for (var i = 0; i <= pipes.length - 1; i++) {
        var pipe = pipes[i];

        if (x >= pipe.x && x <= (pipe.x + pipe.imgW) && lastId !== pipe.id) {
            if ((y >= pipe.upY) && (y <= pipe.upY + pipe.imgH) || (y >= pipe.downY) && (y <= pipe.downY + pipe.imgH)) {
                res.gameOver = true;
                return postMessage(res);
            } else {
                res.score = score + 1;
                res.lastId = pipe.id;
                return postMessage(res);
            }
        }
    }
};