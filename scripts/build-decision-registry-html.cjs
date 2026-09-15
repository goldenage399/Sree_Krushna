/**
 * Static Decoupled Component Assembler (SDCA) Delegator — Decision Registry
 * Standard ID: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-019
 * 
 * Thin delegator invoking modular SDCA assembler in decision_registry_src/
 * Preserves 100% backward compatibility with npm run build:decision-registry.
 */

require('../decision_registry_src/build.cjs');
