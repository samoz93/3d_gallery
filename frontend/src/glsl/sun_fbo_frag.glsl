uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform samplerCube uTexture;
uniform sampler2D uTex;

varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vLayer3;
varying vec3 eyeVector;


  float samplingSum(){
    float sum = 0.;
    float offset = 0.;
    sum+=textureCube(uTexture,vLayer1+offset).r;
    sum+=textureCube(uTexture,vLayer2+offset).r;
    sum+=textureCube(uTexture,vLayer3+offset).r;
    
    return sum * .3 + .15;
  }

  vec3 brightToColor(float b) {
    // b *= .3;
    return vec3(b, b*b, b*b*b*b) * 3.;
  }


  void main() { 
    float frensel = pow(1.0 + dot(eyeVector, vNormal), 4.0);
    
    float b = samplingSum() + frensel * .8 + .1;
    vec3 color = vec3(brightToColor(b));
    gl_FragColor = vec4(color, 1.0);
  }