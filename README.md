# JobHunter (Node.js Job Scraper + Exporter)

A Node.js CLI tool that scrapes job listings for specific keywords, saves results to JSON/CSV/Excel, and can email them to a user.

## Features
- CLI-based job search using keyword flags
- Scrapes job data from job listing pages
- Exports:
  - `jobDetails.json`
  - `jobRecord.csv`
  - Excel workbook via `excel4node`
- Optional email sending of results
- Supports limited keyword types (as noted in code)

## Tech Stack
- Node.js
- axios (HTTP requests)
- minimist (CLI argument parsing)
- excel4node (Excel export)
- fs (file IO)
- nodemailer (email send, if enabled in code)

## Files
```
jobHunter-main/
  jobs.js           # main CLI script
  jobDetails.json   # output JSON
  jobRecord.csv     # output CSV
  jobsUrl.json      # input URLs / sources
  jobDetails.json   # scraped results dump
```

## Install & Run

### 1. Install dependencies
```bash
cd jobHunter-main
npm install minimist axios excel4node
```

### 2. Run scraper
```bash
node jobs.js --jobName=developer --mail="youremail@gmail.com"
```

### CLI Args
- `--jobName`  
  Keyword category (example: `developer`, `graphic_designer`)
- `--mail`  
  Email to send results to (if email logic enabled in file)

## Email Setup (Optional)
Inside `jobs.js`, update the Gmail section:
- Provide Gmail + app password
- Make sure app passwords are configured

**Recommended:** move credentials to `.env`:
```env
GMAIL_USER=youremail@gmail.com
GMAIL_PASS=your_app_password
```

## Output
After running, the script writes:
- Full results to `jobDetails.json`
- Structured sheet to Excel
- CSV record to `jobRecord.csv`

## Future Improvements
- Add dynamic keyword support beyond fixed categories.
- Extract scraper into modular providers per job board.
- Add retry + rate-limit handling.
- Export to Google Sheets.
