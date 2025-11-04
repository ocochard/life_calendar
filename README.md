# Life Calendar Generator

A simple Python CLI tool that generates a printable PDF showing your life in weeks. Inspired by the [Wait But Why Life Calendars](https://store.waitbutwhy.com/collections/life-calendars).

> **Note**: This project was written by [Claude Code](https://claude.com/claude-code), Anthropic's AI-powered coding assistant.

## What It Does

Creates a visual representation of a 90-year life as a grid of 4,680 weeks (52 weeks × 90 years). Each week you've lived is filled in black, while future weeks remain empty. This powerful visualization helps you understand how precious time really is.

## Features

- Simple CLI interface - interactive or command-line arguments
- Generates a clean, printable PDF (A4 portrait)
- 52×90 grid showing every week from age 0 to 90
- Spacious layout with gaps between boxes for better readability
- Past weeks filled in black, future weeks empty
- Clear directional arrows showing time progression
- Age labels: 0-85 on left side, 90 on right side
- Week labels on top axis
- Customizable title
- Minimal dependencies (just ReportLab)
- KISS principle - simple, maintainable code

## Installation

1. Clone or download this repository
2. Create a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Basic Usage (Interactive)

Run the script without arguments and you'll be prompted for your birthdate:
```bash
python life_calendar.py
```

Enter your birthdate when prompted:
```
==================================================
Life Calendar Generator
==================================================

Enter your birthdate (YYYY-MM-DD): 1990-05-15

Generating your life calendar...
✓ PDF saved as: life_calendar_1990-05-15.pdf
  You have lived 1,851 weeks out of 4,680 possible weeks.
  That's 39.6% of a 90-year life.
```

### Quick Usage (Command-line Arguments)

Provide your birthdate as a command-line argument:

```bash
python life_calendar.py --birthdate 1990-05-15
```

### Full Customization

Combine both arguments for complete customization:

```bash
python life_calendar.py --birthdate 1990-05-15 --title "My Personal Life Journey"
```

**Default title**: "A 90-Year Human Life in Weeks"

The PDF will be saved in the current directory with the filename pattern: `life_calendar_YYYY-MM-DD.pdf`

### Command-line Options

```bash
python life_calendar.py --help
```

Options:
- `--birthdate BIRTHDATE` - Your birthdate in YYYY-MM-DD format (optional, you'll be prompted if not provided)
- `--title TITLE` - Custom title for the calendar (optional, default: "A 90-Year Human Life in Weeks")
- `-h, --help` - Show help message and exit

### Examples

**Interactive mode:**
```bash
python life_calendar.py
```

**Quick generation:**
```bash
python life_calendar.py --birthdate 1985-03-20
```

**Custom title:**
```bash
python life_calendar.py --title "The Journey of My Life"
```

**Full control:**
```bash
python life_calendar.py --birthdate 2000-01-01 --title "My Millennium Life"
```

## Requirements

- Python 3.6 or higher
- ReportLab (for PDF generation)

## How to Read Your Calendar

- **X-axis**: Week of the year (1-52) - labeled horizontally with arrow pointing right
- **Y-axis**: Age (0-90 years) - labeled vertically with arrow pointing down
- **Black squares**: Weeks you've already lived
- **Empty squares**: Weeks yet to come (if you live to 90)
- **Spacing**: Gaps between boxes (half the box size) for easier reading

Each row represents one year of your life. Each column represents one week of the year.

## Example Output

The generated PDF includes:
- Customizable title at the top (default: "A 90-Year Human Life in Weeks")
- 52×90 grid of weeks (4,680 total squares) with spacing
- Age labels: 0, 5, 10, 15...85 on the left side
- Age label: 90 on the right side (emphasizing the endpoint)
- Week labels on top (every 5 weeks: 1, 5, 10, 15...50)
- Vertical "Age" label with downward arrow (stops at age ~15)
- Horizontal "Week of Year" label with rightward arrow (stops at week ~25)
- Footer explaining the visualization
- Statistics displayed in terminal output (not in PDF)

## Printing

The PDF is designed to print on standard A4 paper in portrait orientation. For best results:
- Print at 100% scale (no shrinking)
- Use portrait orientation
- High-quality or best print settings recommended

## Technical Details

- **Grid dimensions**: 52 columns × 90 rows = 4,680 squares
- **Page size**: A4 portrait (210mm × 297mm)
- **Spacing**: Half-box gaps between each square for clarity
- **Square size**: Automatically calculated to fit the page with spacing
- **Border style**: Thin gray lines (0.5pt)
- **Calculation**: Days lived ÷ 7 = weeks lived

## Philosophy

This tool is inspired by the idea that visualizing our finite time makes it more tangible and valuable. When you see your life laid out in weeks, it becomes clear how precious each week is.

As Tim Urban from Wait But Why wrote: "It turns out that when I visualize my years, I see a finite number of boxes that feels very real and very tangible."

## License

Free to use for personal purposes. Feel free to modify and share.

## Contributing

This is a simple personal tool following the KISS principle. If you have suggestions or improvements, feel free to fork and modify for your own use.

## Troubleshooting

**Error: "No module named 'reportlab'"**
- Make sure you've installed the requirements: `pip install -r requirements.txt`

**Error: "Birthdate cannot be in the future"**
- Check your date format (YYYY-MM-DD) and ensure it's a past date

**PDF looks wrong when printed**
- Ensure you're printing at 100% scale in landscape orientation
- Check your printer settings for best quality

## Inspiration

- [Wait But Why - Your Life in Weeks](https://waitbutwhy.com/2014/05/life-weeks.html)
- [Wait But Why Life Calendar Store](https://store.waitbutwhy.com/collections/life-calendars)

---

**Remember**: Every week counts. Make them meaningful.
