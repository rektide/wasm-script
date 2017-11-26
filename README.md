# Wasm Script

> Declarative WebAssembly Custom-Element

I would like to see a WebAssemblyModuleScriptElement, which is an instantiation of a module.

This Custom Element imagines what that might look like, allowing for a declarative instantiation of a module, and exposing the module & (optional) instantiation's properties via the DOM.

# Usage

A zero ceremony means of getting a WebAssembly module:

`<wasm-script id="my-wasm" src="/my.wasm" />`

This WebAssembly instance can then be used via the DOM:

```
// CustomElement's must be registered
import wasmScript from "wasm-script/register"

// ...

// call the WebAssembly Module's `my_func` export:
document.getElement("#my-wasm").exports.my_func() // DOM exposes instance/method/imports/exports properties
```
