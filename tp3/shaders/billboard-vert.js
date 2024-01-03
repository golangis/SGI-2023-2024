const vert = 
` #include <packing>
varying vec2 vUv;

uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;

float readDepth( sampler2D depthSampler, vec2 coord ) {
  float fragCoordZ = texture2D( depthSampler, coord ).x;
  float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
  vUv = uv;

  float depth = readDepth(tDepth, vUv);

  depth = 1.0 - depth;
  depth = depth * depth;

  vec3 pos = position + normal * depth; 

  if (normal.x == 0.0 && normal.z == 0.0) {
	pos = position;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

export default vert;
