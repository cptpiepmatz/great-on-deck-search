export default [
  {
    input: "src/pages/index.js",
    output: {
      file: "out/pages.bundle.js",
      format: "iife",
      sourcemap: "inline"
    }
  },
  {
    input: "src/background/index.js",
    output: {
      file: "out/background.bundle.js",
      format: "iife",
      sourcemap: "inline"
    }
  }
]
