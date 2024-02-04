varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
attribute vec3 aRandom;
attribute float size;
varying vec3 vWorldPosition;

const float PI = 3.14159265359;



void main() {
    vec3 pos = position;
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position =  projectionMatrix  * mvPosition;
    vUv = uv;
    vNormal = normal;
}