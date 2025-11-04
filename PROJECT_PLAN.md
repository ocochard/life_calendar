# Life Calendar Generator - Project Plan

> **Note**: This project was written by [Claude Code](https://claude.com/claude-code), Anthropic's AI-powered coding assistant.

## Project Overview

**Life Calendar Generator** - A CLI tool that creates a printable PDF showing a person's life in weeks (0-90 years old), with past weeks filled in black.

### Inspiration
Based on the Wait But Why life calendars: https://store.waitbutwhy.com/collections/life-calendars

### Purpose
To help humans understand how precious time is by visualizing their entire life as weeks, showing what has passed and what potentially remains.

---

## Technical Approach

### Technology Stack
- **Language**: Python 3 (simple, readable, great for this task)
- **PDF Generation**: ReportLab (most straightforward Python PDF library)
- **Date Handling**: Built-in `datetime` module (no external dependency)
- **Dependencies**: Minimal - just ReportLab for PDF generation

### Design Principles
- **KISS (Keep It Simple, Stupid)**: Minimal dependencies, straightforward code
- **Single purpose**: Does one thing well - generates life calendar PDFs
- **Easy to use**: Simple CLI interface with one input (birthdate)
- **Printable output**: High-quality PDF suitable for printing

---

## Core Components

### 1. Input Handler
- Accept birthdate via command-line argument OR prompt user interactively
- Format: YYYY-MM-DD
- Validate the input (proper date format, not future date, reasonable year)
- Calculate current age in weeks

### 2. Calendar Calculator
- Calculate which week of which year the person was born
- Calculate total weeks lived from birth to today
- Determine which boxes to fill (coordinates in the 52×90 grid)
- Account for the starting week offset (birthday might not be week 1)

### 3. PDF Generator
- Create A4 page in **portrait orientation**
- Draw 52×90 grid of small squares with **spacing between boxes (half-box gaps)**
- Fill appropriate squares black (weeks lived)
- Leave future weeks empty/white
- Add labels:
  - Week numbers on top (every 5 weeks)
  - Age labels on left (0, 5, 10...85)
  - Age 90 on right side (emphasizing endpoint)
  - Vertical "Age" label with downward arrow
  - Horizontal "Week of Year" label with rightward arrow
- Use thin gray borders for grid lines (0.5pt)
- Customizable title at the top
- Footer with explanation

---

## Implementation Plan

### Phase 1: Core Logic (30-45 min)
1. Set up project structure (single Python file for KISS)
2. Implement birthdate input and validation
3. Calculate weeks lived since birth
4. Create grid coordinate mapping logic
5. Test calculation accuracy with sample dates

### Phase 2: PDF Generation (45-60 min)
1. Set up ReportLab PDF canvas
2. Calculate optimal square size for page (fit 52×90 grid)
3. Draw grid with thin borders
4. Fill lived weeks with black color
5. Add axis labels (weeks 1-52 on X-axis, ages 0-90 on Y-axis)
6. Test PDF output and print quality

### Phase 3: Testing & Polish (15-30 min)
1. Test with various birthdates (edge cases)
2. Ensure PDF prints correctly on standard paper
3. Add basic error handling (invalid dates, future dates)
4. Create simple README with usage instructions
5. Add informative output messages

**Total Estimated Time**: 1.5 - 2.5 hours

---

## File Structure

```
life-calendar/
├── life_calendar.py    # Single main script (all logic)
├── requirements.txt    # Just: reportlab
└── README.md          # Usage instructions
```

### Alternative (if complexity grows)
```
life-calendar/
├── life_calendar.py    # Main CLI entry point
├── calculator.py       # Date/week calculations
├── pdf_generator.py    # PDF creation logic
├── requirements.txt
└── README.md
```

---

## User Flow

**Interactive Mode:**
```bash
$ python life_calendar.py
Enter your birthdate (YYYY-MM-DD): 1990-05-15
Generating your life calendar...
✓ PDF saved as: life_calendar_1990-05-15.pdf
  You have lived 1,851 weeks out of 4,680 possible weeks.
  That's 39.6% of a 90-year life.
```

**Command-line Mode:**
```bash
$ python life_calendar.py --birthdate 1990-05-15 --title "My Life Journey"
Generating your life calendar...
✓ PDF saved as: life_calendar_1990-05-15.pdf
  You have lived 1,851 weeks out of 4,680 possible weeks.
  That's 39.6% of a 90-year life.
```

---

## Key Design Decisions

### Grid Layout
- **Dimensions**: 52 columns (weeks) × 90 rows (years)
- **Orientation**: Week 1 at top-left, progressing left-to-right, then down by age
- **Spacing**: Half-box gaps between each square (0.5x box size) for readability
- **Total boxes**: 4,680 squares representing potential weeks of life

### Page Configuration
- **Size**: A4 portrait (210mm × 297mm)
- **Square size**: Automatically calculated with spacing to fit grid on one page
- **Margins**: 15mm on all sides for printer safety
- **Layout**: Spacious design emphasizing individual weeks

### Visual Style
- **Border style**: Thin gray lines (0.5pt) - visible but not dominant
- **Lived weeks**: Solid black fill
- **Future weeks**: White/empty with gray border
- **Labels**:
  - Small font (7pt) for numeric labels
  - Bold font (9pt) for axis labels
  - Age labels on left (0-85) and right (90)
  - Week labels on top (every 5 weeks)
- **Directional arrows**:
  - Vertical "Age" label with arrow pointing down (stops ~age 15)
  - Horizontal "Week of Year" label with arrow pointing right (stops ~week 25)
- **Title**: Customizable, bold 16pt at top (default: "A 90-Year Human Life in Weeks")
- **Footer**: Explanatory text in 8pt

### Output
- **Filename pattern**: `life_calendar_YYYY-MM-DD.pdf`
- **Location**: Current directory
- **Quality**: High resolution for printing

---

## Technical Specifications

### Date Calculations
- Birth week is week 0 of age 0
- Each row represents 52 weeks (1 year)
- Account for partial first week (birthday might be mid-week)
- Use ISO week calculation or simple division (7 days = 1 week)

### Grid Coordinates
```
(0,0) = Week 1, Age 0    (51,0) = Week 52, Age 0
(0,1) = Week 1, Age 1    (51,1) = Week 52, Age 1
...
(0,89) = Week 1, Age 89  (51,89) = Week 52, Age 89
```

### PDF Generation Details
```python
# Example calculations for A4 landscape
page_width = 297mm
page_height = 210mm
usable_width = page_width - (2 * margin)
usable_height = page_height - (2 * margin)
square_size = min(usable_width/52, usable_height/90)
```

---

## Potential Enhancements (Future)

### Nice to Have
- Add title/header with name and birthdate
- Include current age and weeks lived statistics
- Add quote or motivational text
- Support different life expectancies (not just 90)
- Command-line arguments for customization

### Advanced Features
- Color-code different life phases (childhood: blue, adult: green, retirement: gold)
- Add major life events as markers (graduations, marriage, children)
- Support for multiple people on one page (family calendars)
- Interactive mode to add life events
- Different themes/color schemes

### Technical Improvements
- Configuration file for customization
- Multiple output formats (PNG, SVG)
- Web interface option
- GUI wrapper for non-technical users

---

## Dependencies

### Required
```txt
reportlab==4.0.7  # Or latest stable version
```

### Built-in Python Modules
- `datetime` - date calculations
- `argparse` - CLI arguments (optional)
- `sys` - system operations
- `os` - file operations

---

## Testing Plan

### Test Cases
1. **Valid inputs**
   - Recent birthdate (2020s)
   - Middle-aged person (1980s-1990s)
   - Elderly person (1930s-1940s)

2. **Edge cases**
   - Born on January 1st (week 1 alignment)
   - Born on December 31st (year boundary)
   - Born exactly today
   - Leap year birthdays

3. **Invalid inputs**
   - Future date
   - Invalid format
   - Non-existent date (Feb 30)
   - Very old dates (before 1900)

4. **Output quality**
   - PDF opens correctly
   - Grid is properly aligned
   - Squares are correct size
   - Prints clearly on paper

---

## Success Criteria

- ✓ User can input birthdate easily (interactive or CLI argument)
- ✓ PDF generates in under 5 seconds
- ✓ Grid is accurately filled based on birthdate
- ✓ Spacing makes individual weeks clearly visible
- ✓ PDF prints clearly on standard printer (portrait A4)
- ✓ Code is simple and maintainable (~210 lines)
- ✓ Only one external dependency (ReportLab)
- ✓ Works on Windows, Mac, Linux
- ✓ Customizable title via command-line argument
- ✓ Clear directional arrows showing time progression

---

## Implementation Status

**Project Status**: ✅ COMPLETED

All planned features have been implemented:
- ✅ Interactive and command-line input modes
- ✅ Portrait A4 layout with spacing
- ✅ Directional arrows (Age and Week of Year)
- ✅ Custom title support
- ✅ Age 90 on right side
- ✅ Comprehensive documentation

---

## Getting Started

### Installation
```bash
pip install reportlab
```

### Usage

**Interactive mode:**
```bash
python life_calendar.py
```

**With command-line arguments:**
```bash
python life_calendar.py --birthdate 1990-05-15 --title "My Life in Weeks"
```

### Example Output
```
==================================================
Life Calendar Generator
==================================================

Generating your life calendar...
✓ PDF saved as: life_calendar_1990-05-15.pdf
  You have lived 1,851 weeks out of 4,680 possible weeks.
  That's 39.6% of a 90-year life.
```

---

## Notes

- Keep the code simple and readable (KISS principle)
- Comment key calculations for clarity
- Handle errors gracefully with helpful messages
- Make it satisfying to use (good feedback messages)
- Remember: this is a personal, meaningful tool - keep it human

---

**Project Status**: Planning Complete ✓
**Next Step**: Ready for implementation
