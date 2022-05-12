var pBs = 0;
var pRs = 0;
var mainhtml = document.getElementById('header');

//oyunu başlatan ana fonksiyon
function gameMain() {
    mainhtml.remove();
    gameArea.start();
    pB = new playerB();
    pR = new playerR();
    ball = new gameBall();
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1440;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 5);
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })

    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//oyun masasını çizen fonksiyon
drawTable = function () {
    ctx = gameArea.context;
    ctx.moveTo(720, 0);
    ctx.lineTo(720, 720);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(720, 360, 150, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 360, 150, 180, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1440, 360, 150, -90, Math.PI);
    ctx.stroke();
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 10, 720);
    ctx.fillRect(0, 0, 720, 10);
    ctx.fillRect(0, 710, 720, 10);
    ctx.fillStyle = 'red';
    ctx.fillRect(1430, 0, 10, 720);
    ctx.fillRect(720, 0, 720, 10);
    ctx.fillRect(720, 710, 720, 10);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 210, 15, 300);
    ctx.fillRect(1425, 210, 15, 300);
    ctx.fillRect(719, 10, 4, 700);
    ctx.font = "40px Arial";
    ctx.fillText(pBs, 25, 60);
    ctx.fillText(pRs, 1390, 60);

}

//mavi oyuncu için ana iskelet
function playerB() {
    this.speedX = 0;
    this.speedY = 0;
    this.x = 356;
    this.y = 360;
    this.update = function () {
        ctx = gameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 50, 0, 2 * Math.PI);
        ctx.fillStyle = '#202080';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 33, 0, 2 * Math.PI);
        ctx.fillStyle = '#000020';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#0000FF';
        ctx.fill();
    }
    this.newPos = function () {
        if (this.x > 669) {
            this.x -= 1;
        } else if (this.y > 659) {
            this.y -= 1;
        } else if (this.x < 61) {
            this.x += 1;
        } else if (this.y < 61) {
            this.y += 1;
        }
        this.x += this.speedX;
        this.y += this.speedY;

    }

}

//kırmızı oyuncu için ana iskelet
function playerR() {
    this.speedX = 0;
    this.speedY = 0;
    this.x = 1156;
    this.y = 360;
    this.update = function () {
        ctx = gameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 50, 0, 2 * Math.PI);
        ctx.fillStyle = '#802020';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 33, 0, 2 * Math.PI);
        ctx.fillStyle = '#200000';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > 1379) {
            this.x -= 1;
        } else if (this.y > 659) {
            this.y -= 1;
        } else if (this.x < 771) {
            this.x += 1;
        } else if (this.y < 61) {
            this.y += 1;
        }
    }

}

// top için ana iskelet
function gameBall() {
    this.speedX = 0;
    this.speedY = 0;
    this.x = 720;
    this.y = 360;
    this.update = function () {
        ctx = gameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 33, 0, 2 * Math.PI);
        ctx.fillStyle = '#A3A3A3';
        ctx.fill();
        ctx.closePath();
    }

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.touch = function (otherobj) {
        var distX = this.x - otherobj.x;
        var distY = this.y - otherobj.y;
        var dist = Math.sqrt(distX * distX + distY * distY);
        adRad = 33 + 50;
        if (dist < adRad) {
            var angle = Math.atan2(distY, distX);
            var sin = Math.sin(ang);
            var cos = Math.cos(ang);
            var pos0 = {
                x: 0,
                y: 0
            };
            var pos1 = rotate(distX, distY, sin, cos, true);
            var spd0 = rotate(otherobj.speedX, otherobj.speedY, sin, cos, true);
            var spd1 = rotate(this.speedX, this.speedY, sin, cos, true);
            speedXTotal = spd0.x - spd1.x;
            spd0.x = ((50 - 15) * spd0.x + 2 * 15 * spd1.x) / (50 + 15);
            spd1.x = speedXTotal + spd0.x;
            var absV = Math.abs(spd0.x) + Math.abs(spd1.x);
            var overlap = (50 + 33) - Math.abs(pos0.x - pos1.x);
            pos0.x += spd0.x / absV * overlap;
            pos1.x += spd1.x / absV * overlap;
            var pos0F = rotate(pos0.x, pos0.y, sin, cos, false);
            var pos1F = rotate(pos1.x, pos1.y, sin, cos, false);
            this.x = otherobj.x + pos1F.x;
            this.y = otherobj.y + pos1F.y;
            otherobj.x = otherobj.x + pos0F.x;
            otherobj.y = otherobj.y + pos0F.y;
            var spd0F = rotate(spd0.x, spd0.y, sin, cos, false);
            var spd1F = rotate(spd1.x, spd1.y, sin, cos, false);
            otherobj.speedX = spd0F.x;
            otherobj.speedY = spd0F.y;
            this.speedX = spd1F.x;
            this.speedY = spd1F.y;
        }
    }
}

//Oyunun her frame'ini oluşturan fonksiyon
function updateGameArea() {

    gameArea.clear();
    pB.speedX = 0;
    pB.speedY = 0;
    pR.speedX = 0;
    pR.speedY = 0;
    drawTable();

    //Mavi oyuncu hareket ve ekrana çizimi
    if (gameArea.keys && gameArea.keys[65]) { pB.speedX = -1; }
    if (gameArea.keys && gameArea.keys[68]) { pB.speedX = 1; }
    if (gameArea.keys && gameArea.keys[87]) { pB.speedY = -1; }
    if (gameArea.keys && gameArea.keys[83]) { pB.speedY = 1; }
    pB.newPos();
    pB.update();

    //Kırmızı oyuncu hareket ve ekrana çizimi
    if (gameArea.keys && gameArea.keys[37]) { pR.speedX = -1; }
    if (gameArea.keys && gameArea.keys[39]) { pR.speedX = 1; }
    if (gameArea.keys && gameArea.keys[38]) { pR.speedY = -1; }
    if (gameArea.keys && gameArea.keys[40]) { pR.speedY = 1; }
    pR.newPos();
    pR.update();

    //Duvarlar ve kazanma durumları
    if ((ball.y - 33) < (10)) {
        ball.speedY = (-ball.speedY);
    } else if (ball.x - 33 < 10) {
        ball.speedX = (-ball.speedX);
        if (ball.y > 210 && ball.y < 510) {
            pRs++;
            if (pRs >= 1) {
                gameArea.canvas.remove();
                mainhtml = document.createElement('header');
                mainhtml.className = 'header d-flex align-items-center';
                mainhtml.innerHTML = '<div class="container px-4 px-lg-5 text-center"><h1 class="mb-2">DenyHockey</h1><h3 class="mb-5" id="dic"><em>Kırmızı Oyuncu Kazandı !<br>' + pBs + ' - ' + pRs + '</em></h3><a class="btn btn-danger btn-xl" id="button" onclick="gameMain()">Tekrar Oyna</a></div>';
                document.body.insertBefore(mainhtml, document.body.childNodes[0]);
            }
            pB.speedX = 0;
            pB.speedY = 0;
            pR.speedX = 0;
            pR.speedY = 0;
            ball.speedX = 0;
            ball.speedY = 0;
            pB.x = 356
            pB.y = 360;
            pR.x = 1156;
            pR.y = 360;
            ball.x = 720;
            ball.y = 360;
        }
    } else if (ball.x + 33 > 1430) {
        ball.speedX = (-ball.speedX);
        if (ball.y > 210 && ball.y < 510) {
            pBs++;
            if (pBs >= 1) {
                gameArea.canvas.remove();
                mainhtml = document.createElement('header');
                mainhtml.className = 'header d-flex align-items-center';
                mainhtml.innerHTML = '<div class="container px-4 px-lg-5 text-center"><h1 class="mb-2">DenyHockey</h1><h3 class="mb-5" id="dic"><em>Mavi Oyuncu Kazandı !<br>' + pBs + ' - ' + pRs + '</em></h3><a class="btn btn-danger btn-xl" id="button" onclick="gameMain()">Tekrar Oyna</a></div>';
                document.body.insertBefore(mainhtml, document.body.childNodes[0]);
            }
            pB.speedX = 0;
            pB.speedY = 0;
            pR.speedX = 0;
            pR.speedY = 0;
            ball.speedX = 0;
            ball.speedY = 0;
            pB.x = 356
            pB.y = 360;
            pR.x = 1156;
            pR.y = 360;
            ball.x = 720;
            ball.y = 360;
        }
    } else if (ball.y + 33 > 710) {
        ball.speedY = (-ball.speedY);
    }

    //Top'un çarpma durumları ve çizimi
    ball.touch(pB);
    ball.touch(pR);
    ball.newPos();
    ball.update();
}


function rotate(x, y, sin, cos, rev) {
    return {
        x: (rev) ? (x * cos + y * sin) : (x * cos - y * sin),
        y: (rev) ? (y * cos - x * sin) : (y * cos + x * sin)
    };
}