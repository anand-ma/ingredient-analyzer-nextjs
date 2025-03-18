# Ingredient Analyzer Next.js App

This is a Next.js application that analyzes images of product ingredients using various AI models. The app allows users to upload an image of product ingredients and receive a detailed analysis of each ingredient, including its scientific name, common Indian name, and potential side effects.

## Features

- Upload an image of product ingredients
- Analyze the image using different AI models
- Receive a JSON array of ingredients with detailed information

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/ingredient-analyzer-nextjs.git
    cd ingredient-analyzer-nextjs
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file based on the `.env.example` file and configure your environment variables.

### Running the App

To run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the app for production:

```sh
npm run build
```

To start the production server:

```sh
npm start
```

## API Endpoints

### Analyze Image

- **Endpoint:** `/api/analyze-image`
- **Method:** `POST`
- **Parameters:**
  - `image`: The image file to be analyzed (required)
  - `llm`: The AI model to use for analysis (optional, default: `google`)

### URL Parameter `llm`

The `llm` URL parameter specifies which AI model to use for analyzing the image. The available options are:

- `togetherai`: Uses the Together AI model
- `openai`: Uses the OpenAI model
- `google`: Uses the Google model (default)
- `groq`: Uses the Groq model

Example usage:

```sh
http://localhost:3000/?llm=google
```

## Technologies Used

- [![Next.js](https://nextjs.org/static/favicon/favicon-32x32.png) Next.js](https://nextjs.org/): A React framework for building web applications.
- [![Tailwind CSS](https://tailwindcss.com/favicon-32x32.png) Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
- [![Vercel AI SDK](https://vercel.com/favicon.ico) Vercel AI SDK](https://vercel.com/docs/ai/vercel-ai-sdk): A toolkit for integrating AI models into applications.
  - [![Together AI](https://together.ai/favicon.ico) Together AI](https://together.ai/): An AI platform for collaborative intelligence.
  - [![OpenAI](https://openai.com/favicon.ico) OpenAI](https://openai.com/): An AI research lab and deployment company.
  - [![Google AI](https://ai.google/favicon.ico) Google AI](https://ai.google/): Google's AI and machine learning research division.
  - [![Groq](https://groq.com/favicon.ico) Groq](https://groq.com/): A company specializing in AI accelerators and hardware.
- [![Zod](https://zod.dev/favicon.ico) Zod](https://zod.dev/): A TypeScript-first schema declaration and validation library.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.