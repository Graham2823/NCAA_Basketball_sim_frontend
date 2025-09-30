# NCAA Basketball Simulator Frontend

A modern web application for simulating NCAA basketball games and tournaments, built with Next.js, TypeScript, and Tailwind CSS.

## 🏀 Project Overview

This application provides an interactive platform for:
- Simulating NCAA basketball games with realistic statistics
- Managing team rosters and player stats
- Running tournament brackets
- Viewing historical game results and analytics
- Creating custom scenarios and matchups

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (version 18.17.0 or higher)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd NCAA_Basketball_sim_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

The page will automatically reload when you make changes to the code.

### Alternative Package Managers

You can also use other package managers:

```bash
# Using Yarn
yarn install
yarn dev

# Using pnpm
pnpm install
pnpm dev

# Using bun
bun install
bun dev
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Linting**: [ESLint](https://eslint.org/) - Code quality and style enforcement
- **Development**: Hot reload, fast refresh, and optimized builds

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
└── types/                 # TypeScript type definitions

public/                    # Static assets
├── images/               # Image files
└── icons/                # Icon files

Configuration files:
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
├── eslint.config.mjs     # ESLint configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## 🔧 Development

### Code Style

This project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Tailwind CSS** for consistent styling

### Key Features

- **Hot Reload**: Changes appear instantly during development
- **TypeScript**: Full type safety and IntelliSense support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern React**: Uses React 19 with latest features
- **Optimized Fonts**: Automatic font optimization with `next/font`

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a Next.js project
3. Deploy with zero configuration

### Other Platforms

This Next.js application can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [TypeScript Documentation](https://www.typescriptlang.org/docs) - TypeScript language reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

**Node modules issues**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**:
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

---

Built with ❤️ for NCAA basketball fans
