# Contractor SaaS Application - Testing & QA Plan

## Executive Summary

This document provides a comprehensive Testing and Quality Assurance plan for the Contractor SaaS application. The application consists of a contractor-facing dashboard, an embeddable customer widget, Stripe billing integration, and PWA capabilities. This plan covers automated testing strategies, manual testing procedures, integration testing scenarios, and deployment verification steps required to ensure a production-ready release.

The testing strategy employs a multi-layered approach combining unit tests for business logic, end-to-end tests for critical user flows, manual testing for UI/UX validation, and specialized testing for the widget embedding system. All test cases include specific acceptance criteria, expected results, and priority levels to guide the testing effort.

---

## 1. Testing Strategy Overview

### 1.1 Testing Philosophy and Approach

The testing strategy follows a risk-based approach, prioritizing features based on business criticality and failure impact. The contractor dashboard represents the highest priority since it controls all business operations, followed by the billing system due to revenue implications, then the widget system as it directly impacts customer acquisition, and finally the PWA features which enhance but do not core functionality.

The testing pyramid guides our approach: we invest heavily in unit tests for utility functions and business logic, maintain a solid foundation of integration tests for API interactions and database operations, and reserve end-to-end tests for critical user journeys that span multiple systems. This balance ensures fast feedback during development while maintaining confidence in production behavior.

### 1.2 Testing Technology Stack

The application uses React 18.3 with TypeScript and Vite as the build system. The recommended testing stack includes Jest for unit and integration testing, React Testing Library for component testing, and Playwright for end-to-end and browser testing. Playwright is specifically chosen over Cypress for this project due to its superior multi-tab and iframe handling capabilities, which are essential for testing the embeddable widget system.

For billing verification, Stripe CLI provides webhook event simulation, enabling testing of subscription lifecycle events without requiring actual payment processing. Lighthouse serves as the primary tool for PWA validation, providing automated audits for installability, performance, and best practices.

### 1.3 Test Environment Configuration

The test environment mirrors production configuration with the following key differences. The database runs on a separate test instance with automated cleanup between test runs. Stripe operates in test mode with sandbox API keys. The application runs on a dedicated staging subdomain accessible only to the testing team. Environment variables configure the test environment, including TEST_MODE=true, which enables debug logging and seed data reset capabilities.

---

## 2. Authentication Testing

### 2.1 Signup Flow Testing

The signup flow represents the entry point for all new contractors and requires comprehensive validation to ensure data integrity and proper account creation.

**Test Case AUTH-SIGNUP-01: Valid Signup Submission**

This test verifies the complete signup flow with valid data. The tester navigates to the signup page, enters a valid business email format (e.g., contractor@example.com), enters a password meeting complexity requirements (minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number), enters a business name, and clicks the signup button. The expected result is successful account creation in the database, JWT token storage in localStorage or cookies, and automatic redirect to the onboarding wizard at /onboarding. This test carries P0 (Critical) priority due to its blocking nature for all new users.

**Test Case AUTH-SIGNUP-02: Email Format Validation**

This test ensures proper email validation prevents invalid submissions. The tester enters various invalid email formats including missing @ symbol, missing domain, extra dots, and spaces. The expected result is inline error message display for each invalid format with specific feedback such as "Please enter a valid email address" or "Email must contain @ and a valid domain." This test carries P1 (High) priority as invalid emails would cause database errors.

**Test Case AUTH-SIGNUP-03: Password Strength Validation**

This test verifies password complexity requirements are enforced. The tester attempts to enter passwords that are too short (less than 8 characters), missing uppercase letters, missing numbers, and missing special characters. The expected result is real-time validation feedback appearing below the password field, preventing form submission until requirements are met. This test carries P1 priority as weak passwords represent a security risk.

**Test Case AUTH-SIGNUP-04: Duplicate Email Prevention**

This test ensures duplicate accounts cannot be created. The tester enters an email address that already exists in the database from a previous signup. The expected result is error message display indicating "An account with this email already exists" with a link to the login page. This test carries P2 (Medium) priority.

### 2.2 Login Flow Testing

**Test Case AUTH-LOGIN-01: Valid Login**

The tester enters valid credentials (email and password) that correspond to an existing account with an active subscription or trial. The expected result is successful authentication, token storage, and redirect to the dashboard at /dashboard. This test carries P0 priority.

**Test Case AUTH-LOGIN-02: Invalid Password**

The tester enters a valid email but incorrect password. The expected result is error display "Invalid email or password" without revealing whether the email exists in the system. This test carries P0 priority and verifies security best practices against user enumeration attacks.

**Test Case AUTH-LOGIN-03: Non-existent Account**

The tester enters an email that does not exist in the database. The expected result is identical error message to invalid password (prevents account enumeration). This test carries P2 priority.

**Test Case AUTH-LOGIN-04: Remember Me Functionality**

The tester enables "Remember Me" during login and then closes the browser. The tester then reopens the browser and navigates to the application. The expected result is automatic login without requiring credential re-entry when the remember me token is still valid (typically 30 days). This test carries P3 (Low) priority.

### 2.3 Session and Access Control Testing

**Test Case AUTH-SESSION-01: Unauthorized Dashboard Access**

The tester attempts to navigate directly to /dashboard without logging in. The expected result is redirect to /login with the original destination stored for post-login redirect. This test carries P0 priority and represents a critical security control.

**Test Case AUTH-SESSION-02: Token Expiration Handling**

The tester manually expires the JWT token in localStorage (set to expired timestamp) and attempts to access a protected route. The expected result is redirect to /login with session expired message displayed. This test carries P0 priority.

**Test Case AUTH-SESSION-03: Concurrent Session Handling**

The tester logs in on two different browsers or devices simultaneously. The expected result depends on business logic: either both sessions remain active, or the newer session invalidates the older one. This test carries P2 priority.

**Test Case AUTH-LOGOUT-01: Complete Logout**

The tester clicks the logout button from the dashboard. The expected result is token removal from localStorage and cookies, redirect to homepage, and verification that direct dashboard URL access fails without re-authentication. This test carries P1 priority.

---

## 3. Onboarding Flow Testing

### 3.1 Step Navigation and Progress Testing

The onboarding wizard guides contractors through seven distinct steps to configure their account. Proper navigation and state management are critical for user experience.

**Test Case ONBOARD-01: Step Progression Validation**

The tester completes Step 1 (Business Info) with valid data and clicks the Next button. The expected result is validation passing, advancement to Step 2 (Categories), progress bar updating to reflect completion of step 1, and the URL updating to include the step parameter. This test carries P0 priority as it represents the primary user journey.

**Test Case ONBOARD-02: Step Validation Blocking**

The tester attempts to click Next without completing required fields in Step 1. The expected result is validation error messages displayed on required fields, no navigation to the next step, and the progress bar remaining unchanged. This test carries P1 priority.

**Test Case ONBOARD-03: Back Navigation**

The tester advances to Step 3 and then clicks the Back button. The expected result is return to Step 2 with all previously entered data preserved. This test carries P1 priority.

**Test Case ONBOARD-04: Progress Persistence on Refresh**

The tester completes Steps 1 and 2, then manually refreshes the browser page. The expected result is the application remains on Step 2 with all entered data preserved, implemented through localStorage or database state persistence. This test carries P1 priority as data loss would frustrate users.

**Test Case ONBOARD-05: Direct URL Access to Middle Step**

The tester attempts to navigate directly to Step 5 via URL (e.g., /onboarding?step=5) without completing previous steps. The expected result is redirect to the highest uncompleted step (Step 1 in this case), preventing跳过关键配置步骤. This test carries P2 priority.

### 3.2 Individual Step Validation Testing

**Test Case ONBOARD-STEP1-01: Business Info Required Fields**

The tester attempts to proceed from Step 1 with the business name field empty. The expected result is error message "Business name is required" displayed below the field. This test carries P1 priority.

**Test Case ONBOARD-STEP2-01: Category Selection Requirement**

The tester attempts to proceed from Step 2 without selecting any service categories. The expected result is error message "Please select at least one category" displayed. This test carries P1 priority.

**Test Case ONBOARD-STEP3-01: Preloaded Services Display**

The tester selects "Plumbing" and "Electrical" categories in Step 2. The expected result is Step 3 displaying preloaded services for both categories with proper grouping by category. This test carries P1 priority.

**Test Case ONBOARD-STEP4-01: Custom Service Creation**

The tester adds a custom service with name "Emergency After-Hours Call", pricing model "Flat Rate", and price "$75". The expected result is the custom service appears in the service list with the entered details, and it persists when navigating between steps. This test carries P1 priority.

**Test Case ONBOARD-STEP5-01: Pricing Edit Functionality**

The tester modifies the default price of "Standard Service Call" from $75 to $95 in Step 5. The expected result is the new price is saved and reflected in the service list after navigation. This test carries P1 priority.

**Test Case ONBOARD-STEP6-01: Widget Preview Generation**

The tester advances to Step 6 with configured services. The expected result is a live preview of the customer widget displays with the contractor's configured services visible in the preview. This test carries P2 priority as it is informational only.

### 3.3 Onboarding Completion Testing

**Test Case ONBOARD-COMPLETE-01: Full Onboarding Completion**

The tester completes all seven steps of the onboarding wizard and clicks "Finish Setup." The expected result is onboarding_completed flag set to true in the database, contractor record updated with all configured data, redirect to /dashboard, and celebration/confirmation UI displayed. This test carries P0 priority as it represents successful account activation.

**Test Case ONBOARD-COMPLETE-02: Post-Onboarding Dashboard Access**

After completing onboarding, the tester logs out and logs back in. The expected result is redirect to /dashboard (not back to onboarding) since onboarding is marked complete. This test carries P0 priority.

**Test Case ONBOARD-COMPLETE-03: Incomplete Onboarding Attempt**

The tester closes the browser mid-onboarding and returns three days later without completing. The expected result is the application resumes from the last incomplete step when the user logs in. This test carries P2 priority.

---

## 4. Service Categories and Services Testing

### 4.1 Category Management Testing

**Test Case CATEGORY-01: Create New Category**

The tester navigates to the Services page in the dashboard, clicks "Add Category," enters category name "Cabinetry," selects an icon, and saves. The expected result is the new category appears in the category list, the category is available for service association, and the change persists after page refresh. This test carries P1 priority.

**Test Case CATEGORY-02: Edit Category**

The tester clicks the edit button on an existing category and changes the name from "Plumbing" to "Plumbing & Gas Fitting." The expected result is the category name updates throughout the application including the widget preview, and the change persists after refresh. This test carries P1 priority.

**Test Case CATEGORY-03: Delete Category with Services**

The tester attempts to delete a category that has associated services. The expected result is warning message "This category has X services. Delete them first or reassign to another category" displayed, and the deletion is prevented. This test carries P1 priority as data integrity must be maintained.

**Test Case CATEGORY-04: Delete Empty Category**

The tester deletes a category with no associated services. The expected result is the category is removed from the list with confirmation dialog, and no orphaned services remain in the database. This test carries P2 priority.

**Test Case CATEGORY-05: Category Display Order**

The tester rearranges categories using drag-and-drop or up/down controls. The expected result is the new order persists and is reflected in both the dashboard and customer widget. This test carries P3 priority.

### 4.2 Service Management Testing

**Test Case SERVICE-01: Add Preloaded Service**

The tester selects a category and adds a preloaded service "Water Heater Installation" from the template library. The expected result is the service appears in the category's service list with default pricing, and the service is selectable in the customer widget. This test carries P1 priority.

**Test Case SERVICE-02: Add Custom Service**

The tester creates a custom service with name "Same-Day Service", description "Priority service within 24 hours", pricing model "Hourly", default price $150, minimum hours 2, maximum hours 8. The expected result is the custom service appears with all entered details, and the price range applies correctly in estimates. This test carries P1 priority.

**Test Case SERVICE-03: Edit Service Pricing**

The tester edits an existing service, changing from hourly pricing ($100/hour) to fixed pricing ($450 flat rate). The expected result is the pricing model change is saved, existing estimates retain original pricing (historical data), but new estimates use the updated pricing. This test carries P1 priority.

**Test Case SERVICE-04: Toggle Service Active/Inactive**

The tester toggles a service from active to inactive status. The expected result is the service disappears from the customer widget but remains visible in the dashboard with an "inactive" badge, and existing estimates are unaffected. This test carries P1 priority as it directly impacts customer experience.

**Test Case SERVICE-05: Delete Service**

The tester deletes a service that has been used in existing estimates. The expected result is warning displays showing X estimates use this service, and upon confirmation, the service is soft-deleted (preserved for historical estimates). This test carries P2 priority.

**Test Case SERVICE-06: Service Search and Filter**

The tester uses the search functionality to find a service by name, and uses the filter to show only active or only inactive services. The expected result is the service list filters correctly and displays accurate counts. This test carries P3 priority.

---

## 5. Estimate Logic Testing

### 5.1 Pricing Calculation Testing

**Test Case ESTIMATE-01: Single Service Calculation**

A customer selects one service with price $150 in the widget. The expected result is the estimate displays $150 as the total with itemized breakdown showing the single service. This test carries P0 priority as it represents basic functionality.

**Test Case ESTIMATE-02: Multiple Service Calculation**

A customer selects three services: Service A ($100), Service B ($75), Service C ($200). The expected result is the total displays $375 with itemized breakdown showing each service and subtotal. This test carries P0 priority.

**Test Case ESTIMATE-03: Hourly Rate Calculation**

A customer selects an hourly service with default price $85/hour and enters 3 hours duration. The expected result is the total calculates to $255 (85 × 3) with breakdown showing rate × hours = total. This test carries P0 priority.

**Test Case ESTIMATE-04: Minimum Price Override**

A customer selects services totaling $80, but the contractor set a minimum price of $100 for the category. The expected result is the estimate displays $100 (minimum enforced) with note "Minimum service charge applied." This test carries P1 priority.

**Test Case ESTIMATE-05: Maximum Price Cap**

A customer selects services totaling $500, but the contractor set a maximum price of $400. The expected result is the estimate displays $400 (cap enforced) with note "Maximum price applied." This test carries P1 priority.

**Test Case ESTIMATE-06: Fixed Price Override**

A customer selects a service marked as "Fixed Price" at $500 flat rate. The expected result is the estimate displays $500 regardless of any hourly calculations, with "Fixed Price" label displayed. This test carries P1 priority.

### 5.2 Estimate Creation and Storage Testing

**Test Case ESTIMATE-07: JSON Data Storage**

A customer completes an estimate request with multiple services, job details, and contact information. The expected result is the database stores all submitted data in JSON format with proper structure including services array, customer details object, and timestamp. This test carries P0 priority as data integrity is critical.

**Test Case ESTIMATE-08: Contractor Notification**

A customer submits an estimate request. The expected result is the contractor's dashboard shows a new lead notification, the estimate appears in the Estimates page with "New" status, and the lead count updates in the dashboard header. This test carries P0 priority as it drives business value.

**Test Case ESTIMATE-09: Estimate Status Lifecycle**

A contractor views a new estimate, changes status to "Contacted," then "Scheduled," then "Completed." The expected result is each status change is recorded with timestamp, status history is visible when viewing the estimate details, and filters correctly show estimates by status. This test carries P1 priority.

**Test Case ESTIMATE-10: Estimate PDF Generation**

A contractor clicks "Generate PDF" on an estimate. The expected result is a PDF downloads containing contractor business info, customer details, line-item services with pricing, total amount, and Terms & Conditions. This test carries P2 priority.

---

## 6. Appointments and Scheduling Testing

### 6.1 Customer Appointment Request Testing

**Test Case APPT-01: Request Appointment from Estimate**

A customer completes an estimate and clicks "Schedule Appointment" on the success screen. The expected result is a date/time picker displays with available slots, the customer can select a preferred date and time, and the request submits with the estimate data linked. This test carries P0 priority.

**Test Case APPT-02: Date Time Selection**

A customer selects a date and time slot for appointment. The expected result is selected time displays in local timezone (properly converted from UTC storage), confirmation message shows the selected date/time in human-readable format, and the selection is preserved if the customer navigates back and returns. This test carries P1 priority.

**Test Case APPT-03: Appointment without Estimate**

A customer directly navigates to the scheduling page without completing an estimate. The expected result is the scheduling page prompts for basic service selection, or redirects to the estimator if services are required first. This test carries P2 priority.

### 6.2 Contractor Appointment Management Testing

**Test Case APPT-04: View Pending Appointments**

A contractor navigates to the Calendar page. The expected result is all pending appointment requests display in a list or calendar view with customer name, requested service, requested date/time, and contact information visible. This test carries P0 priority.

**Test Case APPT-05: Approve Appointment**

A contractor clicks "Approve" on a pending appointment. The expected result is appointment status changes to "Confirmed," the time slot is marked as unavailable for other requests, customer receives confirmation (email or dashboard notification), and calendar view updates to show the confirmed appointment. This test carries P0 priority.

**Test Case APPT-06: Decline Appointment**

A contractor clicks "Decline" on a pending appointment with reason "No availability." The expected result is appointment status changes to "Declined," the reason is recorded, customer receives notification of decline, and the appointment no longer appears in the active calendar. This test carries P1 priority.

**Test Case APPT-07: Reschedule Request**

A contractor clicks "Reschedule" and proposes a new time slot. The expected result is appointment status changes to "Reschedule Requested," customer receives notification with proposed new time, and original time slot becomes available. This test carries P1 priority.

**Test Case APPT-08: Calendar View Filtering**

A contractor filters the calendar to show only "Confirmed" appointments, then only "Pending" appointments, then "All." The expected result is the calendar updates to show only the filtered status appointments, and the filter toggle/state persists during the session. This test carries P3 priority.

---

## 7. Widget Embed System Testing

### 7.1 Widget Script Loading Testing

**Test Case WIDGET-01: Script Injection**

A test HTML page includes the widget script with `<script src="https://app.example.com/widget.js"></script>`. The expected result is the script loads asynchronously without blocking the host page, the global window.contractorWidget object is initialized, and no console errors appear. This test carries P0 priority as it represents the core embedding mechanism.

**Test Case WIDGET-02: Multiple Widget Instances**

A page includes two widget divs with different contractor IDs. The expected result is both widgets initialize correctly, each loads the correct contractor's configuration, and the widgets operate independently. This test carries P1 priority.

**Test Case WIDGET-03: Script Load Failure Handling**

The widget script URL is invalid or the server is unavailable. The expected result is the host page continues loading normally (script doesn't block), an error is logged to console (but not thrown), and the widget container displays a graceful fallback message. This test carries P2 priority.

### 7.2 Iframe Functionality Testing

**Test Case WIDGET-04: Iframe Creation**

After script loads, the widget initializes. The expected result is an iframe element is created with src pointing to the contractor's widget URL (e.g., /widget/abc123), proper sandbox attributes are applied (allow-scripts allow-same-origin), and the iframe is appended to the designated container div. This test carries P0 priority.

**Test Case WIDGET-05: Contractor ID Passing**

The widget initializes with contractorId "contractor-123". The expected result is the iframe src URL contains the contractor ID as a parameter, the widget server receives the contractor ID in the request, and the correct contractor's services and branding load in the iframe. This test carries P0 priority.

**Test Case WIDGET-06: Iframe Auto-Resize**

A customer completes steps in the widget, causing content height to change from 400px to 600px. The expected result is the iframe height attribute updates to match content height via postMessage communication, no scrollbars appear inside the iframe (content fits), and the transition is smooth without flickering. This test carries P1 priority.

**Test Case WIDGET-07: Iframe Mobile Responsiveness**

The widget loads on a mobile device (375px width viewport). The expected result is the iframe container is 100% width, content is readable without horizontal scrolling, touch targets are appropriately sized (minimum 44px), and the estimate form is usable. This test carries P1 priority.

### 7.3 Direct Link Testing

**Test Case WIDGET-08: Direct Widget URL**

A customer navigates directly to https://app.example.com/widget/contractor-123 (without embedding). The expected result is the widget loads with full functionality, contractor branding displays correctly, and the flow works identically to the embedded version. This test carries P1 priority.

**Test Case WIDGET-09: Invalid Contractor ID**

A customer navigates to a widget URL with a non-existent contractor ID. The expected result is an error page displays "This contractor's widget is not available" or redirects to a landing page, with no sensitive information leaked. This test carries P2 priority.

---

## 8. Customer-Facing Estimator UI Testing

### 8.1 Widget User Flow Testing

**Test Case CUSTOMER-01: Category Selection**

A customer sees the widget for the first time. The expected result is available service categories display as clickable cards with icons and names, category count matches contractor configuration, and clicking a category advances to service selection. This test carries P0 priority.

**Test Case CUSTOMER-02: Service Selection**

A customer selects a category and sees available services. The expected result is services display with name, brief description, and price indicator, services are correctly filtered to the selected category, and multi-select works for adding multiple services. This test carries P0 priority.

**Test Case CUSTOMER-03: Job Details Form**

A customer enters job details: address "123 Main St", description "Leaking faucet in kitchen", preferred date "next Tuesday." The expected result is form validates required fields, date picker shows valid dates only, entered data persists through the flow, and data appears in the final estimate. This test carries P0 priority.

**Test Case CUSTOMER-04: Photo Upload (Optional)**

A customer attempts to upload a photo of the issue. The expected result is file picker accepts image types (jpg, png), uploaded image thumbnail displays, large files are rejected with appropriate error, and upload failure doesn't block form submission. This test carries P2 priority.

**Test Case CUSTOMER-05: Estimate Generation**

A customer completes all steps and submits the estimate request. The expected result is loading indicator displays during submission, success screen appears with summary of selected services and total estimate, and confirmation displays with next steps. This test carries P0 priority.

### 8.2 Customer UI Error Handling

**Test Case CUSTOMER-06: Network Error During Submission**

A customer submits an estimate while network connectivity is lost. The expected result is error message displays "Connection lost. Please check your internet and try again," entered data is preserved, and retry mechanism is available. This test carries P1 priority.

**Test Case CUSTOMER-07: Session Timeout**

A customer leaves the widget open for 30 minutes without activity and then attempts to proceed. The expected result is session timeout message displays, and the customer can restart the process without losing category/service selections if re-selected. This test carries P2 priority.

---

## 9. Stripe Billing and Subscription Testing

### 9.1 Trial Period Testing

**Test Case BILLING-01: New Account Trial Initialization**

A new contractor completes signup. The expected result is Stripe customer is created in test mode, subscription status is set to "trialing", trial_start_date is set to current timestamp, trial_end_date is calculated as trial_start + 14 days, and dashboard shows "14 days remaining" badge. This test carries P0 priority.

**Test Case BILLING-02: Trial Expiration Warning**

A contractor with 2 days remaining in trial logs in. The expected result is warning banner displays "Your trial expires in 2 days. Upgrade now to continue access," upgrade button is prominent, and the banner dismisses for the session but returns on next login. This test carries P1 priority.

**Test Case BILLING-03: Trial Expiration Behavior**

The tester manually sets a test account's trial_end_date to a past date with no active subscription. The contractor attempts to access the dashboard. The expected result is access is blocked, redirect to /billing page occurs, prominent upgrade prompt displays, and the billing page shows subscription options with trial expired message. This test carries P0 priority.

### 9.2 Checkout and Payment Testing

**Test Case BILLING-04: Checkout Session Creation**

A contractor clicks "Upgrade to Pro" and selects monthly billing. The expected result is Stripe Checkout session is created, contractor is redirected to Stripe hosted checkout page, session includes correct pricing ($39/month), customer email, and success/cancel URLs. This test carries P0 priority.

**Test Case BILLING-05: Successful Payment Flow**

The tester completes payment on Stripe Checkout with test card number 4242424242424242. The expected result is payment succeeds, redirect to /billing/success occurs, subscription status updates to "active" in database, and dashboard becomes fully accessible. This test carries P0 priority.

**Test Case BILLING-06: Failed Payment Handling**

The tester attempts payment with test card number 4000000000000002 (card declined). The expected result is Stripe displays decline message, redirect to /billing with error message "Payment failed. Please try another card," and subscription remains in previous state. This test carries P1 priority.

### 9.3 Webhook Event Testing

**Test Case WEBHOOK-01: Subscription Created Event**

The tester triggers the customer.subscription.created webhook via Stripe CLI. The expected result is database updates with stripe_subscription_id, subscription_status changes to "active", and trial information is preserved if applicable. This test carries P0 priority.

**Test Case WEBHOOK-02: Subscription Updated Event**

The tester triggers customer.subscription.updated (e.g., plan change or status change). The expected result is database reflects the update (plan ID, status, current_period_end), and dashboard displays appropriate status. This test carries P1 priority.

**Test Case WEBHOOK-03: Invoice Payment Succeeded**

The tester triggers invoice.payment_succeeded for a renewal payment. The expected result is subscription_status remains "active", payment history is recorded, and renewal date extends appropriately. This test carries P1 priority.

**Test Case WEBHOOK-04: Invoice Payment Failed**

The tester triggers invoice.payment_failed during renewal. The expected result is subscription_status changes to "past_due", contractor receives notification (email or dashboard banner), and access may be restricted based on grace period settings. This test carries P1 priority.

### 9.4 Customer Portal Testing

**Test Case BILLING-07: Portal Access**

A contractor clicks "Manage Subscription" on the billing page. The expected result is redirect to Stripe Customer Portal, contractor can view current subscription details, update payment method, and cancel subscription (where enabled). This test carries P2 priority.

---

## 10. Dashboard Access Control Testing

### 10.1 Subscription-Based Access Testing

**Test Case ACCESS-01: Active Trial Access**

A contractor with active trial (not expired) attempts to access /dashboard. The expected result is full access granted, no restrictions displayed, and all features are functional. This test carries P0 priority.

**Test Case ACCESS-02: Active Subscription Access**

A contractor with active subscription attempts to access /dashboard. The expected result is full access granted, subscription badge shows "Pro" or "Business" status, and all features are functional. This test carries P0 priority.

**Test Case ACCESS-03: Expired Trial Access**

A contractor with expired trial and no subscription attempts to access /dashboard. The expected result is access denied, redirect to /billing occurs, prominent upgrade prompt displays, and the URL cannot be accessed directly (middleware protection). This test carries P0 priority.

**Test Case ACCESS-04: Past Due Subscription Access**

A contractor with past_due subscription status attempts to access /dashboard. The expected result is access granted with warning banner, features may be limited based on grace period, and prominent payment required message displays. This test carries P1 priority.

### 10.2 Route Protection Testing

**Test Case ACCESS-05: Protected Route Middleware**

The tester attempts to access /dashboard/services via direct URL without authentication. The expected result is redirect to /login with return URL preserved. This test carries P0 priority.

**Test Case ACCESS-06: Role-Based Access (Future)**

If admin roles are implemented, a standard contractor attempts to access admin-only routes. The expected result is 403 Forbidden displayed, access is denied, and the attempt is logged. This test carries P1 priority.

---

## 11. Database Migration Testing

### 11.1 Fresh Database Migration Testing

**Test Case MIGRATION-01: Initial Migration Execution**

The tester runs all migration files on a fresh PostgreSQL database. The expected result is all tables create successfully without errors, all indexes are created, all constraints are applied, and seed data populates correctly (8 categories, 56 services). This test carries P0 priority.

**Test Case MIGRATION-02: UUID Generation**

The tester verifies that new records receive UUID primary keys. The expected result is id column uses uuid_generate_v4() default, new records have proper UUID format (e.g., "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), and no duplicate IDs are generated. This test carries P1 priority.

**Test Case MIGRATION-03: Foreign Key Constraints**

The tester attempts to delete a category that has associated services. The expected result is deletion is blocked by foreign key constraint, error message is clear, and no orphaned service records exist. This test carries P1 priority.

### 11.2 Existing Database Migration Testing

**Test Case MIGRATION-04: Migration Idempotency**

The tester runs migrations on a database that already has the schema. The expected result is migrations complete without errors (idempotent), no data is lost or corrupted, and tables remain unchanged. This test carries P1 priority.

**Test Case MIGRATION-05: Data Backfill**

The migration includes backfill logic for existing records. The expected result is existing records receive default values for new columns, backfill logic handles edge cases (null values, existing data), and no errors occur during backfill. This test carries P2 priority.

### 11.3 Migration Rollback Testing

**Test Case MIGRATION-06: Rollback Execution**

The tester executes the rollback script on a database with data. The expected result is rollback completes successfully, specified tables/columns are removed, and data in unaffected tables is preserved (where possible). This test carries P2 priority.

---

## 12. PWA Testing

### 12.1 Installation Testing

**Test Case PWA-01: Manifest Loading**

The tester navigates to the application in Chrome and opens DevTools > Application > Manifest. The expected result is manifest.json is served correctly, displays proper name, short_name, start_url, display mode "standalone", background_color, theme_color, and all icon sizes are defined (192x192, 512x512). This test carries P1 priority.

**Test Case PWA-02: Install Prompt Appearance**

The tester visits the application on a supported browser (Chrome on Android, Safari on iOS). The expected result is "Add to Home Screen" or install prompt appears after meeting criteria (HTTPS, visited 2+ times, manifest valid), or the browser's install icon appears in the address bar. This test carries P1 priority.

**Test Case PWA-03: Desktop Installation**

The tester visits the application in Chrome on desktop and clicks the install icon. The expected result is the app installs as a standalone window (separate from browser), the app launches from Start menu/Desktop without browser chrome, and the app icon appears correctly. This test carries P2 priority.

**Test Case PWA-04: Mobile Installation**

The tester visits the application on mobile Safari (iOS) or Chrome (Android) and adds to home screen. The expected result is app icon appears on home screen with correct icon and name, launching the icon opens the app in standalone mode (no browser UI), and the app feels like a native application. This test carries P1 priority.

### 12.2 Service Worker Testing

**Test Case PWA-05: Service Worker Registration**

The tester opens DevTools > Application > Service Workers. The expected result is service worker registers successfully, status shows "Activated and Running," and scope matches the application. This test carries P1 priority.

**Test Case PWA-06: Offline Functionality**

The tester disconnects from the network and attempts to access the application. The expected result is custom offline page displays (not browser error), or cached content loads from service worker, and the app remains partially functional in read-only mode. This test carries P2 priority.

**Test Case PWA-07: Cache Strategy Verification**

The tester loads the application while online, closes and reopens without network. The expected result is cached assets (HTML, CSS, JS, images) load from cache, API calls show offline error gracefully, and critical functionality remains accessible. This test carries P2 priority.

**Test Case PWA-08: Background Sync (Future)**

If background sync is implemented, the tester submits data while offline. The expected result is data is queued and syncs when connectivity returns, and user receives confirmation of successful sync. This test carries P3 priority.

### 12.3 PWA Performance Testing

**Test Case PWA-09: Lighthouse PWA Score**

The tester runs Lighthouse audit for PWA category. The expected result is score of 90+ in PWA category, all mandatory PWA criteria pass (manifest, service worker, HTTPS), and HTTPS is confirmed. This test carries P2 priority.

---

## 13. Deployment Verification Testing

### 13.1 Environment Configuration Testing

**Test Case DEPLOY-01: Environment Variables**

The tester checks that all required environment variables are configured in production. The expected result is NEXT_PUBLIC_APP_URL points to production domain, STRIPE_SECRET_KEY is production key (not test), DATABASE_URL points to production database, and no development-only variables are exposed. This test carries P0 priority.

**Test Case DEPLOY-02: CORS Configuration**

The tester makes an API request from an unauthorized domain. The expected result is CORS headers properly configured, requests from widget domain are allowed, requests from unauthorized domains are blocked with appropriate headers. This test carries P1 priority.

### 13.2 Production Build Testing

**Test Case DEPLOY-03: Build Success**

The tester runs npm run build in production mode. The expected result is build completes with 0 errors, TypeScript compilation succeeds, and no linting errors block the build. This test carries P0 priority.

**Test Case DEPLOY-04: Production Bundle Size**

The tester analyzes the production bundle. The expected result is main bundle is under 500KB (gzipped), lazy loading is implemented for non-critical routes, and no unnecessary dependencies are bundled. This test carries P2 priority.

### 13.3 Production Functionality Testing

**Test Case DEPLOY-05: Production Smoke Test**

The tester navigates through key flows in production (not staging). The expected result is homepage loads without errors, login works correctly, dashboard loads with data (if authenticated), and widget (if configured) loads on test page. This test carries P0 priority.

**Test Case DEPLOY-06: Widget Script Serving**

The tester requests the widget.js file directly. The expected result is file is served with correct MIME type (application/javascript), caching headers are appropriate, and content is not minified in development but minified in production. This test carries P1 priority.

**Test Case DEPLOY-07: Webhook Endpoint Reachability**

The tester verifies the webhook endpoint is publicly accessible. The expected result is endpoint responds to health check (GET), returns appropriate response, and Stripe can send webhook events to this endpoint. This test carries P1 priority.

**Test Case DEPLOY-08: HTTPS Verification**

The tester checks that all production URLs use HTTPS. The expected result is redirect from HTTP to HTTPS works, SSL certificate is valid (no warnings in browser), and all resources load over HTTPS. This test carries P0 priority.

---

## 14. Automated Test Implementation Guide

### 14.1 Jest Unit Test Examples

```typescript
// src/utils/pricing.test.ts
import { calculateEstimate, applyMinMax, formatCurrency } from './pricing';

describe('Pricing Utilities', () => {
  describe('calculateEstimate', () => {
    it('calculates total for multiple services', () => {
      const services = [
        { price: 100, quantity: 1 },
        { price: 75, quantity: 2 },
        { price: 200, quantity: 1 }
      ];
      expect(calculateEstimate(services)).toBe(475);
    });

    it('handles hourly rate calculation', () => {
      const services = [
        { price: 85, quantity: 3, type: 'hourly' }
      ];
      expect(calculateEstimate(services)).toBe(255);
    });

    it('respects fixed price override', () => {
      const services = [
        { price: 500, quantity: 1, type: 'fixed' }
      ];
      expect(calculateEstimate(services)).toBe(500);
    });
  });

  describe('applyMinMax', () => {
    it('returns original when within range', () => {
      expect(applyMinMax(100, 50, 200)).toBe(100);
    });

    it('returns minimum when below', () => {
      expect(applyMinMax(30, 50, 200)).toBe(50);
    });

    it('returns maximum when above', () => {
      expect(applyMinMax(300, 50, 200)).toBe(200);
    });
  });

  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });
});
```

### 14.2 React Testing Library Component Examples

```typescript
// src/components/onboarding/steps/BusinessInfoStep.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingProvider } from '../../../context/OnboardingContext';
import BusinessInfoStep from './BusinessInfoStep';

const renderWithProvider = () => {
  return render(
    <OnboardingProvider>
      <BusinessInfoStep />
    </OnboardingProvider>
  );
};

describe('BusinessInfoStep', () => {
  it('renders all required fields', () => {
    renderWithProvider();
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText(/next/i));
    expect(screen.getByText(/business name is required/i)).toBeInTheDocument();
  });

  it('allows progression when valid', () => {
    renderWithProvider();
    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: 'Test Construction' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText(/next/i));
    // Verify progression (context state updated)
  });
});
```

### 14.3 Playwright E2E Test Examples

```typescript
// tests/e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('complete onboarding happy path', async ({ page }) => {
    // Signup
    await page.goto('/signup');
    await page.fill('[name="email"]', 'contractor@example.com');
    await page.fill('[name="password"]', 'SecurePass123');
    await page.fill('[name="businessName"]', 'Test Construction Co');
    await page.click('button[type="submit"]');

    // Should redirect to onboarding
    await expect(page).toHaveURL('/onboarding');

    // Step 1: Business Info - should already be filled from signup
    await page.click('button:text("Next")');

    // Step 2: Categories
    await page.click('label:text("Plumbing")');
    await page.click('label:text("Electrical")');
    await page.click('button:text("Next")');

    // Step 3: Preloaded Services - select a few
    await page.click('input[value="service-1"]');
    await page.click('button:text("Next")');

    // Step 4: Custom Services - skip
    await page.click('button:text("Next")');

    // Step 5: Pricing - verify services
    await page.click('button:text("Next")');

    // Step 6: Widget Preview
    await page.click('button:text("Next")');

    // Step 7: Finish
    await page.click('button:text("Finish Setup")');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
```

```typescript
// tests/e2e/widget.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Embeddable Widget', () => {
  test('widget loads in iframe on external page', async ({ page }) => {
    // Load test page with embedded widget
    await page.goto('file://tests/fixtures/widget-test.html');

    // Wait for script to load
    await page.waitForSelector('iframe[data-widget]');

    // Verify iframe exists and has correct src
    const iframe = page.locator('iframe[data-widget]');
    await expect(iframe).toBeVisible();
    expect(await iframe.getAttribute('src')).toContain('/widget/');

    // Switch to iframe and verify content
    const frame = page.frameLocator('iframe[data-widget]');
    await expect(frame.locator('text=Get an Estimate')).toBeVisible();
  });

  test('widget auto-resizes with content', async ({ page }) => {
    await page.goto('/widget/test-contractor');

    // Get initial height
    const iframe = page.locator('iframe');
    const initialHeight = await iframe.getAttribute('height');

    // Interact to change content height
    await page.click('text=Plumbing');
    await page.click('text=Service A');
    await page.click('text=Service B');

    // Verify height changed
    const newHeight = await iframe.getAttribute('height');
    expect(parseInt(newHeight)).toBeGreaterThan(parseInt(initialHeight));
  });
});
```

---

## 15. Manual Testing Checklists

### 15.1 Authentication Manual Checklist

- [ ] Signup form renders with all fields (email, password, confirm password, business name)
- [ ] Password strength indicator updates in real-time
- [ ] Email validation catches common errors (@ missing, invalid domain)
- [ ] Login form remembers email if "Remember Me" checked
- [ ] Logout clears all stored tokens completely
- [ ] Protected routes redirect to login with return URL
- [ ] Session timeout redirects appropriately
- [ ] Error messages do not reveal valid email addresses

### 15.2 Onboarding Manual Checklist

- [ ] Progress bar shows correct completion percentage
- [ ] Each step validates required fields before proceeding
- [ ] Data persists when navigating between steps
- [ ] Data persists on browser refresh
- [ ] Category selection updates service options in real-time
- [ ] Custom service creation form validates all fields
- [ ] Price edits save and reflect immediately
- [ ] Widget preview loads contractor's configured services
- [ ] Completion triggers correct database updates
- [ ] Post-completion login bypasses onboarding

### 15.3 Dashboard Manual Checklist

- [ ] Sidebar navigation highlights current page
- [ ] All pages load without console errors
- [ ] Data tables sort and filter correctly
- [ ] Forms submit without page reload (AJAX)
- [ ] Success/error toasts appear appropriately
- [ ] Confirmation dialogs appear for destructive actions
- [ ] Loading states display during async operations
- [ ] Empty states display when no data exists

### 15.4 Widget Manual Checklist

- [ ] Widget renders correctly on mobile viewports
- [ ] Widget renders correctly on tablet viewports
- [ ] Widget renders correctly on desktop viewports
- [ ] All form inputs are keyboard accessible
- [ ] Error messages are user-friendly
- [ ] Success screen displays all submitted information
- [ ] Back button works correctly at each step
- [ ] Progress indicator shows current step

### 15.5 Billing Manual Checklist

- [ ] Trial status displays correctly in header
- [ ] Upgrade button opens Stripe Checkout
- [ ] Payment success redirects properly
- [ ] Payment failure shows appropriate error
- [ ] Subscription status updates in header after payment
- [ ] Billing page shows correct subscription details
- [ ] Customer portal link works correctly
- [ ] Expired trial blocks dashboard access

---

## 16. Integration Test Scenarios

### 16.1 Complete User Journey Integration Test

This end-to-end test verifies the complete contractor lifecycle from signup through first customer estimate.

**Scenario: First-Time Contractor Complete Flow**

Preconditions: Empty database, Stripe in test mode, fresh browser session.

Step 1: Navigate to application homepage, verify hero displays "Start Your Free Trial" button. Step 2: Click signup, complete form with test data. Step 3: Verify redirect to onboarding wizard. Step 4: Complete all 7 onboarding steps with test selections. Step 5: Verify redirect to dashboard with welcome message. Step 6: Navigate to Services page, verify preloaded services from onboarding appear. Step 7: Navigate to Widget page, copy embed code. Step 8: Paste embed code into test HTML file, open in browser. Step 9: Complete customer widget flow with test data. Step 10: Return to dashboard, verify new lead appears in Estimates. Step 11: Click on estimate, verify customer data matches input. Step 12: Approve appointment request. Step 13: Navigate to Calendar, verify appointment appears.

Expected Result: All steps complete successfully with data flowing correctly between systems.

### 16.2 Billing Integration Test

**Scenario: Subscription Lifecycle**

Preconditions: Existing contractor account with active trial.

Step 1: Verify trial days remaining displays in header. Step 2: Navigate to Billing page, click "Upgrade to Pro." Step 3: Complete payment with Stripe test card. Step 4: Verify redirect to success page. Step 5: Return to dashboard, verify Pro badge displays. Step 6: Simulate webhook for payment failure. Step 7: Verify past_due status displays. Step 8: Process payment recovery via Stripe. Step 9: Verify active status restored.

Expected Result: Subscription lifecycle events process correctly with proper status updates.

### 16.3 Widget Integration Test

**Scenario: Customer Request Through Contractor Website**

Preconditions: Contractor has configured services and embedded widget on test page.

Step 1: Open contractor's test website in browser. Step 2: Click widget launch button. Step 3: Verify widget iframe loads with contractor's branding. Step 4: Select category "Plumbing." Step 5: Select service "Leak Repair." Step 6: Enter job details with test address. Step 7: Submit estimate request. Step 8: Verify success confirmation displays in widget. Step 9: Contractor dashboard receives new lead notification. Step 10: Contractor views new estimate with correct details. Step 11: Contractor requests appointment with proposed time. Step 12: Customer receives notification (check dashboard for notification).

Expected Result: Complete customer-to-contractor communication flow works seamlessly.

---

## 17. Go Live Readiness Checklist

### 17.1 Pre-Deployment Checklist

Before deploying to production, verify all of the following items are complete.

**Infrastructure (P0)**

- [ ] Production database is provisioned and accessible
- [ ] Database migrations have been tested on production schema
- [ ] Environment variables are configured in production environment
- [ ] SSL certificates are valid and auto-renewal is configured
- [ ] CDN is configured for static asset delivery
- [ ] Backup schedule is configured for database

**Application (P0)**

- [ ] All P0 automated tests pass
- [ ] No critical or high priority bugs are open
- [ ] Production build completes without errors
- [ ] All routes have proper authentication checks
- [ ] Error boundaries catch and display friendly errors
- [ ] Logging is configured (error tracking service integrated)

**Stripe Integration (P0)**

- [ ] Stripe account is in production mode
- [ ] Webhook endpoint is publicly accessible
- [ ] Webhook signing secret is configured in environment
- [ ] Test webhook events process correctly
- [ ] Stripe customer portal is enabled
- [ ] Pricing products are created in Stripe

**Widget System (P1)**

- [ ] Widget.js is served from production domain
- [ ] Widget loads correctly on test external page
- [ ] Widget functions correctly with production data
- [ ] Direct widget URLs work for all contractors

**PWA (P2)**

- [ ] Manifest is accessible at /manifest.json
- [ ] Service worker is registered
- [ ] App is installable on Chrome (Android/Desktop)
- [ ] App is installable on Safari (iOS)
- [ ] Offline fallback page is configured

### 17.2 Post-Deployment Verification

After deployment, perform these verification steps within the first 24 hours.

**Day 1 Checks (P0)**

- [ ] Homepage loads without errors
- [ ] Signup creates account successfully
- [ ] Login works with existing account
- [ ] Dashboard loads and displays data
- [ ] Widget embed code works on test page
- [ ] Stripe checkout completes successfully
- [ ] Webhook events process correctly

**Day 1 Checks (P1)**

- [ ] Mobile responsive design works correctly
- [ ] PWA installs on test device
- [ ] Error tracking receives no critical errors
- [ ] Performance metrics are within acceptable range

**Week 1 Monitoring (P1)**

- [ ] Monitor error logs daily for issues
- [ ] Verify backup restoration process works
- [ ] Check Stripe webhooks are delivering reliably
- [ ] Review any customer support issues

### 17.3 Rollback Plan

If critical issues are discovered post-deployment, execute the following rollback procedure.

**Immediate Rollback Triggers**

- Complete site outage (unavailable for more than 5 minutes)
- Security vulnerability discovered
- Data loss or corruption
- Payment processing broken

**Rollback Procedure**

Step 1: Identify the issue and assess severity. Step 2: If rollback is warranted, revert deployment to previous version. Step 3: Verify previous version is functioning correctly. Step 4: Notify stakeholders of the rollback. Step 5: Investigate root cause. Step 6: Fix issues in staging. Step 7: Plan redeployment with fixes.

---

## 18. Appendix: Test Case Reference

### Priority Definitions

- **P0 (Critical)**: Must pass before release. Complete functional blockage or major data loss.
- **P1 (High)**: Should pass before release. Significant functional impact but workaround exists.
- **P2 (Medium)**: Target to pass. Moderate impact on user experience.
- **P3 (Low)**: Nice to have. Minor issues that do not affect release decision.

### Test Environment URLs

| Environment | URL |
|------------|-----|
| Production | https://app.contractorsaas.com |
| Staging | https://staging.contractorsaas.com |
| Test Database | postgresql://test-db:5432/contractor_test |
| Stripe Test Mode | https://dashboard.stripe.com/test |

### Test Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@test.com | AdminPass123 | Admin features testing |
| Contractor Trial | trial@test.com | TrialPass123 | Trial period testing |
| Contractor Expired | expired@test.com | ExpiredPass123 | Expired trial testing |
| Contractor Pro | pro@test.com | ProPass123 | Active subscription testing |
| Customer | customer@test.com | N/A (widget) | Widget flow testing |

### Browser Support Matrix

| Browser | Minimum Version | Support Level |
|---------|-----------------|---------------|
| Chrome | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full |
| Edge | 90+ | Full |
| iOS Safari | 14+ | Full |
| Android Chrome | 90+ | Full |

---

*Document Version: 1.0*
*Last Updated: March 2025*
*Author: QA Team*