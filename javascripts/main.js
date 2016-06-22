//globais
var activeCamera = 1;
var clock = new THREE.Clock();
var perspCamera = new THREE.PerspectiveCamera(45, 800 / 600, .1, 500);//(viewangle, aspect, near, far)
var chaseCamera = new THREE.PerspectiveCamera(45, 800 / 600, .1, 500);//(viewangle, aspect, near, far)
var ortoCamera = new THREE.OrthographicCamera(-200, 200, 200, -200, -20, 500);
var keyboard = new THREEx.KeyboardState();
var axis = new THREE.AxisHelper(10);
var scene, renderer;
var player, controls;

var container = $('#scene-container');

function mainLoop() {

    init();
    animate();
}

function init() {
    var windowHalfX = container.width() / 2;
    perspCamera.position.x = 40;
    perspCamera.position.y = 40;
    perspCamera.position.z = 250;
    ortoCamera.position.x = 0;
    ortoCamera.position.y = 40;
    ortoCamera.position.z = 0;
    //TODO: fazer a camera se mexer conforme o boneco mexe
    chaseCamera.position.x = 0;
    chaseCamera.position.y = 0;
    chaseCamera.position.z = 40;
    ortoCamera.lookAt( new THREE.Vector3(0,-1,0) );
    //STATS
    stats = new Stats();
    container.append(stats.dom);


    // scene
    scene = new THREE.Scene();

    scene.add(axis);
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    this.player = new Player();
    player.init();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setSize(800, 600);
    renderer.setPixelRatio(window.devicePixelRatio);
    controls = new THREE.OrbitControls(perspCamera, renderer.domElement);
    container.append(renderer.domElement);

}


//

function animate() {

    requestAnimationFrame(animate);
    render();
    update();


}

function update()
{
    var delta = clock.getDelta(); // seconds.
    var moveDistance = 200 * delta; // 200 pixels per second
    var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

    // local coordinates

    // local transformations

    // move forwards/backwards/left/right
    if (keyboard.pressed("W")) {
        player.player_object.translateZ(-moveDistance);
    }
    if (keyboard.pressed("S")) {
        player.player_object.translateZ(moveDistance);
    }
    if (keyboard.pressed("A")) {
        player.player_object.translateX(-moveDistance);
    }
    if (keyboard.pressed("D")) {
        player.player_object.translateX(moveDistance);
    }
    if (keyboard.pressed("1")) {
        activeCamera = 1;
    }
    if (keyboard.pressed("2")) {
        activeCamera = 2;
    }
    if (keyboard.pressed("3")) {
        activeCamera = 3;
    }
    var relativeCameraOffset = new THREE.Vector3(0, 100, -100);

//    var cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld);
    var cameraOffset = relativeCameraOffset.add(player.player_object.position);

    chaseCamera.position.x = cameraOffset.x;
    chaseCamera.position.y = cameraOffset.y;
    chaseCamera.position.z = cameraOffset.z;
    chaseCamera.lookAt(player.player_object.position);



    controls.update();
    stats.update();
}

function render() {
    switch (activeCamera) {
        case 1:
            renderer.render(scene, perspCamera);
            break;
        case 2:
            renderer.render(scene, ortoCamera);
            break;
        case 3:
            renderer.render(scene, chaseCamera);
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

$('#document').ready(mainLoop);