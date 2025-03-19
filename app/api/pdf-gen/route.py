# to run: uvicorn route:app --reload --port 8000

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import json
from pdf_gen import generate_pdf
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Ingredient(BaseModel):
    ingredient: str
    common_name: str
    side_effects: str

class IngredientsRequest(BaseModel):
    ingredients: List[Ingredient]

@app.post("/generate-pdf")
async def create_pdf(request: IngredientsRequest):
    try:
      # Print the request object
      print("Received request:", request)
      
      # Convert ingredients to the format expected by generate_pdf
      raw_data = [["Ingredient", "Common Name/Botanical Identity", "Potential Side Effects/Harmful Effects"]]
      for item in request.ingredients:
        raw_data.append([
          item.ingredient,
          item.common_name,
          item.side_effects
        ])
      print("Raw data for PDF generation:", json.dumps(raw_data, indent=2))
      # Generate PDF
      pdf_path = generate_pdf(raw_data)
      
      # Return PDF file
      return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="ingredients_analysis.pdf"
      )
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))