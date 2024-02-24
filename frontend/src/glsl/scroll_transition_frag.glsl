uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
const float PI = 3.14159265359;

vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.0);
    return mix(m, 2.0 - m, step(1.0, m));
}

float tri(float x) {
    return mix(x, 1.0 - x, step(0.5, x)) * 2.0;
}

void main() {
    float sweep = step(uProgress, vUv.y);

    float p = uProgress;
 
    float delayValue = p*7. - vUv.y*2. + vUv.x - 2.0 ;
    delayValue = clamp(delayValue,0.,1.);
    
    vec2 acc = vec2(0.5,2.);
    
    vec2 translateValue = p + delayValue * acc;
    vec2 translateValue1 = vec2(-0.5,1.)* translateValue;
    vec2 translateValue2 = vec2(-0.5,1.) * (translateValue - 1.0 - acc);
    
  	vec2 w = sin( sin(uTime)*vec2(0,0.3) + vUv*vec2(0,4.)) * vec2(0, 0.5);
  	vec2 xy = w*(tri(p)*0.5 + tri(delayValue)*0.5);
    
    
    vec2 uv1 = vUv + translateValue1 + xy;
    vec2 uv2 = vUv + translateValue2 + xy;
    
    vec4 t1 = texture2D(uTexture1, mirrored(uv1));
    vec4 t2 = texture2D(uTexture2, mirrored(uv2));

    vec4 t = mix(t1, t2, delayValue);
    gl_FragColor =  t;
}
