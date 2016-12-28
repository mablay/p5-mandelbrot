console.log('Hello World!');

let scene = new Scene(200*200);
let mandelbrot = new Mandelbrot();

function createFullscreenCanvas(width, height) {
    createCanvas(width, height);
    strechCanvas(scene.screen);
}

function strechCanvas(size) {
    var canvas = document.getElementsByTagName('canvas').item(0);
    canvas.style.width = size.width;
    canvas.style.height = size.height;
}

function setup() {
    createFullscreenCanvas(scene.viewport.width, scene.viewport.height);
    noLoop();
}

function draw() {
    //console.log('[Draw] ');
    scene.render(mandelbrot.iterate);
}

/**
 * Update view
 * Update viewport
 */
function windowResized() {
    resizeCanvas(scene.viewport.width, scene.viewport.height);
    strechCanvas(scene.screen);
    redraw();
}

function mouseClicked() {
    let z = scene.viewport.projectFromScreen(mouseX, mouseY);
    let mx = map(mouseX, 0, scene.screen.width, scene.view.left, scene.view.right);
    let my = map(mouseY, 0, scene.screen.height, scene.view.top, scene.view.bottom);
    console.log('[MouseClicked] x %f, y %f', z.a, z.b);
    scene.view.x = z.a;
    scene.view.y = z.b;
    scene.view.r = scene.view.r / 2;
    redraw();
    /*
    var range = (view.right - view.left) / 4;
    view = {
        left: mx - range,
        top: my - range,
        right: mx + range,
        bottom: my + range
    };
    redraw();
    */
}