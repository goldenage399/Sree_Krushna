---
pattern: sdca-pre-emit-syntax-gate
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
portability: universal
canonical_source: bms
porting_effort: low
---

# SDCA Pre-Emit Syntax Gate (INV-SDCA-003)

**Category**: Build Integrity & Architecture Gate  
**Applies to**: Single-Document Client Applications (SDCA), standalone HTML negotiation cockpits, pitch decks, offline interactive runtimes, and concatenated web assets.  
**Origin**: 2026-09-10 (BMS Meeting Cockpit SDCA compilation; ported 2026-09-13 to Sree Krushna Decorator Cockpit).  
**Status**: VALIDATED  

---

## Pattern — SDCA Pre-Emit Syntax Gate

### Problem
Single-Document Client Applications (SDCA)—where modular HTML templates, CSS stylesheets, JSON data models, and JavaScript controllers are merged into a single standalone `.html` file—are prone to silent, catastrophic build corruptions. If any constituent script contains a syntax error (such as an unclosed template literal, unbalanced brace, duplicate variable declaration, or invalid token), concatenating it into `<script>` tags produces an invalid runtime bundle that silently crashes on load in the browser without emitting build-time diagnostics.

### Why it happens
1. **Lack of Intermediate AST Checks**: Build scripts frequently use basic string interpolation or stream concatenation (`fs.readFileSync() + ...`) without parsing the JavaScript AST before embedding.
2. **Post-Build Obfuscation**: Finding syntax errors in an inline 400KB+ concatenated HTML file is exceedingly difficult compared to identifying errors in modular source files with distinct line numbers.
3. **Silent Browser Failures**: Modern browsers fail to parse the entire `<script>` block when a top-level syntax error occurs, causing total white-screen failure or dead event listeners during live executive negotiations.

### Solution
Implement an automated **Pre-Emit Syntax Gate (`INV-SDCA-003`)** within the SDCA build pipeline:
1. **Isolated Modular Validation**:
   - Before reading and merging constituent JavaScript files, the build script invokes Node's native compiler check:
     ```javascript
     execFileSync(process.execPath, ['-c', scriptPath], { stdio: 'pipe' });
     ```
2. **Hard Compilation Halt**:
   - If `node -c` fails with non-zero exit code, the build script immediately throws an explicit error detailing the source file and line number, preventing the generation or overwriting of the destination `.html` file.
3. **Dry-Run Target Validation**:
   - Run a secondary AST or parser pass (`new Function()`) on the combined script buffer before writing the output artifact to disk.

### Failure Mode
- Bypassing the pre-emit check allows broken JavaScript syntax to be written into the single-file presentation deck, resulting in runtime failure in offline environments or during high-stakes vendor negotiations when no developer console is accessible.

### Invariant Instances
- **BMS Instance**: `User_Created/Discussion_Thread/Proposal/cockpit_src/build.cjs` (`INV-SDCA-003`).
- **Sree Krushna Instance**: `cockpit_src/build.cjs` (`INV-SDCA-003`), guarding `decorator-cockpit.html` and `public/decorator-cockpit.html`.
