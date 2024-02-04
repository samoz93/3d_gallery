uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform sampler2D uTexture;
uniform float uSpeed;


void main() {
    vec3 color = texture2D(uTexture, vUv).rgb;
    vec2 sonrays = vWorldPosition.xy - vec2(0.,13.);
    float uvDirection = atan(sonrays.y, sonrays.x);
    float time = uTime * .2;
    float newUv = fract(time *.4 + uvDirection);
    float c = texture2D(uTexture, vec2(uvDirection,0.) + newUv * .1 ).x;
    float c1 = texture2D(uTexture, vec2(0.,uvDirection) * newUv * 1.2 ).x;
    float alpha = mix(c,c1,color.y * .2);
    alpha = min(c,c1);
    // alpha = pow(alpha, 3.0);
    color = vec3(alpha);
    float depth = smoothstep(.0, 4.1, abs(vUv.y));
    gl_FragColor =  vec4(color,alpha * depth * .1 );
}
