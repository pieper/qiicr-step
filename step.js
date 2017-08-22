class STEP {
  constructor(canvas, gl) {

    this.canvas = canvas;
    this.gl = gl;

    this.options = {
      newVolumeThreeD : false,
    };
    this.uniforms = {
      pointLight: { type: '3fv', value: [100., -400., 1500.] },
      gradientSize: { type: '1f', value: 1. },
      rayMaxSteps: { type: '1i', value: 10000 },
      sampleStep: { type: '1f', value: 0.5 },
      renderCanvasWidth: { type: '1f', value: 512 },
      renderCanvasHeight: { type: '1f', value: 512 },
      sliceMode: { type: '1i', value: 1 },
      Kambient: { type: '1f', value: 1.5 },
      Kdiffuse: { type: '1f', value: .95 },
      Kspecular: { type: '1f', value: .8 },
      Shininess: { type: '1f', value: 10 },
    }

    //
    // check if our gl supports float textures and if
    // so set the Field and Generator class variables so all instances use
    // the same type
    let glExtensions = {};
    let expectedExtensions = [
      "EXT_color_buffer_float",
      "OES_texture_float_linear",
    ]; /* TODO WEBGL_debug_renderer_info WEBGL_lose_context */
    expectedExtensions.forEach(extensionName => {
      glExtensions[extensionName] = gl.getExtension(extensionName);
    });

    let hasTextureFloatLinear = 'OES_texture_float_linear' in glExtensions;
    let hasColorBufferFloat = 'EXT_color_buffer_float' in glExtensions;
    Field.useIntegerTextures = !(hasTextureFloatLinear && hasColorBufferFloat);
    if (Field.useIntegerTextures) {
      console.warn('Floating texture support not available');
    }
    Generator.useIntegerTextures = Field.useIntegerTextures;

    this.renderer = new RayCastRenderer({
      gl: this.gl,
      canvas: this.canvas,
      uniforms: this.uniforms,
      inputFields: [],
    });
    this.view = new View({
      viewBoxMax : [250, 250, -250],
      viewBoxMin : [-250, -250, -200],
      viewPoint : [0., -400., 0.],
      viewNormal : [0., 1., 0.],
      viewUp : [0., 0., 1.],
    });
    this.renderer.glExtensions = glExtensions;
    this.renderer.updateProgram();
    this.renderer._render(this.view);

    let resizeCallback = (resizeEvent) => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.uniforms.renderCanvasWidth.value = this.canvas.width;
      this.uniforms.renderCanvasHeight.value = this.canvas.height;
      if (this.renderer) {
        this.renderer.requestRender(this.view);
      }
    };
    window.addEventListener('resize', resizeCallback.bind(this));
    window.dispatchEvent(new Event('resize'));
  }
}
