# Anna's Sample Data

## User Account Created
- **Username**: `anna`
- **Password**: `anna123`
- **Email**: `anna@example.com`
- **Full Name**: Anna Smith

## Sample Tasks Added (8 total)

### 📋 Backlog (3 tasks)
1. **Design User Authentication Flow** (High Priority)
   - Create wireframes and mockups for the login and registration process
   - Detailed: Need to include forgot password, email verification, and social login options. Consider accessibility and mobile responsiveness.

2. **User Onboarding Tutorial** (Low Priority)
   - Create interactive tutorial for new users
   - Detailed: Multi-step walkthrough highlighting key features. Should be skippable and accessible from help menu.

3. **Implement Task Search** (Medium Priority)
   - Add search functionality to filter tasks by title, description, or assignee
   - Detailed: Should support fuzzy search and filters by priority, status, and date ranges. Consider adding keyboard shortcuts.

### 📝 To-Do (2 tasks)
1. **Fix Responsive Layout Issues** (High Priority)
   - Address mobile responsiveness problems on tablet and phone screens
   - Detailed: Several components break on smaller screens. Need to test thoroughly on different devices and browsers.

2. **Setup Database Backup Strategy** (Medium Priority)
   - Configure automated daily backups for production database
   - Detailed: Need to implement backup rotation, test restore procedures, and set up monitoring alerts.

### 🔄 In Progress (1 task)
1. **Implement Dark Mode Toggle** (Medium Priority)
   - Add dark/light theme switching functionality to the application
   - Detailed: Should persist user preference in localStorage and respect system preferences. Need to update all component styles with CSS variables.

### 👀 Review/Testing (1 task)
1. **Write API Documentation** (Low Priority)
   - Document all REST API endpoints with examples and response schemas
   - Detailed: Use OpenAPI/Swagger format. Include authentication requirements, error codes, and example requests/responses.

### ✅ Done (1 task)
1. **Optimize Database Queries** (Medium Priority)
   - Improve performance by optimizing slow database queries
   - Detailed: Identified several N+1 query issues and missing indexes. Should result in 40-50% performance improvement.

## How to Login as Anna

1. Start the frontend application: `npm start` (in the frontend directory)
2. Navigate to the login page
3. Use credentials:
   - **Username**: `anna`
   - **Password**: `anna123`
4. You'll see all the sample tasks distributed across the Kanban board

## Testing the Dark Mode Feature

With Anna's account, you can also test the new dark mode toggle feature that was just implemented:
1. Login as Anna
2. Look for the theme toggle button (moon/sun icon) in the dashboard header
3. Click it to switch between light and dark themes
4. Your preference will be saved for future visits

## Script Used

The sample data was created using the `create_anna_tasks.py` script, which can be run again with:
```bash
source venv/bin/activate
python create_anna_tasks.py
```

This will recreate Anna's account and refresh all her sample tasks.