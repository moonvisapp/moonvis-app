import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getHijriYear } from './lunarCalendar';

/**
 * Capture the map container (Canvas + SVG) as a JPEG image
 * @param {HTMLElement} mapContainer - The map wrapper element containing canvas and svg
 * @returns {Promise<string>} Data URL of the captured image (JPEG format)
 */
export async function captureMapAsImage(mapContainer) {
    if (!mapContainer) {
        throw new Error('Map container element not found');
    }

    try {
        // Find the canvas element
        let canvas = mapContainer;
        if (mapContainer.tagName !== 'CANVAS') {
            canvas = mapContainer.querySelector('canvas');
        }

        if (canvas) {
            // Direct canvas export - Instant!
            return canvas.toDataURL('image/jpeg', 0.95);
        } else {
            // Fallback to html2canvas if no canvas found (shouldn't happen with new MoonMap)
            console.warn('No canvas found in map container, falling back to html2canvas');
            const captured = await html2canvas(mapContainer, {
                backgroundColor: '#0f172a',
                scale: 1.5,
                logging: false,
                useCORS: true,
                allowTaint: true
            });
            return captured.toDataURL('image/jpeg', 0.95);
        }
    } catch (error) {
        console.error('Error capturing map:', error);
        throw error;
    }
}

/**
 * Generate PDF for lunar calendar with map snapshots
 * @param {Object} calendarData - Calendar data from calculateLunarCalendar
 * @param {Function} captureMapCallback - Callback to trigger map capture for a specific date
 * @param {Function} checkCancelled - Optional callback that returns true if export should be cancelled
 * @returns {Promise<void>}
 */
export async function generateLunarCalendarPDF(calendarData, captureMapCallback, onProgress, checkCancelled) {
    console.log('--- STARTING PDF EXPORT DEBUG ---');
    console.time('Total Export Duration');

    if (!calendarData || !calendarData.months) {
        throw new Error('Invalid calendar data provided for PDF generation.');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Helper to add new page if needed
    const checkPageBreak = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    // Calculate total steps for progress (3 maps per month)
    const totalSteps = calendarData.months.length * 3;
    let completedSteps = 0;

    const reportProgress = () => {
        if (onProgress) {
            const percentage = Math.round((completedSteps / totalSteps) * 100);
            onProgress(percentage);
        }
    };

    // Title
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Lunar Calendar', margin, yPosition);
    yPosition += 10;

    // Location info
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Location: ${calendarData.location.name}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Coordinates: Lat: ${Math.abs(calendarData.location.lat).toFixed(2)}°${calendarData.location.lat >= 0 ? 'N' : 'S'}, Long: ${Math.abs(calendarData.location.lon).toFixed(2)}°${calendarData.location.lon >= 0 ? 'E' : 'W'}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 12;

    // Process each month
    for (let monthIndex = 0; monthIndex < calendarData.months.length; monthIndex++) {
        const month = calendarData.months[monthIndex];

        if (checkCancelled && checkCancelled()) {
            throw new Error('Export cancelled');
        }

        checkPageBreak(20);

        // Calculate Hijri Year based on 10th night (or close to it)
        const tenthDayIndex = Math.min(9, month.days.length - 1);
        const refDateForYear = month.days[tenthDayIndex]?.gregorianDate || month.night1Date;
        const hijriYear = getHijriYear(refDateForYear);

        // Month header
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${month.monthName} ${hijriYear}`, margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Night 1: ${month.night1Date.toLocaleDateString()} (${month.night1Method === 'direct' ? 'Direct visibility' : 'Shared Night inheritance'})`, margin, yPosition);
        yPosition += 6;

        // Conjunction Info
        const conjunctionDate = new Date(month.conjunctionDate);
        const tzOffset = Math.round(calendarData.location.lon / 15);
        const localSolarDate = new Date(conjunctionDate.getTime() + tzOffset * 3600 * 1000);
        const localSolarTimeStr = localSolarDate.toISOString().replace('T', ' ').substring(0, 19);

        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100); // Grey color for conjunction info
        pdf.text(`Conjunction: ${conjunctionDate.toUTCString().replace('GMT', 'UTC')} | Local Solar Time: ${localSolarTimeStr}`, margin, yPosition);
        pdf.setTextColor(0, 0, 0); // Reset to black
        yPosition += 10;

        // Calculate dates for map snapshots
        const night1Date = new Date(month.night1Date);
        const nightBefore = new Date(night1Date);
        nightBefore.setDate(nightBefore.getDate() - 1);
        const nightAfter = new Date(night1Date);
        nightAfter.setDate(nightAfter.getDate() + 1);

        // Capture and add map snapshots
        const dates = [
            { date: nightBefore, label: 'Night Before Night 1' },
            {
                date: night1Date,
                label: 'Night 1',
                options: {
                    highlightSharedNightCells: (month.night1Method === 'shared_night' && month.night1Details?.inheritedFromCells)
                        ? month.night1Details.inheritedFromCells
                        : null
                }
            },
            { date: nightAfter, label: 'Night After Night 1' }
        ];

        for (const { date, label, options } of dates) {
            if (checkCancelled && checkCancelled()) {
                throw new Error('Export cancelled');
            }

            try {
                // Capture map
                console.time(`Capture Map: ${label}`);
                const imageData = await captureMapCallback(date, options);
                console.timeEnd(`Capture Map: ${label}`);

                if (imageData) {
                    console.time('Add Image to PDF');
                    const imgWidth = contentWidth;
                    // Correct aspect ratio based on MoonMap dimensions (870x640)
                    const imgHeight = imgWidth * (640 / 870);

                    checkPageBreak(imgHeight + 15);

                    pdf.setFontSize(10);
                    pdf.setFont(undefined, 'bold');
                    pdf.text(`${label}: ${date.toLocaleDateString()}`, margin, yPosition);
                    yPosition += 6;

                    pdf.addImage(imageData, 'JPEG', margin, yPosition, imgWidth, imgHeight);
                    console.timeEnd('Add Image to PDF');
                    yPosition += imgHeight + 8;
                } else {
                    console.error(`Failed to capture map for ${label}`);
                    pdf.setTextColor(255, 0, 0);
                    pdf.text(`[Map capture failed / Image data null]`, margin, yPosition);
                    pdf.setTextColor(0, 0, 0);
                    yPosition += 10;
                }
            } catch (err) {
                console.error(`Error capturing map for ${label}:`, err);
                pdf.setFontSize(9);
                pdf.text('[Map capture failed]', margin, yPosition);
                yPosition += 10;
            }

            completedSteps++;
            reportProgress();
        }

        // Add calendar table
        checkPageBreak(15);

        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.text('Calendar', margin, yPosition);
        yPosition += 7;

        // Table headers
        const tableStartY = yPosition;
        const colWidths = [15, 45, 20, 110]; // Adjusted widths: Night#, Month, Year, Date

        const rowHeight = 7;

        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');

        // Header background
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, yPosition - 5, contentWidth, rowHeight, 'F');

        // Header Text
        pdf.text('Night #', margin + 2, yPosition);
        pdf.text('Lunar Month', margin + colWidths[0] + 2, yPosition);
        pdf.text('Hijri Year', margin + colWidths[0] + colWidths[1] + 2, yPosition);
        pdf.text('Gregorian Date - Evening Of', margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPosition);

        // Header Borders
        let currentX = margin;
        colWidths.forEach(w => {
            pdf.rect(currentX, yPosition - 5, w, rowHeight);
            currentX += w;
        });

        yPosition += rowHeight;

        // Table rows
        pdf.setFont(undefined, 'normal');
        for (const day of month.days) {
            checkPageBreak(rowHeight + 2);

            // Cell Borders
            let currentCellX = margin;
            colWidths.forEach(w => {
                pdf.rect(currentCellX, yPosition - 5, w, rowHeight);
                currentCellX += w;
            });

            // Cell Text
            pdf.text(day.nightNumber.toString(), margin + 2, yPosition);
            pdf.text(month.monthName, margin + colWidths[0] + 2, yPosition);
            pdf.text(hijriYear.toString(), margin + colWidths[0] + colWidths[1] + 2, yPosition);
            pdf.text(day.gregorianDate.toLocaleDateString(), margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPosition);
            yPosition += rowHeight;
        }

        yPosition += 10;
    }

    // Save the PDF
    const fileName = `lunar-calendar-${calendarData.location.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
}
