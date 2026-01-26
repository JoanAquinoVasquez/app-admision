import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { glob } from "glob";
import path from "path";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000/admision-epg",

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      // 🔍 Task para buscar archivos descargados
      on("task", {
        findExcel(pattern) {
          const files = glob.sync(pattern);
          return files.length > 0 ? path.resolve(files[0]) : null;
        }
      });

      return config;
    },

    // ✅ Indica que usarás archivos .feature y .cy.js
    specPattern: [
      "cypress/e2e/**/*.feature",
      "cypress/e2e/**/*.cy.{js,ts}",
    ],

    // ✅ Dile a cucumber dónde buscar los steps
    cucumber: {
      stepDefinitions: "cypress/e2e/**/*.{steps.js,steps.ts}",
    },

    supportFile: "cypress/support/e2e.js",
    screenshotsFolder: "cypress/evidencias/screenshots",
    videosFolder: "cypress/evidencias/videos",
    video: true,
    screenshotOnRunFailure: true,
    viewportHeight: 1080,
    viewportWidth: 1920,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
