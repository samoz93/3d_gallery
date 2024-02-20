varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
varying float vNoise;
varying vec3 vPos;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vLayer3;
varying vec3 eyeVector;


void main() {
    vec3 pos = position;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position =  projectionMatrix  * mvPosition;
    vUv = uv;
    vNormal = normal;
    vPos = pos;

}