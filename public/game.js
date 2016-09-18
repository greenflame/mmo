function loadTexture(loader, resource) {
  return new Promise(function(resolve, reject) {
    loader.load(
      resource,
      function(texture) {
        resolve(texture);
      },
      function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function(err) {
        reject(err);
      }
    );
  });
}

function run() {

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight , 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();

  var images = [
    'textures/grass.png',
    'textures/water.png',
    'textures/sand.png',
  ];

  Promise
    .resolve()
    .then(function() { // Loading textures
      var loader = new THREE.TextureLoader();

      var loaders = images.map(function(textureName) {
        return loadTexture(loader, textureName);
      });

      console.log(loaders);

      return Promise.all(loaders);
    }).then(function(textures) {  // Configuring scene
      // Renderer
      renderer.setClearColor('white');
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Scene
      var axes = new THREE.AxisHelper(20);
      scene.add(axes);

      // Objects
      var materials = textures.map(function(texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        return new THREE.MeshBasicMaterial({
          map: texture
        });
      });

      var geometry = new THREE.PlaneGeometry(10, 10);
      var object = new THREE.Mesh(geometry, materials[1]);
      object.position.x = 0;
      object.position.y = 0;
      object.position.z = 0;
      scene.add(object);

      // Camera
      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 30;
      camera.lookAt(scene.position);

      // Render
      $("#gl-out").append(renderer.domElement);
      renderer.render(scene, camera);

    });
}

$(run());