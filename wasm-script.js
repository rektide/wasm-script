import globalObject from "global-object"
import objectAssignAll from "object-assign-all"
import contextRunner from "context-runner"

export function fetchBytes( src){
	return fetch( src).then( response => response.arrayBuffer())
}

export class WasmScriptElement extends HTMLElement{
	static get observedAttributes(){ return [ "src"]}
	constructor(){
		super()
		this._resetState()
	}
	_resetState(){
		var src= this.getAttribute( "src")
		if( !src){
			return
		}
		return contextRunner( this, {
			defaults: {
				// these will all be created & assigned as properties
				bytes: self=> (self.fetchBytes|| fetchBytes)(src),
				module: self=> WebAssembly.compile( self.bytes),
				importObject: self=> self.importObject,
				instance: self=> WebAssembly.instantiate( self.module, self.importObject),
				exports: self=> self.instance.exports,
				customSections: self=> self.instance.customSections
			}
		})
	}
	attributeChangedCallback( attrName, oldVal, newVal){
		this._resetState()
	}
}
export var WasmScript= WasmScriptElement

export function register(){
	if( global){
		global.WasmScriptElement= WasmScriptElement
		global.WasmScript= WasmScriptElement
	}
	customElements.register( "wasm-script", WasmScriptElement)
}
