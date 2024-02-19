uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vNormal;
uniform vec4 uResolution;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uProgress;
uniform vec3 uColor1;
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
  float radius = .5;

  vec3 q = p;
  float md = 4.;
  p = mod(p, md) - md * .5;
  p.xy *= rot2D(uTime * .4);

  float sizeChanges = (1.6 + cos(uTime * 1.1)) * 3.7;
  // float sizeChanges2 = sin(uTime * 1.1) * 1.5;
  float sphere = sdSphere(p, radius);

  float qmd = 2.;
  q = mod(q, qmd) - qmd * .5;
  q.xy *= rot2D(uTime * .4);
  q.z = mod(q.z, 1.) - .45;
  float box = sdBox(q, vec3(radius ));

  return opSmoothUnion(sphere, box, 0.1);
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
    vec3 bg = mix(vec3(0.9765, 0.0824, 0.0824),vec3(1.0), dist);
    vec2 newUv = (vUv - vec2(0.5)) * uResolution.xy/ uResolution.y;
    vec3 camPos = vec3(0., 0., 4.);
    vec3 rayDir = normalize(vec3(newUv, -1.));

    float t = 0.;
    int i;
    for (i = 0; i < 80; i++) {
        vec3 p = camPos + rayDir * t;
        p.z -= uTime * 2.;
        // p.x += sin(t) * .1;
        p.y += sin(t * (uMouse.y + .5) * .5) * .3;
        p.xy *= rot2D(uTime * .2 + t * .2 * (uMouse.x + .5));
        // p.yz *= rot2D(uTime * .01 + t * .01);

        float d = map(p);
        if (d < 0.0001 || t > tMax) {
            break;
        }
        t += d;
    }
    float tColor = t * .001 + float(i) * .002;
    vec3 color = pallate(tColor , vec3(1.0, 0.0, 0.0), vec3(0.7647, 0.0, 1.0), vec3(1.0, 1.0, 1.0), vec3(1.0, 0.9843, 0.9843));
    color = vec3(tColor);
    color = mix(color, bg, smoothstep(0., 1., t * .03));
    gl_FragColor =  vec4(color, 1.);
}
