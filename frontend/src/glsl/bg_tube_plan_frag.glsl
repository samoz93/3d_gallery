uniform float uTime;
varying vec2 vUv;
uniform vec4 uResolution;
varying vec3 vPos;
uniform vec3 uLight;
varying vec3 vNormal;
varying vec3 vWorld;

float getScatter(vec3 cameraPos,vec3 dir, vec3 lightPos, float dist) {
    // Light to ray origin
    vec3 q = cameraPos - lightPos;

    // coefficients
    float b = dot(dir,q);
    float c = dot(q,q);


    // Evaluate the integral 
    float t = c - b*b;
    float s = 1. /sqrt(max(0.0001,t));
    float l = s * (atan((dist + b) * s) - atan(b*s));

    return pow(max(0., l / 150.),.4);
}

void main() {
    vec3 cameraToWorld = vWorld - cameraPosition;
    vec3 cameraToWorldDir = normalize(cameraToWorld);
    float cameraToWorldDistance = length(cameraToWorld);

    vec3 lightToWorld = normalize(uLight - vWorld);

    float st = getScatter(cameraPosition,cameraToWorldDir, uLight, cameraToWorldDistance);


    float diffusion = max(dot(vNormal, lightToWorld), 0.0);
    float dist = length(uLight - vPos);

    float final = diffusion * st;

    vec3 color = vec3( final,0.,0.0);
    gl_FragColor =  vec4(color,1.);
}