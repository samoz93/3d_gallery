varying vec2 vUv;
uniform sampler2D uPosition;
uniform float uTime;
varying vec4 vColor;

void main() {
    vUv = uv;
    vec4 pos = texture2D(uPosition,vUv);
    float angle = atan(pos.x, pos.y);
    float colorData = 1.;//.4+sin(angle-uTime*.1);
    vColor = vec4(colorData,colorData,colorData,1.);

    vec4 mvPosition =  modelViewMatrix * vec4(pos.xyz, 1.0);
    gl_PointSize = 20. * (1. / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}