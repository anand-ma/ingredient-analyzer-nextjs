from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer, Paragraph
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
import os
import uuid

def generate_pdf(raw_data):
    # Define custom pastel green colors
    header_green = colors.Color(0.45, 0.65, 0.45)
    row_green1 = colors.Color(0.85, 0.95, 0.85)
    row_green2 = colors.Color(0.75, 0.87, 0.75)
    grid_green = colors.Color(0.6, 0.8, 0.6)

    # Create a sample style sheet and adjust paragraph style for word wrapping
    styles = getSampleStyleSheet()
    para_style = styles["BodyText"]

    # Convert raw strings into Paragraph objects for proper text wrapping
    data = []
    for idx, row in enumerate(raw_data):
        new_row = []
        for cell in row:
            style = para_style.clone('header_style' if idx == 0 else 'body_style')
            style.fontName = 'Helvetica-Bold' if idx == 0 else 'Helvetica'
            new_row.append(Paragraph(str(cell), style))
        data.append(new_row)

    # Set column widths
    col_widths = [1.8 * inch, 2.4 * inch, 3.0 * inch]

    # Create output directory if it doesn't exist
    output_dir = "temp"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Create the PDF document
    random_filename = f"ingredients_analysis_{uuid.uuid4().hex[:8]}.pdf"
    pdf_path = os.path.join(output_dir, random_filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=inch,
        bottomMargin=inch
    )

    # Create the table object with column widths and center alignment
    table = Table(data, colWidths=col_widths)
    table.hAlign = "CENTER"
    
    # Add table styles
    base_style = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), header_green),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("VALIGN", (0, 0), (-1, 0), "MIDDLE"),
        ("FONTSIZE", (0, 0), (-1, 0), 14),
        ("TOPPADDING", (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
        ("GRID", (0, 0), (-1, -1), 1, grid_green),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("wordWrap", (0, 1), (-1, -1), 'CJK'),
    ])
    table.setStyle(base_style)

    # Apply alternating row colors
    for row in range(1, len(data)):
        bg_color = row_green1 if row % 2 == 0 else row_green2
        table.setStyle(TableStyle([("BACKGROUND", (0, row), (-1, row), bg_color)]))

    # Build the PDF document
    elements = [Spacer(1, 0.25 * inch), table]
    doc.build(elements)
    
    return pdf_path