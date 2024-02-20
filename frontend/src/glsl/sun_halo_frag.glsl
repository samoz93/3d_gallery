uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

varying vec3 eyeVector;
varying vec3 vPos;

varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vLayer3;

  vec3 brightToColor(float b) {
    b *= .3;
    return vec3(b, b*b, b*b*b*b) * .5;
  }



 
  
  void main() { 
    float radialGradient = 1. - vNormal.z;
    radialGradient *=  radialGradient * radialGradient;


    float b = 1. + radialGradient * .8;

    vec3 color = vec3(brightToColor(b)) * radialGradient;
    // vec3 color = brightToColor(b);
    gl_FragColor = vec4(color, radialGradient * .45);
  }