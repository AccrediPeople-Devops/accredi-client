# Course Enrollment Page

This is a standalone enrollment page that replicates the exact functionality of the enrollment modal from the course detail page, but as a full-page experience.

## How to Use

### URL Parameters

The enrollment page accepts the following URL parameters:

- `course` (required): The course slug
- `schedule` (required): The schedule ID
- `mode` (optional): The course mode (defaults to 'live-online')

### Example URLs

```
/courses/enroll?course=pmp-training&schedule=12345&mode=live-online
/courses/enroll?course=agile-scrum&schedule=67890&mode=classroom
/courses/enroll?course=self-paced-course&schedule=11111&mode=self-paced
```

### Linking from Course Page

To link to this enrollment page from a course detail page, you can use:

```tsx
<Link 
  href={`/courses/enroll?course=${courseSlug}&schedule=${scheduleId}&mode=${mode}`}
  className="enrollment-button"
>
  Enroll Now
</Link>
```

## Features

### ✅ Exact Same Functionality as Modal

- **Personal Information Form**: Full name, email, contact number, country, city
- **Coupon Code System**: Apply and validate coupon codes with real-time feedback
- **Payment Gateway Integration**: Both Stripe and PayPal payment options
- **Form Validation**: Complete client-side validation with error messages
- **Price Calculation**: Dynamic pricing with coupon discounts
- **Error Handling**: Comprehensive error handling and user feedback

### ✅ Payment Gateways

- **Stripe Payment**: Full integration with Stripe payment processing
- **PayPal Payment**: Complete PayPal payment flow
- **Currency Support**: Multi-currency support based on user location
- **Price Display**: Real-time price updates with discount calculations

### ✅ Coupon System

- **Real-time Validation**: Instant coupon code validation
- **Discount Types**: Supports both percentage and fixed amount discounts
- **Visual Feedback**: Success/error states with clear messaging
- **Remove Functionality**: Easy coupon removal option

### ✅ Form Validation

- **Required Fields**: All mandatory fields validated
- **Email Format**: Proper email format validation
- **Phone Number**: Minimum 10-digit phone number requirement
- **Real-time Feedback**: Immediate validation feedback
- **Error Messages**: Clear, specific error messages

### ✅ User Experience

- **Responsive Design**: Works on all device sizes
- **Loading States**: Proper loading indicators
- **Error Dialogs**: User-friendly error handling
- **Navigation**: Back button and breadcrumb navigation
- **Visual Design**: Consistent with site theme and styling

## Technical Details

### Dependencies

- Uses the same services as the original modal:
  - `siteCourseService` for course data
  - `paymentService` for payment processing
  - `couponCodeService` for coupon validation
  - `useLocation` context for currency handling

### State Management

- All form state is managed locally
- No external state dependencies
- Proper cleanup on component unmount

### Error Handling

- Comprehensive error handling for all API calls
- User-friendly error messages
- Fallback UI for error states

## Integration

This page can be used as a replacement for the modal or as an additional enrollment option. It maintains 100% compatibility with the existing payment and coupon systems.
