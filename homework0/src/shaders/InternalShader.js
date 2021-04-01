const LightCubeVertexShader = `
attribute vec3 aVertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;


void main(void) {

  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

}
`;

const LightCubeFragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float uLigIntensity;
uniform vec3 uLightColor;

void main(void) {
    
  //gl_FragColor = vec4(1,1,1, 1.0);
  gl_FragColor = vec4(uLightColor, 1.0);
}
`;
const VertexShader = `
attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

void main(void) {

  // vFragPos = aVertexPosition;
  vFragPos = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
  vNormal = aNormalPosition;

  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

  vTextureCoord = aTextureCoord;

}
`;

const FragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform int uTextureSample;
uniform vec3 uKd;
uniform sampler2D uSampler;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;

varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

void main(void) {
  
  if (uTextureSample == 1) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  } else {
    gl_FragColor = vec4(uKd,1);
  }

}
`;

const PhongVertexShader = `
attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;


void main(void) {

  // vFragPos = aVertexPosition;
  vFragPos = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
  vNormal = aNormalPosition;

  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;

}
`;

const PhongFragmentShader = `#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D uSampler;
uniform vec3 uKd;
uniform vec3 uKs;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;
uniform float uLightIntensity;
uniform int uTextureSample;

vec4 _DiffuseSegment;
float _SpecularSegment;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;

void main(void) {
  _DiffuseSegment = vec4(0.1, 0.426, 0.875, 1.0);
  _SpecularSegment = 0.7;
  vec3 color;
  if (uTextureSample == 1) {
    // color = pow(texture2D(uSampler, vTextureCoord).rgb, vec3(2.2));
    color = texture2D(uSampler, vTextureCoord).rgb;
  } else {
    color = uKd;
  }
  
  vec3 ambient = 0.05 * color;

  vec3 lightDir = normalize(uLightPos - vFragPos);
  vec3 normal = normalize(vNormal);
  
  float diff = max(dot(lightDir, normal), 0.0);
  float w = fwidth(diff)*2.0;
  // w = 0.0;
  // if (diff < _DiffuseSegment.x + w) {
  //     // diff = clamp(_DiffuseSegment.x, _DiffuseSegment.y, smoothstep(_DiffuseSegment.x - w, _DiffuseSegment.x + w, diff));
  //     diff = _DiffuseSegment.x;
  // } else if (diff < _DiffuseSegment.y + w) {
  //     // diff = clamp(_DiffuseSegment.y, _DiffuseSegment.z, smoothstep(_DiffuseSegment.y - w, _DiffuseSegment.y + w, diff));
  //     diff = _DiffuseSegment.y;
  // } else if (diff < _DiffuseSegment.z + w) {
  //     // diff = clamp(_DiffuseSegment.z, _DiffuseSegment.w, smoothstep(_DiffuseSegment.z - w, _DiffuseSegment.z + w, diff));
  //     diff = _DiffuseSegment.z;
  // } else {
  //     diff = _DiffuseSegment.w;
  // }
  
  vec3 diffuse =  diff * color;

  vec3 viewDir = normalize(uCameraPos - vFragPos);
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow (max(dot(viewDir, reflectDir), 0.0), 32.0);
  w = fwidth(spec);
  // if (spec < _SpecularSegment + w) {
  //     spec = 0.0;
  // } else {
  //     spec = 1.0;
  // }
  vec3 specular = uKs * spec;  
  
  float light_atten_coff = normalize(uLightIntensity);// / length(uLightPos - vFragPos);

  gl_FragColor = vec4(pow((ambient + light_atten_coff * (diffuse + specular)), vec3(1.0/2.2)), 1.0);

}
`;