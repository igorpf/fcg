$(function(){
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, 800/600, .1, 500);//(viewangle, aspect, near, far)
	var renderer= new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000);
	renderer.setSize(800, 600);

	var axis = new THREE.AxisHelper(10);
	scene.add(axis);
        
	var cubeGeometry = new THREE.BoxGeometry(5,5,5);
	var cubeMaterials = new THREE.MeshBasicMaterial({color:0xdddddd, wireframe: true});
	var cube = new THREE.Mesh( cubeGeometry, cubeMaterials);
	cube.position.x = 0;
	cube.position.y = 0;
	cube.position.z = 0;

	scene.add(cube);
	camera.position.x = 40;
	camera.position.y = 40;
	camera.position.z = 40;
        
	camera.lookAt(scene.position);
	$('#scene-container').append(renderer.domElement);
	renderer.render(scene, camera);
});

