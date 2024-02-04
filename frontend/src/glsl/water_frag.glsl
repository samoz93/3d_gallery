uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
uniform sampler2D uTexture;
varying vec3 vNormal;
uniform float uSpeed;


void main() {
    vec3 color = vec3(0.3098, 0.5176, 1.0);
    vec2 st = gl_PointCoord.xy;
    float dist = distance(st, vec2(0.5));
    float alpha = smoothstep(0.5, 0.49, dist);
    vec4 tex = texture2D(uTexture, st);

    // OK?
    // vec3 light = vec3(0.5, 0.5, 1.0);
    // float dProd = dot(vNormal, light);
    // float f = max(dProd, 0.2);

    vec3 normal = vec3(tex.rg * 2.0 - 1.0, 0.0);
    normal.z = sqrt(1.0 - normal.x * normal.x - normal.y * normal.y);
    normal = normalize(normal);
    
    vec3 lightPos = vec3(1.5, 4., 1.0);
    vec3 lightDir = normalize(lightPos);
    float diffuse = max(dot(normal, lightDir), 0.);
    
    // color = mix(color,tex.rgb,diffuse);
    gl_FragColor =  vec4(color,alpha * diffuse * .1);
}
