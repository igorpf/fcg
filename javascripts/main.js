var stats;
var camera, scene, renderer;
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();
var player, controls;
function mainLoop() {
	var container = $('#scene-container');


	var windowHalfX = container.width() / 2;
	var windowHalfY = container.height() / 2;

	init();
	animate();

}

function init() {


	var container = $('#scene-container');

	windowWidth = container.width();
	windowHeight = container.height();

	camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 2000);
	camera.position.z = 250;

	//STATS
	stats = new Stats();
	container.append(stats.dom);


	// scene
	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight(0x444444);
	scene.add(ambient);

	var directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(0, 0, 1).normalize();
	scene.add(directionalLight);

	this.player = new Player();
	player.init();


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(windowWidth, windowHeight);
	controls = new THREE.OrbitControls( camera, renderer.domElement );
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
	if ( keyboard.pressed("W") )
		player.player_object.translateZ( -moveDistance );
	if ( keyboard.pressed("S") )
		player.player_object.translateZ(  moveDistance );
	if ( keyboard.pressed("A") )
		player.player_object.translateX( -moveDistance );
	if ( keyboard.pressed("D") )
		player.player_object.translateX(  moveDistance );	

	
		
	controls.update();
	stats.update();
}

function render() {
	camera.lookAt(scene.position);

	renderer.render(scene, camera);

}









$('#document').ready(mainLoop);