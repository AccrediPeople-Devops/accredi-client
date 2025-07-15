# Quantity Fix Test Documentation

## Issue Description
The quantity state was being shared across all schedule cards, causing increasing/decreasing quantity on one schedule to affect all other schedules.

## Root Cause
- Single global `quantity` state: `const [quantity, setQuantity] = useState(1);`
- All schedule cards used the same `quantity` state and `handleQuantityChange` function
- When quantity was updated, it affected all schedules simultaneously

## Solution Implemented

### 1. Replaced Global Quantity State
```typescript
// Before
const [quantity, setQuantity] = useState(1);

// After
const [scheduleQuantities, setScheduleQuantities] = useState<{ [key: string]: number }>({});
```

### 2. Updated Quantity Change Handler
```typescript
// Before
const handleQuantityChange = (action: "increase" | "decrease") => {
  if (action === "increase") {
    setQuantity((prev) => prev + 1);
  } else if (action === "decrease" && quantity > 1) {
    setQuantity((prev) => prev - 1);
  }
};

// After
const handleQuantityChange = (action: "increase" | "decrease", scheduleId: string) => {
  if (action === "increase") {
    setScheduleQuantities((prev) => ({
      ...prev,
      [scheduleId]: (prev[scheduleId] || 1) + 1
    }));
  } else if (action === "decrease" && (scheduleQuantities[scheduleId] || 1) > 1) {
    setScheduleQuantities((prev) => ({
      ...prev,
      [scheduleId]: (prev[scheduleId] || 1) - 1
    }));
  }
};
```

### 3. Updated Schedule Card Quantity Display
```typescript
// Before
<span className="w-10 text-center font-black text-lg site-text-primary">
  {quantity}
</span>

// After
<span className="w-10 text-center font-black text-lg site-text-primary">
  {scheduleQuantities[schedule.id] || 1}
</span>
```

### 4. Updated Button Click Handlers
```typescript
// Before
onClick={() => handleQuantityChange("decrease")}
onClick={() => handleQuantityChange("increase")}

// After
onClick={() => handleQuantityChange("decrease", schedule.id)}
onClick={() => handleQuantityChange("increase", schedule.id)}
```

### 5. Updated Disabled State
```typescript
// Before
disabled={quantity <= 1}

// After
disabled={(scheduleQuantities[schedule.id] || 1) <= 1}
```

### 6. Updated Pricing Calculations
All pricing calculation functions now use the selected schedule's quantity:
```typescript
const quantity = scheduleQuantities[selectedSchedule.id] || 1;
const basePrice = selectedSchedule.earlyBirdPrice * quantity;
```

## Test Cases

### Test Case 1: Independent Quantity States
1. Navigate to a course page with multiple schedules
2. Increase quantity on Schedule A to 3
3. Verify Schedule B still shows quantity 1
4. Increase quantity on Schedule B to 2
5. Verify Schedule A still shows quantity 3

### Test Case 2: Decrease Button Disabled State
1. Set quantity to 1 on any schedule
2. Verify decrease button is disabled
3. Increase quantity to 2
4. Verify decrease button is enabled
5. Decrease quantity back to 1
6. Verify decrease button is disabled again

### Test Case 3: Pricing Calculations
1. Set different quantities on different schedules
2. Click "ENROLL NOW" on Schedule A
3. Verify pricing calculation uses Schedule A's quantity
4. Close modal and click "ENROLL NOW" on Schedule B
5. Verify pricing calculation uses Schedule B's quantity

### Test Case 4: Default Values
1. Navigate to course page
2. Verify all schedules show quantity 1 by default
3. Verify decrease buttons are disabled for all schedules initially

## Expected Behavior
- Each schedule maintains its own independent quantity state
- Quantity changes on one schedule do not affect other schedules
- Pricing calculations use the correct schedule's quantity
- Default quantity is 1 for all schedules
- Decrease button is disabled when quantity is 1

## Files Modified
- `app/(site)/courses/[slug]/page.tsx`
  - Updated state management
  - Updated quantity change handler
  - Updated UI components
  - Updated pricing calculations 