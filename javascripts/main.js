function mainLoop() {
	var container = $('#scene-container');
	var stats;
	var camera, scene, renderer;

	var mouseX = 0, mouseY = 0;
	var windowHalfX = container.width() / 2;
	var windowHalfY = container.height() / 2;

	init();
	animate();

}

function init() {


	var container = $('#scene-container');

	windowWidth = container.width();
	windowHeight = container.height();

	camera = new THREE.PerspectiveCamera( 45, windowWidth / windowHeight, 1, 2000 );
	camera.position.z = 250;

	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( windowWidth, windowHeight );
	container.append( renderer.domElement );

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {
	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}




$('#document').ready(mainLoop);