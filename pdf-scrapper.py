from pdfminer.high_level import extract_text

pdf_path = "Wasim-Ansari-Detailed-CV.pdf"
text = extract_text(pdf_path)
print(text)