# Google Gemini API Setup Guide

This guide will help you set up the Google Gemini API for the Nova AI assistant in the website builder.

## What is Gemini API?

Google Gemini API powers Nova, the AI assistant in the website builder. Nova helps users discover what type of website they need through natural conversation, making the builder experience more intuitive and personalized.

## Features

- **Intelligent Conversation**: Real AI-powered responses instead of pattern matching
- **Site Type Detection**: Automatically detects user needs from conversation
- **Contextual Follow-ups**: Asks relevant questions based on previous answers
- **Graceful Fallback**: Works without API key (falls back to pattern matching)

## Setup Instructions

### 1. Get Your API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Select an existing Google Cloud project or create a new one
5. Copy your API key

### 2. Add to Environment Variables

1. Open your `.env.local` file (or create it from `.env.example`)
2. Add your API key:

```bash
GEMINI_API_KEY=your-actual-api-key-here
```

3. Save the file
4. Restart your dev server:

```bash
npm run dev
```

### 3. Test the Integration

1. Navigate to `http://localhost:3000/builder`
2. The Nova AI assistant should appear in the right sidebar
3. Start chatting with Nova about your website needs
4. Nova should provide intelligent, contextual responses

## How It Works

### API Route: `/api/chat`

Located at `src/app/api/chat/route.ts`, this endpoint:
- Receives conversation history from the AIAgent component
- Calls Claude API with a specialized system prompt
- Returns Nova's response and detected site type
- Falls back gracefully if API is not configured

### System Prompt

Nova is configured with a specific personality:
- Friendly and conversational
- Asks 1-2 clarifying questions at a time
- Keeps responses concise (2-3 sentences max)
- Detects site types from keywords (portfolio, store, blog, business, landing)

### Model Configuration

```typescript
model: 'gemini-1.5-flash'  // Fast, free tier available
maxOutputTokens: 300
temperature: 0.7
```

### AIAgent Component

Located at `src/components/builder/AIAgent.tsx`:
- Sends messages to `/api/chat` endpoint
- Displays responses in real-time with typing indicator
- Falls back to pattern matching if API fails
- Maintains conversation history

## Pricing

Google Gemini API pricing:
- **FREE Tier**:
  - 15 requests per minute
  - 1 million tokens per day
  - 1,500 requests per day
- **Paid Tier** (Gemini 1.5 Flash):
  - Input: $0.075 per million tokens
  - Output: $0.30 per million tokens

For a website builder:
- Typical conversation: ~100-200 tokens per exchange
- **FREE for most use cases!** (up to 1,500 conversations/day)
- If you exceed free tier: **~$0.0005-0.001 per conversation** (way cheaper than Claude!)

See [Google AI Pricing](https://ai.google.dev/pricing) for latest rates.

## Without API Key (Demo Mode)

If you don't add an API key, the app will:
1. Still work fully (graceful degradation)
2. Fall back to pattern matching responses
3. Log a message: "Claude not configured - using fallback"
4. Users won't notice any errors

This allows you to:
- Demo the app without API costs
- Develop and test without credentials
- Deploy without requiring API setup

## Troubleshooting

### "Gemini API error" in console

**Cause**: API key not set or invalid

**Fix**:
1. Check `.env.local` exists and has `GEMINI_API_KEY`
2. Verify you copied the key correctly from Google AI Studio
3. Restart dev server after adding key

### Responses are generic/pattern-based

**Cause**: API key not configured or API call failing

**Check**:
1. Open browser console - look for "Error calling Gemini API"
2. Check server logs for API errors
3. Verify `.env.local` is in root directory (not nested)

### API rate limits

**Cause**: Too many requests (15/minute on free tier)

**Fix**:
1. Check [Google AI Studio](https://aistudio.google.com/) for usage
2. Upgrade to paid tier if needed (still very cheap!)
3. Add rate limiting to `/api/chat` route

## Best Practices

1. **Don't commit API keys**: `.env.local` is in `.gitignore`
2. **Use environment variables**: Never hardcode keys
3. **Monitor usage**: Check Anthropic console regularly
4. **Set up rate limiting**: For production deployments
5. **Handle errors gracefully**: App already has fallback logic

## Production Deployment

For production (Vercel, etc.):

1. Add `GEMINI_API_KEY` to environment variables in hosting dashboard
2. Do NOT add to `.env.example` or `.env.local` in repo
3. Consider adding rate limiting middleware (15 req/min on free tier)
4. Monitor API usage at Google AI Studio
5. Free tier is usually sufficient for small-medium sites!

## Related Files

- `src/app/api/chat/route.ts` - API endpoint
- `src/components/builder/AIAgent.tsx` - Chat UI component
- `.env.example` - Environment variable template
- `package.json` - Contains `@google/generative-ai` dependency

## Support

- **Google AI Docs**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **API Reference**: [https://ai.google.dev/api](https://ai.google.dev/api)
- **Google AI Studio**: [https://aistudio.google.com/](https://aistudio.google.com/)
