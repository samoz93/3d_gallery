uniform float uTime;
uniform float uProgress;

float getColor(float x) {
    return sin(uTime * x);
}

void main() {
    
    gl_FragColor *=  vec4(getColor(1.),getColor(2.),uProgress, 1.0);
    // csm_FragColor = gl_FragColor;
}