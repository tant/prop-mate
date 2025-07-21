# Epic 3 UI Design: Client Management

> All UI elements below must follow the project's design system and global.css. Only specify style details here if not already covered by the design system.

## 2. Client List Page

### Mobile
- **Fixed Header:**
  - Title: "Clients" (Heading 1)
  - "Add New Client" button (Primary, icon + text, placed to the right of the title or fixed at the bottom)
- **Client List:**
  - Display as cards or a simple list. Each item uses Card component style.
    - Client name (bold)
    - Phone number (secondary text)
    - "Edit" (pencil) and "Delete" (trash) icons at the right corner of each item/card
  - If the list is long: Add a search box above the list (Input component)
- **Interactions:**
  - Tap on a card: View details or open the edit form (show as full screen sheet/page)
  - Tap "Delete": Show a confirmation dialog (Modal component)

### Desktop/Tablet
- **Header:**
  - Large title "Clients" (Heading 1)
  - "Add New Client" button (Primary, top right)
- **List:**
  - Display as a table with columns:
    - Name
    - Phone Number
    - Actions ("Edit" and "Delete" icons)
  - Search bar above the table (Input component)
- **Interactions:**
  - Click on a row: View details or open the edit form (modal or separate page)
  - Click "Delete": Show a confirmation dialog

## 3. Add/Edit Client Form

### Mobile
- Display as a full screen sheet or page
- Input fields: Name, Phone Number (required), and other fields if needed (Input component)
- "Save" button (Primary, fixed at the bottom), "Cancel" (Secondary)
- Label and error styles follow design system

### Desktop
- Display as a modal or drawer
- Input fields and labels as above
- "Save" and "Cancel" buttons at the end of the form

## 4. Enhanced UX

- **Loading, Empty State:**
  - Show skeletons while loading (Skeleton component)
  - If there are no clients: Show an illustration icon + text "No clients yet, please add new!"
- **Notifications:**
  - Toast/sonner for successful or failed add/edit/delete actions
- **Mobile Touch Optimization:**
  - Buttons and icons should be large enough for easy interaction (≥ 40px touch target)

- **General:**
  - All spacing, border radius, shadow, color, typography, iconography, and accessibility must follow the design system/global.css. Only specify custom styles here if not already defined.
