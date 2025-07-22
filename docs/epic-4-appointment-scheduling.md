# Epic 4: Appointment Scheduling

## Story 4.1: Display Appointment List
**Description:** Display the list of appointments ("Thời gian", "Khách hàng", "BĐS") with a prominent "Tạo Lịch hẹn mới" button. All UI labels must be in Vietnamese.
**AC:**
- Navigation to the "Lịch hẹn" page exists.
- The page lists appointments ("Thời gian", "Khách hàng", "BĐS").
- A "Tạo Lịch hẹn mới" button exists.

## Story 4.2: Create a New Appointment
**Description:** Provide a form to create a new appointment. All form fields and buttons must be in Vietnamese.
**AC:**
- The "Tạo Lịch hẹn mới" button opens a form.
- The form allows selecting one client.
- The form allows selecting one or more properties.
- The form allows entering a time and meeting point.
- The new appointment appears in the list after saving.

## Story 4.3: Edit and Delete an Appointment
**Description:** Allow users to view, edit, or delete an appointment. All UI labels and dialogs must be in Vietnamese.
**AC:**
- Users can view appointment details.
- Options for "Chỉnh sửa" and "Xóa" (with confirmation in Vietnamese) are available.

---

## UI/UX Requirements (English)

### 1. Appointment List
- Use a table or card list to clearly display the following fields: Time, Client, Property.
- The "Create Appointment" button should be prominently placed at the top of the page or as a floating action button (FAB) at the bottom right on mobile.
- Allow searching/filtering by date, client, or property.
- Show appointment status (upcoming, past, cancelled) using color or icons.

### 2. Create Appointment
- Use a simple form; if there are many fields, use a stepper, prioritizing mobile experience.
- Client and property selection fields should use searchable dropdowns or autocomplete.
- Time selection should use a mobile-friendly date-time picker.
- The "meeting point" field should support address input or map selection (if available).
- Clear "Save" and "Cancel" buttons at the bottom of the form.

### 3. View, Edit, Delete Appointment
- Tapping an appointment opens details (as a dialog or separate page).
- "Edit" and "Delete" buttons should be easy to find and use distinct colors (e.g., "Delete" in red).
- Delete confirmation dialog must be clear, with content in Vietnamese, e.g., "Bạn có chắc chắn muốn xóa lịch hẹn này không?"
- After editing/deleting, show a success or error notification.

### 4. Accessibility & Experience
- All labels, buttons, and notifications must be in Vietnamese, concise, and easy to understand.
- Main actions should require only 1-2 taps on mobile.
- Show a loading indicator when saving/deleting data.
- Show clear error messages if an action fails (e.g., "Không thể lưu lịch hẹn, vui lòng thử lại").

### 5. Advanced Suggestions
- Allow appointment reminders via notification (if possible).
- Show client avatars or property icons for better visual recognition.
- Support swipe actions to delete/edit on mobile (if appropriate).
