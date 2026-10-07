# CrimeCase Frontend UI

A complete frontend-only prototype for the Crime Reporting and Case Management System.

## Included interfaces

### Citizen
- Login/demo role selection
- Dashboard
- Report a Crime
- My Reports
- Case Tracking
- Evidence
- Profile & Settings

### Police Officer
- Investigation dashboard
- Assigned cases
- Crime reports
- Investigation/case tracking
- Evidence management
- Profile & Settings

### Administrator
- System dashboard
- Crime reports
- All cases
- Police officers
- Citizens
- Evidence
- Locations
- Analytics
- Settings

## Run

No build tool is required.

1. Extract the ZIP.
2. Open `index.html` in a browser.
3. Choose a demo role from the login screen.

## Important

This is a UI prototype. Forms, authentication, file uploads, case updates and database operations currently use sample data or browser alerts.

To turn it into a working DBMS project, connect the UI to a backend API and MySQL database. Suggested backend choices are PHP + MySQL or Node.js + Express + MySQL.

The data structures in `js/data.js` correspond to the project entities described in the supplied project summary: users, crime types, locations, crime reports, officers, case assignments, evidence and case updates.
