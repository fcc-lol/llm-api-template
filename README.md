# LLM API Template

A flexible Express.js server that provides a unified API interface for multiple Language Model providers including Anthropic, OpenAI, Google, and DeepSeek.

## Features

- Single API endpoint for multiple LLM providers
- Support for:
  - Anthropic (Claude)
  - OpenAI (GPT models)
  - Google (Gemini)
  - DeepSeek

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your API keys:
   ```
   ANTHROPIC_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   GOOGLE_API_KEY=your_key_here
   DEEPSEEK_API_KEY=your_key_here
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Usage

### Make a Request

```
GET /:platform/:model?
```

- `:platform` - Required: One of `anthropic`, `openai`, `google`, or `deepseek`
- `:model` - Optional: Specific model name (defaults to platform's default model)
- Query parameter: `message` - The prompt to send to the LLM

### Default Models

- Anthropic: `claude-3-5-sonnet-20241022`
- OpenAI: `gpt-4o-mini`
- Google: `gemini-1.5-flash`
- DeepSeek: `deepseek-chat`

### Example Request

```
GET /anthropic?message=What is the capital of France?
```

### Root Endpoint

```
GET /
```

Returns API information including:

- Supported platforms
- Available endpoints
- Basic usage instructions

### Health Check

```
GET /health
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `ANTHROPIC_API_KEY` - Anthropic API key
- `OPENAI_API_KEY` - OpenAI API key
- `GOOGLE_API_KEY` - Google API key
- `DEEPSEEK_API_KEY` - DeepSeek API key
