uniform float uTime;
varying vec2 vUv;
varying float vProgress;
uniform vec3 uColor;

void main() {
    vec3 finalColor = mix(uColor + .2, uColor * .1, vProgress);
    float hideConer = smoothstep(0.1, 0.9, vUv.y * vProgress);
    hideConer = smoothstep(0.1, 0.9, vUv.x * vProgress);
    gl_FragColor =  vec4(finalColor,vProgress * hideConer);
    // csm_FragColor = gl_FragColor;
}