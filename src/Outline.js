
"use strict";

const assert = require("assert");
const format = require("util").format;

const err = require("./errorMessages.js");

/* must appear below module.exports (cyclic require statements)
//- TODO - this could change with ES6 modules
const COptions = require("./Options.js");
const CNodeProxy = require("./NodeProxy.js");
const CSection = require("./Section.js");
//*/

module.exports = class COutline {
//========//========//========//========//========//========//========//========
//- new COutline(COptions options, CNodeProxy owner)

constructor(options, node) {
  assert((arguments.length === 2), err.DEVEL);
  assert((options instanceof COptions), err.DEVEL);
  assert((node instanceof CNodeProxy), err.DEVEL);
  assert((node.isSR || node.isSC), err.INVARIANT);
  
  //- implicitly associate node with this outline
  node.innerOutline = this;

//public:

  //- COptions options { get; }

  //- CNodeProxy outlineOwner { get; }
  //- bool isImplicitOutline { get; }

  //- void addSection(CSection section)
  //- CSection lastSection { get; }
  //- CSection[] sections { get; }

//private:

  //- COptions options
  //- the options to use during the current run
  this._options = options;
  
  //- CNodeProxy _outlineOwner
  //- the outline's starting CNodeProxy object
  //- the node that triggered the creation of this outline
  //- a SR, or a SC element
  this._outlineOwner = node;
  
  //- CSection[] _sections
  //- the inner top-level sections of a SR or SC element
  this._sections = [];
}

//========//========//========//========//========//========//========//========
//- COptions options { get; }

get options() {
  return this._options;
}

//========//========//========//========//========//========//========//========
//- CNodeProxy outlineOwner { get; }

get outlineOwner() {
  return this._outlineOwner;
}

//========//========//========//========//========//========//========//========
//- bool isImplicitOutline { get; }

//- TODO - meant to help create an outline hierarchy
//- distinguish from outlines of inner SRs
get isImplicitOutline() {
  return this._outlineOwner.isSC;
}

//========//========//========//========//========//========//========//========
//- void addSection(CSection section)

addSection(section) {
  assert((arguments.length === 1), err.DEVEL);
  assert((section instanceof CSection), err.DEVEL);
  
  this._sections.push(section);
  section.parentOutline = this;
}

//========//========//========//========//========//========//========//========
//- CSection lastSection { get; }

get lastSection() {
  let len = this._sections.length;
  assert((len > 0), err.INVARIANT);
  return this._sections[len-1];
}

//========//========//========//========//========//========//========//========
//- CSection[] sections { get; }

get sections() {
  return this._sections;
}

//========//========//========//========//========//========//========//========
};//- module.exports

//* must appear below module.exports (cyclic require statements)
const COptions = require("./Options.js");
const CNodeProxy = require("./NodeProxy.js");
const CSection = require("./Section.js");
//*/
