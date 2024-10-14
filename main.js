// Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define the cube geometry and material
const cubeGeometry = new THREE.BoxGeometry(3, 5, 0.3);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x414141 });

const firstCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
const secondcube = new THREE.Mesh(cubeGeometry, cubeMaterial);
const thirdcube = new THREE.Mesh(cubeGeometry, cubeMaterial);
firstCube.position.set(0, 0, 0);
secondcube.position.set(5, 0, -5);
secondcube.rotation.set(0, Math.PI/2, 0);
thirdcube.position.set(-5, 0, -5);
thirdcube.rotation.set(0, Math.PI/2, 0);
scene.add(firstCube);
scene.add(secondcube);
scene.add(thirdcube);

//Création des fleches
const coneGeometry1 = new THREE.ConeGeometry(0.15, 0.75, 32); // Rayon, hauteur, segments
const coneMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const arrowTip1 = new THREE.Mesh(coneGeometry1, coneMaterial1);
const arrowTip2 = new THREE.Mesh(coneGeometry1, coneMaterial1);
const arrowTip3 = new THREE.Mesh(coneGeometry1, coneMaterial1);
const arrowTip4 = new THREE.Mesh(coneGeometry1, coneMaterial1);

// Positionner les pointes de la flèche du premier cube
arrowTip1.position.set(1.5, 0, 0); 
arrowTip2.position.set(-1.5, 0, 0);
arrowTip3.position.set(-1.5, 0, 0);
arrowTip4.position.set(-1.5, 0, 0);
arrowTip1.rotation.set(0, 0, -Math.PI / 2);
arrowTip2.rotation.set(0, 0, Math.PI / 2);
arrowTip3.rotation.set(0, 0, Math.PI / 2);
arrowTip4.rotation.set(0, 0, Math.PI / 2);
firstCube.add(arrowTip1);
firstCube.add(arrowTip2);

secondcube.add(arrowTip4);

thirdcube.add(arrowTip3);


const floorGeometry = new THREE.BoxGeometry(100, 0.1, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xCACACA });
const floorTexture = new THREE.TextureLoader().load('/resources/Marble.jpg');
floorMaterial.map = floorTexture;
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -20, -10);
scene.add(floor);


camera.position.set(0, 0 ,5);


// Initialiser Raycaster et la position de la souris
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// Variables pour l'animation de la caméra
let targetPosition = null; // Position cible pour l'animation
let cubeActif = "Mirroir1"; // Cube qui est actif
const animationSpeed = 0.05; // Vitesse de l'animation

function onMouseClick(event) {
    // Calculer la position de la souris en coordonnées normalisées (-1 à +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le Raycaster avec la position de la souris
    raycaster.setFromCamera(mouse, camera);

    // Déterminer les objets à tester (les cubes et la pointe de la flèche)
    const clickableObjects = [arrowTip1, arrowTip2, arrowTip3, arrowTip4]; // Ajoute ici la pointe de la flèche

    // Vérifier les intersections avec les objets
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
        // Si la pointe de la flèche est cliquée, on peut exécuter une action
        const clickedObject = intersects[0].object;

        // Si c'est la pointe de la flèche, définir la position cible
        if (clickedObject === arrowTip1) {
            targetPosition = new THREE.Vector3(10, 0, -5); // Nouvelle position de la caméra
            cubeActif = "Mirroir2";
        }else if(clickedObject === arrowTip2){
            targetPosition = new THREE.Vector3(-10, 0, -5); // Nouvelle position de la caméra
            cubeActif = "Mirroir3";
        }else if(clickedObject === arrowTip3 || clickedObject === arrowTip4){
            targetPosition = new THREE.Vector3(0, 0, 5); // Nouvelle position de la caméra
            cubeActif = "Mirroir1";
        }
    }
}

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);

    // Si une position cible est définie, interpoler la caméra vers cette position
    if (targetPosition) {
        camera.position.lerp(targetPosition, animationSpeed); // Interpolation linéaire

        // Vérifier si la caméra est proche de la position cible pour arrêter l'animation
        if (camera.position.distanceTo(targetPosition) < 0.1) {
            targetPosition = null; // Arrêter l'animation
        }
    }

    camera.lookAt(0, 0, -5); // Toujours regarder vers le centre de la scène
    renderer.render(scene, camera);
}

// Ajouter un écouteur pour le clic de la souris
window.addEventListener('click', onMouseClick, false);

// Démarrer l'animation
animate();
