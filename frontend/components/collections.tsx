import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart } from "lucide-react"

const collections = [
  {
    id: 1,
    name: "Solana Punks",
    image: "/pixel-art-punk-character.png",
    items: 10000,
    floorPrice: 2.5,
    volume: 1250,
    verified: true,
  },
  {
    id: 2,
    name: "Digital Landscapes",
    image: "/digital-landscape.png",
    items: 5000,
    floorPrice: 1.8,
    volume: 890,
    verified: true,
  },
  {
    id: 3,
    name: "Abstract Minds",
    image: "/abstract-digital-composition.png",
    items: 3333,
    floorPrice: 3.2,
    volume: 2100,
    verified: false,
  },
  {
    id: 4,
    name: "Crypto Creatures",
    image: "/fantasy-creature-digital-art.png",
    items: 7777,
    floorPrice: 0.9,
    volume: 567,
    verified: true,
  },
]

export function Collections() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Featured Collections</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover trending NFT collections from talented creators in the Solana ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Card
              key={collection.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  {collection.verified && <Badge className="bg-primary text-primary-foreground">Verified</Badge>}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">{collection.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium">{collection.items.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Floor:</span>
                    <span className="font-medium">{collection.floorPrice} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span className="font-medium">{collection.volume} SOL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Collections
          </Button>
        </div>
      </div>
    </section>
  )
}
