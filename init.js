/** @babel */

import { configSet, usePackage } from "atom-use-package";
import { start } from "./auto-global-mru";

configSet("core", {
  allowPendingPaneItems: false,
  closeDeletedFileTabs: true,
  openEmptyEditorOnStart: false,
  titleBar: "custom"
});

configSet("editor", {
  atomicSoftTabs: false,
  fontFamily: "Iosevka",
  showInvisibles: true,
  showLineNumbers: false
});

configSet("tree-view", {
  showOnRightSide: true
});

configSet("welcome", {
  showOnStartup: false
});

usePackage("tone-syntax");
usePackage("editorconfig");

usePackage("goto");

usePackage("language-babel");
usePackage("prettier-atom");
usePackage("language-scala");
usePackage("language-elm");

const findNextTheme = (list, current) => {
  const currentIndex = list.findIndex(
    x => x[0] === current[0] && x[1] === current[1]
  );
  return list[(currentIndex + 1) % list.length];
};

const THEMES = [
  ["one-light-ui", "one-light-syntax"],
  ["one-dark-ui", "tone-syntax"]
];

atom.commands.add(".platform-darwin", "mine:cycle-themes", () => {
  atom.config.set(
    "core.themes",
    findNextTheme(THEMES, atom.config.get("core.themes"))
  );
});

start();
