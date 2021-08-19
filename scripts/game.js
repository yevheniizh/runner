const game = new (function () {
  const game = this;

  const MOUSE_BUTTON = ['left', 'middle', 'right'];

  let scene,
    camera,
    config = {
      mouse_lock: false,
    },
    renderer,
    mouse = {
      position: { x: 0, y: 0 },
      speed: { x: 0, y: 0 },
      locked: false,
      keys: {
        left: false,
        right: false,
        middle: false,
        wheel: 0,
      },
    },
    keys = {},
    events = {
      keydown: null,
      keyup: null,
      keypress: null,
      mousedown: null,
      mouseup: null,
    };

  const v = (this.v = (x, y, z) => {
    return new THREE.Vector3(x, y, z);
  });

  game.on = (event_name, processor) => {
    events[event_name] = processor;
  };

  const addCube = (this.addCube = (conf) => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: conf.color });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.copy(conf.position);
    scene.add(cube);
    return cube;
  });

  game.getCamera = () => {
    return camera;
  };

  const call_event = (event, args) => {
    if (events[event]) events[event](args);
  };

  const animate = (this.animate = () => {
    call_event('keydown', keys);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  });

  this.init = (settings) => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (settings.keys_capture) {
      window.addEventListener('keydown', (event) => {
        if (!keys[event.code]) {
          keys[event.code] = true;
          call_event('keypress', keys);
        }
      });
      window.addEventListener('keyup', (event) => {
        keys[event.code] = false;
        call_event('keyup', keys);
      });
    }

    if (settings.mouse_capture) {
      if (settings.mouse_lock) {
        config.mouse_lock = true;
        document.addEventListener('pointerlockchange', (event) => {
          mouse.locked = !!document.pointerLockElement;
        });
      }

      window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });

      window.addEventListener('mousedown', (event) => {
        event.preventDefault();
        mouse.keys[MOUSE_BUTTON[event.button]] = true;
        call_event('mousedown', mouse);

        if (config.mouse_lock && !mouse.locked) {
          console.log('locked');
          document.body.requestPointerLock();
        }
      });

      window.addEventListener('mouseup', (event) => {
        event.preventDefault();
        mouse.keys[MOUSE_BUTTON[event.button]] = false;
        call_event('mouseup', mouse);
      });

      window.addEventListener('mousemove', (event) => {
        event.preventDefault();
        mouse.position.x = event.screenX;
        mouse.position.y = event.screenY;
        mouse.speed.x = event.movementX;
        mouse.speed.y = event.movementY;
        call_event('mousemove', mouse);
      });
    }

    document.body.appendChild(renderer.domElement);
    animate();
  };
})();
