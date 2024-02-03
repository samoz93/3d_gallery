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
    float maxDist = .5;
    float dist = length(uMouse.xy - uv);
    // float dist = length(uMouse.xy - pos.xy);
    if(dist < maxDist){
        vec2 dir = normalize(uMouse.xy - pos.xy);
        dir *= 1. - dist/maxDist;
        pos.xy += dir * .03;
    }

    vProgress = smoothstep(.6, .1,sin((pos.y * uY + pos.x * uX) * uSegment + uTime * uSpeed));
    gl_Position =  projectionMatrix  * modelViewMatrix * vec4(pos, 1.0);

    vUv = uv;
}