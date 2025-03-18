import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  console.log("API route called");
  
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze this image and identify all ingredients. For each ingredient, provide its common name, botanical identity, and potential side effects or harmful effects. Format the response as a JSON array of objects with the properties: name, botanicalIdentity, and potentialEffects.
        Image: ${base64Image}`,
        temperature: 0.7
      });
      
      console.log("Analysis result:", text);
      console.dir(text);
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
    }

    let ingredients: any[] = [];
    
    /* // ...existing commented code for parsing... */

    // Fallback data
    if (ingredients.length === 0) {
      console.log("Using fallback sample data");
      ingredients = [
        {
          name: "Aloe Vera",
          botanicalIdentity: "Aloe barbadensis miller",
          potentialEffects:
            "Generally safe, but may cause skin irritation in some individuals. Oral consumption may cause abdominal cramps and diarrhea.",
        },
        {
          name: "Lavender Oil",
          botanicalIdentity: "Lavandula angustifolia",
          potentialEffects: "May cause skin irritation, allergic reactions, or nausea in sensitive individuals.",
        },
        {
          name: "Glycerin",
          botanicalIdentity: "Glycerol (C3H8O3)",
          potentialEffects:
            "Generally recognized as safe, but may cause headaches, dizziness, or nausea in some individuals when consumed in large amounts.",
        },
      ];
    }

    return NextResponse.json({ ingredients });

  } catch (error: any) {
    console.log("Server error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

