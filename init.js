"use babel";

import {configSet} from 'atom-use-package';

atom.config.set("core.themes", ["one-light-ui", "one-light-syntax"]);

configSet("core", {
  disabledPackages: ["tabs"],
  openEmptyEditorOnStart: false
});

configSet("welcome", {
  showOnStartup: false
});
