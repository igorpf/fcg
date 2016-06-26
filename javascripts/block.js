var Block = function() {
	var that = this;
	var player_loader;
	var block_object;
	var texture = new THREE.Texture();
	var posx = 0;
	var posy = 0;
	var posz = 0;
	that.init = function(x,y,z) {
            that.posx=x;
            that.posy=y;
            that.posz=z;
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
		texture_loader.load('obj/floor/crate.png', function(image) {
			texture.image = image;
			texture.needsUpdate = true;
		});
		// model
		var loader = new THREE.OBJLoader(manager);
		loader.load('obj/block/Wooden Box.obj', addObjtoScene);
	};
	function addObjtoScene(object) {
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.material.map = texture;
			}
		});

		object.position.x = that.posx;
		object.position.y = that.posy;
		object.position.z = that.posz;
                var scale=5;
		object.scale.x = scale;
		object.scale.y = scale;
		object.scale.z = scale*1.75;
		object.rotation.y = Math.PI;
		object.rotation.x = 0;
		that.block_object = object;
		scene.add(that.block_object);
	};
	//Setters
	that.setPosx = function(new_posx) {
		that.posx = new_posx;
	};
	that.setPosy = function(new_posy) {
		that.posy = new_posy;
	};
	that.setPosz = function(new_posz) {
		that.posz = new_posz;
	};
	//getters
	that.getPosx = function() {
		return that.posx;
	};
	that.getPosy = function() {
		return that.posy;
	};
	that.getPosz = function() {
		return that.posz;
	};

	that.getPlayerLoader = function() {
		return that.player_loader;
	};
};

