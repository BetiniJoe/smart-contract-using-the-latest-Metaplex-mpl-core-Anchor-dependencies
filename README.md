# Metaplex NFT Program

# INSTRUCTIONS ON HOW TO BUILD AND TEST THE PROGRAM

This Solana program demonstrates NFT minting and metadata management using Anchor and Metaplex mpl-core. The program allows users to create NFT collections, mint NFTs, update NFT metadata, and transfer NFTs between wallets.

## Features

- **Collection Management**: Create and manage NFT collections
- **NFT Minting**: Mint new NFTs to collections
- **Metadata Management**: Update NFT metadata
- **NFT Transfers**: Transfer NFTs between wallets

## Prerequisites

- Rust (latest stable)
- Solana CLI (latest)
- Anchor CLI (v0.31.1)
- Node.js and npm/yarn (for tests)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/metaplex-nft-program.git
cd metaplex-nft-program
```

2. Install dependencies:
```bash
yarn install
```

## Building the Program

To build the Solana program:

```bash
anchor build
```

This will compile the Rust code and generate the necessary artifacts in the `target` directory.

## Testing

The program includes comprehensive tests to verify its functionality. To run the tests:

```bash
anchor test
```

This will:
1. Start a local Solana validator
2. Deploy the program
3. Run the test suite
4. Shut down the validator

## Program Structure

- `lib.rs`: Main program file containing instruction handlers and account structures
- `tests/`: Contains test files for the program

## Program Instructions

### 1. Initialize Collection

Creates a new NFT collection with the specified name, symbol, and URI.

```typescript
await program.methods
  .initializeCollection(name, symbol, uri)
  .accounts({
    collection: collectionPDA,
    authority: authority.publicKey,
    feePayer: payer.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([authority, payer])
  .rpc();
```

### 2. Mint NFT

Mints a new NFT to a collection.

```typescript
await program.methods
  .mintNft(name, symbol, uri)
  .accounts({
    collection: collectionPDA,
    mint: mint.publicKey,
    metadata: metadataPDA,
    authority: authority.publicKey,
    owner: owner.publicKey,
    feePayer: payer.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  })
  .signers([authority, payer])
  .rpc();
```

### 3. Update NFT Metadata

Updates the metadata of an existing NFT.

```typescript
await program.methods
  .updateNftMetadata(newName, newUri)
  .accounts({
    collection: collectionPDA,
    metadata: metadataPDA,
    mint: mint.publicKey,
    authority: authority.publicKey,
    feePayer: payer.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([authority, payer])
  .rpc();
```

### 4. Transfer NFT

Transfers an NFT to a new owner.

```typescript
await program.methods
  .transferNft()
  .accounts({
    mint: mint.publicKey,
    metadata: metadataPDA,
    owner: owner.publicKey,
    newOwner: newOwner.publicKey,
    feePayer: payer.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  })
  .signers([owner, payer])
  .rpc();
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.