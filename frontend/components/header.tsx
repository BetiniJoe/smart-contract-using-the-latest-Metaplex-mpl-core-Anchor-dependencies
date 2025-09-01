"use client"

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Wallet, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SolNFT</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link href="/create" className="text-foreground hover:text-primary transition-colors">
              Create
            </Link>
            <Link href="/collections" className="text-foreground hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/portfolio" className="text-foreground hover:text-primary transition-colors">
              Portfolio
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !rounded-lg !px-4 !py-2 !text-sm !font-medium !transition-colors" />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/marketplace" className="text-foreground hover:text-primary transition-colors">
                Marketplace
              </Link>
              <Link href="/create" className="text-foreground hover:text-primary transition-colors">
                Create
              </Link>
              <Link href="/collections" className="text-foreground hover:text-primary transition-colors">
                Collections
              </Link>
              <Link href="/portfolio" className="text-foreground hover:text-primary transition-colors">
                Portfolio
              </Link>
              <div className="pt-4">
                <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !rounded-lg !px-4 !py-2 !text-sm !font-medium !transition-colors !w-full" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
