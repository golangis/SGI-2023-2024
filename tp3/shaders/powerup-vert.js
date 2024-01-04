const vertex = `

uniform float time;
uniform float rotationSpeed;
uniform float dilationRange;
uniform float dilationSpeed;
varying vec2 vUv;

void main()	{
	// For cube rotation
	float theta = time*rotationSpeed;
	float c = cos(theta);
	float s = sin(theta);

	mat4 rotation = mat4(
		vec4(-c, 0, -s, 0),
		vec4(0, 1, 0, 0),
		vec4(s, 0, -c, 0),
		vec4(0, 0, 0, 1)
	);

	// For cube dilation
	vUv = uv;

	float dilation = mod(time * dilationSpeed, 2.0);

	if (dilation > 1.0) {
		dilation = 2.0 - dilation;
	}

	vec3 newPosition = position * (1.0 + dilation * dilationRange * 1.5);

	gl_Position = projectionMatrix * modelViewMatrix * rotation * vec4( newPosition, 1.0 );
}

`

export default vertex;
