/** @babel */

const { isTextEditor } = atom.workspace;

const getPaths = pane => {
  const paths = [];
  pane.getItems().forEach(x => isTextEditor(x) && paths.push(x.getPath()));
  return paths;
};

const getActivePaths = exclude =>
  atom.workspace
    .getPanes()
    .filter(x => x !== exclude)
    .map(x => x.getActiveItem())
    .filter(isTextEditor)
    .map(x => x.getPath());

const getM = () => atom.workspace.getPanes()[0];

const getMItems = () => getM().getItems();

const isM = pane => pane === getM();

const doMostRecent = (p, f) => {
  const items = getM().itemStack;
  for (let i = items.length - 1; i >= 0; i--) {
    if (p(items[i])) {
      f(items[i]);
      return;
    }
  }
};

const getDocks = () => [
  atom.workspace.getLeftDock(),
  atom.workspace.getRightDock(),
  atom.workspace.getBottomDock()
];

const isInDock = item =>
  getDocks().some(dock => dock.getPaneItems().includes(item));

const handleDidAddPaneItem = ({ item, pane }) => {
  if (isInDock(item)) return;

  // When the item is added to the master pane, there's nothing to do.
  if (isM(pane)) return;

  // The item is added to another pane, grab the old item. A single item is
  // kept in another panes. Until this callback is run, there are two items at
  // most.
  const oldItem = pane.getItems().filter(x => x != item)[0];

  // If the old item is a text editor, and there is another text editor with the
  // same path, remove it and forget about it.
  const shouldRemoveOldItem =
    isTextEditor(oldItem) && getActivePaths(pane).includes(oldItem.getPath());

  if (shouldRemoveOldItem) {
    pane.removeItem(oldItem);
    return;
  }

  // If there is an old item, and we are still here move it back to the master
  // pane, and to the top of the stack.
  if (oldItem) {
    pane.moveItemToPane(oldItem, getM());
    getM().addItemToStack(oldItem);
  }

  // If the old item is a text editor, ensure there is no even older text
  // editors with the same path in the master pane.
  if (isTextEditor(oldItem)) {
    getMItems().forEach(
      x =>
        x != oldItem &&
        isTextEditor(x) &&
        x.getPath() === oldItem.getPath() &&
        getM().removeItem(x)
    );
  }
};

const handleWillDestroyPaneItem = ({ item, pane }) => {
  if (isInDock(item)) return;

  const m = getM();
  const mItemCount = getMItems().length;

  // If the item will be removed from the master pane we only need to activate
  // the most recent item when there are more than two (otherwise there is only
  // one thing to do: activate the last item or close the pane).
  if (m === pane && mItemCount > 2) {
    doMostRecent(x => x != item, x => m.setActiveItem(x));
    return;
  }

  // TODO: if the item will be removed from another pane, ensure that if it is
  // a text editor, text editors with the same path are removed from all panes.
  // NOT SURE ABOUT HOW THINGS WILL CASCADE THOUGH

  // if the item will be removed from another pane, and there are at least two
  // two items in the master pane, take most recent item (that is not currently
  // active) from it.
  if (m != pane && mItemCount > 1) {
    doMostRecent(x => x != m.getActiveItem(), x => m.moveItemToPane(x, pane));
    return;
  }
};

const handleDidChangeActivePane = pane =>
  handleDidAddPaneItem({ item: pane.getActiveItem(), pane });

export function start() {
  const disposables = [
    atom.workspace.onDidAddPaneItem(handleDidAddPaneItem),
    atom.workspace.onWillDestroyPaneItem(handleWillDestroyPaneItem),
    atom.workspace.onDidChangeActivePane(handleDidChangeActivePane)
  ];
  return () => disposables.forEach(x => x.dispose());
}
