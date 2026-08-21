# TOKEN OPTIMIZATION TOOL SELECTION PROTOCOL
**Protocol ID**: TOKEN-OPT-001  
**Date Created**: 2025-08-12  
**Priority**: CRITICAL - Claude Code Efficiency  
**Status**: ACTIVE - Mandatory for All Tool Selection Decisions

## 🎯 **CORE PRINCIPLE**

### **Token Efficiency First**
```yaml
decision_hierarchy:
  1: "Choose simplest tool that solves the problem"
  2: "Prefer bash/grep over complex Node.js/Python tools"
  3: "Avoid reading complex documentation when simple solutions exist"
  4: "Complex tools only when simple approaches fail"
```

## 📊 **TOOL SELECTION DECISION MATRIX**

### **Problem Complexity vs Tool Complexity**
```yaml
simple_problems:
  examples: ["Find duplicate CSS classes", "Extract file patterns", "Basic text processing"]
  preferred_tools: ["bash", "grep", "sed", "awk", "sort", "uniq"]
  avoid: ["Complex analysis suites", "Multi-module systems", "Documentation-heavy tools"]
  
moderate_problems:
  examples: ["Cross-file pattern analysis", "Data transformation", "Basic automation"]
  preferred_tools: ["Simple scripts", "Single-purpose tools", "Well-documented CLIs"]
  consider: ["Existing simple tools before building new ones"]
  
complex_problems:
  examples: ["Deep architectural analysis", "Multi-system integration", "Advanced CSS analysis"]
  preferred_tools: ["Purpose-built tools", "Comprehensive analysis suites"]
  justify: ["Document why simple approaches won't work"]
```

## 🚀 **BEST PRACTICES FOR TOOL SELECTION**

### **1. Token-Efficient Problem Solving**
```yaml
approach:
  step_1: "Define the exact problem (avoid scope creep)"
  step_2: "Try the simplest bash solution first"
  step_3: "Only escalate to complex tools if bash fails"
  step_4: "Document why simple approach was insufficient"

examples:
  css_duplicates:
    problem: "Find duplicate CSS class definitions"
    simple_solution: "grep + sort + uniq (3 commands)"
    complex_alternative: "CSS-MRI analysis suite (1000+ lines)"
    decision: "Use simple solution - immediately effective"
    
  file_analysis:
    problem: "Analyze file contents"
    simple_solution: "grep + sed for specific patterns"
    complex_alternative: "Full AST parsing with specialized tools"
    decision: "Start simple, escalate only if pattern matching insufficient"
```

### **2. Documentation Reading Strategy**
```yaml
token_optimization:
  quick_scan: "Read tool README headers only (10-50 lines max)"
  usage_examples: "Look for minimal usage examples first"
  avoid_deep_dive: "Don't read comprehensive manuals until tool is chosen"
  preference: "Self-evident tools over documentation-heavy tools"

implementation_first:
  principle: "Try simple implementation before reading complex docs"
  validate: "If simple works, skip complex documentation"
  escalate: "Only read complex docs if simple approach fails"
```

### **3. Existing Tool Evaluation Criteria**
```yaml
evaluation_matrix:
  immediate_utility:
    question: "Does this solve my exact problem right now?"
    weight: "HIGH - Don't use advanced features you don't need"
    
  token_efficiency:
    question: "Is the learning curve worth the benefit?"
    weight: "HIGH - Consider documentation reading cost"
    
  maintenance_burden:
    question: "Will this create ongoing complexity?"
    weight: "MEDIUM - Consider future maintainability"
    
  problem_scope_match:
    question: "Is the tool appropriately sized for the problem?"
    weight: "HIGH - Avoid over-engineering"
```

## ⚠️ **CRITICAL ANTI-PATTERNS TO AVOID**

### **Over-Engineering Signals**
```yaml
warning_signs:
  - "Reading 500+ line tool documentation for simple problem"
  - "Setting up complex tool configuration for one-time task"
  - "Using analysis suite when grep would work"
  - "Learning new tool syntax when bash already works"
  - "Spending more tokens on tool selection than problem solving"

immediate_action:
  when_detected: "STOP - Reassess with simpler approach"
  question: "Can bash + basic Unix tools solve this?"
  fallback: "Use simplest working solution, optimize later if needed"
```

### **Token Waste Patterns**
```yaml
common_wastes:
  comprehensive_analysis: "Reading entire tool ecosystem when only one feature needed"
  feature_exploration: "Exploring advanced features before solving basic problem"
  documentation_deep_dive: "Reading implementation details instead of usage examples"
  tool_comparison: "Comparing multiple complex tools instead of trying simple solution"
```

## 🎯 **PRACTICAL APPLICATION EXAMPLES**

### **Example 1: CSS Duplicate Detection**
```yaml
original_approach:
  considered: "CSS-MRI analysis suite with comprehensive features"
  token_cost: "HIGH - 500+ lines of documentation, complex setup"
  capabilities: "Deep CSS analysis, cascade tracing, cross-browser testing"
  
optimized_approach:
  solution: "3-line bash script with grep/sort/uniq"
  token_cost: "MINIMAL - Self-evident commands"
  capabilities: "Exact duplicate detection (solves the actual problem)"
  result: "10x more token-efficient, immediate results"
```

### **Example 2: File Pattern Analysis**
```yaml
complex_option:
  tool: "AST-based analysis with specialized parsers"
  use_case: "When syntax understanding required"
  
simple_option:
  tool: "grep with regex patterns"
  use_case: "When pattern matching sufficient"
  preference: "Try simple first, escalate only if needed"
```

## 📋 **IMPLEMENTATION PROTOCOL**

### **Mandatory Decision Process**
```yaml
for_any_tool_selection:
  step_1:
    action: "Define exact problem in 1-2 sentences"
    output: "Clear problem statement"
    
  step_2:
    action: "Try bash/grep solution (max 10 lines)"
    time_limit: "15 minutes maximum"
    
  step_3:
    action: "If simple works → USE IT"
    documentation: "Document the simple solution"
    
  step_4:
    action: "If simple fails → Document why"
    justification: "Required before escalating to complex tools"
    
  step_5:
    action: "Select appropriately-sized tool"
    criteria: "Minimum viable complexity to solve problem"
```

### **Tool Audit Requirements**
```yaml
for_existing_complex_tools:
  audit_trigger: "Any tool with >100 lines documentation"
  assessment_criteria:
    - "What problems does this actually solve?"
    - "Can bash/grep solve 80% of these problems?"
    - "What's the token cost of learning vs using?"
    - "Is this tool appropriately sized for typical usage?"
    
  action_based_on_audit:
    high_value: "Keep and document optimal usage patterns"
    medium_value: "Create simple wrapper scripts for common use cases"
    low_value: "Deprecate in favor of simple alternatives"
    redundant: "Remove entirely, document simple alternatives"
```

## 🔄 **INTEGRATION WITH EXISTING PROTOCOLS**

### **Updates to CLAUDE.md**
```yaml
tool_selection_guidance:
  add_section: "Token-Optimized Tool Selection"
  placement: "After Critical Protocols section"
  content: "Reference to TOKEN-OPTIMIZATION-TOOL-SELECTION-PROTOCOL.md"
  
automatic_enforcement:
  trigger: "Any mention of complex tool usage"
  action: "Apply token optimization evaluation"
  documentation: "Mandatory justification for complex tool choices"
```

### **Integration with Production-First Protocol**
```yaml
alignment:
  principle: "Ship working solutions fast"
  tool_selection: "Choose tools that get to working solution fastest"
  optimization: "Simple tools typically ship faster than complex ones"
  maintenance: "Simple tools have lower ongoing maintenance burden"
```

## 📊 **SUCCESS METRICS**

### **Token Efficiency Indicators**
```yaml
positive_indicators:
  - "Problem solved with <10 lines of bash"
  - "Solution implemented in <1 hour"
  - "Zero documentation reading required"
  - "Self-evident tool usage"
  
negative_indicators:
  - "Spent >30 minutes reading tool documentation"
  - "Tool has features we don't use"
  - "Setup complexity exceeds problem complexity"
  - "Tool requires ongoing configuration maintenance"
```

### **Effectiveness Measurement**
```yaml
track_over_time:
  problem_solving_speed: "Time from problem identification to working solution"
  token_usage_per_solution: "Total tokens consumed per problem solved"
  solution_maintainability: "Ongoing support burden of chosen tools"
  developer_onboarding: "Time for new developers to understand tool choices"
```

---

**Business Impact**: CRITICAL - Massive token efficiency gains across all technical problem solving  
**Implementation**: IMMEDIATE - Apply to all current and future tool selection decisions  
**Maintenance**: QUARTERLY - Review and update based on actual usage patterns  
**Integration**: MANDATORY - Reference in CLAUDE.md and other core protocols