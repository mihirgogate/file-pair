'use babel';
var lib = require('./lib');


export default {

  openPairedFile() {
    var currentBuffer = atom.workspace.getActivePaneItem().buffer;
    if (!currentBuffer || !currentBuffer.file || !currentBuffer.file.path) {
      atom.notifications.addError("Not a valid code file");
      return;
    }
    var currentFilePath = currentBuffer.file.path;
    var config = {
      suffixes: atom.config.get("file-pair.suffixes"),
      directoryReplacements: atom.config.get("file-pair.directoryReplacements")
    };
    lib.getPairedFilePath(currentFilePath, config, function(err, filePath){
      if(err) {
        atom.notifications.addError(err);
      } else {
        var panes = atom.workspace.getPanes();
        var activePane = atom.workspace.getActivePane();
        var allPaneIds = _getAllPaneIds(panes);
        var nextPaneId = lib.getNextPaneId(activePane.id, allPaneIds);
        var pairedPane = _getPairedPane(nextPaneId, panes, activePane);
        pairedPane.activate()
        atom.workspace.open(filePath);
      }
    });
  },

  activate(state) {
    atom.commands.add('atom-workspace', {
      'file-pair:open-paired-file': () => this.openPairedFile()
    });
  },

  deactivate() {
  },

  serialize() {
    return {};
  },

};

function _getPairedPane(nextPaneId, panes, activePane) {
    if (nextPaneId == null) {
      return activePane.splitRight();
    }
    for (var i = 0; i < panes.length; i++) {
      if (panes[i].id == nextPaneId) {
        return panes[i];
      }
    }
    throw Error("nextPaneId " + nextPaneId + " is not in the list of open panes");
}

function _getAllPaneIds(panes) {
  var allPaneIds = [];
  panes.forEach(function _getId(pane) { allPaneIds.push(pane.id) });
  return allPaneIds;
}
