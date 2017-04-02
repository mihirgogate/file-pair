var test = require('tape');
var lib = require('./lib');
var getNextPaneId = require('./lib').getNextPaneId;

test("it gets paired file path for code file", function t(assert){
    lib.getPairedFilePath(
      __dirname + "/lib.js",
      {
        suffixes: ["_test"]
      },
      function cb(err, filePath) {
        assert.ifErr(err);
        assert.equals(
            filePath, __dirname + "/lib_test.js"
        );
        assert.end();
      }
    );
});

test("it gets paired file path for test file", function t(assert){
    lib.getPairedFilePath(
      __dirname + "/lib_test.js",
      {
        suffixes: ["_test"]
      },
      function cb(err, filePath) {
        assert.ifErr(err);
        assert.equals(
            filePath, __dirname + "/lib.js"
        );
        assert.end();
      }
    );
});

test("it returns error if file does not exist", function t(assert){
    var config = {
        suffixes: ["-test"]
      };
    lib.getPairedFilePath(
      __dirname + "/does-not-exist.js",
      config,
      function cb(err, filePath) {
        assert.equals(err, "No pair files found. Following candidates considered - [\"" + __dirname + "/does-not-exist-test.js\"]");
        assert.end();
      }
    );
});

test("it returns paired file for test directory", function t(assert){
    lib.getPairedFilePath(
      __dirname + "/lib.js",
      {
        directoryReplacements: [
          __dirname + ":" + __dirname + "/test"
        ]
      },
      function cb(err, filePath) {
        assert.ifErr(err);
        assert.equals(
            filePath, __dirname + "/test/lib.js"
        );
        assert.end();
      }
    );
});

test("it does not return the same file if the original does not exist", function t(assert){
    lib.getPairedFilePath(
      __dirname + "/lib.js",
      {
        directoryReplacements: [
          "not-existing-directory:dont-care"
        ]
      },
      function cb(err, filePath) {
        assert.equals(err, "No pair files found. Following candidates considered - []");
        assert.end();
      }
    );
});

test("it returns error if test directory does not exist", function t(assert){
    var config = {
        directoryReplacements: [
          __dirname + ":" + __dirname + "/not-existing-directory"
        ]
    };
    lib.getPairedFilePath(
      __dirname + "/lib.js",
      config,
      function cb(err, filePath) {
        assert.equals(err, "No pair files found. Following candidates considered - [\"" + __dirname+ "/not-existing-directory/lib.js\"]");
        assert.end();
      }
    );
});

test("getNextPaneId() throws exception if input list is invalid", function t(assert){
    var currentPaneId = 1;
    var allPaneIds = "i am not a list";
    assert.throws(
      function() {
        var nextPaneId = getNextPaneId(currentPaneId, allPaneIds);
      },
      /allPaneIds should be a non zero length list","allPaneIds":"i am not a list/
    );
    assert.end();
});

test("getNextPaneId() returns null if only one pane", function t(assert){
    var currentPaneId = 1;
    var allPaneIds = [1];
    var nextPaneId = getNextPaneId(currentPaneId, allPaneIds);
    assert.equals(nextPaneId, null);
    assert.end();
});

test("getNextPaneId() loops around if pane is right most", function t(assert){
    var currentPaneId = 3;
    var allPaneIds = [1, 2, 3];
    var nextPaneId = getNextPaneId(currentPaneId, allPaneIds);
    assert.equals(nextPaneId, 1);
    assert.end();
});

test("getNextPaneId() returns the id of the pane to the right of the present pane", function t(assert){
    var currentPaneId = 2;
    var allPaneIds = [1, 2, 3];
    var nextPaneId = getNextPaneId(currentPaneId, allPaneIds);
    assert.equals(nextPaneId, 3);
    assert.end();
});

test("getNextPaneId() throws exception if current pane id not found in list of pane ids", function t(assert){
    var currentPaneId = 999;
    var allPaneIds = [1, 2, 3];
    assert.throws(
      function() {
        var nextPaneId = getNextPaneId(currentPaneId, allPaneIds);
      },
      /{"msg":"current pane id not found in list of all pane ids","currentPaneId":999,"allPaneIds":\[1,2,3\]}/
    );
    assert.end();
});
