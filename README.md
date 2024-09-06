# Monster Research Incorporated

![Monster Example](/assets/mirthful-zephyrkin.png?height=300&width=300)

Monster Research Incorporated is a Next.js application that generates, displays, and ranks unique monsters using AI. This project was created as a submission for [LWJ Web Dev Challenge Hackathon 4: Monsters!](https://www.learnwithjason.dev/blog/web-dev-challenge-hackathon-monsters).

## Features

- AI-powered monster generation using OpenAI's GPT and DALL-E
- Real-time leaderboard and monster carousel
- User authentication with Clerk
- Backend powered by Convex, including database and file storage
- Automatic monster generation every 5 minutes using Convex cron jobs
- User voting system (authenticated users only)

![Dashboard](/assets/dashboard.png?height=600&width=800)

## Tech Stack

- **Frontend**: Next.js
- **Authentication**: Clerk
- **Backend**: Convex
- **AI Services**: OpenAI (GPT for text generation, DALL-E for image generation)
- **Database**: Convex Database
- **File Storage**: Convex Storage
- **Scheduled Tasks**: Convex Cron Jobs

## How It Works

1. **Monster Generation**:

   - OpenAI's GPT generates structured objects with monster parameters
   - These parameters are used to create an image generation prompt
   - DALL-E uses this prompt to generate a unique monster image

2. **Data Storage**:

   - Generated monsters and their metadata are stored in the Convex database
   - Monster images are stored in Convex's storage backend

3. **User Interface**:

   - The app displays a leaderboard and a carousel of generated monsters
   - New monsters are automatically created every 5 minutes using Convex cron jobs

4. **User Interaction**:
   - Users must authenticate using Clerk to participate
   - Authenticated users can vote monsters up or down
   - Votes affect the monster's position on the leaderboard

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/monster-research-inc.git
   cd monster-research-inc
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   OPENAI_API_KEY=your_openai_api_key
   CONVEX_DEPLOYMENT=your_convex_deployment_url
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser to see the application.

## Contributing

This project was created for a hackathon, but we welcome contributions! If you have ideas for improvements or new features, feel free to:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the organizers of [LWJ Web Dev Challenge Hackathon 4: Monsters!](https://www.learnwithjason.dev/blog/web-dev-challenge-hackathon-monsters)
- Shoutout to the amazing APIs and services that made this project possible:
  - OpenAI
  - Clerk
  - Convex
  - Next.js
  - ChatGPT to help create better prompts
  - v0.dev for making the UI much easier and faster to create

## Contact

Daniel Wise - [Portfolio](https://www.danwise.dev) - hi@danwise.dev

Live Application: [https://monster-research.com](https://monster-research.com)

Project Link: [https://github.com/dubscode/monster-research](https://github.com/dubscode/monster-research)
