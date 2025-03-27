import { NextResponse } from "next/server";
import { generateText, generateObject } from "ai";
import { togetherai } from '@ai-sdk/togetherai';
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { groq } from '@ai-sdk/groq';
import { z } from "zod";

const IngredientSchema = z.object({
  ingredient: z.string(),
  common_name: z.string(),
  side_effects: z.string()
});

const IngredientsSchemaObject = z.object({
  ingredients: z.array(IngredientSchema)
});

async function analyzeImageTogetherAI(image: File) {
  const bytes = await image.arrayBuffer();
  const base64Image = Buffer.from(bytes).toString("base64");

  const { text } = await generateText({
    model: togetherai('meta-llama/Llama-Vision-Free'),
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this image of product ingredients. For each ingredient:\n1. List the scientific or chemical name as "ingredient"\n2. Provide the common Indian name or local name as "common_name"\n3. List known side effects, allergic reactions, or health concerns as "side_effects"\n\nReturn ONLY a JSON array of objects with these exact properties: ingredient, common_name, side_effects. Format must be valid JSON without any additional text or explanations.' },
        { type: 'image', image: base64Image }
      ]
    }]
  });

  // console.log("Analysis result:", text);
  return JSON.parse(text);
}

async function analyzeImageOpenAI(image: File) {

  const bytes = await image.arrayBuffer();
  const base64Image = Buffer.from(bytes).toString("base64");

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that provides information about ingredients in JSON format.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this image and identify all ingredients. For each ingredient, provide its common indian name, and potential side effects or harmful effects." },
          { type: "image", image: base64Image }
        ]
      },
    ],
    schema: IngredientsSchemaObject
  });

  // console.log("Analysis result:", object.ingredients);
  return object.ingredients;
}

async function analyzeImageGoogle(image: File) {
  const bytes = await image.arrayBuffer();
  const base64Image = Buffer.from(bytes).toString("base64");

  const { object } = await generateObject({
    model: google("gemini-2.5-pro-exp-03-25"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that provides information about ingredients in JSON format.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this image and identify all ingredients. For each ingredient, provide its common indian english name , and potential side effects or harmful effects. Do not use hindi name for common_name. Use only english or tamil name for common_name. Format the response as a JSON array of objects with the properties: ingredient, common_name, and side_effects." },
          { type: "image", image: base64Image }
        ]
      },
    ],
    schema: IngredientsSchemaObject
  });

  // console.log("Analysis result:", object.ingredients);
  return object.ingredients;
}

async function analyzeImageGroq(image: File) {
  const bytes = await image.arrayBuffer();
  const base64Image = Buffer.from(bytes).toString("base64");

  const { text } = await generateText({
    model: groq('llama-3.2-90b-vision-preview'),
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this image of product ingredients. For each ingredient:\n1. List the scientific or chemical name as "ingredient"\n2. Provide the common Indian name or local name as "common_name"\n3. List side effects , allergic reactions, or health concerns as "side_effects"\n\nReturn ONLY a JSON array of objects with these exact properties: ingredient, common_name, side_effects. Format must be valid JSON without any additional text or explanations.' },
        { type: 'image', image: base64Image }
      ]
    }]
  });

  // console.log("Analysis result:", text);
  return JSON.parse(text);
}
export const maxDuration = 40; 
export async function POST(req: Request) {
  console.log("API route called");

  let ingredients: any[] = [];
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    const llm = formData.get("llm") || "google";
    console.log("Using LLM:", llm);

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    try {
      switch (llm) {
        case 'togetherai':
          ingredients = await analyzeImageTogetherAI(image);
          break;
        case 'openai':
          ingredients = await analyzeImageOpenAI(image);
          break;
        case 'google':
          ingredients = await analyzeImageGoogle(image);
          break;
        case 'groq':
          ingredients = await analyzeImageGroq(image);
          break;
        default:
          ingredients = await analyzeImageGoogle(image);
      }
      // console.dir(ingredients);
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
    }

    // Fallback data
    if (ingredients.length === 0) {
      console.log("Using fallback sample data");
      ingredients = [
        {
          ingredient: "Aloe Vera",
          common_name: "Aloe barbadensis miller",
          side_effects:
            "Generally safe, but may cause skin irritation in some individuals. Oral consumption may cause abdominal cramps and diarrhea.",
        },
        {
          ingredient: "Lavender Oil",
          common_name: "Lavandula angustifolia",
          side_effects: "May cause skin irritation, allergic reactions, or nausea in sensitive individuals.",
        },
        {
          ingredient: "Glycerin",
          common_name: "Glycerol (C3H8O3)",
          side_effects:
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

