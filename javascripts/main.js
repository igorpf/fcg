//globais
var activeCamera = 1;
var clock = new THREE.Clock();
var fpCamera = new THREE.PerspectiveCamera(45, 800 / 600, .1, 500); //(viewangle, aspect, near, far)
var chaseCamera = new THREE.PerspectiveCamera(45, 800 / 600, .1, 1200); //(viewangle, aspect, near, far)
var ortoCamera = new THREE.OrthographicCamera(10, 800 / 2, 0, 780 / -2, 1, 300);
var mini_ortoCamera = new THREE.OrthographicCamera(10, 800 / 2, 0, 780 / -2, 1, 300);
var keyboard = new THREEx.KeyboardState();
var axis = new THREE.AxisHelper(10);
var scene, renderer;
var player, controls;
var floor; //geometry/texture 
var floorGeometry;
var grassMaterial, grassTexture, waterMaterial, waterTexture;
var holeMaterial, holeTexture, crackMaterial, crackTexture;
var numberToColorDict = {};
var numberToType = {};
var mapInferior; // keep only the number
var mapSuperior; // that represent the object
var mapObjects;
var mapScale = 20;
var inputElement = document.getElementById("input1");
var inputElement2 = document.getElementById("input2");
var size = 20;
var src;
var enemies = [],
    enemiesCounter = 0;

var id;



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



var container = $('#scene-container');


function mainLoop() {
    $('#status').html("Carregue seus arquivos Bitmap");
    $('#instruction').html("");

    init();
    animate();
}

function init() {
    var windowHalfX = container.width() / 2;
    fpCamera.position.x = 0;
    fpCamera.position.y = 15;
    fpCamera.position.z = -10;
    fpCamera.lookAt(new THREE.Vector3(200, 15, -200));
    ortoCamera.position.x = 0;
    ortoCamera.position.y = 100;
    ortoCamera.position.z = 0;
    //TODO: fazer a camera se mexer conforme o boneco mexe
    chaseCamera.position.x = 0;
    chaseCamera.position.y = 0;
    chaseCamera.position.z = 40;
    ortoCamera.up = new THREE.Vector3(0, 0, -1);
    ortoCamera.lookAt(new THREE.Vector3(0, -1, 0));
    mini_ortoCamera.up = new THREE.Vector3(0, 0, -1);
    mini_ortoCamera.lookAt(new THREE.Vector3(0, -1, 0));
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
    player = new Player();

    var spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(-60, 150, -30);
    spotlight.shadowCameraVisible = true;
    spotlight.shadowDarkness = 0.95;
    spotlight.intensity = 2;
    // must enable shadow casting ability for the light
    spotlight.castShadow = true;
    scene.add(spotlight);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setSize(800, 600);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMapEnabled = true;
    renderer.autoClear = false;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    //    controls = new THREE.OrbitControls(fpCamera, renderer.domElement);
    container.append(renderer.domElement);

}


//

function animate() {

    requestAnimationFrame(animate);
    render();
    update();


}

function update() {
    var delta = clock.getDelta();
    var moveDistance = 50 * delta;
    var enemy_moveDistance = 25 * delta;

    if (player.player_object !== undefined) {
        var currentPos = worldToMapCoordinates(player.player_object.position);
        var v = new THREE.Vector3(0, 0, 0);
        if (keyboard.pressed("W")) {
            player.checkRotation('up');
            v = v.set(0, 0, -moveDistance);
            v = v.add(player.player_object.position);
            fpCamera.rotation.y = -player.player_object.rotation.y;
            fpCamera.position.z = player.player_object.position.z - 10;
            fpCamera.position.x = player.player_object.position.x;
        } else if (keyboard.pressed("S")) {
            player.checkRotation('down');
            v = v.set(0, 0, moveDistance);
            v = v.add(player.player_object.position);
            fpCamera.rotation.y = -player.player_object.rotation.y;
            fpCamera.position.z = player.player_object.position.z + 10;
            fpCamera.position.x = player.player_object.position.x;
        } else if (keyboard.pressed("A")) {
            player.checkRotation('left');
            v = v.set(-moveDistance, 0, 0);
            v = v.add(player.player_object.position);
            fpCamera.rotation.y = player.player_object.rotation.y;
            fpCamera.position.x = player.player_object.position.x - 10;

        } else if (keyboard.pressed("D")) {
            player.checkRotation('right');
            v = v.set(moveDistance, 0, 0);
            v = v.add(player.player_object.position);
            fpCamera.rotation.y = player.player_object.rotation.y;
            fpCamera.position.x = player.player_object.position.x + 10;
        }

        if (keyboard.pressed("V")) {
            if (activeCamera == 1) {
                activeCamera = 2;
            } else if (activeCamera == 2) {
                activeCamera = 3;
            } else if (activeCamera == 3) {
                activeCamera = 1;
            }
        }

        //Avoids the moviment when a keyboard hasn't been pressed
        if ((keyboard.pressed("W") || keyboard.pressed("A") || keyboard.pressed("S") || keyboard.pressed("D"))) {
            var p = worldToMapCoordinates(v);
            if (p.x >= 0 && p.x < mapSuperior.length && p.z >= 0 && p.z < mapSuperior.length) { //move only inside the map bounds
                var tSup = numberToType[mapSuperior[p.x][p.z]];
                var tInf = numberToType[mapInferior[p.x][p.z]];
                if (tSup !== 'block' && !v.equals(player.player_object.position) &&  tInf !== 'empty') {
                    player.player_object.translateZ(-moveDistance);
                    mapSuperior[currentPos.x][currentPos.z] = 0;
                    mapSuperior[p.x][p.z] = 5;
                }                
                else if (tInf === 'empty'){                    
                    player.player_object.translateY(-12);
                    var timer = setInterval(function (){
                        $('#status').html("Tu faleceste!");
                        $('#instruction').html("Atualize a p&aacute;gina para tentar novamente");
                        cancelAnimationFrame(id);
                    },2000);
                    
                }
            }
        }
        var wireMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });
        var collidableMeshList = [];
        for (i = 0; i < enemies.length; i++) {
            var enemy_geo_bbox = new THREE.CubeGeometry(10, 20, 10, 1, 1, 1);
            enemy_bbox = new THREE.Mesh(player_geo_bbox, wireMaterial);
            // enemy_bbox.position = enemies[i].monster_object.position.clone();
            enemy_bbox.position.x = enemies[i].monster_object.position.x;
            enemy_bbox.position.y = 4;
            enemy_bbox.position.z = enemies[i].monster_object.position.z;
            collidableMeshList.push(enemy_bbox);
        };
        var player_geo_bbox = new THREE.CubeGeometry(20, 30, 20, 1, 1, 1);
        player_bbox = new THREE.Mesh(player_geo_bbox, wireMaterial);
        player_bbox.position = player.player_object.position.clone();
        player_bbox.position.x = player.player_object.position.x;
        player_bbox.position.y = 4;
        player_bbox.position.z = player.player_object.position.z;
        var originPoint = player_bbox.position.clone();


        // for (var vertexIndex = 0; vertexIndex < player_bbox.geometry.vertices.length; vertexIndex++) {
        //     var localVertex = player_bbox.geometry.vertices[vertexIndex].clone();
        //     var globalVertex = localVertex.applyMatrix4(player_bbox.matrix);
        //     var directionVector = globalVertex.sub(player_bbox.position);

        //     var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        //     var collisionResults = ray.intersectObjects(collidableMeshList);
        //     if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
        //         cancelAnimationFrame(id);

        //     }
        // }


        if (keyboard.pressed("F")) {
            var direction = player.getLookingAt();
            for (i = 0; i < enemies.length; i++) {
                var moved = false;
                if (player_bbox.position.x >= collidableMeshList[i].position.x) {
                    if (player_bbox.position.x - collidableMeshList[i].position.x > 6 &&
                        player_bbox.position.x - collidableMeshList[i].position.x <= 15) {
                        if (player_bbox.position.z >= collidableMeshList[i].position.z) {
                            if (player_bbox.position.z - collidableMeshList[i].position.z > 6 &&
                                player_bbox.position.z - collidableMeshList[i].position.z <= 20) {

                                if (direction == "up") {
                                    enemies[i].monster_object.translateZ(-20);

                                } else if (direction == "down") {
                                    enemies[i].monster_object.translateZ(20);
                                } else if (direction == "left") {
                                    enemies[i].monster_object.translateX(-20);

                                } else if (direction == "right") {
                                    enemies[i].monster_object.translateX(20);

                                }
                                moved = true;
                            }
                        } else {
                            if (collidableMeshList[i].position.z - player_bbox.position.z > 6 &&
                                collidableMeshList[i].position.z - player_bbox.position.z <= 20) {
                                if (direction == "up") {
                                    enemies[i].monster_object.translateZ(-20);

                                } else if (direction == "down") {
                                    enemies[i].monster_object.translateZ(20);
                                } else if (direction == "left") {
                                    enemies[i].monster_object.translateX(-20);

                                } else if (direction == "right") {
                                    enemies[i].monster_object.translateX(20);

                                }
                                moved = true;
                            }

                        }
                    }
                } else {
                    if (collidableMeshList[i].position.x - player_bbox.position.x > 6 &&
                        collidableMeshList[i].position.x - player_bbox.position.x <= 20) {
                        if (collidableMeshList[i].position.z > player_bbox.position.z) {
                            if (collidableMeshList[i].position.z - player_bbox.position.z > 6&&
                                collidableMeshList[i].position.z - player_bbox.position.z <= 20) {
                                if (direction == "up") {
                                    enemies[i].monster_object.translateZ(-20);

                                } else if (direction == "down") {
                                    enemies[i].monster_object.translateZ(20);
                                } else if (direction == "left") {
                                    enemies[i].monster_object.translateX(-20);

                                } else if (direction == "right") {
                                    enemies[i].monster_object.translateX(20);

                                }
                                moved = true;
                            }
                        } else {
                            if (player_bbox.position.z - collidableMeshList[i].position.z > 6 &&
                                player_bbox.position.z - collidableMeshList[i].position.z <= 20) {
                                if (direction == "up") {
                                    enemies[i].monster_object.translateZ(-20);

                                } else if (direction == "down") {
                                    enemies[i].monster_object.translateZ(20);
                                } else if (direction == "left") {
                                    enemies[i].monster_object.translateX(-20);

                                } else if (direction == "right") {
                                    enemies[i].monster_object.translateX(20);

                                }
                                moved = true;
                            }
                        }

                    }
                }
                
                var mPos = worldToMapCoordinates(enemies[i].monster_object.position);
                if(moved && numberToType[mapInferior[mPos.x][mPos.z]] === 'empty'){
                    enemies[i].monster_object.translateY(-12);                     
                    var m = enemies.splice(i, 1);
                    scene.remove(m[0].monster_object);                                        
                }
            }
        }

        for (i = 0; i < enemies.length; i++) {
            if (player_bbox.position.x >= collidableMeshList[i].position.x) {
                if (player_bbox.position.x - collidableMeshList[i].position.x <= 5) {
                    if (player_bbox.position.z >= collidableMeshList[i].position.z) {
                        if (player_bbox.position.z - collidableMeshList[i].position.z <= 5) {
                            $('#status').html("Tu faleceste!");
                            $('#instruction').html("Atualize a p&aacute;gina para tentar novamente");
                            cancelAnimationFrame(id);
                        }
                    } else {
                        if (collidableMeshList[i].position.z - player_bbox.position.z <= 5) {
                            $('#status').html("Tu faleceste!");
                            $('#instruction').html("Atualize a p&aacute;gina para tentar novamente");
                            cancelAnimationFrame(id);
                        }

                    }
                }
            } else {
                if (collidableMeshList[i].position.x - player_bbox.position.x <= 2) {
                    if (collidableMeshList[i].position.z > player_bbox.position.z) {
                        if (collidableMeshList[i].position.z - player_bbox.position.z <= 5) {
                            $('#status').html("Tu faleceste!");
                            $('#instruction').html("Atualize a p&aacute;gina para tentar novamente");
                            cancelAnimationFrame(id);
                        }
                    } else {
                        if (player_bbox.position.z - collidableMeshList[i].position.z <= 5) {
                            $('#status').html("Tu faleceste!");
                            $('#instruction').html("Atualize a p&aacute;gina para tentar novamente");
                            cancelAnimationFrame(id);
                        }
                    }

                }
            }

        }


        var relativeCameraOffset = new THREE.Vector3(150, 150, 150);
        var cameraOffset = relativeCameraOffset.add(player.player_object.position);
        chaseCamera.position.x = cameraOffset.x;
        chaseCamera.position.y = cameraOffset.y;
        chaseCamera.position.z = cameraOffset.z;
        chaseCamera.lookAt(player.player_object.position);
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



    //    controls.update();
    stats.update();
}

function render() {
    var w = 800,
        h = 600;
    var mapWidth = 180;
    var mapHeight = 100;


    switch (activeCamera) {
        case 1:
            renderer.setViewport(0, 0, w, h);
            renderer.clear();
            renderer.render(scene, fpCamera);
            renderer.setViewport(10, h - mapHeight - 10, mapWidth, mapHeight);
            renderer.render(scene, ortoCamera);
            break;
        case 2:
            renderer.setViewport(0, 0, w, h);
            renderer.clear();
            renderer.render(scene, ortoCamera);
            renderer.setViewport(10, h - mapHeight - 10, mapWidth, mapHeight);
            renderer.render(scene, ortoCamera);

            break;
        case 3:
            renderer.setViewport(0, 0, w, h);
            renderer.clear();
            renderer.render(scene, chaseCamera);
            renderer.setViewport(10, h - mapHeight - 10, mapWidth, mapHeight);
            renderer.render(scene, ortoCamera);

            break;
    }

}

function animate() {
    id = requestAnimationFrame(animate);
    moveMonster();
    render();
    update();
}

/* --------------------- DUMMY MOVE ------------------------------------------*/
// movements for dummy monsters 
function moveMonster() {
    var delta = clock.getDelta();
    var enemy_moveDistance = 1.0;
    var options = ['up', 'down', 'left', 'right', ''];
    var v_enemy = [];
    var monsters_pos = [];
    var timerId = [];
    for (i = 0; i < enemies.length; i++) {
        var currentPos = worldToMapCoordinates(enemies[i].monster_object.position);
        var option = Math.round(Math.random() * 5);
        if (options[option] == 'up') {

            monsters_pos[i] = worldToMapCoordinates(enemies[i].monster_object.position);
            v_enemy[i] = new THREE.Vector3(0, 0, 0);
            v_enemy[i] = v_enemy[i].set(0, 0, -enemy_moveDistance);
            v_enemy[i] = v_enemy[i].add(enemies[i].monster_object.position);


            var p = worldToMapCoordinates(v_enemy[i]);
            if (p.x >= 0 && p.x < mapSuperior.length && p.z >= 0 && p.z < mapSuperior.length) { //move only inside the map bounds
                var t = numberToType[mapSuperior[p.x][p.z]];
                if (t !== 'block' && !v_enemy[i].equals(enemies[i].monster_object.position)) {
                    enemies[i].monster_object.translateZ(-(enemy_moveDistance + 1.25));
                    mapSuperior[currentPos.x][currentPos.z] = 0;
                    mapSuperior[p.x][p.z] = 5;
                }
            }
        } else if (options[option] == 'down') {

            monsters_pos[i] = worldToMapCoordinates(enemies[i].monster_object.position);
            v_enemy[i] = new THREE.Vector3(0, 0, 0);
            v_enemy[i] = v_enemy[i].set(0, 0, -enemy_moveDistance);
            v_enemy[i] = v_enemy[i].add(enemies[i].monster_object.position);

            var p = worldToMapCoordinates(v_enemy[i]);
            if (p.x >= 0 && p.x < mapSuperior.length && p.z >= 0 && p.z < mapSuperior.length) { //move only inside the map bounds
                var t = numberToType[mapSuperior[p.x][p.z]];
                if (t !== 'block' && !v_enemy[i].equals(enemies[i].monster_object.position)) {
                    enemies[i].monster_object.translateZ(enemy_moveDistance);
                    mapSuperior[currentPos.x][currentPos.z] = 0;
                    mapSuperior[p.x][p.z] = 5;
                }
            }
        } else if (options[option] == 'left') {

            monsters_pos[i] = worldToMapCoordinates(enemies[i].monster_object.position);
            v_enemy[i] = new THREE.Vector3(0, 0, 0);
            v_enemy[i] = v_enemy[i].set(0, 0, -enemy_moveDistance);
            v_enemy[i] = v_enemy[i].add(enemies[i].monster_object.position);

            var p = worldToMapCoordinates(v_enemy[i]);
            if (p.x >= 0 && p.x < mapSuperior.length && p.z >= 0 && p.z < mapSuperior.length) { //move only inside the map bounds
                var t = numberToType[mapSuperior[p.x][p.z]];
                if (t !== 'block' && !v_enemy[i].equals(enemies[i].monster_object.position)) {
                    enemies[i].monster_object.translateX(-enemy_moveDistance);
                    mapSuperior[currentPos.x][currentPos.z] = 0;
                    mapSuperior[p.x][p.z] = 5;
                }
            }

        } else if (options[option] == 'right') {

            monsters_pos[i] = worldToMapCoordinates(enemies[i].monster_object.position);
            v_enemy[i] = new THREE.Vector3(0, 0, 0);
            v_enemy[i] = v_enemy[i].set(0, 0, -enemy_moveDistance);
            v_enemy[i] = v_enemy[i].add(enemies[i].monster_object.position);

            var p = worldToMapCoordinates(v_enemy[i]);
            if (p.x >= 0 && p.x < mapSuperior.length && p.z >= 0 && p.z < mapSuperior.length) { //move only inside the map bounds
                var t = numberToType[mapSuperior[p.x][p.z]];
                if (t !== 'block' && !v_enemy[i].equals(enemies[i].monster_object.position)) {
                    enemies[i].monster_object.translateX(enemy_moveDistance);
                    mapSuperior[currentPos.x][currentPos.z] = 0;
                    mapSuperior[p.x][p.z] = 5;
                }
            }
        }

    }
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
    enemiesCounter = 0;
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
    grassMaterial = new THREE.MeshBasicMaterial({
        map: grassTexture,
        side: THREE.DoubleSide
    });

    waterTexture = new THREE.ImageUtils.loadTexture('obj/floor/water.jpg');
    waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
    waterTexture.repeat.set(10, 10);
    waterMaterial = new THREE.MeshBasicMaterial({
        map: waterTexture,
        side: THREE.DoubleSide
    });

    holeTexture = new THREE.ImageUtils.loadTexture('obj/floor/hole.jpg');
    holeTexture.wrapS = holeTexture.wrapT = THREE.RepeatWrapping;
    holeTexture.repeat.set(1, 1);
    holeMaterial = new THREE.MeshBasicMaterial({
        map: holeTexture,
        side: THREE.DoubleSide
    });

    crackTexture = new THREE.ImageUtils.loadTexture('obj/floor/crack.jpg');
    crackTexture.wrapS = crackTexture.wrapT = THREE.RepeatWrapping;
    crackTexture.repeat.set(1, 1);
    crackMaterial = new THREE.MeshBasicMaterial({
        map: crackTexture,
        side: THREE.DoubleSide
    });

    floorGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);
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
    floor[i][j].position.x = i * mapScale + mapScale / 2;
    floor[i][j].position.z = j * mapScale + mapScale / 2;
    floor[i][j].position.y = -0.5;
    floor[i][j].rotation.x = Math.PI / 2;
    scene.add(floor[i][j]);
    //
}

function setMapObject(i, j, k) {
    //            cannot be instantiated if water is below
    var x = i * mapScale + mapScale / 2,
        y, z = j * mapScale + mapScale / 2;
    if (numberToType[mapInferior[i][j]] === 'block') {
        switch (numberToType[k]) {
            case 'block':
                var b = new Block();
                b.init(x, 0, z);
                mapObjects[i][j] = b;
                break;
            case 'player':
                player.init(x, 10, z);
                fpCamera.position.x = x;
                fpCamera.position.z = z;
                break;
            case 'hole':
                floor[i][j] = new THREE.Mesh(floorGeometry, holeMaterial);
                floor[i][j].position.x = x;
                floor[i][j].position.z = z;
                floor[i][j].position.y = -0.5;
                floor[i][j].rotation.x = Math.PI / 2;
                scene.add(floor[i][j]);
                break;
            case 'crack':
                floor[i][j] = new THREE.Mesh(floorGeometry, crackMaterial);
                floor[i][j].position.x = x;
                floor[i][j].position.z = z;
                floor[i][j].position.y = -0.5;
                floor[i][j].rotation.x = Math.PI / 2;
                scene.add(floor[i][j]);
                break;
            case 'enemy':
                if (enemies.length < 5) {
                    enemies[enemiesCounter] = new Monster();
                    enemies[enemiesCounter++].init(x, 4, z);

                }
                break;
            default:
                break;
        }
    } else
        mapSuperior[i][j] = 0;
}
/*----------------------MAP LOADING END-------------------------------------*/



$('#document').ready(mainLoop);