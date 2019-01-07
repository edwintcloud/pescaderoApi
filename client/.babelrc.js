const env = require("./env-config.js");

module.exports = {
  presets: ["@zeit/next-typescript/babel", "next/babel"],
  plugins: [["transform-define", env]]
};
