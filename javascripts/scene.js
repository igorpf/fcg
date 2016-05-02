 var gl;
    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl") || canvas.getContext("webgl") || canvas.getContext("moz-webgl") || canvas.getContext("webkit-3d")  ;
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
        else{
        	var extensions = gl.getSupportedExtensions();
        	console.log(extensions);
        }
    }

    function drawScene() {
        
    }

    function webGLStart() {
        var canvas = document.getElementById("gl");
        initGL(canvas);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        drawScene();
    }

