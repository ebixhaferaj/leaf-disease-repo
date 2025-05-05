from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from io import BytesIO
import os
from datetime import datetime

def generate_pdf(predictions, report_path: str):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    margin = 50
    line_height = 14
    y_position = height - margin

    IMAGE_FOLDER = os.path.abspath("Plant_Disease/app/static/predictions/")
    LOGO_FOLDER = os.path.abspath("Plant_Disease/app/static/logo/")
    LOGO_PATH = os.path.join(LOGO_FOLDER, "HealthyGreens.png")

    # Header: Logo and Title
    try:
        if os.path.exists(LOGO_PATH):
            logo = ImageReader(LOGO_PATH)
            c.drawImage(logo, margin, y_position - 40, width=1.5 * inch, preserveAspectRatio=True, mask='auto')
        else:
            c.setFont("Helvetica", 10)
            c.drawString(margin, y_position - 30, "[Logo not found]")
    except Exception as e:
        c.setFont("Helvetica", 10)
        c.drawString(margin, y_position - 30, f"[Logo error: {e}]")

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(margin + 2 * inch, y_position - 20, "Prediction Report")

    # Timestamp
    c.setFont("Helvetica", 10)
    y_position -= 80
    c.drawString(margin, y_position, f"Generated on: {datetime.utcnow().strftime('%D-%m-%y')}")
    y_position -= line_height * 2

    # Prediction blocks
    for i, prediction in enumerate(predictions, start=1):
        disease = prediction['disease']
        description = prediction['description']
        pesticides = prediction['pesticides']
        confidence = prediction['confidence']
        timestamp = prediction['timestamp']
        image_filename = prediction['image_url']
        image_path = os.path.join(IMAGE_FOLDER, image_filename)

        # Box height and image size
        image_width = 1.5 * inch
        image_height = 1.5 * inch
        box_height = 100
        total_box_height = max(box_height, image_height + 10)

        # Box border
        c.setStrokeColor(colors.grey)
        c.setLineWidth(0.5)
        c.rect(margin - 5, y_position - total_box_height, width - 2 * margin + 10, total_box_height, stroke=1, fill=0)

        # Prediction text
        c.setFont("Helvetica-Bold", 12)
        c.drawString(margin + 5, y_position, f"Prediction #{i}")
        y_position -= line_height * 1.5

        c.setFont("Helvetica", 10)
        c.drawString(margin, y_position, f"Disease: {disease}")
        y_position -= line_height

        c.drawString(margin, y_position, f"Description: {description}")
        y_position -= line_height

        c.drawString(margin, y_position, f"Pesticide Suggestion: {pesticides}")
        y_position -= line_height

        c.drawString(margin, y_position, f"Confidence: {confidence * 100:.2f}%")
        y_position -= line_height

        c.drawString(margin, y_position, f"Timestamp: {timestamp('%H:%M:%S %D-%m-%y')}")
        y_position -= line_height

        # Draw smaller image
        try:
            if os.path.exists(image_path):
                c.drawImage(image_path, width - margin - image_width, y_position - 22,
                            width=image_width, height=image_height, preserveAspectRatio=True, mask='auto')
            else:
                c.drawString(width - margin - image_width, y_position, f"[Image not found: {image_filename}]")
        except Exception as e:
            c.drawString(width - margin - image_width, y_position, f"[Image error: {e}]")

        y_position -= total_box_height + 10

        if y_position < 120:
            c.showPage()
            c.setFont("Helvetica", 10)
            y_position = height - margin

    c.save()
    with open(report_path, "wb") as f:
        f.write(buffer.getvalue())
    return report_path
