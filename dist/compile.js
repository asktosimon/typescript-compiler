"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var typescript_1 = __importDefault(require("typescript"));
var fs = require("fs");
var libs = {
    "es2015.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.d.ts", "utf8"),
    "dom.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.dom.d.ts", "utf8"),
    "lib.es5.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es5.d.ts", "utf8"),
    "lib.es2015.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.d.ts", "utf8"),
    "lib.es2015.core.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.core.d.ts", "utf8"),
    "lib.es2015.collection.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.collection.d.ts", "utf8"),
    "lib.es2015.generator.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.generator.d.ts", "utf8"),
    "lib.es2015.promise.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.promise.d.ts", "utf8"),
    "lib.es2015.iterable.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.iterable.d.ts", "utf8"),
    "lib.es2015.proxy.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.proxy.d.ts", "utf8"),
    "lib.es2015.reflect.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.reflect.d.ts", "utf8"),
    "lib.es2015.symbol.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.symbol.d.ts", "utf8"),
    "lib.decorators.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.decorators.d.ts", "utf8"),
    "lib.decorators.legacy.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.decorators.legacy.d.ts", "utf8"),
    "lib.es2015.symbol.wellknown.d.ts": fs.readFileSync("node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts", "utf8"),
};
var compilerOptions = __assign(__assign({}, typescript_1.default.getDefaultCompilerOptions()), { 
    //   jsx: ts.JsxEmit.React,
    strict: false, target: typescript_1.default.ScriptTarget.ES2015, esModuleInterop: true, module: typescript_1.default.ModuleKind.None, suppressOutputPathCheck: true, skipLibCheck: true, skipDefaultLibCheck: true, moduleResolution: typescript_1.default.ModuleResolutionKind.Node16 });
function createCompilerHost(options, sourceText, moduleSearchLocations, writeFileCallback) {
    function fileExists(fileName) {
        return typescript_1.default.sys.fileExists(fileName);
    }
    function readFile(fileName) {
        return typescript_1.default.sys.readFile(fileName);
    }
    function getSourceFile(fileName, languageVersion) {
        var sourceText2 = typescript_1.default.sys.readFile(fileName);
        if (Object.keys(libs).find(function (x) { return x === fileName; })) {
            // @ts-ignore
            return typescript_1.default.createSourceFile(fileName, 
            // @ts-ignore
            libs[fileName], languageVersion);
        }
        return sourceText2
            ? typescript_1.default.createSourceFile(fileName, sourceText2, languageVersion)
            : typescript_1.default.createSourceFile(fileName, sourceText, languageVersion);
    }
    function resolveModuleNames(moduleNames, containingFile) {
        var resolvedModules = [];
        for (var _i = 0, moduleNames_1 = moduleNames; _i < moduleNames_1.length; _i++) {
            var moduleName = moduleNames_1[_i];
            // try to use standard resolution
            var result = typescript_1.default.resolveModuleName(moduleName, containingFile, options, {
                fileExists: fileExists,
                readFile: readFile,
            });
            if (result.resolvedModule) {
                resolvedModules.push(result.resolvedModule);
            }
            else {
                // check fallback locations, for simplicity assume that module at location
                // should be represented by '.d.ts' file
                for (var _a = 0, moduleSearchLocations_1 = moduleSearchLocations; _a < moduleSearchLocations_1.length; _a++) {
                    var location_1 = moduleSearchLocations_1[_a];
                    var modulePath = path_1.default.join(location_1, "".concat(moduleName, ".d.ts"));
                    if (fileExists(modulePath)) {
                        resolvedModules.push({ resolvedFileName: modulePath });
                    }
                }
            }
        }
        return resolvedModules;
    }
    return {
        getSourceFile: getSourceFile,
        getDefaultLibFileName: function () { return "lib.es2015.d.ts"; },
        writeFile: writeFileCallback,
        getCurrentDirectory: function () { return typescript_1.default.sys.getCurrentDirectory(); },
        getDirectories: function (pathd) { return typescript_1.default.sys.getDirectories(pathd); },
        getCanonicalFileName: function (fileName) {
            return typescript_1.default.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
        },
        getNewLine: function () { return typescript_1.default.sys.newLine; },
        useCaseSensitiveFileNames: function () { return typescript_1.default.sys.useCaseSensitiveFileNames; },
        fileExists: fileExists,
        readFile: readFile,
        resolveModuleNames: resolveModuleNames,
    };
}
function compile(code) {
    var host = createCompilerHost(compilerOptions, code, [], function (fileName, text) {
        result[fileName] = text;
    });
    var result = {};
    var program = typescript_1.default.createProgram(["text.ts"], { target: typescript_1.default.ScriptTarget.ES2015 }, host);
    var emitResult = program.emit();
    var allDiagnostics = typescript_1.default
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);
    var diagnosticMessages = allDiagnostics.map(function (diagnostic) {
        if (diagnostic.file) {
            var _a = typescript_1.default.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start), line = _a.line, character = _a.character;
            var message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            return "".concat(diagnostic.file.fileName, " (").concat(line + 1, ",").concat(character + 1, "): ").concat(message);
        }
        else {
            return typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        }
    });
    return {
        diagnosticMessages: diagnosticMessages,
        result: result,
    };
}
exports.default = compile;
