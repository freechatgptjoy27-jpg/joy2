# CiviSpark Season 1.0 — Official Event Management Platform

> **Organized by:** Civil Engineering Club, Dhaka International University (DIU), Bangladesh  
> **Tagline:** “Design. Innovate. Compete.”  
> **Timezone:** Asia/Dhaka (Bangladesh Standard Time, BST)  
> **Currency:** BDT (Configurable)  

---

## 1. Executive Summary

**CiviSpark Season 1.0** is a full-stack, responsive event management system engineered specifically for the flagship annual engineering festival of the Civil Engineering Club at Dhaka International University (DIU).

The system handles the entire registration-to-results lifecycle:
- Public competition portals with strict institutional and category-specific validations.
- **Truss Competition:** Mandatory 3-member teams, all DIU students, with duplicate student ID prevention across active teams.
- **AutoCAD Competition:** Independent **Beginner** (strictly 1st-year DIU) and **Advanced** (2nd, 3rd, and 4th-year DIU) categories with 90-minute competition formatting and rubric parameters.
- **Memory Game:** Individual DIU participant registration.
- **Poster Presentation:** Individual and team (up to 4 members) research entries with abstract submissions and private storage handling.
- **Payment Verification:** Manual payment processing (bKash, Nagad, Rocket, Bank Transfer) with administrator verification, rejection workflows, and append-only audit logging.
- **Dual-Factor Status Lookup:** `/registration-status` requiring Registration ID and DIU Student ID/email.
- **Role-Based Access Control (RBAC):** Admin, Organizer, and Judge interfaces.
- **Public Statistics & Analytics:** Aggregated real-time metrics clearly separating Truss teams from individual members.

---

## 2. Technology Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS with deep navy (`#0B192C`), crisp white, and electric cyan (`#00ADB5`)
- **State Management:** Integrated unified event engine with LocalStorage persistence and Supabase integration
- **Icons:** Lucide Icons
- **Responsive Layout:** Mobile-first responsive grids, dialog modals, and drawer navigation

### Backend & Database
- **Database:** Supabase PostgreSQL with UUID primary keys and strict foreign keys
- **Security:** Complete Row Level Security (RLS) policies on all 15 tables
- **Storage:** Private storage buckets (`posters`, `payment_proofs`)
- **Edge Functions:**
  - `register`: Atomic registration validation and code generation
  - `verify-payment`: Staff payment approval and audit logging
  - `lookup-status`: Safe dual-factor lookup preventing enumeration
  - `submit-score`: Assigned judge rubric scoring

---

## 3. Database Schema Overview (15 Tables)

1. `events`: Global event configurations, venue, dates, and contacts.
2. `segments`: Competition segments (Truss, CAD Beg, CAD Adv, Memory Game, Poster).
3. `profiles`: Authenticated users.
4. `user_roles`: Role assignments (Admin, Organizer, Judge).
5. `registrations`: Main registration records with unique sequential codes (`CS1-TR-0001`, etc.).
6. `team_members`: Normalized roster entries for all team competitions.
7. `payments`: Payment records, transaction references, verification timestamps, and acting admins.
8. `submissions`: Poster research abstracts, file metadata, and reviewer feedback.
9. `judges`: Evaluator profiles.
10. `judge_assignments`: Scope-based evaluator segment allocations.
11. `scoring_rubrics`: Configurable scoring dimensions with max points and weights.
12. `scores`: Judge evaluation records.
13. `check_ins`: On-site attendance and presence records.
14. `event_settings`: Key-value configuration for payment instructions, FAQ, and schedules.
15. `audit_logs`: Append-only security and operational trail.

---

## 4. How to Run Locally

### Option A: Standalone Instant Server (Zero Dependencies Required)
No Node or npm installation is required to immediately test the platform:
```powershell
python civispark/standalone/server.py
```
Open **`http://localhost:8080`** in your browser.  
You can also double-click `civispark/standalone/app.html` to open directly in any browser.

### Option B: Node / Vite Development Server
```bash
cd civispark
npm install
npm run dev
```

### Option C: Running Automated Tests
```powershell
python civispark/tests/run_tests.py
```

---

## 5. Security & Data Integrity Highlights

- **No Invented Values:** Event date, venue, fees, and deadlines start as `NULL` and display "To be announced" until configured by the Admin.
- **Truss Exact-3 Rule:** Submitting 2 or 4 members is impossible; duplicate student IDs inside the team or in another active Truss team are rejected.
- **Strict Role Separation:** Judges cannot access payment records or audit logs; ordinary users cannot grant administrative roles.
- **Payment Verification:** No registration becomes Confirmed without authorized payment verification.
