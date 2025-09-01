# Solana NFT Marketplace Frontend

A modern, responsive frontend for a Solana NFT marketplace built with Next.js, TypeScript, and Tailwind CSS. This application integrates with the Solana blockchain and provides a comprehensive interface for creating, minting, and trading NFTs.

## Features

- 🔗 **Wallet Integration**: Connect with popular Solana wallets (Phantom, Solflare)
- 🎨 **NFT Creation**: Create collections and mint NFTs with an intuitive interface
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🌙 **Dark Mode Support**: Built-in dark/light mode toggle
- 💼 **Portfolio Management**: View and manage your NFT collection
- 🏪 **Marketplace**: Browse and discover NFT collections
- ⚡ **Fast Performance**: Built on Next.js 15 with optimized performance

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Wallet Adapter
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React

## Backend Integration

This frontend is designed to work with the Solana NFT program built with Anchor and Metaplex mpl-core. The backend includes:

- Collection initialization
- NFT minting with metadata
- NFT transfers
- Metadata updates
- Program-derived addresses (PDAs)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd solana-nft-marketplace
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

The application is configured to work with Solana devnet by default. To use mainnet or a custom RPC endpoint, modify the `endpoint` in `components/wallet-provider.tsx`.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── create/            # NFT creation page
│   ├── portfolio/         # User portfolio page
│   ├── layout.tsx         # Root layout with wallet provider
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles and design tokens
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── header.tsx        # Navigation header
│   ├── hero.tsx          # Homepage hero section
│   ├── features.tsx      # Features showcase
│   ├── collections.tsx   # Featured collections
│   ├── footer.tsx        # Site footer
│   └── wallet-provider.tsx # Solana wallet integration
└── lib/                  # Utility functions
    └── utils.ts          # Common utilities
\`\`\`

## Key Components

### Wallet Integration
- Automatic wallet detection and connection
- Support for multiple wallet types
- Connection state management across the app

### NFT Creation Flow
- Two-step process: Collection creation → NFT minting
- Form validation and user guidance
- Integration ready for backend program calls

### Portfolio Management
- Display user's NFT collection
- Value tracking and performance metrics
- Transfer and management actions

### Responsive Design
- Mobile-first approach
- Consistent spacing and typography
- Accessible color contrast ratios

## Design System

The application uses a carefully crafted design system with:

- **Colors**: Cyan primary (#0891b2), Amber secondary (#d97706)
- **Typography**: Geist Sans for headings, system fonts for body
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable UI components with consistent styling

## Deployment

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Deploy to Vercel

The easiest way to deploy is using Vercel:

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## Backend Integration Guide

To connect this frontend with your Solana program:

1. Update the program ID in wallet provider configuration
2. Add your program's IDL and client code
3. Implement the actual blockchain calls in the create and portfolio pages
4. Configure the correct RPC endpoint for your deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository or contact the development team.
