//globais
var activeCamera = 1;
var clock = new THREE.Clock();
var perspCamera = new THREE.PerspectiveCamera(45, 800 / 600, .1, 500);//(viewangle, aspect, near, far)
var chaseCamera = new THREE.PerspectiveCamera(45, 800 / 600, .1, 500);//(viewangle, aspect, near, far)
var ortoCamera = new THREE.OrthographicCamera(0, 400, 400, 0, -20, 500);
var keyboard = new THREEx.KeyboardState();
var axis = new THREE.AxisHelper(10);
var scene, renderer;
var player, controls;
var floor; //guarda a geometria/textura do chão
var floorGeometry;
var grassMaterial, grassTexture, waterMaterial, waterTexture;
var numberToColorDict = {};
var numberToType = {};
var mapInferior;// guardam só os números
var mapSuperior;// que representam os objetos
var mapObjects;
var mapScale = 20;
var inputElement = document.getElementById("input1");
var inputElement2 = document.getElementById("input2");
var size = 20;
/*initalization (THIS MUST BE MADE GLOBALLY)*/
mapInferior = new Array(size);
mapSuperior = new Array(size);
floor = new Array(size);
mapObjects = new Array(size);
for (var i = 0; i < size; ++i) {
    mapInferior[i] = new Array(size);
    mapSuperior[i] = new Array(size);
    floor[i] = new Array(size);
    mapObjects[i] = new Array(size);
}
//quando escolher o arquivo, já carrega o mapa do jogo

var src;

var container = $('#scene-container');


function mainLoop() {

    init();
    animate();
}

function init() {
    var windowHalfX = container.width() / 2;
    perspCamera.position.x = 40;
    perspCamera.position.y = 40;
    perspCamera.position.z = 150;
    ortoCamera.position.x = 0;
    ortoCamera.position.y = 400;
    ortoCamera.position.z = 0;
    //TODO: fazer a camera se mexer conforme o boneco mexe
    chaseCamera.position.x = 0;
    chaseCamera.position.y = 0;
    chaseCamera.position.z = 40;
    ortoCamera.up = new THREE.Vector3(0, 0, -1);
    ortoCamera.lookAt(new THREE.Vector3(0, -1, 0));
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
    player.init(0, 5, 0);

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
    var moveDistance = 50 * delta; // 50 pixels per second
    var rotateAngle = Math.PI / 0.7 * delta;   // pi/2 radians (90 degrees) per second

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
        player.player_object.rotateY(rotateAngle);
    }
    if (keyboard.pressed("D")) {
        player.player_object.rotateY(-rotateAngle);
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
    var relativeCameraOffset = new THREE.Vector3(0, 300, 600);

    var cameraOffset = relativeCameraOffset.applyMatrix4(player.player_object.matrixWorld);
//    var cameraOffset = relativeCameraOffset.add(player.player_object.position);

    chaseCamera.position.x = cameraOffset.x;
    chaseCamera.position.y = cameraOffset.y;
    chaseCamera.position.z = cameraOffset.z;
    chaseCamera.lookAt(player.player_object.position);


//console.log(mapObjects[5][17].block_object );
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
/*----------------------MAP LOADING BEGIN-------------------------------------*/
inputElement.addEventListener("change", handleFiles, false);
inputElement2.addEventListener("change", handleFiles, false);
inputElement2.disabled = true;
function handleFiles(e) {
    inputElement2.disabled = false;
    inputElement.disabled = true;
    src = e.srcElement.id;
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.addEventListener("load",
            processimage, false);
    reader.readAsArrayBuffer(file);
}
function processimage(e) {
    var buffer = e.target.result;
    var bitmap = getBMP(buffer);
    var size = 20;
    initializeDictionaries();
    loadFloor();
    for (var i = 0; i < size; ++i)
        for (var j = 0; j < size; ++j) {
            var index = 3 * (i * size + j);
            var color = new Color(bitmap.pixels[index + 2],
                    bitmap.pixels[index + 1],
                    bitmap.pixels[index]);

            for (var k in numberToColorDict)
                if (numberToColorDict[k].equals(color))
                    if (src === "input1") {
                        mapInferior[i][j] = k;
                        setFloorTexture(i, j, k);
                    } else {
                        mapSuperior[i][j] = k;
                        setMapObject(i, j, k);
                    }
        }

}

function initializeDictionaries() {
    var c = new Color(0, 0, 0);
    var index = 0;
    for (var i in c.colors()) {
        numberToColorDict[index] = c.colors()[i];
        numberToType[index++] = i;
    }
}
function loadFloor() {
    grassTexture = new THREE.ImageUtils.loadTexture('obj/floor/grass.jpg');
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10);
    grassMaterial = new THREE.MeshBasicMaterial({map: grassTexture, side: THREE.DoubleSide});

    waterTexture = new THREE.ImageUtils.loadTexture('obj/floor/water.jpg');
    waterTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    waterTexture.repeat.set(10, 10);
    waterMaterial = new THREE.MeshBasicMaterial({map: waterTexture, side: THREE.DoubleSide});
    floorGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
}
/**
 * 
 * @param {int} i linha
 * @param {int} j coluna
 * @param {string} k tipo do objeto lido no bitmap
 * @returns {undefined}
 */
function setFloorTexture(i, j, k) {
    //FLOOR
    floor[i][j] = new THREE.Mesh(floorGeometry, (numberToType[k] === 'empty') ? waterMaterial : grassMaterial);
    floor[i][j].position.x = i * mapScale;
    floor[i][j].position.z = j * mapScale;
    floor[i][j].position.y = -0.5;
    floor[i][j].rotation.x = Math.PI / 2;
    scene.add(floor[i][j]);
    //
}
function setMapObject(i, j, k) {
    console.log(mapInferior);
    switch (numberToType[k]) {
        case 'block':
//            cannot be instanciated if water is below
            if (numberToType[mapInferior[i][j]] === 'block') {
                var b = new Block();
                b.init(i * mapScale, 0, j * mapScale);
                mapObjects[i][j] = b;
            }
            break;
        default:
            break;
    }
}
/*----------------------MAP LOADING END-------------------------------------*/



$('#document').ready(mainLoop);