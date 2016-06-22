//globais
var activeCamera = 1;
var scene = new THREE.Scene();
var perspCamera = new THREE.PerspectiveCamera(45, 800 / 600, .1, 500);//(viewangle, aspect, near, far)
var chaseCamera = new THREE.PerspectiveCamera(45, 800 / 600, .1, 500);//(viewangle, aspect, near, far)
var ortoCamera = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 500);
var renderer = new THREE.WebGLRenderer();
var axis = new THREE.AxisHelper(10);
var cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
var cubeMaterials = new THREE.MeshBasicMaterial({color: 0xdddddd, wireframe: false});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
var keyboard = new THREEx.KeyboardState();

init();
animate();
function init() {
    scene.add(axis);
    renderer.setClearColor(0x000000);
    renderer.setSize(800, 600);
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;
    scene.add(cube);
    perspCamera.position.x = 40;
    perspCamera.position.y = 40;
    perspCamera.position.z = 40;
    ortoCamera.position.x = 0;
    ortoCamera.position.y = 0;
    ortoCamera.position.z = 40;
    //TODO: fazer a camera se mexer conforme o boneco mexe
    chaseCamera.position.x = 0;
    chaseCamera.position.y = 0;
    chaseCamera.position.z = 40;

    perspCamera.lookAt(scene.position);orto
    $('#scene-container').append(renderer.domElement);
    renderer.render(scene, perspCamera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}
function update() {
    if (keyboard.pressed("1")) {
        activeCamera = 1;
    }
    if (keyboard.pressed("2")) {
        activeCamera = 2;
    }
    if (keyboard.pressed("3")) {
        activeCamera = 3;
    }
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