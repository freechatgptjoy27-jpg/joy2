# CiviSpark Season 1.0 — Deployment & Production Launch Guide

> Civil Engineering Club, Dhaka International University (DIU), Bangladesh

This guide details the exact steps required to transition **CiviSpark Season 1.0** from development to live production on Supabase and hosting providers (Vercel, Netlify, or self-hosted).

---

## 1. Production Launch Checklist

- [ ] Supabase project created with PostgreSQL 15+.
- [ ] Database migrations executed in order (001 -> 002 -> 003 -> 004).
- [ ] Row Level Security (RLS) confirmed enabled on all 15 tables.
- [ ] Storage buckets created with private visibility (`posters`, `payment_proofs`).
- [ ] Edge Functions deployed with secrets set (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
- [ ] Initial Administrator account registered and assigned `Admin` in `user_roles`.
- [ ] Official event parameters configured in Admin Dashboard:
  - Event start and end dates
  - Physical venue / room allocations
  - Registration fees per segment (or left unannounced if pending)
  - Registration opening and closing deadlines
  - Official organizer helpline phone and email
  - Payment instructions (bKash, Nagad, Rocket, or Bank details)
- [ ] Automated business rule tests executed: `python tests/run_tests.py` -> 100% OK.

---

## 2. Environment Variables Configuration

In your production hosting environment (e.g., Vercel, Netlify):

```env
# Frontend Client Variables
VITE_SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Supabase Edge Functions Secrets
SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

> **Security Rule:** Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend bundles or client environment variables.

---

## 3. Database Migration Steps

Execute the SQL files located in `supabase/migrations/` sequentially using Supabase CLI or SQL Editor:

1. **`20261029000001_initial_schema.sql`**
   - Creates the 15 core tables (`events`, `segments`, `profiles`, `user_roles`, `registrations`, `team_members`, `payments`, `submissions`, `judges`, `judge_assignments`, `scoring_rubrics`, `scores`, `check_ins`, `event_settings`, `audit_logs`).
   - Sets indexes on registration codes, student IDs, payment references, and foreign keys.

2. **`20261029000002_rls_policies.sql`**
   - Enables RLS on all 15 tables.
   - Enforces role-based permissions for Admin, Organizer, and Judge.
   - Restricts public access to safe published metadata and aggregate endpoints only.

3. **`20261029000003_functions_and_triggers.sql`**
   - Installs `generate_registration_code(segment_type)` generator (`CS1-TR-0001`, `CS1-CAD-BEG-0001`, etc.).
   - Installs `get_public_statistics()` server-side aggregation function.
   - Installs payment verification audit logging trigger and registration status auto-transition.
   - Creates private storage buckets.

4. **`20261029000004_seed_data.sql`**
   - Seeds official event metadata without inventing fees, dates, or contact lines.
   - Seeds the 5 competition segments (Truss, AutoCAD Beginner, AutoCAD Advanced, Memory Game, Poster Presentation).

---

## 4. Deploying Edge Functions

Using the Supabase CLI:

```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref <your-project-id>

# Deploy Edge Functions
supabase functions deploy register
supabase functions deploy verify-payment
supabase functions deploy lookup-status
supabase functions deploy submit-score
```

---

## 5. Administrative Setup & Handover

1. Navigate to `/login` and create/sign in with the designated Chief Administrator DIU email address (e.g. `admin@diu.edu.bd`).
2. Verify role assignment in `public.user_roles` with `role = 'Admin'`.
3. Go to `/admin/settings` to input:
   - Event start timestamp
   - Campus venue
   - Official contact details
   - bKash/Nagad merchant payment instructions.
4. Go to `/admin/segments` to input registration fees and capacity caps once confirmed by the Civil Engineering Club committee.
5. On competition day, utilize `/admin/attendance` for desk check-ins and `/admin/scores` for judge evaluations.
6. When judging concludes, review the preliminary standings at `/admin/results` and click **Approve & Publish Results** to make them visible to the public.
