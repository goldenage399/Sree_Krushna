# 🔄 Circular Dependency Prevention Protocol
## Service Architecture Safety Guidelines

## 📌 **Protocol Overview**

This protocol prevents circular dependency issues that can cause system-wide failures. Following these guidelines ensures reliable service initialization and interaction.

**Severity Level**: 🚨 **CRITICAL** - System failure risk
**Applies To**: All service development and modification
**Mandatory Compliance**: Required for all service-related changes

## 🎯 **Core Principle**

> **Services MUST communicate through ServiceRegistry, NEVER through direct imports when circular dependencies exist**

## 🚨 **Circular Dependency Detection**

### **Warning Signs** 🔍
```bash
# Build-time warnings
"Circular dependency detected: ServiceA → ServiceB → ServiceA"

# Runtime errors  
"require is not defined"
"Service initialization failed"
"Maximum call stack size exceeded"

# Development indicators
- Service A imports Service B
- Service B imports Service A (or chain that leads back to A)
- Multiple services trying to initialize simultaneously
```

### **Common Circular Patterns** ⚠️
1. **Profile ↔ Acting**: ProfileUserMappingService ↔ ActingAssignmentService
2. **User ↔ Assignment**: UserService ↔ AssignmentService  
3. **Task ↔ Notification**: TaskService ↔ NotificationService
4. **Auth ↔ Audit**: AuthService ↔ SecurityAuditService

## 🛡️ **Prevention Strategies**

### **1. ServiceRegistry-First Architecture**
```javascript
// ❌ NEVER DO THIS (Direct Import)
import { ProfileUserMappingService } from './ProfileUserMappingService.js';

class ActingAssignmentService {
  static async getProfile(id) {
    return await ProfileUserMappingService.getProfile(id); // CIRCULAR!
  }
}

// ✅ CORRECT APPROACH (ServiceRegistry)
import { ServiceRegistry } from './ServiceRegistry.js';

class ActingAssignmentService {
  static async getProfile(id) {
    const ProfileUserMappingService = await ServiceRegistry.get('ProfileUserMappingService');
    return await ProfileUserMappingService.getProfile(id); // SAFE!
  }
}
```

### **2. Dependency Declaration Rules**
```yaml
service_registration_rules:
  direct_dependencies: "Only declare dependencies that DON'T create cycles"
  circular_dependencies: "Remove from dependencies array, resolve at runtime"
  runtime_resolution: "Use ServiceRegistry.get() inside methods"

example:
  # ❌ Creates circular dependency
  dependencies: ["ActingAssignmentService", "MultiUserProfileAssignmentService"]
  
  # ✅ Breaks cycle, resolves at runtime
  dependencies: [] # Empty - resolve via ServiceRegistry.get()
```

### **3. Import Strategy Framework**
```javascript
// Service imports classification:

// ✅ SAFE: Core dependencies (no circular risk)
import { db } from '../firebase.js';
import { ServiceRegistry } from './ServiceRegistry.js'; 

// ✅ SAFE: External libraries
import { collection, doc, getDoc } from 'firebase/firestore';

// ❌ DANGEROUS: Other services (high circular risk)
import { SomeService } from './SomeService.js'; // Use ServiceRegistry instead!

// ✅ CONDITIONAL: Same-layer services (check for cycles first)  
import { UtilityService } from './UtilityService.js'; // OK if no bidirectional dependency
```

## 🔧 **Implementation Checklist**

### **Before Adding Service Dependencies** ✅
```yaml
pre_implementation_checks:
  - [ ] Map current service dependency graph
  - [ ] Identify potential circular paths  
  - [ ] Choose ServiceRegistry vs direct import approach
  - [ ] Update ServiceInitializer registration
  - [ ] Plan async initialization handling
```

### **Service Development Pattern** ✅
```javascript
// 1. Import ONLY ServiceRegistry for service access
import { ServiceRegistry } from './ServiceRegistry.js';
import { db } from '../firebase.js'; // Core dependencies OK

// 2. Use async methods for service access
class MyService {
  static async methodRequiringOtherService() {
    // 3. Get service instance at runtime
    const OtherService = await ServiceRegistry.get('OtherService');
    
    // 4. Use the service
    return await OtherService.someMethod();
  }
}

// 5. Register in ServiceInitializer with minimal dependencies
ServiceRegistry.register('MyService', async () => {
  const { MyService } = await import('./MyService.js');
  return MyService;
}, { 
  singleton: true, 
  dependencies: [] // Keep minimal - resolve others at runtime
});
```

### **Testing Circular Dependencies** ✅
```bash
# 1. Build test
npm run build  # Should complete without circular dependency errors

# 2. Service initialization test
# Check browser console for ServiceRegistry initialization logs

# 3. Concurrent access test
# Multiple components accessing same service simultaneously

# 4. Dependency graph validation
# Use ServiceRegistry.validateDependencies() in browser console
```

## 🚨 **Emergency Resolution Steps**

### **If Circular Dependency Detected**
1. **STOP** - Do not merge code with circular dependencies
2. **Identify** the circular path using error messages
3. **Break** the cycle using one of these strategies:
   - Remove direct import, use ServiceRegistry
   - Extract shared functionality to utility service
   - Redesign service responsibilities to eliminate circular need
4. **Test** thoroughly with concurrent access scenarios
5. **Update** documentation of service interaction patterns

### **Common Resolution Patterns**
```yaml
pattern_1_serviceregistry:
  problem: "Service A imports Service B, Service B imports Service A"
  solution: "Remove imports, use ServiceRegistry.get() at runtime"
  
pattern_2_extraction:
  problem: "Services share common functionality causing circular imports"
  solution: "Extract shared code to separate utility service"
  
pattern_3_redesign:
  problem: "Fundamental architectural circular dependency"
  solution: "Redesign service boundaries and responsibilities"
```

## 📊 **Monitoring & Maintenance**

### **Regular Audits** 🔍
```bash
# Monthly dependency health check
grep -r "import.*Service" src/services/ | grep -v ServiceRegistry

# Quarterly architecture review
node scripts/dependency-graph-analyzer.js
```

### **Performance Monitoring** 📈
- Service initialization times
- Concurrent access patterns
- Memory usage of service singletons
- Error rates in service resolution

## 🎯 **Success Metrics**

### **System Health Indicators** ✅
- ✅ Zero circular dependency build errors
- ✅ All services initialize successfully on first access
- ✅ No runtime "require is not defined" errors
- ✅ ServiceRegistry.validateDependencies() returns clean results
- ✅ Concurrent service access works reliably

### **Developer Experience Metrics** ✅
- ✅ New services follow ServiceRegistry pattern
- ✅ Code reviews catch circular dependency risks early
- ✅ Documentation reflects actual service interaction patterns
- ✅ Testing includes concurrent initialization scenarios

## 🔗 **Related Protocols**
- [Service Registry Architecture Update](../architecture/SERVICE-REGISTRY-ARCHITECTURE-UPDATE-2025-08.md)
- [Safe Automation Protocol](./SAFE-AUTOMATION-PROTOCOL.md)
- [Build Verification Protocol](./BUILD-VERIFICATION-PROTOCOL.md)

---

**Protocol Version**: 1.0.0  
**Effective Date**: August 2025  
**Review Cycle**: Quarterly  
**Compliance**: MANDATORY for all service development