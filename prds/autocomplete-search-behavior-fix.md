# PRD: Autocomplete Search Behavior Fix for Map Search Pages

**Version:** 1.0
**Date:** November 2, 2025
**Status:** Draft
**Author:** AI Assistant
**Priority:** High

---

## 1. Executive Summary

### Problem Statement

The current autocomplete components (`JobSearchAutocomplete` and `LocationAutocomplete`) in the search map pages have behavior that conflicts with the UX design. Specifically:

1. **Auto-selection on typing**: While typing, autocomplete items are automatically selected/highlighted
2. **Enter key behavior**: Pressing Enter auto-selects the highlighted autocomplete item instead of submitting the search
3. **No custom values**: Users cannot submit arbitrary search terms that don't match autocomplete suggestions
4. **UX conflict**: The design has no dedicated "Submit" button - pressing Enter is intended to mean "search with what I typed"

### Current Impact

- **User Confusion**: Users expect Enter to search with their typed query, but it instead selects a suggestion
- **Reduced Flexibility**: Users cannot search for custom terms that don't appear in autocomplete
- **Poor Mobile Experience**: On mobile devices without submit buttons, users cannot easily trigger searches with custom terms

### Proposed Solution

Modify both `JobSearchAutocomplete` and `LocationAutocomplete` components to:

1. Allow custom values that don't match autocomplete suggestions
2. Prevent automatic selection while typing
3. Only select autocomplete items when explicitly CLICKED by the user
4. Make Enter key submit the current typed value (not select autocomplete item)
5. Maintain backward compatibility with other uses of these components

---

## 2. Background & Context

### Components Affected

#### Primary Components (to be modified)

1. **`/apps/seeker-portal/components/forms/JobSearchAutocomplete.tsx`**

   - Used in: Search map pages, Mobile filter scene, Landing search
   - Current behavior: Auto-selects on Enter, doesn't allow custom values

2. **`/apps/seeker-portal/components/forms/LocationAutocomplete.tsx`**
   - Used in: Search map pages, Mobile filter scene, Landing search
   - Current behavior: Auto-selects on Enter, doesn't allow custom values

#### Usage Locations

1. **`/apps/seeker-portal/components/search/map/MobileFilterScene.tsx`** (Primary use case)
2. **`/apps/seeker-portal/components/landing/LandingSearchController.tsx`**
3. Other search interfaces using these components

### HeroUI v2 Autocomplete API Research

Based on comprehensive Context7 research, the HeroUI v2 Autocomplete component provides the following relevant props:

#### Key Props for Custom Value Support

```typescript
{
  allowsCustomValue: boolean;        // Default: false - MUST ENABLE THIS
  inputValue: string;                 // Controlled input value
  selectedKey: React.Key | null;      // Controlled selection
  menuTrigger: 'focus' | 'input' | 'manual'; // Default: 'focus'
  shouldCloseOnBlur: boolean;         // Default: true
  onInputChange: (value: string) => void;
  onSelectionChange: (key: React.Key | null) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}
```

#### Critical Behavior Documentation

From HeroUI v2 documentation:

1. **`allowsCustomValue`**: "Whether the Autocomplete allows a non-item matching input value to be set."

   - When `true`, allows users to type values that don't match any autocomplete item
   - Essential for our use case

2. **Selection vs Input Value**:

   - `inputValue`: What the user types (controlled via `onInputChange`)
   - `selectedKey`: Which item from the list is selected (controlled via `onSelectionChange`)
   - These are SEPARATE and can be managed independently

3. **Keyboard Behavior**:

   - By default, Enter key triggers selection of highlighted item
   - This can be overridden in `onKeyDown` handler
   - We must prevent default Enter behavior and implement custom submit logic

4. **`menuTrigger: 'input'`**:
   - Opens menu only when user types
   - Already used in current implementation

---

## 3. Requirements

### 3.1 Functional Requirements

#### FR-1: Allow Custom Values

**Priority:** P0 (Critical)

**Description:** Both autocomplete components MUST allow users to type and submit values that don't match any autocomplete suggestions.

**Acceptance Criteria:**

- [ ] User can type any arbitrary text in the input field
- [ ] The typed value is preserved even if no autocomplete items match
- [ ] Submitting (via Enter) uses the typed value, not a selected autocomplete item
- [ ] The `allowsCustomValue` prop is set to `true` on the HeroUI Autocomplete component

**Implementation Details:**

```typescript
// Add to both components
<Autocomplete
  allowsCustomValue={true} // CRITICAL: Enable custom values
  // ... other props
/>
```

---

#### FR-2: Prevent Auto-Selection on Typing

**Priority:** P0 (Critical)

**Description:** While the user is typing, no autocomplete item should be automatically selected or highlighted as the "active" selection.

**Acceptance Criteria:**

- [ ] `selectedKey` state remains `null` while user is typing
- [ ] Visual highlighting of autocomplete items only occurs on hover or keyboard navigation
- [ ] The first autocomplete item is NOT automatically selected when the dropdown opens
- [ ] User must explicitly click or use arrow keys + Enter to select an item

**Implementation Details:**

```typescript
const handleInputChange = (newInputValue: string) => {
  setInputValue(newInputValue);

  // CRITICAL: Clear any selection when user types
  if (selectedKey !== null) {
    setSelectedKey(null);
  }

  onValueChange(newInputValue);
};
```

---

#### FR-3: Click-Only Selection

**Priority:** P0 (Critical)

**Description:** Autocomplete items should ONLY be selected when the user explicitly clicks on them with a mouse or tap gesture.

**Acceptance Criteria:**

- [ ] Clicking an autocomplete item selects it and closes the dropdown
- [ ] The selected item's value replaces the input value
- [ ] Arrow key navigation does NOT select items (only highlights)
- [ ] Enter key does NOT select the highlighted item (see FR-4)
- [ ] `onSelectionChange` is only called when user clicks an item

**Implementation Details:**

```typescript
const handleSelectionChange = (key: Key | null) => {
  // Only process actual item selection (from clicks)
  if (!key) return;

  const selectedItem = suggestions.find((item) => item.id === key);
  if (selectedItem) {
    setInputValue(selectedItem.displayName);
    setSelectedKey(key);
    onValueChange(selectedItem.displayName);

    // Call selection callback if provided
    onItemSelect?.(selectedItem);
  }
};
```

---

#### FR-4: Enter Key Submits (Not Selects)

**Priority:** P0 (Critical)

**Description:** Pressing the Enter key should submit the current typed value, NOT select the currently highlighted autocomplete item.

**Acceptance Criteria:**

- [ ] Pressing Enter calls the `onSubmit` callback with the current `inputValue`
- [ ] Enter does NOT call `onSelectionChange` with the highlighted item
- [ ] The autocomplete dropdown closes after Enter is pressed
- [ ] Input field is blurred after Enter is pressed
- [ ] Default Enter key behavior is prevented

**Implementation Details:**

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    e.stopPropagation();

    // Submit with current typed value, NOT selected item
    onSubmit?.(inputValue);

    // Close dropdown and blur input
    inputRef.current?.blur();
  }
};
```

---

### 3.2 Non-Functional Requirements

#### NFR-1: Backward Compatibility

**Priority:** P1 (High)

**Description:** Changes should not break existing implementations of these components in other parts of the application.

**Acceptance Criteria:**

- [ ] All existing props remain supported
- [ ] Components work in all current usage locations
- [ ] Landing page search continues to function correctly
- [ ] Other search interfaces maintain their behavior

**Testing Required:**

- Test in MobileFilterScene
- Test in LandingSearchController
- Test any other usage locations

---

#### NFR-2: Accessibility

**Priority:** P1 (High)

**Description:** Components must remain accessible to keyboard and screen reader users.

**Acceptance Criteria:**

- [ ] Keyboard navigation still works (Tab, Shift+Tab)
- [ ] Arrow keys navigate through suggestions
- [ ] Escape key closes the dropdown
- [ ] Screen readers announce input changes
- [ ] ARIA labels remain correct and descriptive

---

#### NFR-3: Performance

**Priority:** P2 (Medium)

**Description:** Changes should not degrade performance.

**Acceptance Criteria:**

- [ ] No additional re-renders introduced
- [ ] Debouncing still works correctly
- [ ] GraphQL queries are not duplicated
- [ ] No memory leaks from event handlers

---

## 4. Technical Design

### 4.1 Component Architecture

Both components follow similar patterns but with different data structures:

```
JobSearchAutocomplete / LocationAutocomplete
├── State Management
│   ├── inputValue (what user types)
│   ├── selectedKey (which item is selected - null by default)
│   ├── suggestions (from GraphQL)
│   └── loading states
├── Event Handlers
│   ├── handleInputChange (update input, clear selection)
│   ├── handleSelectionChange (only from clicks)
│   ├── handleKeyDown (Enter = submit, not select)
│   └── handleBlur (optional cleanup)
└── HeroUI Autocomplete Component
    ├── allowsCustomValue={true}
    ├── selectedKey={selectedKey}
    ├── inputValue={inputValue}
    └── event handlers
```

### 4.2 State Flow Diagrams

#### Current (Problematic) Flow

```
User Types "nurs"
  → inputValue = "nurs"
  → selectedKey = "nurse-123" (auto-selected first match)
  → Press Enter
  → onSelectionChange called with "nurse-123"
  → Input changes to "Registered Nurse"
  → WRONG: User wanted to search for "nurs"
```

#### New (Correct) Flow

```
User Types "nurs"
  → inputValue = "nurs"
  → selectedKey = null (no auto-selection)
  → Press Enter
  → onSubmit("nurs") called
  → Search executes with "nurs"
  → CORRECT: User's typed value is used
```

### 4.3 Key Code Changes

#### JobSearchAutocomplete.tsx

**Changes Required:**

1. **Enable Custom Values**

```typescript
<Autocomplete
  allowsCustomValue={true} // ADD THIS
  // ... existing props
/>
```

2. **Prevent Auto-Selection on Input**

```typescript
const handleInputChange = (newInputValue: string) => {
  setInputValue(newInputValue);

  // Clear selection when user types - CRITICAL CHANGE
  if (selectedKey !== null) {
    setSelectedKey(null);
  }

  onValueChange(newInputValue);
};
```

3. **Fix Enter Key Behavior**

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    e.stopPropagation(); // ADD THIS to prevent bubbling

    // CHANGE: Submit typed value, not selected item
    onSubmit?.(inputValue);

    inputRef.current?.blur();
  }
};
```

4. **Selection Only from Clicks**

```typescript
const handleSelectionChange = (key: Key | null) => {
  // This should only be called from clicks now
  setSelectedKey(key);

  if (!key) return;

  const selectedJob = suggestions.find((job) => job.jobId === key);
  if (selectedJob) {
    setInputValue(selectedJob.displayName);
    onValueChange(selectedJob.displayName);
    onJobSelect?.(selectedJob);
  }
};
```

#### LocationAutocomplete.tsx

**Changes Required:** (Same pattern as JobSearchAutocomplete)

1. **Enable Custom Values**

```typescript
<Autocomplete
  allowsCustomValue={true} // ADD THIS
  // ... existing props
/>
```

2. **Prevent Auto-Selection**

```typescript
const handleInputChange = (value: string) => {
  onValueChange?.(value);

  // Clear suggestions when input is empty
  if (value === "") {
    setSuggestions([]);
  }

  // ADD: Ensure no auto-selection
  // (Selection should only happen via handleSelectionChange from clicks)
};
```

3. **Fix Enter Key Behavior**

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    e.stopPropagation(); // ADD THIS

    // CHANGE: Submit typed value directly
    onSubmit?.(value);

    inputRef.current?.blur();
  }
};
```

4. **Selection Only from Clicks**

```typescript
const handleSelectionChange = (selectedKey: Key | null) => {
  if (!selectedKey) return;

  const selected = suggestions.find((item) => item.placeId === selectedKey);
  if (selected) {
    onChange?.(selected); // Call with location object
    // Note: Don't automatically update inputValue here
    // Let parent component decide via onValueChange
  }
};
```

### 4.4 Props API Changes

No new props needed. Existing props work perfectly:

```typescript
interface JobSearchAutocompleteProps {
  value: string; // Controlled input value
  onValueChange: (value: string) => void; // Called on every keystroke
  onSubmit?: (searchTerm: string) => void; // Called on Enter - EXISTING
  onClear?: () => void;
  onJobSelect?: (job: SearchJob) => void; // Called when item clicked
  // ... other HeroUI props
}

interface LocationAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: (searchTerm: string) => void; // Called on Enter - EXISTING
  onChange?: (location: SearchLocation) => void; // Called when item clicked
  onClear?: () => void;
  // ... other HeroUI props
}
```

**Key Point:** The existing `onSubmit` prop is already defined but not being used correctly. We just need to make sure Enter triggers it with the typed value.

---

## 5. Implementation Plan

### 5.1 Phase 1: JobSearchAutocomplete Fix (2-3 hours)

**Tasks:**

1. ✅ Research HeroUI v2 Autocomplete API (COMPLETE via Context7)
2. Add `allowsCustomValue={true}` prop
3. Update `handleInputChange` to clear selection on typing
4. Update `handleKeyDown` to prevent default and submit typed value
5. Ensure `handleSelectionChange` only responds to clicks
6. Test with MobileFilterScene component
7. Test with LandingSearchController component

**Acceptance:**

- User can type custom search terms
- Enter submits typed value
- Clicking suggestion selects it
- No auto-selection while typing

### 5.2 Phase 2: LocationAutocomplete Fix (2-3 hours)

**Tasks:**

1. Apply same pattern as JobSearchAutocomplete
2. Add `allowsCustomValue={true}` prop
3. Update `handleInputChange` logic
4. Update `handleKeyDown` to submit typed value
5. Ensure `handleSelectionChange` only responds to clicks
6. Handle the `onChange` callback correctly (location object vs string)
7. Test with MobileFilterScene component
8. Test with LandingSearchController component

**Acceptance:**

- User can type custom locations
- Enter submits typed value
- Clicking location selects it and provides full location object
- No auto-selection while typing

### 5.3 Phase 3: Integration Testing (1-2 hours)

**Test Scenarios:**

#### Map Search Page (Desktop)

- [ ] Type custom job search term, press Enter → Search executes
- [ ] Type custom location, press Enter → Location filter applies
- [ ] Click autocomplete job suggestion → Selected and search executes
- [ ] Click autocomplete location suggestion → Location filter applies with coordinates

#### Map Search Page (Mobile - MobileFilterScene)

- [ ] Type custom job search, press Enter → Input updates
- [ ] Type custom location, press Enter → Input updates
- [ ] Click "Apply Filters" → Search executes with typed values
- [ ] Click autocomplete suggestions → Values update correctly

#### Landing Page Search

- [ ] Type job search, press Enter → Redirects to search page
- [ ] Type location, press Enter → Redirects to search page
- [ ] Click autocomplete suggestions → Values update and redirect works

#### Edge Cases

- [ ] Empty input + Enter → Clears filter
- [ ] Type, then backspace to empty, then Enter → Clears filter
- [ ] Type, select suggestion, then type more, then Enter → Uses typed value
- [ ] Arrow key navigation → Highlights but doesn't select
- [ ] Escape key → Closes dropdown

### 5.4 Phase 4: Documentation & PR (1 hour)

**Tasks:**

1. Update component documentation comments
2. Add code comments explaining the custom Enter behavior
3. Create PR with comprehensive description
4. Link to this PRD in PR description
5. Add before/after demo video (optional but recommended)

---

## 6. Testing Strategy

### 6.1 Unit Tests (Optional - Consider for Future)

Since the project uses Relay and React testing can be complex, unit tests are optional for this change. Focus on manual integration testing.

### 6.2 Manual Testing Checklist

#### JobSearchAutocomplete Component

| Test Case                                                       | Expected Behavior                            | Status |
| --------------------------------------------------------------- | -------------------------------------------- | ------ |
| Type "doc" and press Enter                                      | Search executes with "doc"                   | ⬜     |
| Type "doctor", click "Doctor - General Practice"                | Input shows "Doctor - General Practice"      | ⬜     |
| Type "nurs", wait for suggestions, press Enter without clicking | Search executes with "nurs"                  | ⬜     |
| Type "xyz123" (no matches), press Enter                         | Search executes with "xyz123"                | ⬜     |
| Clear button                                                    | Input clears and onClear called              | ⬜     |
| Escape key                                                      | Dropdown closes                              | ⬜     |
| Arrow keys + Enter                                              | Enter submits typed value, NOT selected item | ⬜     |

#### LocationAutocomplete Component

| Test Case                                     | Expected Behavior                                  | Status |
| --------------------------------------------- | -------------------------------------------------- | ------ |
| Type "che" and press Enter                    | Location filter applies with "che"                 | ⬜     |
| Type "chennai", click "Chennai, Tamil Nadu"   | Input shows "Chennai, Tamil Nadu", coordinates set | ⬜     |
| Type "mum", wait for suggestions, press Enter | Location filter applies with "mum"                 | ⬜     |
| Type "123456" (no matches), press Enter       | Location filter applies with "123456"              | ⬜     |
| Clear button                                  | Input clears and onClear called                    | ⬜     |
| Escape key                                    | Dropdown closes                                    | ⬜     |

### 6.3 Integration Testing

| Integration Point       | Test Scenario                                  | Status |
| ----------------------- | ---------------------------------------------- | ------ |
| MobileFilterScene       | Type custom search + location, apply filters   | ⬜     |
| MobileFilterScene       | Click autocomplete items, apply filters        | ⬜     |
| LandingSearchController | Type and submit custom values                  | ⬜     |
| LandingSearchController | Click autocomplete and submit                  | ⬜     |
| Map search page         | All combinations of typing/clicking/submitting | ⬜     |

---

## 7. Risks & Mitigations

### Risk 1: Breaking Existing Behavior

**Probability:** Medium
**Impact:** High

**Mitigation:**

- Thoroughly test all existing usage locations
- Keep PR focused on these two components only
- Have rollback plan ready
- Deploy to staging first

### Risk 2: HeroUI Component Limitations

**Probability:** Low
**Impact:** Medium

**Mitigation:**

- Context7 research confirms all needed props exist
- `allowsCustomValue` and keyboard event override are supported
- Fall back to custom component if HeroUI proves insufficient (unlikely)

### Risk 3: User Confusion

**Probability:** Low
**Impact:** Low

**Mitigation:**

- New behavior aligns with standard web search patterns (Google, etc.)
- Users expect Enter to submit what they typed
- Click-to-select is intuitive

---

## 8. Success Metrics

### User Experience Metrics

- Users can search for custom terms not in autocomplete
- Reduced friction in search workflow
- Mobile users can submit searches easily

### Technical Metrics

- No increase in error rates
- No performance degradation
- All existing tests pass

### Acceptance

- All items in Testing Strategy checklist pass
- Product owner approves behavior in staging
- No regressions in other parts of the application

---

## 9. Future Enhancements (Out of Scope)

1. **Autocomplete History**: Save recent custom searches
2. **Smart Suggestions**: Learn from user's custom searches
3. **Fuzzy Matching**: Suggest items even with typos
4. **Category Filters**: Pre-filter autocomplete by category
5. **Voice Input**: Allow voice search on mobile

---

## 10. References

### Documentation

- [HeroUI v2 Autocomplete API](https://heroui.com/docs/components/autocomplete)
- Context7 Library: `/heroui-inc/heroui`
- React Aria Autocomplete Behavior

### Related Files

- `/apps/seeker-portal/components/forms/JobSearchAutocomplete.tsx`
- `/apps/seeker-portal/components/forms/LocationAutocomplete.tsx`
- `/apps/seeker-portal/components/search/map/MobileFilterScene.tsx`
- `/apps/seeker-portal/components/landing/LandingSearchController.tsx`

### HeroUI Key Props (from Context7 Research)

```typescript
allowsCustomValue: boolean          // Enable custom values
inputValue: string                  // Controlled input
selectedKey: React.Key | null       // Controlled selection
menuTrigger: 'input'               // Open on typing
onKeyDown: (e: KeyboardEvent)      // Override Enter behavior
onInputChange: (value: string)     // Track typing
onSelectionChange: (key: Key)      // Track selection
```

---

## 11. Approval

**Prepared by:** AI Assistant
**Review Required:** Engineering Lead, Product Owner
**Estimated Effort:** 6-8 hours
**Target Completion:** [To be determined]

---

## Appendix A: Code Snippets

### Complete handleKeyDown Implementation

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    // Prevent default autocomplete behavior (selecting highlighted item)
    e.preventDefault();

    // Stop event from bubbling up
    e.stopPropagation();

    // Submit with the current typed value, NOT a selected item
    // This is the key change - we use inputValue, not selectedKey
    onSubmit?.(inputValue);

    // Close the dropdown and remove focus
    inputRef.current?.blur();
  }

  // Allow other keys (Escape, Arrow keys) to work normally
};
```

### Complete handleInputChange Implementation

```typescript
const handleInputChange = (newInputValue: string) => {
  // Update the displayed input value
  setInputValue(newInputValue);

  // CRITICAL: Clear any selection when user types
  // This prevents auto-selection behavior
  if (selectedKey !== null) {
    setSelectedKey(null);
  }

  // Notify parent component of value change
  onValueChange(newInputValue);
};
```

### Complete handleSelectionChange Implementation

```typescript
const handleSelectionChange = (key: Key | null) => {
  setSelectedKey(key);

  if (!key) return;

  // Find the selected item from suggestions
  const selectedItem = suggestions.find((item) => item.id === key);

  if (selectedItem) {
    // Update input to show selected item's display name
    setInputValue(selectedItem.displayName);

    // Update parent component
    onValueChange(selectedItem.displayName);

    // Call item-specific callback if provided
    onItemSelect?.(selectedItem);

    // Clean up loading states
    setIsLoading(false);
    disposeQuery();
  }
};
```

---

## Appendix B: Visual Mock-ups

### Before (Current Problematic Behavior)

```
┌─────────────────────────────────────┐
│ Search: nurs|                    ▼  │ ← User typing "nurs"
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ > Registered Nurse                  │ ← Auto-highlighted/selected
│   Nurse Practitioner                │
│   Nursing Assistant                 │
└─────────────────────────────────────┘
          ↓ User presses Enter
┌─────────────────────────────────────┐
│ Search: Registered Nurse         ▼  │ ← WRONG! User wanted "nurs"
└─────────────────────────────────────┘
```

### After (New Correct Behavior)

```
┌─────────────────────────────────────┐
│ Search: nurs|                    ▼  │ ← User typing "nurs"
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   Registered Nurse                  │ ← NOT selected, just visible
│   Nurse Practitioner                │
│   Nursing Assistant                 │
└─────────────────────────────────────┘
          ↓ User presses Enter
┌─────────────────────────────────────┐
│ Search: nurs                     ▼  │ ← CORRECT! Searches for "nurs"
└─────────────────────────────────────┘

OR user clicks a suggestion:
          ↓ User clicks "Registered Nurse"
┌─────────────────────────────────────┐
│ Search: Registered Nurse         ▼  │ ← Selected item replaces input
└─────────────────────────────────────┘
```

---

**END OF PRD**
