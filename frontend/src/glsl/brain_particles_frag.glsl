uniform float uTime;
varying vec2 vUv;
varying float vProgress;
uniform vec3 uColor;

void main() {
    // vec3 color = vec3(smoothstep(.1,1.,sin(uTime * 2.0 + vUv.x * 10.0)),1.,1.);
    // vec3 finalColor = mix(color + .2, color, 1.);
    // float hideConer = smoothstep(0.1, 0.9, vUv.y * vProgress);
    // hideConer = smoothstep(0.1, 0.9, vUv.x * vProgress);
    float disc = length(gl_PointCoord - vec2(0.5));
    float opacity = smoothstep(0.3, 0.29, disc);
    gl_FragColor =  vec4(vec3(1.),vProgress * disc);
    // csm_FragColor = gl_FragColor;
}