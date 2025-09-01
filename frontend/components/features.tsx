import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Coins, Users, Palette, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built on Solana for instant transactions and minimal fees",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Smart contracts audited and battle-tested on mainnet",
  },
  {
    icon: Coins,
    title: "Low Cost Minting",
    description: "Mint NFTs for pennies, not dollars",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join a thriving ecosystem of creators and collectors",
  },
  {
    icon: Palette,
    title: "Easy Creation",
    description: "Intuitive tools for artists and creators of all levels",
  },
  {
    icon: TrendingUp,
    title: "Portfolio Tracking",
    description: "Monitor your NFT investments and collection value",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose SolNFT?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of NFTs with our comprehensive platform built for the Solana ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
