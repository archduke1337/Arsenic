# Arsenic Summit 2024

A modern, dynamic student parliament simulation platform built with Next.js 16, React 19, and TypeScript.

## 🌟 Features

- **Multi-Event Support**: Model UN, Lok Sabha, Rajya Sabha, Debate, Youth Parliament
- **Dynamic Homepage**: Real-time stats from Appwrite backend
- **User Authentication**: Secure login/registration with Appwrite
- **Admin Dashboard**: Complete event management system
- **Responsive Design**: Mobile-optimized with Tailwind CSS
- **Dark Mode**: Full light/dark theme support
- **Smooth Animations**: Framer Motion for polished interactions
- **Real-time Notifications**: WebSocket-based updates

## 🚀 Tech Stack

- **Frontend**: Next.js 16.0.5 with Turbopack
- **UI Framework**: React 19.0.0 + NextUI
- **Styling**: Tailwind CSS 3.4.1
- **Backend**: Appwrite 21.4.0
- **Animations**: Framer Motion
- **Database**: Appwrite Cloud (tor.cloud.appwrite.io)
- **Type Safety**: TypeScript 5

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/arsenic-nextjs.git
cd arsenic-nextjs

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Update .env.local with your Appwrite credentials:
# NEXT_PUBLIC_APPWRITE_ENDPOINT=https://tor.cloud.appwrite.io/v1
# NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
# NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
# NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage with dynamic stats
│   ├── globals.css        # Global styles & animations
│   ├── layout.tsx         # Root layout
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── [routes]/          # Event pages
├── components/            # Reusable React components
│   ├── navbar.tsx         # Navigation with animations
│   ├── footer.tsx         # Footer
│   ├── admin/             # Admin components
│   └── ui/                # UI utilities
├── lib/                   # Utility functions
│   ├── appwrite.ts        # Appwrite configuration
│   ├── auth-context.tsx   # Auth context provider
│   ├── utils.ts           # Helper functions
│   └── schema.ts          # Database schemas
├── public/                # Static assets
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies
```

## 🔑 Key Collections

### Appwrite Database (ID: 6928648600197e286fda)

- **Registrations**: User event registrations
- **Committees**: Event committees & details
- **Awards**: Award categories & prizes
- **Users**: User profiles & permissions
- **Events**: Event configurations
- **Payments**: Payment transactions
- **Scores**: Participant scores

## 🎨 Styling Features

- Glassmorphism effects with backdrop blur
- Gradient animations on text and buttons
- Smooth transitions and Framer Motion animations
- Dark/light mode support
- Responsive grid layouts
- Custom scrollbar styling

## 🔐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://tor.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=6928648600197e286fda
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000/api
```

## 📱 Development

### Start Development Server
```bash
npm run dev        # With Turbopack enabled
```

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```bash
docker build -t arsenic-nextjs .
docker run -p 3000:3000 arsenic-nextjs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Project Lead**: Arsenic Summit Organizing Committee
- **Development**: Next.js & React specialists
- **Design**: UI/UX team

## 🔗 Links

- [Live Site](https://arsenic-summit.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📧 Support

For issues and questions, please [open an issue](https://github.com/yourusername/arsenic-nextjs/issues) on GitHub.

---

Made with ❤️ for Arsenic Summit 2024
