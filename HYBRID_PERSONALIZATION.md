# Hybrid Personalization System

## Overview

The AI Evals Tutorial now features a **Hybrid Personalization System** that adapts to each user's specific AI system and use case.

---

## 🎯 How It Works

### **Phase 1: Onboarding Wizard**

New users are greeted with a 5-step wizard that collects:

1. **System Type** - Classification, Generation, Extraction, Q&A, Chat, or Other
2. **Domain** - Customer Support, Healthcare, E-commerce, Finance, Legal, Education, Content, Code, or General
3. **System Description** - Free-text description of what their AI does
4. **Experience Level** - Beginner, Intermediate, or Advanced
5. **Primary Goal** - Learning, Building, or Debugging

**Example Flow:**
```
User: "I'm building a customer support chatbot"
└→ System Type: chat
└→ Domain: customer-support
└→ Description: "Chatbot that helps users troubleshoot software issues"
└→ Experience: beginner
└→ Goal: building
```

---

### **Phase 2: Personalized Tutorial**

Tutorial content adapts based on user context:

**Before Personalization:**
```typescript
Example: "Classify this text as positive or negative"
```

**After Personalization (Customer Support):**
```typescript
Example: "Classify this support ticket: 'Your team was incredibly helpful!'"
```

**Features:**
- Examples use their domain (healthcare, finance, etc.)
- Skips irrelevant sections
- Recommends appropriate scorers for their system type
- Adjusts complexity based on experience level

---

### **Phase 3: AI Tutor Assistant**

Floating assistant available throughout the app:

**Features:**
- Context-aware responses
- Knows their system type and domain
- Provides personalized recommendations
- Generates domain-specific test cases on demand

**Example Interaction:**
```
User: "What scorer should I use?"
AI Tutor: "For your classification system in customer-support, 
I recommend exactMatch since you need precise category matching."
```

---

### **Phase 4: Custom Code Generation**

Playground generates starter code based on their profile:

**Generated for Classification (Customer Support):**
```typescript
async function classificationSystem(input: string) {
  // Prompt tailored to customer support domain
  content: `Classify this support ticket. 
  Respond with: urgent, normal, or low priority
  
  Text: ${input}`
}

// Test cases specific to customer support
const testCases = [
  { 
    id: '1', 
    input: 'System is completely down!',
    expectedOutput: 'urgent' 
  },
  // More customer support examples...
];
```

**Generated for Q&A (Healthcare):**
```typescript
async function qaSystem(input: string) {
  // Prompt tailored to healthcare domain
  content: `Answer this medical question accurately:
  
  ${input}`
}

// Test cases specific to healthcare
const testCases = [
  {
    id: '1',
    input: 'What are the symptoms of condition X?',
    expectedOutput: 'Common symptoms include...'
  },
  // More healthcare examples...
];
```

---

## 📁 Architecture

### **1. User Context System** (`src/lib/userContext.ts`)

```typescript
interface UserContext {
  systemName?: string;
  systemDescription?: string;
  aiSystemType: AISystemType;
  domain: string;
  inputFormat: InputFormat;
  outputFormat: OutputFormat;
  successCriteria: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoal: 'learning' | 'building' | 'debugging';
}
```

**Key Functions:**
- `getRecommendedScorer()` - Returns best scorer for system type
- `getDomainSpecificPrompt()` - Generates context string
- `getRelevantExamples()` - Filters examples by relevance

### **2. Context Store** (`src/lib/contextStore.ts`)

Zustand store with persistence:
- Saves user context to localStorage
- Persists across sessions
- Tracks onboarding completion

### **3. Onboarding Wizard** (`src/components/OnboardingWizard.tsx`)

5-step modal wizard:
- Progressive disclosure
- Visual progress bar
- Skip option available
- Validates each step

### **4. AI Tutor Assistant** (`src/components/AITutorAssistant.tsx`)

Floating chat interface:
- Context-aware responses
- Domain-specific recommendations
- Always accessible
- Can generate test cases

### **5. Code Generator** (`src/lib/codeGenerator.ts`)

Dynamic code generation:
- System type → appropriate prompts
- Domain → relevant examples
- Output format → extraction logic
- Success criteria → scorer selection

---

## 🎨 User Experience Flow

### **First Visit**

1. User opens app
2. Onboarding wizard appears
3. User answers 5 questions (2 minutes)
4. Context saved
5. App adapts to their needs

### **Subsequent Visits**

1. Context loaded from localStorage
2. Tutorial shows personalized content
3. AI Tutor available for questions
4. Playground has custom code ready

### **Learning Path by Goal**

**Goal: Learning**
- Start with Tutorial section
- Progress through adapted modules
- Use AI Tutor for clarification
- Try Playground with generated code

**Goal: Building**
- Jump to Playground
- Get custom code template
- Use AI Tutor for guidance
- Reference Docs as needed

**Goal: Debugging**
- Review Examples section
- Use AI Tutor for troubleshooting
- Check Docs for best practices
- Test in Playground

---

## 💡 Personalization Examples

### **Classification System (E-commerce)**

**Tutorial Example:**
```
Instead of: "Classify as positive or negative"
Shows: "Classify product review: 'Great quality, fast shipping!'"
```

**Test Cases:**
```typescript
{ input: 'Product arrived damaged', expectedOutput: 'negative' }
{ input: 'Excellent value for money', expectedOutput: 'positive' }
```

**Recommended Scorer:** `exactMatch` (threshold: 1.0)

### **Q&A System (Healthcare)**

**Tutorial Example:**
```
Instead of: "Answer this question"
Shows: "Answer: 'What are the side effects of medication X?'"
```

**Test Cases:**
```typescript
{ 
  input: 'How should I take this medication?',
  expectedOutput: 'Take one tablet daily with food'
}
```

**Recommended Scorer:** `semanticSimilarity` (threshold: 0.8)

### **Generation System (Content)**

**Tutorial Example:**
```
Instead of: "Generate text"
Shows: "Write a blog post introduction about: 'AI in marketing'"
```

**Test Cases:**
```typescript
{
  input: 'Write intro about sustainable fashion',
  expectedOutput: 'Engaging intro discussing eco-friendly clothing...'
}
```

**Recommended Scorer:** `llmJudge` (threshold: 0.7)

---

## 🔧 Technical Implementation

### **Context Persistence**

```typescript
// Saved to localStorage as 'eval-tutorial-context'
{
  context: {
    aiSystemType: 'classification',
    domain: 'customer-support',
    // ... other fields
  },
  hasCompletedOnboarding: true
}
```

### **Dynamic Content Rendering**

```typescript
// Tutorial adapts based on context
const { context } = useContextStore();

const exampleText = context.domain === 'healthcare'
  ? 'Medical report summary...'
  : 'Generic text...';
```

### **Code Generation**

```typescript
// Generates custom code on demand
const code = generateCustomEvalCode(context);
// Returns fully functional eval code for their use case
```

---

## 🚀 Future Enhancements

### **Phase 5: Advanced Features** (Not yet implemented)

1. **Test Case Generator**
   - AI generates domain-specific test cases
   - Based on their system description
   - Includes edge cases

2. **Custom Dataset Builder**
   - Upload their real data
   - Auto-generate test cases
   - Suggest labels

3. **Performance Tracking**
   - Track their eval results over time
   - Compare against benchmarks
   - Suggest improvements

4. **Community Templates**
   - Share eval templates
   - Browse by domain/system type
   - Fork and customize

5. **API Integration**
   - Connect real AI system
   - Run evals against live API
   - Automated regression testing

---

## 📊 Benefits

### **For Users:**
- ✅ Immediate relevance - see examples in their domain
- ✅ Faster learning - skip irrelevant content
- ✅ Quick start - generated code ready to use
- ✅ Personalized guidance - AI Tutor knows their context

### **For Different User Types:**

**Beginners:**
- Gentle onboarding
- Domain-specific examples are easier to understand
- AI Tutor provides extra guidance

**Intermediate:**
- Skip basics, focus on their specific use case
- Relevant examples save time
- Generated code accelerates development

**Advanced:**
- Jump straight to building
- Custom code templates
- Domain-specific best practices

---

## 🎯 Key Features Summary

| Feature | Description | Benefit |
|---------|-------------|---------|
| Onboarding Wizard | 5-question setup | Captures user context |
| Context Store | Persistent storage | Remembers preferences |
| Adaptive Tutorial | Dynamic content | Relevant examples |
| AI Tutor | Floating assistant | Personalized help |
| Code Generator | Custom templates | Quick start |

---

## 🔄 How to Reset/Change Context

Users can:
1. Clear browser localStorage
2. Click "Reset" in settings (to be added)
3. Complete onboarding again

---

## 💻 Developer Notes

### **Adding New Domains**

```typescript
// In src/lib/userContext.ts
export const DOMAIN_EXAMPLES = {
  'new-domain': {
    description: 'Domain description',
    icon: '🎯'
  }
};
```

### **Adding System Types**

```typescript
// In src/lib/userContext.ts
export const SYSTEM_TYPE_INFO = {
  newType: {
    description: 'System description',
    examples: ['Ex 1', 'Ex 2'],
    recommendedScorers: ['exactMatch']
  }
};
```

### **Customizing Code Generation**

```typescript
// In src/lib/codeGenerator.ts
function getPromptTemplate(systemType, domain, description) {
  // Add custom logic for new system types
}
```

---

## ✨ Result

The app transforms from a **generic tutorial** into a **personalized learning experience** tailored to each user's specific AI system and use case.

**Before:** "Here's how to build evals (generic)"
**After:** "Here's how to build evals for YOUR customer support chatbot in healthcare"

This dramatically increases relevance, reduces cognitive load, and accelerates time-to-value! 🚀
