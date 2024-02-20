uniform float uTime;
varying vec2 vUv;
uniform vec4 uResolution;
uniform sampler2D uTexture;

void main() {
    vec2 uv = vUv;
    vec3 color =  vec3(uv,1.0);
    gl_FragColor =  vec4(color,1.);
}