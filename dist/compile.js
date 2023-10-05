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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var ts = __importStar(require("typescript"));
var libs = {
    "es2015.d.ts": require("typescript/lib/lib.es2015.d.ts"),
    "dom.d.ts": require("typescript/lib/lib.dom.d.ts"),
    "lib.es5.d.ts": require("typescript/lib/lib.es5.d.ts"),
    "lib.es2015.d.ts": require("typescript/lib/lib.es2015.d.ts"),
    "lib.es2015.core.d.ts": require("typescript/lib/lib.es2015.core.d.ts"),
    "lib.es2015.collection.d.ts": require("typescript/lib/lib.es2015.collection.d.ts"),
    "lib.es2015.generator.d.ts": require("typescript/lib/lib.es2015.generator.d.ts"),
    "lib.es2015.promise.d.ts": require("typescript/lib/lib.es2015.promise.d.ts"),
    "lib.es2015.iterable.d.ts": require("typescript/lib/lib.es2015.iterable.d.ts"),
    "lib.es2015.proxy.d.ts": require("typescript/lib/lib.es2015.proxy.d.ts"),
    "lib.es2015.reflect.d.ts": require("typescript/lib/lib.es2015.reflect.d.ts"),
    "lib.es2015.symbol.d.ts": require("typescript/lib/lib.es2015.symbol.d.ts"),
    "lib.decorators.d.ts": require("typescript/lib/lib.decorators.d.ts"),
    "lib.decorators.legacy.d.ts": require("typescript/lib/lib.decorators.legacy.d.ts"),
    "lib.es2015.symbol.wellknown.d.ts": require("typescript/lib/lib.es2015.symbol.wellknown.d.ts"),
};
var compilerOptions = __assign(__assign({}, ts.getDefaultCompilerOptions()), { 
    //   jsx: ts.JsxEmit.React,
    strict: false, target: ts.ScriptTarget.ES2015, esModuleInterop: true, module: ts.ModuleKind.None, suppressOutputPathCheck: true, skipLibCheck: true, skipDefaultLibCheck: true, moduleResolution: ts.ModuleResolutionKind.Node16 });
function createCompilerHost(options, sourceText, moduleSearchLocations) {
    function fileExists(fileName) {
        return ts.sys.fileExists(fileName);
    }
    function readFile(fileName) {
        return ts.sys.readFile(fileName);
    }
    function getSourceFile(fileName, languageVersion) {
        var sourceText2 = ts.sys.readFile(fileName);
        if (Object.keys(libs).find(function (x) { return x === fileName; })) {
            // @ts-ignore
            return ts.createSourceFile(fileName, 
            // @ts-ignore
            libs[fileName].default, languageVersion);
        }
        return sourceText2
            ? ts.createSourceFile(fileName, sourceText2, languageVersion)
            : ts.createSourceFile(fileName, sourceText, languageVersion);
    }
    function resolveModuleNames(moduleNames, containingFile) {
        var resolvedModules = [];
        for (var _i = 0, moduleNames_1 = moduleNames; _i < moduleNames_1.length; _i++) {
            var moduleName = moduleNames_1[_i];
            // try to use standard resolution
            var result = ts.resolveModuleName(moduleName, containingFile, options, {
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
                    var modulePath = path.join(location_1, "".concat(moduleName, ".d.ts"));
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
        writeFile: function (fileName, content) {
            console.log(fileName, content);
        },
        getCurrentDirectory: function () { return ts.sys.getCurrentDirectory(); },
        getDirectories: function (pathd) { return ts.sys.getDirectories(pathd); },
        getCanonicalFileName: function (fileName) {
            return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
        },
        getNewLine: function () { return ts.sys.newLine; },
        useCaseSensitiveFileNames: function () { return ts.sys.useCaseSensitiveFileNames; },
        fileExists: fileExists,
        readFile: readFile,
        resolveModuleNames: resolveModuleNames,
    };
}
function compile(code) {
    var host = createCompilerHost(compilerOptions, code, []);
    var program = ts.createProgram(["text.ts"], { target: ts.ScriptTarget.ES2015 }, host);
    var emitResult = program.emit();
    var allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);
    allDiagnostics.forEach(function (diagnostic) {
        if (diagnostic.file) {
            var _a = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start), line = _a.line, character = _a.character;
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.log("".concat(diagnostic.file.fileName, " (").concat(line + 1, ",").concat(character + 1, "): ").concat(message));
        }
        else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });
}
exports.default = compile;
