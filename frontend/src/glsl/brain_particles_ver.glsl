uniform float uTime;
varying vec2 vUv;
varying float vProgress;
uniform float uSpeed;
uniform float uSegment;
uniform float uX;
uniform float uY;
uniform vec3 uMouse;

void main() {
    vec3 pos = position;
    float maxDist = .1;
    float dist = length(uMouse.xy - pos.xy);
    if(dist < maxDist){
        vec2 dir = normalize(uMouse.xy - pos.xy);
        dir *= (1. - dist/maxDist);
        pos.xy += dir * .01;
    }

    vProgress = smoothstep(.9, .1,sin((pos.y * uY + pos.x * uX)* uSegment + uTime * uSpeed));
    vec4 mvPosition =  modelViewMatrix * vec4(pos.xyz, 1.0);
    gl_Position =  projectionMatrix  * mvPosition;
    gl_PointSize = 1. * (1. / - mvPosition.z);

    vUv = uv;
}