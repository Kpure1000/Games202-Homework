class DirectionalLight {

    constructor(lightIntensity, lightColor, lightPos, focalPoint, lightUp, hasShadowMap, gl) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2, 0));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate, scale) {
        let lightMVP = mat4.create();
        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // Model transform
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, translate);
        mat4.scale(modelMatrix, modelMatrix, scale);
        // View transform
        mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);
        // Projection transform

        // let front = vec3.create();
        // let right = vec3.create();
        // let up = vec3.create();
        // vec3.normalize(front, this.focalPoint - this.lightPos);
        // vec3.cross(right, -this.lightUp, front);
        // vec3.normalize(right, right);
        // vec3.cross(up, right, front);
        // let left_bottom = vec3.create();
        // let horizontal = vec3.create();
        // let vertical = vec3.create();
        // left_bottom = this.focalPoint - this.lightPos + front - resolution / 2 * right - resolution / 2 * up;
        // horizontal = resolution * right;
        // vertical = resolution * up;

        mat4.ortho(projectionMatrix, 0, resolution, 0, resolution, 0.1, 100.0);

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);

        return lightMVP;
    }
}