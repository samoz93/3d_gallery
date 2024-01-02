varying vec2 vUv;
uniform sampler2D uPosition;
uniform float uTime;

void main() {
    vUv = uv;
    // vec4 pos = texture2D(uPosition,vUv);
    vec3 pos = position;
    vec4 mvPosition =  modelViewMatrix * vec4(pos.xyz, 1.0);
    gl_Position = projectionMatrix * mvPosition;

}