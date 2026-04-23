# HealthCare Subsidy Advisor

A demo web application for Singapore residents to check their CHAS card tier, HealthierSG subsidy balance, and eligibility for nationally recommended health screenings and vaccinations.

> **Disclaimer:** This is a demo/educational application. It is not affiliated with the Singapore Government, MOH, or any government agency. For official information, visit [chas.sg](https://www.chas.sg) or [healthiersg.gov.sg](https://www.healthiersg.gov.sg).

## Features

- **Mock Singpass Login** — Choose from 4 demo profiles or create a custom profile with adjustable age, gender, and household income
- **CHAS Tier Calculation** — Automatically determines Blue, Orange, or Green tier based on household monthly income per capita
- **Vaccination Eligibility** — Full NAIS schedule including Influenza, Pneumococcal, Shingles, HPV, Tdap, Hepatitis B, MMR, Varicella, and COVID-19
- **Screening Eligibility** — Cardiovascular risk, cervical cancer, colorectal cancer, and breast cancer screenings based on age and gender
- **Responsive Design** — Mobile-first layout matching Singapore Government design standards
- **SG Government Masthead** — Official-style header and MOH-branded footer

## Tech Stack

- [React 18](https://react.dev/) — UI framework
- [Vite 6](https://vite.dev/) — Build tool
- GitHub Actions — CI/CD
- GitHub Pages — Hosting

---

## Deploy to GitHub Pages

### Option A: Automatic deployment (recommended)

This project includes a GitHub Actions workflow that automatically builds and deploys on every push to `main`.

#### Steps:

1. **Create a new GitHub repository**

   Go to [github.com/new](https://github.com/new) and create a repo named `healthcare-subsidy-advisor` (or any name you prefer).

2. **Update the base path in `vite.config.js`**

   If your repo name is different from `healthcare-subsidy-advisor`, edit the `base` field:

   ```js
   base: '/your-repo-name/',
   ```

3. **Push the code**

   ```bash
   cd healthcare-subsidy-advisor
   npm install
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**

   - Go to your repo → **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will run automatically on push and deploy to:
     ```
     https://<your-username>.github.io/<your-repo-name>/
     ```

5. **Done!** The site will be live in ~2 minutes after the first push.

---

### Option B: Manual deployment with `gh-pages`

If you prefer not to use GitHub Actions:

```bash
# Install dependencies
npm install

# Build and deploy to gh-pages branch
npm run deploy
```

Then go to **Settings → Pages** and set the source to **Deploy from a branch** → `gh-pages` / `/ (root)`.

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
healthcare-subsidy-advisor/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions auto-deploy
├── public/                     # Static assets
├── src/
│   ├── App.jsx                 # Main application component
│   └── main.jsx                # React entry point
├── index.html                  # HTML entry point
├── package.json
├── vite.config.js              # Vite config (edit base path here)
└── README.md
```

## License

MIT — Free for educational and personal use.
