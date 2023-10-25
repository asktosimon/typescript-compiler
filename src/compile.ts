import path from "path";
import ts from "typescript";

const fs = require("fs");

const libs = {
  "es2015.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.d.ts",
    "utf8"
  ),
  "dom.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.dom.d.ts",
    "utf8"
  ),
  "lib.es5.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es5.d.ts",
    "utf8"
  ),
  "lib.es2015.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.d.ts",
    "utf8"
  ),
  "lib.es2015.core.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.core.d.ts",
    "utf8"
  ),
  "lib.es2015.collection.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.collection.d.ts",
    "utf8"
  ),
  "lib.es2015.generator.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.generator.d.ts",
    "utf8"
  ),
  "lib.es2015.promise.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.promise.d.ts",
    "utf8"
  ),
  "lib.es2015.iterable.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.iterable.d.ts",
    "utf8"
  ),
  "lib.es2015.proxy.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.proxy.d.ts",
    "utf8"
  ),
  "lib.es2015.reflect.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.reflect.d.ts",
    "utf8"
  ),
  "lib.es2015.symbol.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.symbol.d.ts",
    "utf8"
  ),
  "lib.decorators.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.decorators.d.ts",
    "utf8"
  ),
  "lib.decorators.legacy.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.decorators.legacy.d.ts",
    "utf8"
  ),
  "lib.es2015.symbol.wellknown.d.ts": fs.readFileSync(
    "node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts",
    "utf8"
  ),
};

const compilerOptions: ts.CompilerOptions = {
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

function createCompilerHost(
  options: ts.CompilerOptions,
  sourceText: string,
  moduleSearchLocations: string[],
  writeFileCallback: (fileName: string, text: string) => void
): ts.CompilerHost {
  function fileExists(fileName: string): boolean {
    return ts.sys.fileExists(fileName);
  }

  function readFile(fileName: string): string | undefined {
    return ts.sys.readFile(fileName);
  }

  function getSourceFile(fileName: string, languageVersion: ts.ScriptTarget) {
    const sourceText2 = ts.sys.readFile(fileName);
    if (Object.keys(libs).find((x) => x === fileName)) {
      // @ts-ignore
      return ts.createSourceFile(
        fileName,
        // @ts-ignore
        libs[fileName],
        languageVersion
      );
    }

    return sourceText2
      ? ts.createSourceFile(fileName, sourceText2, languageVersion)
      : ts.createSourceFile(fileName, sourceText, languageVersion);
  }

  function resolveModuleNames(
    moduleNames: string[],
    containingFile: string
  ): ts.ResolvedModule[] {
    const resolvedModules: ts.ResolvedModule[] = [];
    for (const moduleName of moduleNames) {
      // try to use standard resolution
      const result = ts.resolveModuleName(moduleName, containingFile, options, {
        fileExists,
        readFile,
      });
      if (result.resolvedModule) {
        resolvedModules.push(result.resolvedModule);
      } else {
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
    writeFile: writeFileCallback,
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getDirectories: (pathd) => ts.sys.getDirectories(pathd),
    getCanonicalFileName: (fileName) =>
      ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
    getNewLine: () => ts.sys.newLine,
    useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
    fileExists,
    readFile,
    resolveModuleNames,
  };
}

export default function compile(code: string): {
  diagnosticMessages: string[];
  result: Record<string, string>;
} {
  const host = createCompilerHost(
    compilerOptions,
    code,
    [],
    (fileName, text) => {
      result[fileName] = text;
    }
  );

  const result: Record<string, string> = {};

  const program = ts.createProgram(
    ["text.ts"],
    { target: ts.ScriptTarget.ES2015 },
    host
  );
  const emitResult = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  const diagnosticMessages = allDiagnostics.map((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      return `${diagnostic.file.fileName} (${line + 1},${
        character + 1
      }): ${message}`;
    } else {
      return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    }
  });

  return {
    diagnosticMessages,
    result,
  };
}
