# to run: uvicorn route:app --reload --port 8000
# this file is the main entry point for the API and should be named index.py

import logging
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from .utils.pdf_gen import generate_pdf
import os

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

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
            logger.debug(f"Processing ingredient: {item.ingredient}")
            raw_data.append([
                item.ingredient,
                item.common_name,
                item.side_effects,
            ])
            
        # Generate PDF
        pdf_path = generate_pdf(raw_data)
        logger.debug(f"PDF generated successfully at path: {pdf_path}")
        
        # Schedule deletion of the temporary PDF after the response is sent
        background_tasks.add_task(os.remove, pdf_path)
        logger.debug("Scheduled PDF deletion for after response")
        
        # Return the PDF file as response
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename="ingredients_analysis.pdf",
            background=background_tasks
        )
        
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))