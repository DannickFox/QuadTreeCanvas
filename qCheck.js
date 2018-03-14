// qCheck.js
// Recursively divides canvas into quadrants.
// Experiment for collisions.

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight - (window.outerHeight - window.innerHeight);
canvas.width = window.innerWidth - (window.outerWidth - window.innerWidth);
ctx.strokeStyle = 'black';
ctx.lineWidth = 1;

let points = [];

// Constants.
const N_points = 100;
const max_rad = 10;
const max_vel = 50;
const qLimit = 3;
const delta = 1 / 50;

for (let i = 0; i < N_points; i++) {
    points.push(
        {
            radius: Math.random() * max_rad + 2,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 2 * (Math.random() - 0.5) * max_vel,
            vy: 2 * (Math.random() - 0.5) * max_vel,
            reflection: 1
        }
    );
}

const drawDivider = (bounds) => {
    ctx.strokeStyle = 'grey';
    ctx.beginPath();
    ctx.moveTo((bounds.x + bounds.w) / 2, bounds.y);
    ctx.lineTo((bounds.x + bounds.w) / 2, bounds.h);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bounds.x, (bounds.y + bounds.h) / 2);
    ctx.lineTo(bounds.w, (bounds.y + bounds.h) / 2);
    ctx.closePath();
    ctx.stroke();
}

const newBounds = bb => {
    middle_x = (bb.x + bb.w) / 2;
    middle_y = (bb.y + bb.h) / 2;

    return [
        {x: bb.x, y: bb.y, w: middle_x, h: middle_y}, // top_left
        {x: middle_x, y: bb.y, w: bb.w, h: middle_y}, // top_right
        {x: bb.x, y: middle_y, w: middle_x, h: bb.h}, // bottom_left
        {x: middle_x, y: middle_y, w: bb.w, h: bb.h} // bottom_right
    ];
}

const qCheck = (point_ar, bounds) => {
    if (point_ar.length > qLimit) {
        drawDivider(bounds);
        let b = newBounds(bounds);
        let rPoints = [[], [], [], []];
        for (let i = 0; i < 4; i++) {
            for (p of point_ar) {
                if (p.x > b[i].x && p.x < b[i].w && p.y < b[i].h && p.y > b[i].y) {
                    rPoints[i].push(p);
                }
            }
            qCheck(rPoints[i], b[i]);
        }
    }
}

const frame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

        qCheck(points, {x: 0, y: 0, w: canvas.width, h: canvas.height});

    points.forEach(point => {
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.stroke();

        if (point.x - point.radius < 0) {
            point.x = point.radius;
            point.vx *= -point.reflection;
        } else if (point.x + point.radius > canvas.width) {
            point.x = canvas.width - point.radius;
            point.vx *= -point.reflection;
        }
        if (point.y - point.radius < 0) {
            point.y = point.radius;
            point.vy *= -point.reflection;
        } else if (point.y + point.radius > canvas.height) {
            point.y = canvas.height - point.radius;
            point.vy *= -point.reflection;
        }

        point.x += point.vx * delta;
        point.y += point.vy * delta;
    });
    

    requestAnimationFrame(frame);
}

frame();