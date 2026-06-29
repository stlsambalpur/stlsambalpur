# Cash Book Management System - STL Sambalpur

A secure, role-based Cashbook Management System for Soil Testing Lab, Sambalpur.

## Features

- **Authentication & User Management**: Secure login with role-based access control
- **Financial Entry Management**: Cashbook transactions, advances, and components
- **Multi-level Approval Workflows**: Approve/Deny transactions with audit trail
- **Comprehensive Reporting**: Date-wise, monthly, and financial year reports with PDF/Excel export
- **Advance Management**: Track and manage advance amounts with adjustment history
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## Roles

- **Admin**: Full system access including user management and approvals
- **Operator**: Create entries and view reports
- **Approver**: Approve/Deny transactions
- **Viewer**: View-only access to reports

## Tech Stack

- Backend: Node.js with Express
- Frontend: React.js with Material-UI
- Database: MongoDB
- Authentication: JWT with bcrypt password hashing
- PDF Export: pdfkit
- Excel Export: xlsx

## Default Admin Credentials

- Email: admin@stl.gov.in
- Password: Admin123

## Installation

See INSTALLATION.md for detailed setup instructions.