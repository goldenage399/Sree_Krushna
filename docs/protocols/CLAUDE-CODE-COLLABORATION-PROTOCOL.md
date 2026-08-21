# Claude Code Collaboration Protocol

## Quick Start Reference
**Invoke this protocol**: Reference this file when initiating Claude Code collaboration sessions.

## Session Template
```
SYSTEM:
You are "Claude Code," a smart, context-aware code implementation assistant.
Use only shared files to understand context. Ask "@Mind: [your question]" if unclear.
Produce only code, diffs, or config changes. Run builds and report success/errors.

USER:
Here are shared files:
[LIST FILES TO SHARE]

TASK FOR CLAUDE CODE:
[SPECIFIC IMPLEMENTATION REQUEST]
```

## Three-Way Partnership Structure

### "The Mind" (Strategic Planner)
- **Define Strategy & Architecture**: Component breakdown, UI/UX guidelines, algorithm outlines
- **Specify Detailed Tasks**: Precise implementation requests with file paths, API interfaces, styling conventions
- **Validate & Integrate Outputs**: Review code diffs for correctness, style, and accessibility
- **Proactive Clarification**: Anticipate missing props, variables, or design tokens

### Human Operator (File Broker)
- **Intermediary Messenger**: Upload only relevant files/snippets requested by Claude Code
- **Relay Communication**: Channel clarification questions between Claude Code and the Mind
- **Local Verification**: Integrate code diffs and run full test suites locally
- **Report Integration Issues**: Communicate any regressions or problems

### Claude Code (Smart Executor)
- **Review & Confirm Context**: Inspect only shared files to understand existing code, stubs, design tokens
- **Request Clarification**: Use `@Mind: [specific question]` when anything is ambiguous
- **Implement Exactly**: Produce only requested code/diffs with minimal commentary
- **Build & Test**: Run `npm run build` and report BUILD SUCCESS or detailed errors
- **Follow Standards**: Adhere to naming conventions, theme-aware CSS, mobile-first, WCAG 2.1 AA

## Communication Flow

1. **Session Kick-Off**
   - Share specific files needed for context
   - State clear implementation task
   - Provide Mind's architectural guidance

2. **Clarification Protocol**
   ```
   Claude Code → Mind: @Mind: [specific question about props/interface/tokens]
   Mind → Claude Code: [precise specification/answer]
   ```

3. **Execution & Reporting**
   - Claude Code returns implementation diff
   - Runs build verification
   - Reports BUILD SUCCESS or errors

4. **Integration & Review**
   - Human integrates locally and tests
   - Mind reviews within overall UI architecture
   - Iterate if needed

## File Sharing Guidelines

### Security & Efficiency
- **Targeted Sharing**: Only share files Claude Code specifically needs
- **No Workspace Access**: Claude Code cannot browse or clone entire workspace
- **Token Optimization**: Minimal context for maximum efficiency

### What to Share
- Component stubs or existing implementations
- Theme tokens and CSS variables
- Type definitions and interfaces
- Test fixtures if relevant
- Configuration files when needed

## Best Practices

### For Human Operators
- **Lean Prompts**: Concise session headers with files and tasks
- **Single Responsibility**: One component/feature per session
- **Immediate Integration**: Test locally and report issues quickly

### For Claude Code
- **Never Guess**: Always ask `@Mind:` when uncertain
- **Consistent Style**: Follow design system conventions
- **Build Verification**: Always run and report build status
- **Minimal Commentary**: Focus on code, not explanations

### For The Mind
- **Clear Specifications**: Provide precise prop interfaces and requirements
- **Architectural Guidance**: Maintain overall system coherence
- **Proactive Planning**: Anticipate dependencies and missing pieces

## Multi-Assignment UI Project Context

### Phase 1: Foundation Stabilization
- 100% theme compliance across all routes/components
- Mobile-first, accessible, theme-aware codebase

### Phase 2: Multi-Assignment Implementation
- Display and manage multiple simultaneous assignments per user
- Context-aware filtering, progressive disclosure, dynamic switching
- Backend service integration

### Quality Standards
- **Theme Compliance**: CSS custom properties, 5-theme system support
- **Accessibility**: WCAG 2.1 AA compliance with ARIA attributes
- **Responsive**: Mobile-first breakpoints and layouts
- **Performance**: Efficient rendering and state management

## Troubleshooting

### Common Issues
- **Missing Context**: Share additional files Claude Code requests
- **Build Failures**: Review error messages and fix incrementally
- **Integration Problems**: Test locally and report specific issues
- **Unclear Requirements**: Use `@Mind:` protocol for clarification

### Recovery Steps
1. Identify missing context or files
2. Share additional resources
3. Clarify requirements with the Mind
4. Re-run implementation with better context
5. Verify builds and integration

---

**Usage**: Reference this protocol file at the start of Claude Code collaboration sessions to establish clear roles, communication patterns, and quality standards for efficient Multi-Assignment UI development.