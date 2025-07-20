# Real Estate App Design System

## 1. Color Palette

| Token         | Description           | Hex Code   | Usage                                      | Preview |
|---------------|----------------------|------------|---------------------------------------------|:------:|
| primary       | Main blue            | #2563eb    | Primary buttons, links, active states       | <span style="display:inline-block;width:24px;height:24px;background:#2563eb;border-radius:4px;"></span> |
| secondary     | Light gray           | #f1f5f9    | Secondary backgrounds, inputs, cards        | <span style="display:inline-block;width:24px;height:24px;background:#f1f5f9;border-radius:4px;border:1px solid #e2e8f0;"></span> |
| accent        | Accent orange        | #f59e42    | Highlighted actions, success states         | <span style="display:inline-block;width:24px;height:24px;background:#f59e42;border-radius:4px;"></span> |
| error         | Error red            | #ef4444    | Error messages, error borders               | <span style="display:inline-block;width:24px;height:24px;background:#ef4444;border-radius:4px;"></span> |
| success       | Success green        | #22c55e    | Success messages, positive states           | <span style="display:inline-block;width:24px;height:24px;background:#22c55e;border-radius:4px;"></span> |
| text-primary  | Dark gray/black      | #0f172a    | Main text, headings                         | <span style="display:inline-block;width:24px;height:24px;background:#0f172a;border-radius:4px;"></span> |
| text-secondary| Secondary gray       | #64748b    | Descriptions, secondary labels              | <span style="display:inline-block;width:24px;height:24px;background:#64748b;border-radius:4px;"></span> |
| disabled      | Disabled gray        | #cbd5e1    | Disabled buttons/inputs                     | <span style="display:inline-block;width:24px;height:24px;background:#cbd5e1;border-radius:4px;"></span> |
| border        | Border color         | #e2e8f0    | Input, card, section borders                | <span style="display:inline-block;width:24px;height:24px;background:#e2e8f0;border-radius:4px;"></span> |
| background    | Main background      | #ffffff    | App background, card background             | <span style="display:inline-block;width:24px;height:24px;background:#ffffff;border-radius:4px;border:1px solid #e2e8f0;"></span> |

## 2. Typography

- **Font:** Inter, sans-serif
- **Font sizes:**
  - Heading 1: 2rem (32px) / bold
  - Heading 2: 1.5rem (24px) / bold
  - Heading 3: 1.25rem (20px) / semibold
  - Body: 1rem (16px) / normal
  - Caption: 0.875rem (14px) / normal
- **Line height:** 1.4–1.6
- **Letter spacing:** -0.01em for headings, normal for body

## 3. Spacing & Layout

- **Spacing scale:** 4, 8, 12, 16, 24, 32, 40, 48px
- **Container max width:** 1200px (desktop), full width (mobile)
- **Section padding:** 16–24px
- **Card padding:** 16px
- **Gap between items:** 12–16px

## 4. Border Radius & Shadow

- **Border radius:** 8px (rounded-md)
- **Input/button radius:** 6–8px
- **Card shadow:** shadow-xs, shadow-sm (shadcn/tailwind default)

## 5. Components

### 5.1. Button

| Variant   | Style                                                         | Usage                  |
|-----------|---------------------------------------------------------------|------------------------|
| Primary   | bg-primary, text-white, hover:bg-primary/90                   | Main actions           |
| Secondary | bg-secondary, text-primary, border, hover:bg-secondary/80     | Secondary actions      |
| Accent    | bg-accent, text-white, hover:bg-accent/90                     | Highlighted actions    |
| Disabled  | bg-disabled, text-gray-400, cursor-not-allowed                | Disabled state         |

- **Sizes:** 
  - Large: px-6 py-3, text-base
  - Medium: px-4 py-2, text-base
  - Small: px-3 py-1.5, text-sm
- **Icon:** Optional left/right icon

### 5.2. Input & Form

- **Input:** bg-secondary, border, rounded, px-3 py-2, focus:ring-primary
- **Label:** text-secondary, font-medium, mb-1
- **Error:** text-error, text-sm, mt-1
- **Form layout:** 1 column (mobile), 2 columns (desktop if needed)

### 5.3. Card/List Item

- **Card:** bg-white, shadow-xs, rounded, px-4 py-3, border
- **List item:** border-b, px-4 py-3, hover:bg-secondary/50
- **Avatar image:** slightly rounded, 48x48px

### 5.4. Navigation

- **Bottom Navigation (Mobile):** bg-white, border-t, fixed bottom-0, flex, icon + label, active: text-primary
- **Sidebar (Desktop):** bg-white, border-r, fixed, icon + label

### 5.5. Modal/Dialog

- **Overlay:** bg-black/40
- **Content:** bg-white, rounded, shadow-lg, p-6
- **Button:** Primary/Secondary, full width on mobile

### 5.6. Toast/Alert

- **Success:** bg-success/10, text-success, check icon
- **Error:** bg-error/10, text-error, warning icon
- **Info:** bg-primary/10, text-primary, info icon

### 5.7. State

- **Loading:** Small spinner, dimmed overlay for major actions
- **Empty:** Illustration icon + short guidance text
- **Error:** Red text, warning icon

## 6. Iconography

- **Icon set:** Heroicons or Lucide (outline style)
- **Size:** 20–24px
- **Color:** According to state (primary, error, success...)

## 7. Responsive

- **Mobile-first:** 1 column, bottom nav, large touch targets
- **Tablet/Desktop:** Increased padding, more columns in lists, sidebar if needed

## 8. Accessibility

- **Contrast:** Ensure good contrast ratio for text/buttons
- **Focus ring:** Clearly visible on input/button focus
- **Label:** All inputs have clear labels
- **Keyboard navigation:** Tab, Enter, Space all work as expected

---
