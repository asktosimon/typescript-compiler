import * as b from "node:path";
import e from "typescript";
const C = (i) => i, g = {
  "es2015.d.ts": require("!raw-loader!typescript/lib/lib.es2015.d.ts"),
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
  "lib.es2015.symbol.wellknown.d.ts": require("!raw-loader!typescript/lib/lib.es2015.symbol.wellknown.d.ts")
}, q = {
  ...e.getDefaultCompilerOptions(),
  //   jsx: ts.JsxEmit.React,
  strict: !1,
  target: e.ScriptTarget.ES2015,
  esModuleInterop: !0,
  module: e.ModuleKind.None,
  suppressOutputPathCheck: !0,
  skipLibCheck: !0,
  skipDefaultLibCheck: !0,
  moduleResolution: e.ModuleResolutionKind.Node16
};
function y(i, c, n) {
  function l(t) {
    return e.sys.fileExists(t);
  }
  function a(t) {
    return e.sys.readFile(t);
  }
  function r(t, s) {
    const o = e.sys.readFile(t);
    return Object.keys(g).find((u) => u === t) ? e.createSourceFile(
      t,
      // @ts-ignore
      g[t].default,
      s
    ) : o ? e.createSourceFile(t, o, s) : e.createSourceFile(t, c, s);
  }
  function d(t, s) {
    const o = [];
    for (const u of t) {
      const m = e.resolveModuleName(u, s, i, {
        fileExists: l,
        readFile: a
      });
      if (m.resolvedModule)
        o.push(m.resolvedModule);
      else
        for (const p of n) {
          const f = b.join(p, `${u}.d.ts`);
          l(f) && o.push({ resolvedFileName: f });
        }
    }
    return o;
  }
  return {
    getSourceFile: r,
    getDefaultLibFileName: () => "lib.es2015.d.ts",
    writeFile: (t, s) => {
      console.log(t, s);
    },
    getCurrentDirectory: () => e.sys.getCurrentDirectory(),
    getDirectories: (t) => e.sys.getDirectories(t),
    getCanonicalFileName: (t) => e.sys.useCaseSensitiveFileNames ? t : t.toLowerCase(),
    getNewLine: () => e.sys.newLine,
    useCaseSensitiveFileNames: () => e.sys.useCaseSensitiveFileNames,
    fileExists: l,
    readFile: a,
    resolveModuleNames: d
  };
}
function h(i) {
  const c = y(q, i, []), n = e.createProgram(
    ["text.ts"],
    { target: e.ScriptTarget.ES2015 },
    c
  ), l = n.emit();
  e.getPreEmitDiagnostics(n).concat(l.diagnostics).forEach((r) => {
    if (r.file) {
      const { line: d, character: t } = e.getLineAndCharacterOfPosition(
        r.file,
        r.start
      ), s = e.flattenDiagnosticMessageText(
        r.messageText,
        `
`
      );
      console.log(
        `${r.file.fileName} (${d + 1},${t + 1}): ${s}`
      );
    } else
      console.log(
        e.flattenDiagnosticMessageText(r.messageText, `
`)
      );
  });
}
export {
  h as compile,
  C as sum
};
