uniform float uProgress;
uniform float uIntensity;
attribute vec3 aCenter;
attribute float aRandom;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main() {

    vec3 pos = position;

    float prog = normalize( uProgress - pos.y)/2. + 1.;;
    float localProgress = prog; //clamp((uProgress - prog), 0., 1.);
    localProgress = uProgress;
    pos += (1.-localProgress) * aRandom * normal;
    pos = (pos - aCenter);
    pos *= localProgress;
    pos +=aCenter  * uIntensity;
    pos = rotate(pos, vec3(0., 1., 0.), aRandom * (1.-  uProgress) * 3.14 * 3.);
    gl_Position =  projectionMatrix  * modelViewMatrix * vec4(pos, 1.0);
    csm_PositionRaw = gl_Position;
}