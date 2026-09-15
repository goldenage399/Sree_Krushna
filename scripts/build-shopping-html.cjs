/**
 * Static Decoupled Component Assembler (SDCA) Delegator — Shopping Registry
 * Standard ID: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-019
 * 
 * Thin delegator invoking modular SDCA assembler in shopping_src/
 * Preserves 100% backward compatibility with npm run build:shopping.
 */

require('../shopping_src/build.cjs');
