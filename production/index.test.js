"use strict";var _extends2=require("babel-runtime/helpers/extends"),_extends3=_interopRequireDefault(_extends2),_index=require("./index"),_index2=_interopRequireDefault(_index);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}/*
 *
 * Setup.
 *
 */var wrapper=new _index2.default({called:"test"});wrapper.add({update:function update(a,b){return(0,_extends3.default)({},a,b)}}),test("instantiate",function(){expect(wrapper).toBeDefined()}),test("correct type export",function(){expect(wrapper.types().update).toMatch(/TEST_UPDATE/)});