"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Plus, Wallet } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CreatePage() {
  const { connected } = useWallet()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    collectionName: "",
    collectionSymbol: "",
    collectionDescription: "",
    collectionUri: "",
    nftName: "",
    nftSymbol: "",
    nftDescription: "",
    nftUri: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
                <CardDescription>You need to connect your Solana wallet to create NFTs and collections</CardDescription>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create NFT Collection</h1>
            <p className="text-muted-foreground">Set up your collection and mint your first NFT on Solana</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Create Collection</CardTitle>
                <CardDescription>Set up your NFT collection with basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="collectionName">Collection Name</Label>
                    <Input
                      id="collectionName"
                      placeholder="My Awesome Collection"
                      value={formData.collectionName}
                      onChange={(e) => handleInputChange("collectionName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collectionSymbol">Collection Symbol</Label>
                    <Input
                      id="collectionSymbol"
                      placeholder="MAC"
                      value={formData.collectionSymbol}
                      onChange={(e) => handleInputChange("collectionSymbol", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectionDescription">Description</Label>
                  <Textarea
                    id="collectionDescription"
                    placeholder="Describe your collection..."
                    value={formData.collectionDescription}
                    onChange={(e) => handleInputChange("collectionDescription", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectionUri">Metadata URI</Label>
                  <Input
                    id="collectionUri"
                    placeholder="https://example.com/collection-metadata.json"
                    value={formData.collectionUri}
                    onChange={(e) => handleInputChange("collectionUri", e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.collectionName || !formData.collectionSymbol || !formData.collectionUri}
                  >
                    Next: Create NFT
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Mint Your First NFT</CardTitle>
                <CardDescription>Create your first NFT in the collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nftName">NFT Name</Label>
                    <Input
                      id="nftName"
                      placeholder="My First NFT"
                      value={formData.nftName}
                      onChange={(e) => handleInputChange("nftName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nftSymbol">NFT Symbol</Label>
                    <Input
                      id="nftSymbol"
                      placeholder="MFN"
                      value={formData.nftSymbol}
                      onChange={(e) => handleInputChange("nftSymbol", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nftDescription">NFT Description</Label>
                  <Textarea
                    id="nftDescription"
                    placeholder="Describe your NFT..."
                    value={formData.nftDescription}
                    onChange={(e) => handleInputChange("nftDescription", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nftUri">NFT Metadata URI</Label>
                  <Input
                    id="nftUri"
                    placeholder="https://example.com/nft-metadata.json"
                    value={formData.nftUri}
                    onChange={(e) => handleInputChange("nftUri", e.target.value)}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button disabled={!formData.nftName || !formData.nftSymbol || !formData.nftUri}>
                    Create Collection & Mint NFT
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
