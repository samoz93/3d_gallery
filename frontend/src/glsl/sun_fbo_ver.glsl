varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
varying float vNoise;

varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vLayer3;
varying vec3 eyeVector;

const float PI = 3.14159265359;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


void main() {

    float time = uTime * .1;

    mat2 rot1 = rotate2d(time * .3);
    vec3 p1 = position;
    p1.yz = rot1 * p1.yz;
    vLayer1 = p1;

    mat2 rot2 = rotate2d(time * .2);
    vec3 p2 = position + 1.;
    p2.xz = rot2 * p2.xz;
    vLayer2 = p2;

    mat2 rot3 = rotate2d(time * .1);
    vec3 p3 = position + 2.;
    p3.xy = rot3 * p3.xy;
    vLayer3 = p3;



    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position =  projectionMatrix  * mvPosition;
    vUv = uv;
    vNormal = normal;
    eyeVector = normalize( position.xyz - cameraPosition);
}