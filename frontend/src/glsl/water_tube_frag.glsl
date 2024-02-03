uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uWaterTexture;
varying vec3 vNormal;


void main() {
    vec3 color = vec3(0.3098, 0.5176, 1.0);
    vec4 waterColor = texture2D(uWaterTexture, vUv);
    vec4 dustColor = texture2D(uTexture, vUv);
    // vec3 finalColor = mix(color, waterColor, 0.5);
    
    gl_FragColor =  vec4(vec3(dustColor.r),1.);
}
