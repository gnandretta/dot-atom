/** @babel */

import { configSet, usePackage } from "atom-use-package";
import { start } from "./auto-global-mru";

atom.config.set("core.themes", ["one-light-ui", "one-light-syntax"]);

configSet("core", {
  // disabledPackages: ["tabs"],
  allowPendingPaneItems: false,
  openEmptyEditorOnStart: false
});

configSet("tree-view", {
  showOnRightSide: true
});

configSet("welcome", {
  showOnStartup: false
});

usePackage("editorconfig");

usePackage("language-babel");
usePackage("language-scala");

start();
