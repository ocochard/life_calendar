// Set max date to today
document.addEventListener('DOMContentLoaded', function() {
    const birthdateInput = document.getElementById('birthdate');
    const today = new Date().toISOString().split('T')[0];
    birthdateInput.setAttribute('max', today);

    // PNG button handler
    document.getElementById('png-btn').addEventListener('click', function() {
        handleGenerate('png');
    });
});

// Form submission handler (PDF)
document.getElementById('calendar-form').addEventListener('submit', function(e) {
    e.preventDefault();
    handleGenerate('pdf');
});

// Unified generate handler
function handleGenerate(format) {
    // Clear previous messages
    hideMessage('error-message');
    hideMessage('success-message');

    // Get form values
    const birthdate = document.getElementById('birthdate').value;
    const title = document.getElementById('title').value || 'A 90-Year Human Life in Weeks';

    // Validate birthdate
    if (!birthdate) {
        showError('Please enter your birthdate');
        return;
    }

    const birthdateObj = new Date(birthdate);
    const today = new Date();

    if (birthdateObj > today) {
        showError('Birthdate cannot be in the future');
        return;
    }

    // Show loading state
    toggleLoading(true, format);

    // Generate (using setTimeout to allow UI to update)
    setTimeout(() => {
        try {
            if (format === 'pdf') {
                generateLifeCalendarPDF(birthdate, title);
                showSuccess('PDF generated successfully!');
            } else {
                generateLifeCalendarPNG(birthdate, title);
                showSuccess('PNG generated successfully!');
            }
        } catch (error) {
            showError(`Error generating ${format.toUpperCase()}: ` + error.message);
        } finally {
            toggleLoading(false, format);
        }
    }, 100);
}

/**
 * Calculate the number of weeks lived since birthdate
 */
function calculateWeeksLived(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();
    const diffTime = today - birth;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
}

/**
 * Generate the life calendar PDF
 */
function generateLifeCalendarPDF(birthdate, title) {
    const { jsPDF } = window.jspdf;

    // Calculate weeks lived
    const weeksLived = calculateWeeksLived(birthdate);

    // Create PDF (A4 portrait: 210mm x 297mm)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Constants
    const WEEKS_PER_YEAR = 52;
    const MAX_YEARS = 90;
    const TOTAL_WEEKS = WEEKS_PER_YEAR * MAX_YEARS;

    // Page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const labelSpaceLeft = 20;
    const labelSpaceTop = 20;

    // Calculate box size to fit the grid
    const usableWidth = pageWidth - (2 * margin) - labelSpaceLeft;
    const usableHeight = pageHeight - (2 * margin) - labelSpaceTop;

    // Box size with spacing (spacing = 0.5 * box size)
    const spacingFactor = 0.5;
    const boxSizeFromWidth = usableWidth / (WEEKS_PER_YEAR + (WEEKS_PER_YEAR - 1) * spacingFactor);
    const boxSizeFromHeight = usableHeight / (MAX_YEARS + (MAX_YEARS - 1) * spacingFactor);
    const boxSize = Math.min(boxSizeFromWidth, boxSizeFromHeight);
    const spacing = boxSize * spacingFactor;

    // Calculate grid dimensions and center it
    const gridWidth = WEEKS_PER_YEAR * boxSize + (WEEKS_PER_YEAR - 1) * spacing;
    const gridHeight = MAX_YEARS * boxSize + (MAX_YEARS - 1) * spacing;
    const startX = margin + labelSpaceLeft + (usableWidth - gridWidth) / 2;
    const startY = margin + labelSpaceTop + (usableHeight - gridHeight) / 2;

    // Add title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(title, pageWidth / 2, margin, { align: 'center' });

    // Draw the grid
    doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0); // Black stroke color for all boxes

    for (let year = 0; year < MAX_YEARS; year++) {
        for (let week = 0; week < WEEKS_PER_YEAR; week++) {
            const weekNumber = year * WEEKS_PER_YEAR + week;
            const x = startX + week * (boxSize + spacing);
            const y = startY + year * (boxSize + spacing);

            if (weekNumber < weeksLived) {
                // Past weeks - filled black with black border
                doc.setFillColor(0, 0, 0);
                doc.rect(x, y, boxSize, boxSize, 'FD');
            } else {
                // Future weeks - empty with black border
                doc.rect(x, y, boxSize, boxSize, 'S');
            }
        }
    }

    // Add age labels on the left (0-85, every 5 years)
    doc.setFontSize(7);
    doc.setFillColor(0, 0, 0);
    const labelInterval = 5;

    for (let age = 0; age < MAX_YEARS; age += labelInterval) {
        const y = startY + age * (boxSize + spacing) + boxSize / 2;
        const labelX = startX - 5;
        doc.text(age.toString(), labelX, y + 1, { align: 'right' });
    }

    // Add age 90 on the right side only
    const y90 = startY + MAX_YEARS * (boxSize + spacing) + boxSize / 2;
    const labelXRight = startX + gridWidth + 5;
    doc.text('90', labelXRight, y90 + 1, { align: 'left' });

    // Add week labels on top (every 5 weeks, starting from 1)
    for (let week = 0; week <= WEEKS_PER_YEAR; week += labelInterval) {
        let displayWeek = week;
        if (week === 0) displayWeek = 1;
        const x = startX + (displayWeek - 1) * (boxSize + spacing) + boxSize / 2;
        doc.text(displayWeek.toString(), x, startY - 2, { align: 'center' });
    }

    // Add axis labels
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');

    // Add "Age" label vertically with arrow pointing down
    const ageLabelX = startX - 12;
    const ageLabelY = startY;

    doc.saveGraphicsState();
    doc.text('Age', ageLabelX, ageLabelY, { angle: 90 });
    doc.restoreGraphicsState();

    // Draw vertical arrow pointing down (stops around age 15)
    const arrowVX = ageLabelX + 2;
    const arrowVStartY = ageLabelY + 10;
    const arrowVEndY = startY + 15 * (boxSize + spacing);

    doc.setLineWidth(1);
    doc.line(arrowVX, arrowVStartY, arrowVX, arrowVEndY);
    // Arrow head
    doc.line(arrowVX, arrowVEndY, arrowVX - 1, arrowVEndY - 2);
    doc.line(arrowVX, arrowVEndY, arrowVX + 1, arrowVEndY - 2);

    // Add "Week of Year" label with arrow pointing right
    const weekLabelX = startX;
    const weekLabelY = startY - 10;
    doc.text('Week of Year', weekLabelX, weekLabelY);

    // Draw horizontal arrow pointing right (stops around week 25)
    const arrowStartX = weekLabelX + 27;
    const arrowEndX = startX + 25 * (boxSize + spacing);
    const arrowY = weekLabelY - 2;

    doc.line(arrowStartX, arrowY, arrowEndX, arrowY);
    // Arrow head
    doc.line(arrowEndX, arrowY, arrowEndX - 2, arrowY + 1);
    doc.line(arrowEndX, arrowY, arrowEndX - 2, arrowY - 1);

    // Add footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(
        'Each box represents one week of your life. Black boxes are weeks you\'ve lived.',
        pageWidth / 2,
        pageHeight - margin + 5,
        { align: 'center' }
    );

    // Save the PDF
    const filename = `life_calendar_${birthdate}.pdf`;
    doc.save(filename);
}

/**
 * Generate the life calendar PNG
 */
function generateLifeCalendarPNG(birthdate, title) {
    // Calculate weeks lived
    const weeksLived = calculateWeeksLived(birthdate);

    // Constants
    const WEEKS_PER_YEAR = 52;
    const MAX_YEARS = 90;

    // Canvas dimensions (A4 aspect ratio at high resolution for print quality)
    // A4 is 210mm x 297mm (1:1.414 ratio)
    const canvasWidth = 2480;  // 210mm at ~300 DPI
    const canvasHeight = 3508; // 297mm at ~300 DPI

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Margins (proportional to PDF version)
    const marginLeft = 414;   // 35mm
    const marginTop = 473;    // 40mm
    const marginRight = 177;  // 15mm
    const marginBottom = 177; // 15mm

    // Calculate box size to fit the grid
    const availableWidth = canvasWidth - marginLeft - marginRight;
    const availableHeight = canvasHeight - marginTop - marginBottom;

    // Box size with spacing (spacing = 0.5 * box size)
    const boxSizeFromWidth = availableWidth / 77.5;
    const boxSizeFromHeight = availableHeight / 134.5;
    const boxSize = Math.min(boxSizeFromWidth, boxSizeFromHeight);
    const spacing = boxSize * 0.5;

    // Add title
    ctx.fillStyle = 'black';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvasWidth / 2, 236); // ~20mm from top

    // Draw the grid
    for (let year = 0; year < MAX_YEARS; year++) {
        for (let week = 0; week < WEEKS_PER_YEAR; week++) {
            const weekNumber = year * WEEKS_PER_YEAR + week;
            const x = marginLeft + week * (boxSize + spacing);
            const y = marginTop + year * (boxSize + spacing);

            if (weekNumber < weeksLived) {
                // Past weeks - filled black with black border
                ctx.fillStyle = '#000000';
                ctx.fillRect(x, y, boxSize, boxSize);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, boxSize, boxSize);
            } else {
                // Future weeks - empty with black border
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, boxSize, boxSize);
            }
        }
    }

    // Add age labels on the left (0-85, every 5 years)
    ctx.fillStyle = '#646464';
    ctx.font = '26px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const labelInterval = 5;

    for (let age = 0; age < MAX_YEARS; age += labelInterval) {
        const y = marginTop + age * (boxSize + spacing);
        ctx.fillText(age.toString(), marginLeft - 95, y + boxSize / 2); // ~8mm left of grid
    }

    // Add age 90 on the right side only
    const gridWidth = WEEKS_PER_YEAR * (boxSize + spacing) - spacing;
    const y90 = marginTop + MAX_YEARS * (boxSize + spacing);
    ctx.textAlign = 'left';
    ctx.fillText('90', marginLeft + gridWidth + 95, y90 + boxSize / 2);

    // Add week labels on top
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    for (let week = 0; week < WEEKS_PER_YEAR; week += labelInterval) {
        const x = marginLeft + week * (boxSize + spacing);
        ctx.fillText(week.toString(), x + boxSize / 2, marginTop - 36); // ~3mm above grid
    }

    // Add directional arrows and labels
    ctx.font = '30px Arial';
    ctx.fillStyle = '#646464';
    ctx.strokeStyle = '#646464';
    ctx.lineWidth = 2;

    // Age arrow (vertical)
    const arrowX = marginLeft - 177; // ~15mm left
    const arrowStartY = marginTop;
    const arrowEndY = marginTop + 236; // ~20mm arrow

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowStartY);
    ctx.lineTo(arrowX, arrowEndY);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(arrowX - 12, arrowEndY - 24);
    ctx.lineTo(arrowX, arrowEndY);
    ctx.lineTo(arrowX + 12, arrowEndY - 24);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillText('Age', arrowX, arrowEndY + 59); // Label below arrow

    // Week arrow (horizontal)
    const arrowY = marginTop - 95; // ~8mm above
    const arrowStartX = marginLeft;
    const arrowEndX = marginLeft + 236; // ~20mm arrow

    ctx.beginPath();
    ctx.moveTo(arrowStartX, arrowY);
    ctx.lineTo(arrowEndX, arrowY);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(arrowEndX - 24, arrowY - 12);
    ctx.lineTo(arrowEndX, arrowY);
    ctx.lineTo(arrowEndX - 24, arrowY + 12);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillText('Week', arrowEndX + 36, arrowY + 12); // Label right of arrow

    // Add footer
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(
        'Each box represents one week of your life. Black boxes are weeks you\'ve lived.',
        canvasWidth / 2,
        canvasHeight - 95 // ~8mm from bottom
    );

    // Convert canvas to blob and download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `life_calendar_${birthdate}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

/**
 * UI Helper Functions
 */
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function hideMessage(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

function toggleLoading(isLoading, format) {
    const pdfBtn = document.querySelector('.pdf-btn');
    const pngBtn = document.querySelector('.png-btn');
    const targetBtn = format === 'pdf' ? pdfBtn : pngBtn;

    const btnText = targetBtn.querySelector('.btn-text');
    const btnLoading = targetBtn.querySelector('.btn-loading');

    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        pdfBtn.disabled = true;
        pngBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        pdfBtn.disabled = false;
        pngBtn.disabled = false;
    }
}
