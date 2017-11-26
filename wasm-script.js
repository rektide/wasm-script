import { decode as decodeB64} from "base64-arraybuffer"
import globalObject from "global-object"
import objectAssignAll from "object-assign-all"
import contextRunner from "context-runner"

export function fetchBytes( src){
	if( !src){
		return Promise.reject()
	}
	if( src.slice( 0, 5)=== "data:"){
		return decodeB64( src.slice( 5))
	}
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
		//this.fetch= fetch( src).then( response => response.arrayBuffer())
		//if( this.imports&& this.imports.then){
		//	this,imports.then( imports=> this.imports= imports)
		//}
		//this.module= this.fetch.then( bytes => WebAssembly.compile( bytes))
		//this.instance= this.module.then( module=> WebAssembly.instantiate( module))
		//this.exports= {}
		//this.instance.then( instance=> {
		//	objectAssignAll( this.exports, instance.exports)
		//})
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
