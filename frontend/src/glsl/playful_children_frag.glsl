uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform vec4 uResolution;
uniform vec3 uColor;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

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

float map(vec3 p) {
  float radius = .2;
  float range = .40;
  float move = (sin(uTime* .3) * range - .8 * range) *  (cos(uTime* 2.) * range - .5 * range * .5);
  vec3 sPos = vec3(move,move + .5,move );
//   vec3 bPos = vec3(sin(uTime) * .1, 0., .0);

  vec3 q = p;

  // Box
//   q.y -= uTime * .1;
//   q = fract(q * .5) - .5;
//   q -= vec3(0., 0., .5);
  q.xz *= rot2D(+uTime);

  // Sphere
  p.yz *= rot2D(cos(uTime)  * 1.);
  p.yx *= rot2D(sin(uTime)  * 1.);

//   p.z += -.5;
  float sphere = sdSphere(p - sPos, radius);
  float box = sdBox(q, vec3(radius));

  return opSmoothUnion(box, sphere,.3);
}

vec3 pallate(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 newUv = (vUv - vec2(0.5));
    vec3 rayPos = vec3(0., 0., -2.);
    vec3 rayDir = normalize(vec3(newUv, 1.));

    float t = 0.;
    int i;
    for (i = 0; i < 80; i++) {
        vec3 p = rayPos + rayDir * t;
        p.xy *= rot2D(uTime + t * .1);

        float d = map(p);
        if (d < 0.001 || t > 200.0) {
            break;
        }
        t += d;
    }

    vec3 c1 = uColor;
    vec3 c2 = uColor2;
    vec3 c3 = uColor3;
    vec3 c4 = uColor4;
    vec3 plt = pallate(t * .03, c1, c2, c3, c4);

    vec3 color = vec3(plt * .2 * float(i) / 20.0);

    gl_FragColor =  vec4(color, 1.);
}
