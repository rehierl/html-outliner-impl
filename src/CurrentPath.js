
"use strict";

const assert = require("assert");
const format = require("util").format;

const err = require("./errorMessages.js");

/* must appear below module.exports (cyclic require statements)
//- TODO - this could change with ES6 modules
const CNodeProxy = require("./NodeProxy.js");
//*/

module.exports = class CCurrentPath {
//========//========//========//========//========//========//========//========

constructor() {
  assert((arguments.length === 0), err.DEVEL);

//public:

  //- void push(CNodeProxy node)
  //- void pop(CNodeProxy node)
  //- bool isEmpty { get; }
  
  //- String currentPath { get; }
  //- void toString()

//private:

  //- Array _path
  //- the internal buffer
  this._path = [];

//- "remember the result" variables
//private, temporary:

  //- String _currentPath
  //- a string representation of the current path
  this._currentPath = undefined;
}

//========//========//========//========//========//========//========//========
//- void push(CNodeProxy node)

push(node) {
  assert((arguments.length === 1), err.DEVEL);
  assert((node instanceof CNodeProxy), err.DEVEL);
  assert(node.isDomNode, err.DEVEL);
  this._path.push(node);
  this._currentPath = undefined;
}

//========//========//========//========//========//========//========//========
//- void pop(CNodeProxy node)

pop(node) {
  assert((arguments.length === 1), err.DEVEL);
  assert((node instanceof CNodeProxy), err.DEVEL);
  
  let len = this._path.length;
  assert((len > 0), err.DEVEL);
  
  let tos = this._path[len-1];
  assert((tos === node), err.DEVEL);
  
  tos = this._path.pop();
  this._currentPath = undefined;
}

//========//========//========//========//========//========//========//========
//- bool isEmpty { get; }

get isEmpty() {
  return (this._path.length === 0);
}

//========//========//========//========//========//========//========//========
//- String currentPath { get; }

get currentPath() {
  if(this._currentPath === undefined) {
    let ic = this._path.length;
    
    if(ic === 0) {
      this._currentPath = "empty path";
      return this._currentPath;
    }
    
    let path = [];
    
    for(let ix=0, ic=this._path.length; ix<ic; ix++) {
      let node = this._path[ix];
      let part = node.nodeName;
      
      if(node.isHC) {
        part = format("%s:%s", part, node.textContent);
      }
      
      path.push(part);
    }
    
    path = path.join(" / ");
    this._currentPath = path;
  }
  return this._currentPath;
}

//========//========//========//========//========//========//========//========
//- void toString()

toString() {
  return this._currentPath;
}

//========//========//========//========//========//========//========//========
};//- module.exports

//* must appear below module.exports (cyclic require statements)
const CNodeProxy = require("./NodeProxy.js");
//*/