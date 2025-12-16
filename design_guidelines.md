# Atomik Drone Operator App - Design Guidelines

## Brand Identity
**Brand**: Atomik (www.atomik.in)
**Theme**: Green gradient ecosystem representing agri-tech innovation
**Primary Color**: Green gradient (#2ecc71 to #27ae60)
**Secondary Color**: Deep green (#1e8449)
**Accent Color**: Bright green (#58d68d) for CTAs and success states
**Background**: Clean white (#ffffff) with subtle light gray (#f8f9fa) for sections
**Typography**: 
- Headers: Poppins Bold
- Body: Inter Regular
- Numbers/Stats: Poppins SemiBold

## Architecture Decisions

### Authentication
**Required**: Mobile OTP-based authentication
- Initial flow: Splash Screen (5s) → Language Selection → Phone Number Input → OTP Verification
- Use Twilio for SMS OTP delivery
- Session persistence with secure token storage
- Auto-detect country code with manual override option
- Include privacy policy and terms of service links on phone input screen
- Profile screen includes logout with confirmation

### Navigation
**Root Navigation**: Tab Bar (4 tabs)
- **Dashboard** (Home icon): Overview with stats and active bookings
- **Bookings** (Calendar icon): Manage all booking requests
- **Earnings** (Rupee/Money icon): Income tracking and history
- **Profile** (User icon): Operator details and settings

**Floating Action**: None needed (actions are contextual within screens)

### Multilingual Support
**Languages**: English, Hindi, Punjabi, Marathi, Kannada, Telugu, Tamil
- Language selection on first launch (stored in local state)
- Language switcher in Profile > Settings
- All text must support RTL and complex scripts
- Use i18n library with language files for each locale
- Numbers and currency formatted according to Indian locale (₹)

## Screen Specifications

### 1. Splash Screen
**Purpose**: Brand introduction and app initialization
**Duration**: 5 seconds with fade-in/fade-out animation
**Layout**:
- Full-screen green gradient background (vertical gradient)
- Atomik logo centered (use provided Latest_Atomik_Logo_1765872759874.png)
- Tagline "Advancing Agriculture" below logo in light text
- No header or navigation
- Safe area: Full screen

### 2. Language Selection Screen
**Purpose**: Set user's preferred language
**Layout**:
- Header: Transparent with "Select Language" title
- Main content: Scrollable grid of language cards (2 columns)
- Each card shows language name in native script with flag emoji alternative
- Selected language has green border and checkmark
- Continue button at bottom (fixed, above safe area)
- Safe area insets: top (insets.top + Spacing.xl), bottom (insets.bottom + Spacing.xl)

### 3. Phone Number Input Screen
**Purpose**: Initial authentication - phone number entry
**Layout**:
- Header: Transparent, no back button
- Main content: Scrollable form
  - Atomik logo at top (smaller than splash)
  - Welcome text: "Welcome to Atomik Pilot"
  - Country code dropdown (+91 default for India)
  - Phone number input (10 digits, numeric keyboard)
  - "Send OTP" button below input
  - Privacy policy and terms links at bottom
- Safe area insets: top (insets.top + Spacing.xl), bottom (insets.bottom + Spacing.xl)

### 4. OTP Verification Screen
**Purpose**: Verify phone number with OTP code
**Layout**:
- Header: Custom with back button (left), "Verify OTP" title
- Main content: Scrollable form
  - Info text: "Enter 6-digit code sent to +91 XXXXX XXXXX"
  - 6 individual OTP input boxes (centered, large)
  - Resend OTP link with countdown timer (60s)
  - "Verify" button below inputs
- Safe area insets: top (headerHeight + Spacing.xl), bottom (insets.bottom + Spacing.xl)

### 5. Dashboard Screen
**Purpose**: Overview of operator's current status and quick stats
**Layout**:
- Header: Transparent with "Dashboard" title, notification bell (right)
- Main content: Scrollable view
  - Greeting card: "Good Morning, [Operator Name]"
  - Stats cards row (3 cards in horizontal scroll):
    - Active Bookings (count with green badge)
    - Sprays Done Today (count)
    - Acres Covered Today (number)
  - "Active Bookings" section with list of in-progress bookings (max 3, "View All" link)
  - Each booking card shows: Farmer name, location, acreage, time, status badge
  - "Today's Schedule" section with upcoming bookings timeline
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)

### 6. Bookings List Screen
**Purpose**: Manage all booking requests and assignments
**Layout**:
- Header: Custom with "Bookings" title, filter icon (right)
- Tabs below header: Pending, Active, Completed
- Main content: FlatList of booking cards
  - Each card: Farmer name, location pin icon + village, acreage, date/time, status badge
  - Pending: Green "Accept" button, gray "Decline" button
  - Active: Green "Mark Complete" button
  - Completed: View details only
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)

### 7. Booking Detail Screen
**Purpose**: View full booking information and manage status
**Layout**:
- Header: Default with back button, "Booking Details" title
- Main content: Scrollable view
  - Status badge at top (Pending/Active/Completed)
  - Farmer details card: Name, phone (clickable to call), profile picture placeholder
  - Booking details card:
    - Location with map thumbnail (static)
    - Acreage (in acres)
    - Crop type
    - Spray type (pesticide/fertilizer)
    - Scheduled date and time
    - Special instructions (if any)
  - Pricing card: Total amount, payment status
  - Action buttons at bottom (fixed):
    - Pending: "Accept Booking" (green), "Decline" (gray)
    - Active: "Start Spray" (green), "Cancel" (red outline)
    - Completed: "View Invoice" (green outline)
- Safe area insets: top (Spacing.xl), bottom (insets.bottom + Spacing.xl)
- Buttons fixed above safe area bottom

### 8. Earnings Screen
**Purpose**: Track income and payment history
**Layout**:
- Header: Custom with "Earnings" title, date range filter (right)
- Main content: Scrollable view
  - Summary card at top:
    - Total earnings (large, bold)
    - Period selector: Today, Week, Month (segmented control)
  - Earnings chart (bar or line graph showing daily/weekly earnings)
  - Breakdown section:
    - Completed bookings count
    - Total acres sprayed
    - Average per booking
  - Transaction list: Recent payments with date, farmer name, amount
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)

### 9. History Screen
**Purpose**: Access past bookings and spray records
**Layout**:
- Header: Custom with "History" title, search icon (right)
- Filter chips below header: All, Last 7 Days, Last Month, Last 3 Months
- Main content: FlatList of completed booking cards
  - Each card: Date, farmer name, location, acreage, amount earned
  - Tap to view spray report/invoice
- Empty state: "No history yet" with illustration
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)

### 10. Profile Screen
**Purpose**: Operator profile, settings, and app preferences
**Layout**:
- Header: Transparent with "Profile" title
- Main content: Scrollable view
  - Profile header card:
    - Operator photo (circular, 80px)
    - Name
    - Phone number
    - Pilot license number
  - Sections with dividers:
    - Personal Details: Edit name, email, address
    - Drone Details: Model, registration, insurance expiry
    - Documents: License, insurance (view/upload)
    - Settings: Language, notifications, theme (light/dark)
    - Support: Help center, contact support
    - Legal: Privacy policy, terms of service
    - Logout button (red text)
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)

## Visual Design

### Components
**Cards**: White background, subtle shadow (shadowOpacity: 0.05, shadowRadius: 4), 12px border radius
**Buttons**:
- Primary: Green gradient background, white text, 12px border radius
- Secondary: White background, green border, green text
- Danger: Red outline, red text (for cancel/decline actions)
- Visual feedback: 0.7 opacity on press
**Status Badges**: Pill-shaped, 8px padding horizontal, 4px vertical
- Pending: Yellow background (#fff3cd), dark yellow text
- Active: Green background (#d4edda), dark green text
- Completed: Gray background (#e2e3e5), dark gray text
**Input Fields**: Light gray border, 12px border radius, 16px padding, green border on focus
**Icons**: Feather icons, 24px size for navigation, 20px for inline icons

### Typography Scale
- Title: 24px Poppins Bold
- Heading: 20px Poppins SemiBold
- Subheading: 16px Inter SemiBold
- Body: 14px Inter Regular
- Caption: 12px Inter Regular
- Stats/Numbers: 28px Poppins SemiBold

### Spacing
- xl: 24px (screen padding)
- lg: 20px (between sections)
- md: 16px (between elements)
- sm: 12px (within components)
- xs: 8px (tight spacing)

### Assets Required
1. Atomik logo (provided: Latest_Atomik_Logo_1765872759874.png)
2. System icons: Use Feather icons from @expo/vector-icons
3. Placeholder profile pictures: Generate 3 neutral avatar illustrations for farmers/operators
4. Empty state illustrations: 2 simple line illustrations (no bookings, no history)
5. Map thumbnail: Use static map image or placeholder for location display

## Interaction Design
- All touchable elements have 0.7 opacity on press
- Bottom action buttons in detail screens use floating style with shadow
- Pull-to-refresh on list screens
- Swipe actions on booking cards (swipe right: accept, swipe left: decline)
- Confirmation alerts for destructive actions (decline, cancel, logout)
- Toast notifications for success/error messages (top of screen, auto-dismiss in 3s)
- Loading states: Skeleton screens for lists, spinner for actions

## Accessibility
- Minimum touch target size: 44px
- Color contrast ratio ≥4.5:1 for text
- Support for screen readers with proper labels
- Forms must have clear labels and error states
- Focus indicators for keyboard navigation