uniform float uTime;
uniform float uFrequency;
varying vec2 vUv;
varying float vPattern;
uniform vec3 uColors[4];

#define COLOR_RAMP(colors, factor, finalColor) { \
    int index = 0; \
    for(int i = 0; i < colors.length() - 1; i++){ \
       Color currentColor = colors[i]; \
       bool isInBetween = currentColor.position <= factor; \
       index = int(mix(float(index), float(i), float(isInBetween))); \
    } \
    Color currentColor = colors[index]; \
    Color nextColor = colors[index + 1]; \
    float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position) / range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
} \


struct Color{
    vec3 color;
    float position; // 0-1
};

void main() {
    float freqTime = uTime * (1. + uFrequency );
    vec3 color ;
    vec3 mainColor = mix(vec3(0.2549, 0.2471, 0.1412),vec3(0.9529, 0.7725, 0.7725),uFrequency * 1.5);

    mainColor.r *= 0.6 + sin(freqTime) * .3;
    mainColor.g *= 1.2 + cos(freqTime * .1) * .6;
    mainColor.b *= 0.8 + cos(freqTime * .9) * .2;

    Color[4] colors = Color[](
        Color(uColors[0], 0.0),
        Color(uColors[1], .01),
        Color(uColors[2], .5),
        Color(uColors[3], 1.0)
    );

    COLOR_RAMP(colors, max(0.006,vPattern), color);

    gl_FragColor =  vec4(color,1.);
    csm_DiffuseColor = gl_FragColor;
}
