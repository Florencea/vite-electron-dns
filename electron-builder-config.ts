import "dotenv/config";
import type { Configuration } from "electron-builder";

const config = {
  appId: process.env.VITE_APPID ?? "",
  productName: process.env.VITE_TITLE ?? "",
  directories: {
    output: "release",
  },
  files: ["dist/**/*", "build/icon.png"],
  nsis: {
    artifactName: "Install ${productName}.${ext}",
    createDesktopShortcut: "always",
    runAfterFinish: true,
    deleteAppDataOnUninstall: true,
  },
  mac: {
    target: "dmg",
    entitlementsInherit: "build/entitlements.mac.plist",
    notarize: false,
  },
  dmg: {
    artifactName: "${productName}.${ext}",
  },
  linux: {
    target: ["AppImage", "deb"],
    maintainer: "Florencea Bear",
    category: "Utility",
  },
  appImage: {
    artifactName: "${productName}.${ext}",
  },
  npmRebuild: false,
} satisfies Configuration;

export default config;
