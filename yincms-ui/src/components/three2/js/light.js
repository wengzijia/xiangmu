import { AmbientLight, DirectionalLight } from 'three';

export const lightList = [];

/**环境光 */
const ambientLight = new AmbientLight(0xffffff, 0.9);

const directionalLight1 = new DirectionalLight(0xffffff, 0.1);
const directionalLight2 = new DirectionalLight(0xffffff, 0.1);
const directionalLight3 = new DirectionalLight(0xffffff, 0.1);
directionalLight1.position.set(20, 20, 20);
directionalLight2.position.set(20, 20, -20);
directionalLight3.position.set(-20, 20, 20);

lightList.push(ambientLight, directionalLight1, directionalLight2, directionalLight3);
