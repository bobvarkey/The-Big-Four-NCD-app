# Unified Interventional Neuro Reference Platform - Design Specification

**Date:** 2026-05-14  
**Status:** Design Approved  
**Target Users:** Residents and Fellows in Training  
**Primary Goal:** Unified clinical reference and decision-support platform for interventional neurology

---

## 1. Overview

**Project Name:** `interventional-neuro` (unified repository)

A modern, lightweight reference platform consolidating four separate clinical assessment tools into a single, cohesive learning and decision-support system for interventional neurology residents and fellows.

**Consolidating:**
- avm-navigator (AVM Evaluation & Embolization Checklist)
- cerebral-flow-check (Cerebral Angiogram Protocol)
- coil-whisperer (Aneurysm Treatment Strategies)
- petrous-balloon-guide (Procedural Checklists)

**Success Criteria:**
- Residents can quickly find the right tool for a given clinical scenario
- Clear decision-making logic is transparent and discoverable
- Platform becomes the go-to reference during case discussions
- Unified, cohesive aesthetic (not 4 bolted-together tools)

---

## 2. Technical Architecture

**Tech Stack:** Astro + React Islands + Tailwind CSS

**Why Astro?**
- Content-first approach ideal for reference material
- Pre-rendered static HTML = instant page loads (critical for OR/cath lab context)
- React islands only where needed (decision trees, calculators, checklists)
- Minimal JavaScript footprint
- Excellent offline support
- SEO-friendly for shared training materials

**Repository Structure:**
```
interventional-neuro/
├── src/
│   ├── pages/              # Astro routes (auto-generated from file structure)
│   ├── components/         # Reusable Astro + React components
│   ├── content/            # Markdown-based procedures, guidelines
│   ├── layouts/            # Page templates (header, footer, sidebar)
│   ├── styles/             # Global design tokens and CSS
│   └── lib/                # Utilities, helpers
├── public/                 # Static assets
├── astro.config.mjs        # Astro configuration
├── tailwind.config.js      # Tailwind design tokens
└── docs/                   # Specification and planning docs
```

---

## 3. Information Architecture

**Organizing Principle:** Clinical context, not by original app silos

Users don't think "I need coil-whisperer"—they think "I need to understand aneurysm treatment options" or "I'm preparing for an SAH case."

**Site Structure:**
```
/ (Home - Hub)
├── /clinical-scenarios      # Learn by context (entry point for trainees)
│   ├── /sah                 # Subarachnoid Hemorrhage management
│   ├── /avm-planning        # AVM pre-procedure planning
│   ├── /unruptured-aneurysm # Incidental findings evaluation
│   └── /davf                # Dural AVF embolization
│
├── /tools                   # Tools organized by pathology/purpose
│   ├── /vascular-assessment
│   │   ├── /avm-evaluation
│   │   ├── /aneurysm-decision-framework
│   │   ├── /davf-assessment
│   │   └── /classification-systems
│   │
│   ├── /procedural-checklists
│   │   ├── /cerebral-angiogram
│   │   ├── /ica-balloon-test-occlusion
│   │   ├── /sah-management
│   │   ├── /davf-embolization
│   │   └── /[more procedures]
│   │
│   └── /technique-strategy
│       ├── /aneurysm-treatment-strategies
│       ├── /technique-comparisons
│       └── /device-selection-guide
│
├── /learning-resources      # Educational materials
│   ├── /decision-trees      # Interactive flowcharts
│   ├── /calculators         # PHASES, Raymond-Roy, risk scores
│   └── /quick-reference     # Printable cards and summaries
│
└── /about                   # Platform info, settings

```

**Discoverability Features:**
- **Search:** Full-text search across all procedures, decision points, classifications
- **Breadcrumbs:** Show location in hierarchy on every content page
- **Related Links:** Suggest adjacent tools at bottom of each page
- **Quick Access:** Home page features 5-6 most common procedures
- **Tagging:** Procedures tagged by complexity, risk level, category

---

## 4. Visual Design & Aesthetic

**Philosophy:** Modern, clean, minimal (inspired by Stripe, Linear, contemporary SaaS)  
**Tone:** Professional, educational, accessible (not sterile or clinical-looking)

**Color Palette:**
- **Primary:** `#0f172a` (Deep Navy) — Trust, authority
- **Accent:** `#0ea5e9` (Medical Blue) — Interactive elements, CTAs
- **Accent Dark:** `#0284c7` (Dark Blue) — Hover states
- **Backgrounds:** 
  - Light: `#f8fafc`
  - Surface: `#f1f5f9`
- **Border:** `#e2e8f0` (Light gray)
- **Semantic:**
  - Success: `#10b981` (Green)
  - Warning: `#f59e0b` (Amber)
  - Danger: `#ef4444` (Red)

**Typography:**
- **Headings:** Inter or System UI (clean sans-serif)
- **Body:** 16px base, sans-serif (Inter, Segoe UI), 1.6 line-height
- **Monospace:** For clinical codes, dosages, measurements
- **Hierarchy:** Distinct H1→H6, generous whitespace

**Components:**
- Subtle shadows (not bold drop-shadows)
- Rounded corners: 8px cards, 6px buttons
- Generous padding: 1.5rem minimum
- Smooth transitions: 200ms default
- No heavy borders (use background colors instead)

**Layout:**
- Max-width: 1200px (readable line length)
- Mobile-first responsive design
- Card-based grouping for procedures
- Tables for procedural steps (scannable, clean)
- Sidebar navigation on desktop, bottom nav on mobile

---

## 5. Navigation & User Flow

**Header:** Logo + Search (always visible, sticky on desktop)

**Primary Navigation:**
```
Home | Clinical Scenarios | Tools | Learning Resources | About
```

**Key User Journeys:**

**Journey 1: Learning a Procedure**
1. Click "Clinical Scenarios"
2. Select scenario (e.g., "Subarachnoid Hemorrhage Management")
3. Platform shows all relevant tools for that case
4. Related resources linked throughout
5. Can jump to full checklist, classification, or decision trees

**Journey 2: Quick Reference**
1. Use search bar (type procedure name or symptom)
2. Get instant results ranked by relevance
3. Access checklists, decision trees, or classifications directly

**Journey 3: Understanding Treatment Strategy**
1. Browse "Technique & Strategy" section
2. Select procedure type (e.g., "Aneurysm Treatment Options")
3. See side-by-side technique comparisons, decision trees
4. Interactive calculators and risk assessments

**Breadcrumbs:** Shown on all content pages
```
Home > Tools > Procedural Checklists > Cerebral Angiogram Protocol
```

---

## 6. Content Organization & Components

**Procedure Template:**
Each procedure has consistent structure:
1. **Header** — Procedure name, category, icon
2. **Quick Info** — Risk level, time estimate, complexity
3. **Safety Alert** (if applicable) — Critical warnings
4. **Steps** — Numbered checklist with descriptions
5. **Related Resources** — Links to decision trees, classifications, calculators
6. **Clinical Notes** — Evidence-based context

**Decision Tree Template:**
Interactive flowcharts with:
- Clear decision points (yes/no branches)
- Outcomes at leaf nodes
- Related procedure links
- Evidence citations

**Calculator Template:**
Interactive tools with:
- Input fields (validated)
- Real-time calculation
- Result explanation
- Clinical interpretation

**Classification System Template:**
Reference cards with:
- Criteria/variables
- Point calculations
- Risk stratification
- Clinical significance

---

## 7. Interactive Elements (React Islands)

Only the following require React interactivity:
- **Decision Trees** — Dynamic branching
- **Calculators** — Real-time computation (PHASES, Raymond-Roy, risk scores)
- **Checklists** — Checkbox state persistence
- **Search** — Live filtering
- **Responsive Navigation** — Mobile menu toggle

Static content (procedures, classifications, reference cards) rendered as Astro HTML.

---

## 8. Performance & Offline Support

**Target Metrics:**
- First contentful paint: <500ms
- Interactive time: <1s
- Full page loads: <2s
- Supports offline access (cached content)

**Astro Pre-rendering:**
All content pre-rendered to static HTML at build time. No client-side rendering for content pages.

---

## 9. Responsive Design

**Breakpoints:**
- Mobile: 375px (iPhone SE)
- Tablet: 768px
- Desktop: 1024px+

**Mobile-First Approach:**
- Bottom navigation on mobile (5-6 key sections)
- Hamburger menu for secondary nav
- Single-column layout
- Large touch targets (min 44px)

**Desktop:**
- Top navigation bar
- Optional sidebar on some pages
- Multi-column layouts where appropriate

---

## 10. Future Extensibility

**Design supports:**
- Additional procedures (plug-and-play)
- New decision trees and calculators
- User accounts (saved notes, bookmarks, progress tracking)
- Offline PWA capabilities
- Mobile app wrapper (if needed)
- API for integrations with EHR systems

---

## 11. Success Metrics

**User Engagement:**
- Time to find relevant tool (target: <30 seconds)
- Pages per session (goal: 3+ related tools accessed)
- Return visit frequency

**Educational Impact:**
- Resident feedback (qualitative)
- Adoption during case discussions
- Use in training rounds

**Technical:**
- Page load performance metrics
- Search relevance
- Mobile/offline functionality

---

## Document Revision History

| Date | Changes | Author |
|------|---------|--------|
| 2026-05-14 | Initial design spec | Claude Code |

