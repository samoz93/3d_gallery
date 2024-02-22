uniform float uTime;
varying vec2 vUv;
uniform vec3 uLight;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
    vec3 pos = position;

    vWorld = (modelMatrix * vec4(pos, 1.0)).xyz;
    gl_Position =  projectionMatrix  * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
    vPos = position;
    vNormal = normal;
}