const frag = `

uniform float time;
uniform vec2 resolution;

uniform sampler2D uTexture;

varying vec2 vUv;

void main()	{

	vec4 textureColor = texture2D(uTexture, vUv);

	gl_FragColor = textureColor;
}

`

export default frag;