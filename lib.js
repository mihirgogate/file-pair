var path = require('path');
var fs = require('fs');

module.exports = {
  getPairedFilePath: function(filePath, config, cb) {

    var candidates = [];

    if (config.suffixes) {
      config.suffixes.forEach(function check(suffix){
        var cans = getCandidatesForSuffixRule(
          filePath, suffix);
        if (cans) {
          candidates = candidates.concat(cans);
        }
      });
    }

    if (config.directoryReplacements) {
      config.directoryReplacements.forEach(function check(dirReplacement){
        var cans = getCandidatesForDirectoryReplacementRule(
          filePath, dirReplacement);
        if (cans) {
          candidates = candidates.concat(cans);
        }
      });
    }

    if (candidates.length > 0) {
      for(var i = 0; i < candidates.length; i++) {
        if (fs.existsSync(candidates[i])) {
          return cb(null, candidates[i]);
        }
      }
    }

    return cb("No pair files found. Following candidates considered - {candidates}".replace("{candidates}", JSON.stringify(candidates))
    );
  }
};

function getCandidatesForDirectoryReplacementRule(filePath, directoryReplacement) {
  if (!filePath || !directoryReplacement) {
    return null;
  }

  var directoryReplacementParts = directoryReplacement.split(':');
  if (directoryReplacementParts.length != 2) {
    return null;
  }


  var originalDirectory = directoryReplacementParts[0];
  var replacementDirectory = directoryReplacementParts[1];
  if (!originalDirectory || !replacementDirectory) {
    return null;
  }

  var candidates = [];
  var pairedFile = filePath.replace(
    originalDirectory, replacementDirectory);
  if (pairedFile !== filePath) {
    candidates.push(pairedFile);
  }
  return candidates;
}


function getCandidatesForSuffixRule(filePath, suffix) {
  if (!suffix || !filePath) {
    return null;
  }
  var candidates = [];

  var filePathParts = filePath.split(path.sep);
  var fileNameWithExtension = filePathParts[filePathParts.length - 1];
  var fileName = fileNameWithExtension.split('.')[0];

  var fullFileNameWithSuffix = _replaceFileName(
    filePath, fileName + suffix);

  candidates.push(fullFileNameWithSuffix);

  if (!_endsWith(fileName, suffix)) {
    return candidates;
  }

  var fileNameWithoutSuffix = fileName.substr(
    0, fileName.length - suffix.length);
  var fullFileNameWithoutSuffix = _replaceFileName(
    filePath, fileNameWithoutSuffix);

  candidates.push(fullFileNameWithoutSuffix);

  return candidates;
}

function _endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

function _replaceFileName(fullFilePath, newFileName) {
  var filePathParts = fullFilePath.split(path.sep);
  var fileNameWithExtension = filePathParts[filePathParts.length - 1];

  var fileName = fileNameWithExtension.split('.')[0];
  var extension = fileNameWithExtension.split('.')[1];

  var pairedFileName = newFileName + '.' + extension;
  var pairedFilePathParts = filePathParts.slice();
  pairedFilePathParts[pairedFilePathParts.length - 1] = pairedFileName;
  var fullPairedFileName = pairedFilePathParts.join(path.sep);
  return fullPairedFileName;
}
