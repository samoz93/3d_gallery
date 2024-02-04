uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uWaterTexture;
varying vec3 vNormal;
varying vec3 vWorldPosition;


void main() {
    float time = uTime * .2;
    float waterColor = texture2D(uWaterTexture, vUv + fract(time + vUv.x) * .01).r;
    float dustColor = texture2D(uWaterTexture, vUv + fract(time + vUv.y) * 1.2).r;
    float dustColor3 = texture2D(uTexture, vUv * vec2(.8,.5) - time * 4.).r;

    float alpha = (min(waterColor, dustColor) + dustColor3) * .9;
    float mx = mix(dustColor, waterColor, dustColor3);
    vec3 color = vec3(dustColor);
    // color = vec3(waterColor);
    // color = vec3(sin(uTime));
    color = vec3(alpha);
    // color = vec3(mx);

    vec3 viewDirection = -normalize(vWorldPosition - cameraPosition) * vNormal;
    float fresnel = pow(dot(viewDirection, vNormal),3.);

    color = vec3(alpha);
    gl_FragColor =  vec4(color,alpha * fresnel);
}
