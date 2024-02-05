uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vNormal;
uniform vec4 uResolution;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uProgress;

const float PI = 3.14159265359;
const float tMax = 100.0;
mat2 rot2D(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdArc(vec3 p, float r, float h) {
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}
float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h);
}

float opSmoothIntersection( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h);
}

vec2 matcap(vec3 eye, vec3 normal) {
    vec3 reflected = reflect(eye, normal);
    float m = 2.8284271247461903 * sqrt( 
        pow(reflected.x, 2.0) + 
        pow(reflected.y, 2.0) + 
        pow(reflected.z + 1.0, 2.0));
    return reflected.xy / m + .5;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float map(vec3 p) {
  float radius = .2;
  // float range = .40;
  // float move = (sin(uTime* .3) * range - .8 * range) *  (cos(uTime* 2.) * range - .5 * range * .5);
  // vec3 sPos = vec3(move,move + .5,move );
  // vec3 bPos = vec3(0.,sin(uTime) * .8, .0);
  // vec3 sPos = vec3(0.,sin(uTime) * .4, .0);
  vec2 newMouse = uMouse * 3.;// (uMouse + vec2(-radius,-radius * .25)) * uResolution.zw;
  // newMouse.y += radius;
  vec3 boxVec = p;
  // p = mod(p,.5) - .25;
  // Box
  // q = mod(q,1.5) - .75;
  boxVec.xz *= rot2D(+uTime);
  // p.xy *= rot2D(+uTime);  
  // p.yz *= rot2D(+uTime);  


//   p.z += -.5;
  float mouseSphere = sdSphere(p - vec3(newMouse,0.2) , radius);

  float box = sdBox(boxVec , vec3(radius));
  float sphere2 = sdSphere(p , radius);
  float boxSphereMix = mix(sphere2, box, .5 + sin(uTime) * .3);

  for (int i = 0; i < 7; i++) {
    float rand = random(vec2(float(i),float(i) * 2.));
    float pr = 1. - fract(uTime * .3 + rand * 3.) * 5.2;
    vec3 randomOffset = vec3(sin(rand * 2. * PI),cos(rand * 2. * PI),0.);
    float outOfCenter = sdSphere(p - randomOffset * pr, radius * .5);
    boxSphereMix = opSmoothUnion(outOfCenter, boxSphereMix, .3);
  }

  return opSmoothUnion(boxSphereMix, mouseSphere, .3);
  // return opSmoothUnion(basicShapesMix, outOfCenter, .3);
}

vec3 pallate(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

void main() {
    float dist = 1. - length(vUv - vec2(.5));
    vec3 bg = mix(vec3(.3),vec3(1.0), dist);
    vec2 newUv = (vUv - vec2(0.5)) * uResolution.xy/ uResolution.y;
    vec3 camPos = vec3(0., 0., 2.);
    vec3 rayDir = normalize(vec3(newUv, -1.));

    float t = 0.;
    int i;
    for (i = 0; i < 80; i++) {
        vec3 p = camPos + rayDir * t;
        // p.xy *= rot2D(uTime + t * .1);

        float d = map(p);
        if (d < 0.0001 || t > tMax) {
            break;
        }
        t += d;
    }

    // vec3 c1 = vec3(0.0863, 0.5843, 0.8549);
    // vec3 c2 = vec3(0.5176, 0.0, 1.0);
    // vec3 c3 = vec3(0.6588, 0.0, 0.0);
    // vec3 c4 = vec3(0.0, 0.0, 0.0);
    // vec3 plt = pallate(t * .003, c1, c2, c3, c4);
    // vec4 = texture2D(uTexture, newUv);
    // vec3 color = bg;
    vec3 color = bg;
    if (t < tMax) {
        vec3 normal = calcNormal(camPos + rayDir * t);
        vec2 matcapUv = matcap(rayDir, normal);
        vec4 text = texture2D(uTexture, matcapUv);
        float frensel =  pow(1. + dot(normal, rayDir), 3.);
        color = text.xyz;
        color = mix(color, bg, frensel);
    }
    // float alpha = smoothstep(1., .1, t * .1);
    gl_FragColor =  vec4(color, 1.);
}
