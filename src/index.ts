// export { default as sum } from "./sum";
import { default as compile } from "./compile";

compile('type Person = { name: string; }const person: Person = {name: 23}')