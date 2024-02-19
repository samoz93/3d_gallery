uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform vec4 uResolution;
uniform vec2 uMouse;
uniform float uProgress;
uniform sampler2D uTexture;

const float PI = 3.14159265359;
const float tMax = 100.0;

void main() {
    vec4 tex = texture2D(uTexture, vUv);
    float light = dot(vNormal, vec3(1.));
    light = abs(light);
    vec3 color = vec3(light);
    gl_FragColor =  vec4(vUv,1.,1.);
}
