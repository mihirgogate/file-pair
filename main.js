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
        var activePane = atom.workspace.getActivePane();
        var splitPane = activePane.splitRight();
        atom.workspace.open(filePath);
        splitPane.activate()
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
