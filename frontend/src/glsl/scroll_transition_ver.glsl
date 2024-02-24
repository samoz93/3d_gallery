varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;

const float PI = 3.14159265359;



void main() {
    vec3 pos = position;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position =  projectionMatrix  * mvPosition;
    vUv = uv;
    vNormal = normal;
}