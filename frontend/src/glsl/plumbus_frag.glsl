varying float vPattern;

void main() {
    vec3 color = mix(vec3(0.0078, 0.0039, 0.0039),vec3(0.4314, 0.5804, 0.4314),vPattern);
    gl_FragColor =  vec4(color,1.);
    csm_FragColor = gl_FragColor;
}