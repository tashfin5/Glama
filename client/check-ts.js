const ts = require('typescript');
const fs = require('fs');
const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedCommandLine = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');
const program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
const diagnostics = ts.getPreEmitDiagnostics(program);
const configDiagnostics = diagnostics.filter(d => d.file && d.file.fileName.endsWith('tsconfig.json') || !d.file);
configDiagnostics.forEach(d => {
  console.log(ts.flattenDiagnosticMessageText(d.messageText, '\n'));
});
if (configDiagnostics.length === 0) console.log("No config errors found by TS API.");
