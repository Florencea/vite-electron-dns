import type { Configuration } from "electron-builder";
import { APP_CONFIG } from "./src/shared/config";

const config = {
  appId: APP_CONFIG.appId,
  productName: APP_CONFIG.title,
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
  publish: null,
} satisfies Configuration;

export default config;
