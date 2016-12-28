function Mandelbrot() {
    var defaultMaxIterations = 100;
    var defaultBreakCondition = 16;
    return {
        iterate: function iterate(a, b, maxIterations, breakCondition){
            maxIterations = maxIterations || defaultMaxIterations;
            breakCondition = breakCondition || defaultBreakCondition;
            var aa = a; var bb = b;
            for (var n=0; n<maxIterations; n++) {
                var aNext = aa*aa - bb*bb + a;
                bb = 2 * aa * bb + b;
                aa = aNext;
                if (aa*aa+bb*bb > breakCondition) break;
            }
            return n;
        }
    };
}