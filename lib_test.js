var test = require('tape');
var lib = require('./lib');

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
