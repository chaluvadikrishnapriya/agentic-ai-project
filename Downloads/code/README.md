# CyclePredict AI

A full-stack web application that uses AI to predict menstrual cycles based on analysis of health bills and pharmacy purchases.

## Features

- **Bill Upload & Analysis**: Upload medical or pharmacy bills (PDF, images, text)
- **AI-Powered Predictions**: Get accurate cycle predictions based on medicine analysis
- **Health Insights**: Receive personalized wellness recommendations
- **Chat Assistant**: Ask questions about your cycle and get instant advice
- **Spending Trends**: Track health spending patterns over time
- **Secure Authentication**: JWT-based user authentication
- **Privacy-First**: All data is encrypted and securely stored

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express (via Next.js API routes)
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Environment variables configured

### Environment Variables

Create a `.env.local` file with:

\`\`\`
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=cyclepredict
JWT_SECRET=your_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run database setup: `npm run setup:db`
4. Start development server: `npm run dev`
5. Visit http://localhost:3000

## Project Structure

\`\`\`
app/
  page.tsx                 # Home page
  auth/
    login/page.tsx        # Login page
    signup/page.tsx       # Signup page
  dashboard/
    page.tsx              # Main dashboard
    upload/page.tsx       # Bill upload
    prediction/page.tsx   # Cycle prediction
    chat/page.tsx         # AI chat
    insights/page.tsx     # Health insights
    profile/page.tsx      # User profile
  api/
    auth/                 # Authentication endpoints
    bills/                # Bill processing
    chat/                 # Chat endpoint
    insights/             # Analytics

components/
  ui/                     # Shadcn UI components
  header.tsx              # App header
  protected-route.tsx     # Route protection
  cycle-calendar.tsx      # Calendar component

lib/
  mongodb.ts              # Database connection
  ocr.ts                  # OCR utilities
  prediction.ts           # Prediction logic
  auth.ts                 # Auth helpers
  validators.ts           # Input validation
  constants.ts            # App constants
\`\`\`

## Future Enhancements

- SMS/email notifications for predicted periods
- Integration with wearable devices
- Advanced ML prediction models
- Export health summary as PDF
- Multi-language support
- Mobile app

## License

MIT

## Support

For issues or questions, please contact support@cyclepredict.ai
