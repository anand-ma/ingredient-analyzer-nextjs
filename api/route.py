# to run: uvicorn route:app --reload --port 8000

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from .utils.pdf_gen import generate_pdf
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

@app.post("/api/generate-pdf")
async def create_pdf(request: IngredientsRequest, background_tasks: BackgroundTasks):
    try:
        # Convert ingredients to the expected format for generate_pdf
        raw_data = [["Ingredient", "Common Name / Botanical Identity", "Potential Side Effects / Harmful Effects"]]
        for item in request.ingredients:
            raw_data.append([
                item.ingredient,
                item.common_name,
                item.side_effects,
            ])
        # Generate PDF
        pdf_path = generate_pdf(raw_data)
        
        # Schedule deletion of the temporary PDF after the response is sent
        background_tasks.add_task(os.remove, pdf_path)
        
        # Return the PDF file as response
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename="ingredients_analysis.pdf",
            background=background_tasks
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))