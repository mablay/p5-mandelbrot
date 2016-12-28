class View {
    constructor(x, y, r, viewport) {
        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 1;
    }


    get aspect() { return viewport.aspect(); }
    get left()   { return this.x - this.r; }
    get right()  { return this.x + this.r; }
    get top()    { return this.y - this.r; }
    get bottom() { return this.y + this.r; }

    project(viewport) {
        var width = viewport.width;
        var height = viewport.height;
        var vpRadius = Math.sqrt(width*width + height*height) / 2;
        var scale = this.r / vpRadius;
        var vw = width * scale;
        var vh = height * scale;
        return {
            left: this.x - vw,
            top: this.y - vh,
            right: this.x + vw,
            bottom: this.y + vh
        };
    }

}

class Viewport {
    constructor(scene) {
        this.scene = scene;

        // Not every resolution goes with any aspect ratio. Find the smallest resolution >= 'resolution'
        // that satisfies the aspect ratio.
        // 1) width * height = resolution
        // 2) height / width = aspect
        // => width * width * aspect = resolution
        // => width = sqrt(resolution / aspect)
        // this.width = Math.ceil(Math.sqrt(resolution / aspect));
        // => height = resolution / sqrt(resolution / aspect)
        // => height = sqrt(resolution * aspect)
        // this.height = Math.ceil(Math.sqrt(resolution * aspect));
    }

    get width() {
        return Math.ceil(Math.sqrt(this.scene.resolution / this.scene.screen.aspect));
    }
    get height() {
        return Math.ceil(Math.sqrt(this.scene.resolution * this.scene.screen.aspect));
    }
    get area() {
        return this.width * this.height;
    }

    /** projects from viewport coordinates (x, y) to view coordinates (a, b) **/
    project(x, y) {
        var width = this.width;
        var height = this.height;
        var vpRadius = Math.sqrt(width*width + height*height) / 2;
        var scale = this.scene.view.r / vpRadius;
        var vLeft = this.scene.view.x - width * scale / 2;
        var vTop = this.scene.view.y + height * scale / 2;
        return {
            a: vLeft + x * scale,
            b: vTop - y * scale
        };
    }

    projectFromScreen(X, Y) {
        var x = X / this.scene.screen.width * this.width;
        var y = Y / this.scene.screen.height * this.height;
        return this.project(x, y)
    }

    toString() {
        return 'viewport ('+this.width+', '+this.height+')';
    }
}

class Screen {
    get width() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
    get height() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
    get aspect() {
        return this.height / this.width;
    }
    get area() {
        return this.width * this.height;
    }

    toString() {
        return 'screen ('+this.width+', '+this.height+')';
    }
}

/**
 * The scene manages the relation between screen (bowser window) and view (rendered area)
 */
class Scene {
    /**
     * @param resolution Represents the approximate number of pixels that are to be rendered.
     * Depending on system performance and scene complexity this parameter should be adjusted.
     * Default value: 10000 (= 100 * 100)
     */
    constructor(resolution, maxIteration) {
        this.resolution = resolution || 10000;
        this.maxIteration = maxIteration || 100;
        this.view = new View(-0.6, 0, 1.5);
        this.screen = new Screen();
        this.viewport = new Viewport(this);
    }

    /**
     * Determines the viewport according to view position, radius, screen aspect ratio and scene resolution.
     * @param algorithm function that performs the rendering algorithm for a certain pixel.
     */
    render(algorithm) {
        loadPixels();
        var width = this.viewport.width;
        var height = this.viewport.height;
        //console.log('[Render] [%d, %d] (%d, %d) => (%f, %f) x (%f, %f)',this.screen.width, this.screen.height,width, height,this.view.left, this.view.top,this.view.right, this.view.bottom);

        var viewp = this.view.project(this.viewport);

        for (var x=0; x<width; x++) {
            for (var y=0; y<height; y++) {
                var a = map(x, 0, width, viewp.left, viewp.right);
                var b = map(y, 0, height, viewp.bottom, viewp.top);
                var n = algorithm(a,b,this.maxIteration);
                n = (n === this.maxIteration) ? 0 : map(n, 0, this.maxIteration, 0, 255);
                var col = color(n, n, n);
                set(x, y, col);
            }
        }
        updatePixels();
    }
}

