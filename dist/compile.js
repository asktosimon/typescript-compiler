"use strict";
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
const path = __importStar(require("path"));
const ts = __importStar(require("typescript"));
const libs = {
    "es2015.d.ts": require("typescript/lib/lib.es2015.d.ts"),
    "dom.d.ts": require("!raw-loader!typescript/lib/lib.dom.d.ts"),
    "lib.es5.d.ts": require("!raw-loader!typescript/lib/lib.es5.d.ts"),
    "lib.es2015.d.ts": require("!raw-loader!typescript/lib/lib.es2015.d.ts"),
    "lib.es2015.core.d.ts": require("!raw-loader!typescript/lib/lib.es2015.core.d.ts"),
    "lib.es2015.collection.d.ts": require("!raw-loader!typescript/lib/lib.es2015.collection.d.ts"),
    "lib.es2015.generator.d.ts": require("!raw-loader!typescript/lib/lib.es2015.generator.d.ts"),
    "lib.es2015.promise.d.ts": require("!raw-loader!typescript/lib/lib.es2015.promise.d.ts"),
    "lib.es2015.iterable.d.ts": require("!raw-loader!typescript/lib/lib.es2015.iterable.d.ts"),
    "lib.es2015.proxy.d.ts": require("!raw-loader!typescript/lib/lib.es2015.proxy.d.ts"),
    "lib.es2015.reflect.d.ts": require("!raw-loader!typescript/lib/lib.es2015.reflect.d.ts"),
    "lib.es2015.symbol.d.ts": require("!raw-loader!typescript/lib/lib.es2015.symbol.d.ts"),
    "lib.decorators.d.ts": require("!raw-loader!typescript/lib/lib.decorators.d.ts"),
    "lib.decorators.legacy.d.ts": require("!raw-loader!typescript/lib/lib.decorators.legacy.d.ts"),
    "lib.es2015.symbol.wellknown.d.ts": require("!raw-loader!typescript/lib/lib.es2015.symbol.wellknown.d.ts"),
};
const compilerOptions = {
    ...ts.getDefaultCompilerOptions(),
    //   jsx: ts.JsxEmit.React,
    strict: false,
    target: ts.ScriptTarget.ES2015,
    esModuleInterop: true,
    module: ts.ModuleKind.None,
    suppressOutputPathCheck: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.Node16,
};
function createCompilerHost(options, sourceText, moduleSearchLocations) {
    function fileExists(fileName) {
        return ts.sys.fileExists(fileName);
    }
    function readFile(fileName) {
        return ts.sys.readFile(fileName);
    }
    function getSourceFile(fileName, languageVersion) {
        const sourceText2 = ts.sys.readFile(fileName);
        if (Object.keys(libs).find((x) => x === fileName)) {
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
        const resolvedModules = [];
        for (const moduleName of moduleNames) {
            // try to use standard resolution
            const result = ts.resolveModuleName(moduleName, containingFile, options, {
                fileExists,
                readFile,
            });
            if (result.resolvedModule) {
                resolvedModules.push(result.resolvedModule);
            }
            else {
                // check fallback locations, for simplicity assume that module at location
                // should be represented by '.d.ts' file
                for (const location of moduleSearchLocations) {
                    const modulePath = path.join(location, `${moduleName}.d.ts`);
                    if (fileExists(modulePath)) {
                        resolvedModules.push({ resolvedFileName: modulePath });
                    }
                }
            }
        }
        return resolvedModules;
    }
    return {
        getSourceFile,
        getDefaultLibFileName: () => "lib.es2015.d.ts",
        writeFile: (fileName, content) => {
            console.log(fileName, content);
        },
        getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
        getDirectories: (pathd) => ts.sys.getDirectories(pathd),
        getCanonicalFileName: (fileName) => ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
        getNewLine: () => ts.sys.newLine,
        useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
        fileExists,
        readFile,
        resolveModuleNames,
    };
}
function compile(code) {
    const host = createCompilerHost(compilerOptions, code, []);
    const program = ts.createProgram(["text.ts"], { target: ts.ScriptTarget.ES2015 }, host);
    const emitResult = program.emit();
    const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);
    allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
            const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });
}
exports.default = compile;
