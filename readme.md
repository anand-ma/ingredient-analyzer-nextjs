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

### 🚀 Frontend
- **Framework:** [![NextJS](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
- **UI Components:** [![Shadcn](https://img.shields.io/badge/Shadcn-000000?style=for-the-badge&logo=shadcn&logoColor=white)](https://ui.shadcn.com/)
- **Styling:** [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

### 🛠️ Backend
- **Runtime:** [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
- **Framework:** [![Next.js API Routes](https://img.shields.io/badge/Next.js_API_Routes-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/docs/api-routes/introduction)
- **Type Safety:** [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
- **Validation:** [![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

### 🤖 AI Development
- **Code Assistant:** [![GitHub Copilot + VSCode](https://img.shields.io/badge/GitHub_Copilot_+_VSCode-24292e?style=for-the-badge&logo=github&logoColor=white)](https://github.com/features/copilot) [![Cursor](https://img.shields.io/badge/Cursor_IDE-000000?style=for-the-badge&logo=cursor&logoColor=white)](https://cursor.sh/)
- **API Integration:** [![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sdk.vercel.ai/)

### 🧠 AI Models
- **OpenAI:** [![OpenAI](https://img.shields.io/badge/OpenAI_GPT--4V-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/gpt-4)
- **Google Gemini:** [![Google Cloud Vision](https://img.shields.io/badge/Google_Cloud_Vision-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/vision)
- **TogetherAI:** [![Together AI](https://img.shields.io/badge/Together_AI-3B82F6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3djEwbDEwIDUgMTAtNVY3TDEyIDJ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+)](https://www.together.ai/)
- **Groq:** [![Groq](https://img.shields.io/badge/Groq_LLM-000000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMTAgMTBoLTEwdi0xMHoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=)](https://www.groq.com/)


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.