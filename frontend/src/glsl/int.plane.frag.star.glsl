uniform sampler2D uPosition;
uniform sampler2D uInfo;
varying vec2 vUv;
uniform float uTime;

void main() {
    vec4 pos = texture2D(uPosition,vUv);
    vec4 info = texture2D(uInfo,vUv);

    float radius = length(pos.yx);
    float circularForce = 1. - smoothstep(0.3,1.4,abs(pos.x-radius));
    float angle = atan(pos.y, pos.x)  + info.y * .1 * mix(.7, 1., circularForce);

    float targetRadius = mix(info.x,.8,cos(angle *10. + uTime * .1));
    radius += (targetRadius - radius) * .1;


    vec3 targetPos = vec3(cos(angle), sin(angle), 0) * radius;
    
    pos.xy += (targetPos.xy - pos.xy) * 1.1;

    gl_FragColor =  vec4(pos.xy,1.,1.);
}