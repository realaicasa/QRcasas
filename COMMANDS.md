# QRcasas Restart Commands

## Initialize
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Check git status, current branch, recent commits, and the Vercel deployment commit before changing code."

## Production Homepage Diagnosis
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Reproduce `/en/properties` locally, inspect the first server-side exception, verify the Teable API endpoint and environment configuration, fix the smallest root cause, run typecheck/tests/build, then commit and push to main."

## Footer/Header Verification
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify the top-of-footer buttons are Add property and real-estate-agents, verify the header labels are Properties (directory) and Agents (directory), run checks, and push only if changes are required."

## Teable Verification
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify Teable reads using environment variables only. Confirm TEABLE_API_URL resolves to https://app.teable.ai/api, never print TEABLE_API_TOKEN, and do not perform writes without reading the existing record first."

## Advertiser Dashboard
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Continue the advertiser flow: protected /account/properties dashboard, property creation at /account/properties/new, ownership-gated editing, active/expiring/archived status, renewal selection, and enquiry statistics. Verify all routes and tests."

## PR / Deployment Check
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Inspect git status, git diff, git log --oneline -10, and origin tracking. Run pnpm typecheck, pnpm test, and pnpm build. Push only the intended changes to main and report the commit hash."

## Stripe / Resend Configuration
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Do not recreate lifecycle fields or replace Teable OTP/Google OAuth. Add only the supplied Stripe credentials and canonical Price IDs, verify the existing webhook configuration, configure Resend only where the canonical automation requires it, run production checks, and report the deployment commit."

## Security Rotation
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Rotate the exposed GitHub and Teable PATs, update Vercel Production variables without printing secrets, verify the deployed commit, and confirm the working tree is clean."
