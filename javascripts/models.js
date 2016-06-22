	//Arquivo responsável por carregar os modelos.

	 // texture

	var manager = new THREE.LoadingManager();
	manager.onProgress = function(item, loaded, total) {

	    console.log(item, loaded, total);

	};

	var texture = new THREE.Texture();


	var onProgress = function(xhr) {
	    if (xhr.lengthComputable) {
	        var percentComplete = xhr.loaded / xhr.total * 100;
	        console.log(Math.round(percentComplete, 2) + '% downloaded');
	    }
	};

	var onError = function(xhr) {};

	var loader = new THREE.ImageLoader(manager);
	loader.load('obj/lego/face_Nikita.jpg', function(image) {

	    texture.image = image;
	    texture.needsUpdate = true;

	});

	 // model
	var loader = new THREE.OBJLoader(manager);
	loader.load('obj/lego/be.obj', function(object) {

	    object.traverse(function(child) {

	        if (child instanceof THREE.Mesh) {

	            child.material.map = texture;

	        }

	    });

	    object.position.x = 0;
	    object.position.y = 0;
	    object.scale.x = 0.2;
	    object.scale.y = 0.2;
	    object.scale.z = 0.2;
	    object.rotation.y = -15;
	    object.rotation.x = 0;
	    scene.add(object);

	}, onProgress, onError);

	