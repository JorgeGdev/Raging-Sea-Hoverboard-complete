import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'






/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//AXES HELPER


// const axesHelper = new THREE.AxesHelper()
// axesHelper.position.y = 0.25
// scene.add(axesHelper)




//LOADING MODELS

//const dracoloader = new DRACOLoader()
//dracoloader.setDecoderPath("/draco/")
const gltfloader = new GLTFLoader()
//gltfloader.setDRACOLoader(dracoloader)



//TEDDY BEAR MODEL

let teddyBear = null
//let mixer = null

gltfloader.load(
    "./models/bear/teddy__bear.glb",

    (gltf) =>
    {

        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[0])
        // action.play()




      



        teddyBear = gltf.scene
        scene.add(teddyBear)

        teddyBear.scale.set(0.05, 0.05, 0.05)
        teddyBear.position.y = - 0.15
        teddyBear.rotation.x = - Math.PI /2
        teddyBear.rotation.z = Math.PI /0.5 

    },

    
    


)


//DUCK MODEL




let duck = null
//let mixer = null

gltfloader.load(
    "./models/Duck/Duck.gltf",

    (gltf) =>
    {

        duck = gltf.scene
        scene.add(duck)

        duck.scale.set(0.2, 0.2, 0.2)
        duck.position.y = - 0.15
        duck.position.x = 3
        duck.rotation.x = - Math.PI /2
        duck.rotation.z = Math.PI /0.5 

    },

    
    


)




const teddyBearlight = new THREE.DirectionalLight( 0xFFFFFF, 2 );
teddyBearlight.position.set(-0.62, 0, 1.08)
teddyBearlight.target.position.set(1.84, 2.16, -0.62);
scene.add( teddyBearlight );
scene.add(teddyBearlight.target)

const teddyBearlight2 = new THREE.DirectionalLight( 0xFFFFFF, 2 );
teddyBearlight2.position.set(-0.62, 5, 1.8)
teddyBearlight2.target.position.set(1.84, 2.16, -0.62);
scene.add( teddyBearlight2 );
scene.add(teddyBearlight2.target)

// // Añadir control para la intensidad de la luz
// const lightFolder = gui.addFolder('Directional Light');
// lightFolder.add(teddyBearlight2, 'intensity', 0, 2).name('Intensity').listen();

// // Añadir control para la posición de la luz
// lightFolder.add(teddyBearlight2.position, 'x', -10, 10).name('Position X').listen();
// lightFolder.add(teddyBearlight2.position, 'y', 0, 20).name('Position Y').listen();
// lightFolder.add(teddyBearlight2.position, 'z', -10, 10).name('Position Z').listen();

// // Añadir control para la posición del target
// lightFolder.add(teddyBearlight.target.position, 'x', -10, 10).name('Target X').listen();
// lightFolder.add(teddyBearlight.target.position, 'y', -10, 10).name('Target Y').listen();
// lightFolder.add(teddyBearlight.target.position, 'z', -10, 10).name('Target Z').listen();

// lightFolder.open();  // Abre el folder por defecto para mayor visibilidad




// const helper = new THREE.DirectionalLightHelper( teddyBearlight2, 0.25 );
// scene.add( helper );
/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)
waterGeometry.deleteAttribute("normal")
waterGeometry.deleteAttribute("uv")

// Colors
debugObject.depthColor = '#4d60ef'
debugObject.surfaceColor = '#343d60'

gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime: { value: 0 },
        
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.925 },
        uColorMultiplier: { value: 1 }
    }
})

// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
// gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

// gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
// gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
// gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
// gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

// gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
// gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))





// Audio setup
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();  // Asegúrate de que esta línea esté antes del bloque de evento

// Añadir un manejador de eventos que iniciará la carga y reproducción de audio al hacer clic
document.addEventListener('click', () => {
    audioLoader.load('models/music2.wav', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    }, 
    undefined, // Función para el manejo de progreso (opcional)
    function (err) { // Función para manejo de errores
        console.error('Error loading audio:', err);
    });
});






/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Water
    waterMaterial.uniforms.uTime.value = elapsedTime

    //MOVEMENT teddyBear

    // Rotate objects
    if(teddyBear)
    {
        teddyBear.rotation.x = - elapsedTime * 0.1
        //teddyBear.rotation.x = Math.sin(elapsedTime) * 0.25 
        teddyBear.rotation.z = Math.sin(elapsedTime ) * 0.15 
        teddyBear.position.x =  0.1 - Math.sin(elapsedTime * 0.2) *0.25

    }


    // Rotate objects
    if(duck)
    {
        duck.rotation.x = elapsedTime * 0.5
        duck.position.x = -0.3 - Math.sin(elapsedTime * 0.2) *0.25
        duck.rotation.z =  - Math.sin(elapsedTime ) * 0.15 
        

    }

    // //update mixer

    // if(mixer !== null)
    // {
    //     mixer.update(deltaTime)

    // }




    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()