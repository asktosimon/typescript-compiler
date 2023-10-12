"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export { default as sum } from "./sum";
var compile_1 = __importDefault(require("./compile"));
(0, compile_1.default)('type Person = { name: string; }const person: Person = {name: 23}');
