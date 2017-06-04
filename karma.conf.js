module.exports = function(config) {
  config.set({

    basePath: './',

    frameworks: ['jasmine', 'karma-typescript'],

    files: [
      'src/**/*.tsx',
      'test/**/*Spec.tsx'
    ],

    preprocessors: {
     "src/**/*.ts": ["karma-typescript", "coverage"],
     "src/**/*.tsx": ["karma-typescript", "coverage"],
     "test/**/*.tsx": ["karma-typescript"]
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        exclude: [
          "react/addons",
          "react-test-renderer/shallow",
          "react/lib/ReactContext",
          "react/lib/ExecutionEnvironment"
        ]
      }
    },
    reporters: ["progress", "karma-typescript"],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity
  })
}
