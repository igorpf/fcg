//Arquivo responsável por carregar os modelos.
var Monster = function() {
	var that = this;
	var monster_loader;
	var monster_object;
	var texture = new THREE.Texture();
	var posx = 0;
	var posy = 0;
	var posz = 0;
	var rotation;

	var looking = {
		'left': false,
		'right': false,
		'up': true,
		'down': false
	};


	that.init = function(x, y, z) {
		that.setPosx(x);
		that.setPosy(y);
		that.setPosz(z);

		var manager = new THREE.LoadingManager();
		manager.onProgress = function(item, loaded, total) {

			console.log(item, loaded, total);

		};

		var onProgress = function(xhr) {
			if (xhr.lengthComputable) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log(Math.round(percentComplete, 2) + '% downloaded');
			}
		};

		var onError = function(xhr) {};

		var texture_loader = new THREE.ImageLoader(manager);
		texture_loader.load('obj/lego/face_haryach.jpg', function(image) {

			texture.image = image;
			texture.needsUpdate = true;

		});

		// model

		var loader = new THREE.OBJLoader(manager);

		loader.load('obj/WoodenLarry.obj', addObjtoScene);


	};

	function addObjtoScene(object) {

		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {

				child.material.map = texture;

			}
		});

                var scale=5;
		object.position.x = that.getPosx();
		object.position.y = that.getPosy();
		object.position.z = that.getPosz();
		object.scale.x = scale;
		object.scale.y = scale;
		object.scale.z = scale;
		object.rotation.x = 0;

		that.monster_object = object;

		scene.add(that.monster_object);
	};


	that.checkRotation = function(new_direction) {
		switch (new_direction) {
			case 'up':
				if (looking['up'] == true)
					break;
				else {
					if (looking['left'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y - (Math.PI / 2);
						that.setLooking(new_direction, true);
					}
					if (looking['right'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y + (Math.PI / 2);
						that.setLooking(new_direction, true);
					}
					if (looking['down'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y + Math.PI;
						that.setLooking(new_direction, true);
					}

				}

				break;
			case 'left':
				if (looking['left'] == true)
					break;
				else {
					if (looking['up'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y + (Math.PI / 2);
						that.setLooking(new_direction, true);
					}
					if (looking['down'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y - (Math.PI / 2);
						that.setLooking(new_direction, true);
					}
					if (looking['right'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y + Math.PI;
						that.setLooking(new_direction, true);
					}

				}

				break;
			case 'right':
				if (looking['right'] == true)
					break;
				else {
					if (looking['up'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y - (Math.PI / 2);
						that.setLooking(new_direction, true);
					}
					if (looking['down'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y + (Math.PI / 2);
						that.setLooking(new_direction, true);
					}
					if (looking['left'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y + Math.PI;
						that.setLooking(new_direction, true);
					}

				}

				break;
			case 'down':
				if (looking['down'] == true)
					break;
				else {
					if (looking['left'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y + (Math.PI / 2);
						that.setLooking(new_direction, true);
					}
					if (looking['right'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y - (Math.PI / 2);
						that.setLooking(new_direction, true);
					}
					if (looking['up'] == true) {
						that.monster_object.rotation.y = that.monster_object.rotation.y + Math.PI;
						that.setLooking(new_direction, true);
					}

				}

				break;



		}


	};

	//Seters
	that.setPosx = function(new_posx) {
		posx = new_posx;
	};
	that.setPosy = function(new_posy) {
		posy = new_posy;
	};
	that.setPosz = function(new_posz) {
		posz = new_posz;
	};

	that.setRotate = function(rotate) {
		rotation = rotate;
	};

	that.setLooking = function(new_direction, boolean) {
		Object.keys(looking).forEach(function(direction) {
			if (direction == new_direction) {
				looking[direction] = boolean;
			} else {
				looking[direction] = false;
			}
		});

	};

	//getters
	that.getRotate = function() {
		return rotation;
	};

	that.getPosx = function() {
		return posx;
	};
	that.getPosy = function() {
		return posy;
	};
	that.getPosz = function() {
		return posz;
	};

	that.getMonsterLoader = function() {
		return monster_loader;
	};

	that.getLooking = function() {
		return looking;
	};

	that.getLookingAt = function(direction) {
		return looking[direction];
	};


}