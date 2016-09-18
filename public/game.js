var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight , 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

var materials = {
  'grass': null,
  'water': null,
  'sand': null
};

function loadTexture(loader, resource) {
  return new Promise(function(resolve, reject) {
    loader.load(
      resource,
      function(texture) {
        resolve(texture);
      },
      function(xhr) {
        console.log(resource + ': ' +(xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function(err) {
        reject(err);
      }
    );
  });
}

function loadTextures() {
  var keys = [];
  for (var key in materials) {
    if (materials.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  return Promise.resolve().then(function() {
    var loader = new THREE.TextureLoader();

    var loaders = keys.map(function(key) {
      return loadTexture(loader, 'textures/' + key + '.png');
    });

    return Promise.all(loaders);

  }).then(function(textures) {

    for (var i = 0; i < keys.length; i++) {
      textures[i].magFilter = THREE.NearestFilter;
      textures[i].minFilter = THREE.NearestFilter;

      materials[keys[i]] = new THREE.MeshBasicMaterial({
        map: textures[i]
      });
    }

  });
}

function initScene() {
  return Promise
    .resolve()
    .then(function() { // Loading textures
      return loadTextures();
    }).then(function() {  // Configuring scene
      console.log(materials);

      // Renderer
      renderer.setClearColor('white');
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Scene
      var axes = new THREE.AxisHelper(20);
      scene.add(axes);

      // Objects
      var geometry = new THREE.PlaneGeometry(10, 10);
      var object = new THREE.Mesh(geometry, materials.grass);
      object.position.x = 0;
      object.position.y = 0;
      object.position.z = 0;
      scene.add(object);

      // Camera
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 30;
      camera.lookAt(scene.position);

      // Render
      $("#gl-out").append(renderer.domElement);
      renderer.render(scene, camera);

    });
}

function run() {
  initScene();


}

$(run());