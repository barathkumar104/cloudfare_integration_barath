# StackAI Foundation - AI Native App Building Assignment (Level 2)

## Overview
This project implements a Weather Intelligence App that uses public Open-Meteo APIs.
It is prepared for deployment through GitHub to Cloudflare Pages, following the Level 2 assignment requirements.

## Assignment Files
- AI-Assisted App Building Assignment - L2.docx
- AI-Assisted App Building Help Guide - L2.docx
- AI-Assisted App Building Evaluation Rubric - L2.xlsx

## App Features Implemented
- City search with Open-Meteo geocoding
- Current weather card
- 7-day forecast cards
- 7-day temperature trend chart
- Planning recommendation text based on weekly conditions
- Graceful error message for invalid city or API failures
- SPA routing fallback via Cloudflare Pages redirects

## Project Structure
- src/ : React + TypeScript source
- src/components/ : reusable UI components
- public/_redirects : Cloudflare Pages SPA routing fallback
- outputs/ : assignment evidence templates

## Open-Meteo APIs Used
- Geocoding: https://geocoding-api.open-meteo.com/v1/search
- Forecast: https://api.open-meteo.com/v1/forecast

## Local Run Instructions
Prerequisite: Node.js 18+ and npm installed locally.

1. Install dependencies
	npm install
2. Start dev server
	npm run dev
3. Create production build
	npm run build
4. Preview build
	npm run preview
5. Run automated tests
	npm run test

## Cloudflare Pages Deployment Settings
Use these values unless your environment requires a different branch or root:

- Framework preset: Vite
- Build command: npm run build
- Build output directory: dist
- Production branch: main

The file public/_redirects includes:

/* /index.html 200

This avoids 404 on browser refresh for SPA routes.

## Required Validation Tests
Run and capture evidence for:
- Valid city search 1 (example: Chennai)
- Valid city search 2 (example: London)
- Invalid city search error state
- Browser refresh behavior
- Responsive layout behavior

## Automated Test Setup
- Framework: Vitest + React Testing Library
- Test files:
	- src/App.test.tsx
	- src/api.test.ts
- Commands:
	- npm run test
	- npm run test:watch

## Output and Evidence Files Created
- outputs/CLOUDFLARE_DEPLOYMENT_NOTES.md
- outputs/TEST_RESULTS.md
- outputs/SUBMISSION_EVIDENCE_CHECKLIST.md

Fill these files while completing deployment and testing evidence.

## Submission Reminder
- Complete the evaluation rubric file before submission.
- Package all required files into a single ZIP named:
  empid_emp_name_appbuilding_L2.zip

## Guardrails
- Use only public Open-Meteo weather data.
- Do not add Gemini keys, private keys, client data, or customer personal data.
