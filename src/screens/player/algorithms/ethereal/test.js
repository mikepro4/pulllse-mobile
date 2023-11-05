function Target(_rad) {
    var incr = 0.9;
    this.x = 0;
    this.y = 0;
    this.rotate = 0;
    this.radius = _rad;
    this.rotate_speed = 0.001 * 0.1 + 0.001;
    this.friction = 0.01 * 0.8 + 0.1;
    this.speed = 0.01 * 0.2 + 0.03;
    this.step = 5 * 0.5 + 0.0001;
    this.freq = 0.0001 * 0.09 + 0.01;
    this.bold_rate = 1 * 0.3 + 0.1;
}


function VPoint(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.target = null;
}

var w = 100;
var h = 100;

var _targets;
var _pts = [];

var _pre_sec = 0;

for (var i = 0; i < 5000; i++) {
    var pt = new VPoint(
        Math.random(1) * window.innerWidth,
        Math.random(1) * window.innerHeight
    );
    _pts.push(pt);
}


function update() {
    var i = 0;
    var l = _targets.length;
    var t;
    var pt;

    for (i = 0; i < l; i++) {
        t = _targets[i];
        t.rotate += t.rotate_speed;
    }

    l = _pts.length;

    ctx.fillStyle = "rgba(0,0, 0, 255)";
    ctx.fillRect(0, 0, w * 2, h * 2);

    for (i = 0; i < l; i++) {
        pt = _pts[i];
        t = pt.target;
        var t_radius =
            Math.cos(t.rotate * 2.321 + t.freq * i) * t.radius * t.bold_rate +
            t.radius;
        var tx = t.x + Math.cos(t.rotate + t.step * i) * t_radius;
        var ty = t.y + Math.sin(t.rotate + t.step * i) * t_radius;

        pt.vx += (tx - pt.x) * t.speed;
        pt.vy += (ty - pt.y) * t.speed;

        pt.x += pt.vx;
        pt.y += pt.vy;

        pt.vx *= t.friction;
        pt.vy *= t.friction;

        if (pt.x >= 0 && pt.x <= w && pt.y >= 0 && pt.y <= h) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillRect(pt.x, pt.y, 2, 2);
        }
    }
    requestAnimFrame(update);
}

update();