# Epic 3: Client Management

## Client Data Structure

```typescript
import { Timestamp } from "firebase/firestore";

interface Client {
  id: string;
  name: string; // Tên khách hàng
  phone: string; // SĐT
  email?: string;
  notes?: string;
  searchCriteria?: {
    propertyType?: string;
    locations?: string[];
    priceMin?: number;
    priceMax?: number;
  };
  source?: string; // Nguồn khách hàng
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Story 3.1: Display Client List
* **Description:** Display the list of clients ("Tên", "Số điện thoại") with a prominent "Thêm Khách hàng mới" button. All UI labels must be in Vietnamese.
* **AC:**
    - Navigation to the "Khách hàng" page exists.
    - The page lists clients ("Tên", "Số điện thoại").
    - An "Thêm Khách hàng mới" button exists.

## Story 3.2: Add and Edit a Client
* **Description:** Provide a form to add or edit client information. All form fields and buttons must be in Vietnamese.
* **AC:**
    - The "Thêm Khách hàng mới" button opens a form.
    - The form includes all defined data fields (labeled in Vietnamese).
    - Users can view and edit details from the list.
    - Information is updated upon saving.

## Story 3.3: Delete a Client
* **Description:** Allow users to delete a client. All confirmation dialogs and buttons must be in Vietnamese.
* **AC:**
    - A delete function exists on the detail page.
    - Confirmation is required (dialog in Vietnamese).
    - The client is removed from the list upon deletion.
