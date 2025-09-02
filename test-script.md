# Manual Test Script for First-Run Wizard

## Test Environment Setup
1. Open the application in an incognito/private browser window
2. Sign up for a new account or clear localStorage for existing user
3. Verify that no clients or projects exist in the database for the test user

## Test Cases

### 1. Wizard Appearance
- [ ] **Expected**: Wizard overlay appears automatically for new users
- [ ] **Steps**: 
  1. Load the application after clearing localStorage
  2. Verify wizard overlay is visible with step 1 content
  3. Check that step indicators show 3 dots with first one active

### 2. Step 1 - Create Client
- [ ] **Expected**: User can create a client successfully
- [ ] **Steps**:
  1. Fill in client name (required field)
  2. Optionally fill in email, company, notes
  3. Click "Create Client & Continue"
  4. Verify client is created in database
  5. Verify wizard progresses to step 2

#### Edge Cases:
- [ ] Try submitting without client name (should be blocked)
- [ ] Try with very long input values
- [ ] Try with special characters

### 3. Step 2 - Create Project
- [ ] **Expected**: User can create a project linked to the client
- [ ] **Steps**:
  1. Fill in project name (required field)
  2. Optionally fill in description, hourly rate, currency
  3. Click "Create Project & Continue"
  4. Verify project is created and linked to client
  5. Verify wizard progresses to step 3

#### Edge Cases:
- [ ] Try submitting without project name (should be blocked)
- [ ] Try different currency options
- [ ] Try negative or very large hourly rates

### 4. Step 3 - Start Timer
- [ ] **Expected**: User can start their first timer session
- [ ] **Steps**:
  1. Optionally fill in task description
  2. Click "Start Your First Timer!"
  3. Verify timer starts and is linked to the created project
  4. Verify confetti animation plays
  5. Verify wizard closes and doesn't reappear

### 5. Navigation Controls
- [ ] **Back Button**: 
  - Disabled on step 1
  - Works correctly on steps 2 and 3
  - Preserves entered data when going back
- [ ] **Skip Setup Button**: 
  - Available on all steps
  - Marks wizard as completed when clicked
  - Closes wizard without creating entities
- [ ] **X (Close) Button**:
  - Available on all steps  
  - Marks wizard as completed when clicked
  - Closes wizard without creating entities

### 6. Persistence Testing
- [ ] **Expected**: Wizard state persists across page refreshes
- [ ] **Steps**:
  1. Start wizard and complete step 1
  2. Refresh the page
  3. Verify wizard reopens at step 2 with client data preserved
  4. Complete step 2 and refresh again
  5. Verify wizard reopens at step 3 with project data preserved

### 7. Keyboard Shortcuts Tip
- [ ] **Expected**: Pro tip shows keyboard shortcuts after timer starts
- [ ] **Steps**:
  1. Complete all wizard steps
  2. Verify tip shows: "Press R to start/stop timers, S to switch to last task, N for manual entries"
  3. Test that these shortcuts actually work

### 8. Error Handling
- [ ] **Network Errors**: Simulate network failures during client/project creation
- [ ] **Database Errors**: Test with invalid data that might cause DB errors
- [ ] **Corrupted State**: Manually corrupt localStorage wizard data and verify graceful handling

### 9. Accessibility Testing
- [ ] **Keyboard Navigation**: Tab through all form elements
- [ ] **Screen Reader**: Test with screen reader (if available)
- [ ] **Focus Management**: Verify proper focus management between steps
- [ ] **ARIA Labels**: Check that buttons and form elements have proper labels

### 10. Edge Cases
- [ ] **Multiple Windows**: Open multiple browser tabs and verify wizard behavior
- [ ] **Session Timeout**: Test wizard behavior if auth session expires
- [ ] **Already Has Data**: Test user who already has clients/projects (wizard should not appear)

## Performance Checks
- [ ] Wizard loads quickly without blocking main UI
- [ ] Form submissions are responsive
- [ ] No memory leaks when opening/closing wizard multiple times
- [ ] Confetti animation performs smoothly

## Data Verification
After completing the wizard, verify in the database:
- [ ] Client record exists with correct user_id
- [ ] Project record exists with correct client_id and user_id
- [ ] Timer session/time entry exists with correct project_id
- [ ] All foreign key relationships are properly established

## Browser Compatibility
Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox  
- [ ] Safari (if available)
- [ ] Edge

## Responsive Design
Test wizard on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Very small screens (320x568)

## Notes
- Document any bugs or unexpected behavior
- Include screenshots for visual issues
- Record performance metrics if possible
- Note any accessibility issues discovered