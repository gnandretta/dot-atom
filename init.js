"use babel";

import {configSet, usePackage} from 'atom-use-package';

atom.config.set("core.themes", ["one-light-ui", "one-light-syntax"]);

configSet("core", {
  // disabledPackages: ["tabs"],
  openEmptyEditorOnStart: false
});

configSet("tree-view", {
  alwaysOpenExisting: true,
  showOnRightSide: true,
  squashDirectoryNames: true
});

configSet("welcome", {
  showOnStartup: false
});

usePackage("editorconfig");

usePackage("language-babel");
usePackage("language-scala");
