# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Life Calendar Generator: Available in two versions:
1. **Web Version** (`index.html`, `app.js`, `style.css`): Browser-based, no installation required, generates PDF or PNG
2. **Python CLI** (`life_calendar.py`): Command-line tool for generating PDFs

Both generate a printable visualization showing a person's life in weeks (0-90 years). Past weeks are filled in black, future weeks remain empty. Inspired by Wait But Why Life Calendars.

## Setup

### Web Version
No setup needed - just open `index.html` in any modern browser.

### Python CLI Version
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Application

### Web Version
```bash
# Open in browser
open index.html
```

### Python CLI Version
```bash
# Interactive mode (prompts for birthdate)
python life_calendar.py

# With command-line arguments
python life_calendar.py --birthdate 1990-05-15
python life_calendar.py --birthdate 1990-05-15 --title "My Personal Life Journey"

# Help
python life_calendar.py --help
```

## Code Architecture

### Web Version (`index.html`, `app.js`, `style.css`)

Three-file web application with these components:

1. **HTML (`index.html`)**
   - Form for birthdate and title input
   - Two buttons: Download PDF and Download PNG
   - Loads jsPDF from CDN for PDF generation

2. **JavaScript (`app.js`)**
   - `calculateWeeksLived()`: Converts birthdate to weeks lived (days // 7)
   - `generateLifeCalendarPDF()`: Uses jsPDF to generate A4 portrait PDF
   - `generateLifeCalendarPNG()`: Uses HTML5 Canvas to generate high-res PNG (2480×3508px)
   - Both generators produce identical layouts matching Python version
   - Client-side only - no data leaves the browser

3. **CSS (`style.css`)**
   - Modern gradient UI with responsive design
   - Two-button layout (side-by-side on desktop, stacked on mobile)

### Python Version (`life_calendar.py`)

Single-file application with these key components:

1. **Input Handling**
   - `get_birthdate()`: Interactive prompt with validation
   - `main()`: Argument parsing using argparse, supports `--birthdate` and `--title` flags

2. **Calculation**
   - `calculate_weeks_lived()`: Converts birthdate to weeks lived (days // 7)

3. **PDF Generation**
   - `create_life_calendar_pdf()`: Uses ReportLab to generate A4 portrait PDF
   - Grid: 52 weeks × 90 years = 4,680 total squares
   - Spacing: Gaps between boxes equal to half the box size for readability
   - Layout: Past weeks filled black, future weeks empty with grey border

## Layout Details (Both Versions)

- Page: A4 portrait (210mm × 297mm)
- Margins: 15mm + space for labels (20mm left, 20mm top)
- Grid positioning: Dynamically calculated to center the 52×90 grid with spacing
- Square size: Auto-calculated to fit available space
- Box borders: Thin black lines (0.1mm PDF, 1px PNG)
- Labels: Age (0-85 left, 90 right), weeks (top axis, every 5 weeks starting at 1)
- Directional arrows show time progression (age down, weeks right)
- Title: Centered at top (default: "A 90-Year Human Life in Weeks")
- Footer: "Each box represents one week of your life. Black boxes are weeks you've lived."

## Important Implementation Notes

### Coordinate Systems
- **Python/ReportLab**: Y=0 at bottom of page, increases upward
- **jsPDF**: Y=0 at top of page, increases downward
- Grid calculations must account for this difference to produce identical layouts

### Output Formats
- **PDF (both versions)**: Vector format, ~50-100KB, best for printing
- **PNG (web only)**: Raster at 2480×3508px (~300 DPI), ~200-500KB, good for sharing

## Design Principles

Follows KISS principle:
- **Web version**: No backend, no frameworks, vanilla HTML/CSS/JS
- **Python version**: Single file, minimal dependencies (only ReportLab)
- Both: Straightforward logic, no external configuration
