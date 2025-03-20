"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Define the ingredient data structure
interface Ingredient {
  ingredient: string
  common_name: string
  side_effects: string
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      // Reset results when a new image is selected
      setIngredients([])
      setError(null)
      setErrorDetails(null)
    }
  }

  const analyzeImage = async () => {
    if (!image) return

    setIsLoading(true)
    setError(null)
    setErrorDetails(null)

    try {
      // Get the URL parameters
      const params = new URLSearchParams(window.location.search)
      const llmParam = params.get('llm') || 'google' // Use 'default' if no llm parameter

      // Create form data to send the image
      const formData = new FormData()
      formData.append("image", image)
      formData.append("llm", llmParam)
      console.log("Sending image to API with llm:", llmParam)

      // Call your API route that will interact with Together API
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      })

      // First check if the response is OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      // Then try to parse the JSON
      let data
      try {
        data = await response.json()
      } catch (err) {
        console.error("Failed to parse response as JSON:", err)
        throw new Error("Invalid response from server")
      }

      // Check if we have ingredients in the response
      if (data.ingredients && Array.isArray(data.ingredients)) {
        setIngredients(data.ingredients)
      } else {
        console.error("Invalid response format:", data)
        throw new Error("Invalid response format from server")
      }
    } catch (err: any) {
      console.error("Error analyzing image:", err)
      setError(err.message || "An error occurred while analyzing the image. Please try again.")
      // If we have more details, show them
      if (err.details) {
        setErrorDetails(err.details)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const generatePDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });
  
      // console.dir("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
  
      // Get the PDF blob
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Open the PDF in a new tab
      window.open(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF report");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-green-50">
      <div className="w-full max-w-4xl">
        <Card className="border-green-200 shadow-md">
          <CardHeader className="bg-green-100 rounded-t-lg">
            <CardTitle className="text-green-800">Ingredient Analyzer</CardTitle>
            <CardDescription>
              Upload an image to analyze ingredients and identify potential side effects
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-lg p-12 text-center">
                <div className="mb-4 text-green-700">
                  <Upload className="mx-auto h-12 w-12" />
                  <h3 className="mt-2 text-sm font-semibold">Upload an image</h3>
                  <p className="mt-1 text-xs text-green-600">PNG, JPG or JPEG up to 10MB</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  variant="outline"
                  className="bg-white text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  Select Image
                </Button>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Image Preview</h3>
                  <div className="relative rounded-lg overflow-hidden border border-green-200">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}

              {image && !isLoading && (
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={analyzeImage}>
                  Analyze Ingredients
                </Button>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <p className="mt-2 text-sm text-green-700">Analyzing ingredients...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex flex-col">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  {errorDetails && <p className="text-xs text-red-600 mt-2 ml-7">{errorDetails}</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {ingredients.length > 0 && (
          <Card className="mt-6 border-green-200 shadow-md">
            <CardHeader className="bg-green-100 rounded-t-lg">
              <CardTitle className="text-green-800">Analysis Results</CardTitle>
              <CardDescription>Identified ingredients and their potential effects</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border border-green-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-green-50">
                    <TableRow className="hover:bg-green-100/50">
                      <TableHead className="font-semibold text-green-800">Ingredient</TableHead>
                      <TableHead className="font-semibold text-green-800">Common Name / Botanical Identity</TableHead>
                      <TableHead className="font-semibold text-green-800">
                        Potential Side Effects / Harmful Effects
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.map((ingredient, index) => (
                      <TableRow
                        key={index}
                        className={cn("hover:bg-green-50", index % 2 === 0 ? "bg-white" : "bg-green-50/50")}
                      >
                        <TableCell className="font-medium">{ingredient.ingredient}</TableCell>
                        <TableCell>{ingredient.common_name}</TableCell>
                        <TableCell>{ingredient.side_effects}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="bg-green-50/50 text-xs text-green-700 italic flex justify-between items-center">
              <Button
                onClick={generatePDF}
                disabled={ingredients.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Generate PDF Report
              </Button>
                <p className="ml-4">Note: This analysis is based on AI interpretation and should not be considered medical advice.</p>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  )
}

