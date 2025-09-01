"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, Eye, Send } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const mockNFTs = [
  {
    id: 1,
    name: "Solana Punk #1234",
    collection: "Solana Punks",
    image: "/pixel-art-punk-character.png",
    value: 2.5,
    change: "+12.5%",
  },
  {
    id: 2,
    name: "Digital Landscape #567",
    collection: "Digital Landscapes",
    image: "/digital-landscape.png",
    value: 1.8,
    change: "-5.2%",
  },
  {
    id: 3,
    name: "Abstract Mind #890",
    collection: "Abstract Minds",
    image: "/abstract-digital-composition.png",
    value: 3.2,
    change: "+8.7%",
  },
]

export default function PortfolioPage() {
  const { connected, publicKey } = useWallet()

  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>Connect your wallet to view your NFT portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !rounded-lg !px-6 !py-3 !text-base !font-medium !transition-colors !w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalValue = mockNFTs.reduce((sum, nft) => sum + nft.value, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Portfolio</h1>
            <p className="text-muted-foreground">
              Wallet: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
            </p>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalValue.toFixed(1)} SOL</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.3% (24h)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total NFTs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockNFTs.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Across 3 collections</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Best Performer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">+12.5%</div>
                <div className="text-sm text-muted-foreground mt-1">Solana Punk #1234</div>
              </CardContent>
            </Card>
          </div>

          {/* NFT Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">My NFTs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNFTs.map((nft) => (
                <Card key={nft.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Send className="h-4 w-4 mr-1" />
                          Transfer
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-card-foreground">{nft.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{nft.collection}</p>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold text-card-foreground">{nft.value} SOL</div>
                        <Badge variant={nft.change.startsWith("+") ? "default" : "destructive"} className="text-xs">
                          {nft.change}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Empty State for when no NFTs */}
          {mockNFTs.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">No NFTs Found</CardTitle>
                <CardDescription className="mb-6">
                  You don't have any NFTs in your wallet yet. Start by creating or purchasing your first NFT.
                </CardDescription>
                <Button>Browse Marketplace</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
