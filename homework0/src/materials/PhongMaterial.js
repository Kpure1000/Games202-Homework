class PhongMaterial extends Material {

    constructor(color, texture, specular, intensity) {
        let textureSample = 0;
        if (texture != null) {
            textureSample = 1;
            super({
                'uKd': { type: '3fv', value: color },
                'uKs': { type: '3fv', value: specular },
                'uSampler': { type: 'texture', value: texture },
                'uTextureSample': { type: '1i', value: textureSample },
                'uLightIntensity': { type: '1f', value: intensity }
            }, [], PhongVertexShader, PhongFragmentShader);
        } else {
            super({
                'uKd': { type: '3fv', value: color },
                'uKs': { type: '3fv', value: specular },
                'uTextureSample': { type: '1i', value: textureSample },
                'uLightIntensity': { type: '1f', value: intensity }
            }, [], PhongVertexShader, PhongFragmentShader);
        }
    }
}