
"use strict";

const assert = require("assert");
const err = require("./errorMessages.js");
const isObjectInstance = require("./isObjectInstance.js");

module.exports = class COptions {
//========//========//========//========//========//========//========//========
//- properties/methods overview

//public:

  //- new COptions()
  //- bool isDefault { get; }

  //- string selector { get; }
  //- bool maintainPath { get; }
  //- bool usePerformanceShortcuts { get; }
  //- bool verifyInvariants { get; }
  //- bool ignoreHiddenAttributes { get; }
  //- bool ignoreInnerSRs { get; }
  //- bool allowDomEdits { get; }
  
  //- RegExp rxSR { get; }
  //- RegExp rxSC { get; }
  //- RegExp rxHC { get; }
  
  //- void combine(Object optionsArg)

//========//========//========//========//========//========//========//========
//- new COptions()

constructor() {
  assert((arguments.length === 0), err.DEVEL);

//private:

  //- bool _isDefault
  //- a flag to indicate that all options have default values
  this._isDefault = true;
  
  //- string _selector
  //- a CSS selector to use on the supplied starting node
  //- won't be used if empty (""), must be valid CSS syntax if non-empty
  //- body.querySelector("body") won't find anything because body isn't a
  //  descendant element of body - querySelector() will only find descendants
  this._selector = "";
  
  //- bool _maintainPath
  //- allows to maintain a path of nodes from the root to the current node
  //- set to maintain a path for debugging purposes
  this._maintainPath = true;
  
  //- bool _usePerformanceShortcuts
  //- set to use performance shortcuts
  this._usePerformanceShortcuts = false;
  
  //- bool _verifyInvariants
  //- set to verify all invariants
  //- false = trust that the outliner works perfectly
  this._verifyInvariants = true;
  
  //- bool _ignoreHiddenAttributes
  //- set to ignore elements that have the hidden attribute set;
  //  i.e. this will also ignore all of their child nodes/elements
  //- false = ignore all hidden attributes; i.e. this will treat all
  //  elements and all of their child nodes/elements as being visible
  this._ignoreHiddenAttributes = false;
  
  //- bool _ignoreInnerSRs
  //- set to ignore inner sectioning root (SR) elements
  //- false = also create outlines for these inner SRs
  //- the word "inner" is relative to the starting node. it will be processed,
  //  even if it is an inner SR, but not if it has the hidden attribute set
  this._ignoreInnerSRs = false;
  
  //- RegExp _rxSR
  //- a regular expression used to classify an element
  //  as sectioning root (SR) element
  //- dom will return a node's name/tag in uppercase letters; use /^(...)$/i
  //- for an options argument use "^(...)$";
  //  the ignoreCase flag (i) will be assigned automatically
  this._rxSR = /^(blockquote|body|details|dialog|fieldset|figure|td)$/i;
  
  //- RegExp _rxSC
  //- a regular expression used to classify an element
  //  as sectioning content (SC) element
  //- dom will return a node's name/tag in uppercase letters; use /^(...)$/i
  //- for an options argument use "^(...)$";
  //  the ignoreCase flag (i) will be assigned automatically
  this._rxSC = /^(article|aside|nav|section)$/i;
  
  //- RegExp _rxHC
  //- a regular expression used to classify an element
  //  as heading content (HC) element
  //- allows to ignore standard heading elements; e.g. /^(h[1-4])$/i
  //- allows to use non-standard heading elements; e.g. /^(h|h[1-6])$/i
  //- non-standard heading elements will be associated with
  //  the highest rank; i.e. treated as <h1> elements
  //- dom will return a node's name/tag in uppercase letters; use /^(...)$/i
  //- for an options argument use "^(...)$";
  //  the ignoreCase flag (i) will be assigned automatically
  this._rxHC = /^(h[1-6])$/i;
  
  //- bool _allowDomEdits
  //- set to allow modifications to the dom tree
  //- false = disallow any modifications whatsoever
  this._allowDomEdits = true;
}

//========//========//========//========//========//========//========//========
//- bool isDefault { get; }

get isDefault() {
  return this._isDefault;
}

//========//========//========//========//========//========//========//========
//- string selector { get; }

get selector() {
  return this._selector;
}

//========//========//========//========//========//========//========//========
//- bool maintainPath { get; }

get maintainPath() {
  return this._maintainPath;
}

//========//========//========//========//========//========//========//========
//- bool usePerformanceShortcuts { get; }

get usePerformanceShortcuts() {
  return this._usePerformanceShortcuts;
}

//========//========//========//========//========//========//========//========
//- bool verifyInvariants { get; }

get verifyInvariants() {
  return this._verifyInvariants;
}

//========//========//========//========//========//========//========//========
//- bool ignoreHiddenAttributes { get; }

get ignoreHiddenAttributes() {
  return this._ignoreHiddenAttributes;
}

//========//========//========//========//========//========//========//========
//- bool ignoreInnerSRs { get; }

get ignoreInnerSRs() {
  return this._ignoreInnerSRs;
}

//========//========//========//========//========//========//========//========
//- RegExp rxSR { get; }

get rxSR() {
  return this._rxSR;
}

//========//========//========//========//========//========//========//========
//- RegExp rxSC { get; }

get rxSC() {
  return this._rxSC;
}

//========//========//========//========//========//========//========//========
//- RegExp rxHC { get; }

get rxHC() {
  return this._rxHC;
}

//========//========//========//========//========//========//========//========
//- bool allowDomEdits { get; }

get allowDomEdits () {
  return this._allowDomEdits;
}

//========//========//========//========//========//========//========//========
//- void combine(Object optionsArg)

combine(optionsArg) {
  assert(isObjectInstance(optionsArg), err.INVALID_OPTIONS);
  
  function isBool(name, value) {
    return { isValid: (typeof value === "boolean"), value: value };
  }
  
  function isString(name, value) {
    return { isValid: (typeof value === "string"), value: value };
  }

  function isRegExp(name, value) {
    if(value instanceof RegExp) {
      return { isValid: true, value: value};
    }
    if(typeof value === "string") {
      try {
        //- verify the regular expression
        //  i.e. SyntaxError if invalid
        let rx = new RegExp(value, "i");
        //rx.test("");//- necessary?
        return { isValid: true, value: rx };
      } catch(error) {
        return { isValid: false, value: null };
      }
    }
    return { isValid: false, value: null };
  }
  
  let optionsMap = {
    //isDefault: not-allowed
    selector: isString,
    maintainPath: isBool,
    usePerformanceShortcuts: isBool,
    verifyInvariants: isBool,
    ignoreHiddenAttributes: isBool,
    ignoreInnerSRs: isBool,
    rxSR: isRegExp,
    rxSC: isRegExp,
    rxHC: isRegExp,
    allowDomEdits: isBool
  };
  
  let names = Object.getOwnPropertyNames(optionsArg);
  let ic = names.length;
  let valuesMap = {};
  
  //- validate optionsArg's values
  
  for(let ix=0; ix<ic; ix++) {
    let name = names[ix];
    let value = optionsArg[name];
    let handler = optionsMap[name];
    
    //- unknown/invalid option/setting
    assert((handler !== undefined), err.INVALID_OPTIONS);
    
    //- option/setting has an invalid value
    let result = handler(name, value);
    assert((result.isValid === true), err.INVALID_OPTIONS);
    
    //- keep the converted/canonical value
    valuesMap[name] = result.value;
  }
  
  //- use those values, if all is fine
  
  for(let ix=0; ix<ic; ix++) {
    let name = names[ix];
    let newValue = valuesMap[name];
    
    name = "_" + name;
    let oldValue = this[name];
    if(newValue === oldValue) continue;

    this[name] = newValue;
    this._isDefault = false;
  }
}

//========//========//========//========//========//========//========//========
};//- module.exports
