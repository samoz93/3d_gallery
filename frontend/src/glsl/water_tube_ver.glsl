varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
attribute vec3 aRandom;
attribute float size;

const float PI = 3.14159265359;



vec3 getPos(float progress){
  vec3 pos = vec3(0.);
  float angle = progress * PI * 2.;
  pos.x = sin(angle) + 2. * sin(angle * 2.);
  pos.y = cos(angle) - 2. * cos(angle * 2.);
  pos.z =  -sin(angle * 3.);
  return pos;
}


vec3 getPos2(float progress){
  vec3 pos = vec3(0.);
  float angle = progress * PI * 2.;

  pos.x = (2. + cos(angle * 3.)) * cos(angle * 2.);
  pos.y = (2. + cos(angle * 3.)) * sin(angle * 2.);
  pos.z =  -sin(angle * 3.);
  return pos;
}

vec3 getTangent(float progress){
    vec3 pos = vec3(0.);

    float angle = progress * PI * 2.;

    pos.x = cos(angle) + 4. * cos(angle * 2.) ;
    pos.y = -sin(angle) + 4. * sin(angle * 2.);
    pos.z =  3. * -cos(angle * 3.);

    return normalize(pos);
}



vec3 getNormal(float progress){
    vec3 pos = vec3(0.);

    float angle = progress * PI * 2.;

    pos.x = -sin(angle) - 8. * sin(angle * 2.) ;
    pos.y = -cos(angle) + 8. * cos(angle * 2.);
    pos.z =  9. * sin(angle * 3.);

    return normalize(pos);
}

void main() {
    vec3 pos = position;
    // float progress = fract(uTime * .01 + aRandom.x  );
    // // pos =  getPos(progress);
    // vec3 normal = getNormal(progress);
    // vec3 tangent = getTangent(progress);
    // vec3 binormal = normalize(cross(normal, tangent));
    // // pos += normal  * aRandom.z * .5 + binormal * aRandom.z * .5;
    
    // // float radius = .1 * aRandom.y + .4;

    // float cx = cos( aRandom.y * PI * 2. * uTime * .1 + aRandom.z * 1.) * radius;
    // float cy = sin( aRandom.y * PI * 2. * uTime * .1 + aRandom.z * 1.) * radius;
    // // pos += binormal * cy + normal * cx;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // mvPosition.xyz += getPos2(val) * 3.;
    // gl_PointSize = 30.0 * (1./ - mvPosition.z);
    gl_Position =  projectionMatrix  * mvPosition;
    vUv = uv;
    vNormal = normal;
}