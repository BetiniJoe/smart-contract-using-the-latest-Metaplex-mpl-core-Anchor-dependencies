//a TypeScript test file to test our program

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MetaplexNftProgram } from "../target/types/metaplex_nft_program";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { assert } from "chai";

describe("metaplex_nft_program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MetaplexNftProgram as Program<MetaplexNftProgram>;
  
  // Generate keypairs for testing
  const authority = anchor.web3.Keypair.generate();
  const owner = anchor.web3.Keypair.generate();
  const newOwner = anchor.web3.Keypair.generate();
  const payer = anchor.web3.Keypair.generate();
  const mint = anchor.web3.Keypair.generate();
  
  // Collection data
  const collectionName = "Test Collection";
  const collectionSymbol = "TEST";
  const collectionUri = "https://example.com/collection.json";
  
  // NFT data
  const nftName = "Test NFT";
  const nftSymbol = "TNFT";
  const nftUri = "https://example.com/nft.json";
  
  // Updated NFT data
  const updatedNftName = "Updated NFT";
  const updatedNftUri = "https://example.com/updated-nft.json";
  
  // PDAs
  let collectionPDA: anchor.web3.PublicKey;
  let metadataPDA: anchor.web3.PublicKey;
  
  before(async () => {
    // Airdrop SOL to payer, authority, and owner
    await provider.connection.requestAirdrop(payer.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(authority.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(owner.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(newOwner.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    
    // Derive PDAs
    [collectionPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("collection"), authority.publicKey.toBuffer()],
      program.programId
    );
    
    [metadataPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), mint.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initialize Collection", async () => {
    // Initialize a new collection
    await program.methods
      .initializeCollection(collectionName, collectionSymbol, collectionUri)
      .accounts({
        collection: collectionPDA,
        authority: authority.publicKey,
        feePayer: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority, payer])
      .rpc();
    
    // Fetch the collection account
    const collectionAccount = await program.account.nftCollection.fetch(collectionPDA);
    
    // Verify collection data
    assert.equal(collectionAccount.authority.toString(), authority.publicKey.toString());
    assert.equal(collectionAccount.name, collectionName);
    assert.equal(collectionAccount.symbol, collectionSymbol);
    assert.equal(collectionAccount.uri, collectionUri);
    assert.equal(collectionAccount.verified, false);
    assert.equal(collectionAccount.nftCount.toString(), "0");
  });

  it("Mint NFT", async () => {
    // Mint a new NFT
    await program.methods
      .mintNft(nftName, nftSymbol, nftUri)
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
      .signers([mint, authority, payer])
      .rpc();
    
    // Fetch the metadata account
    const metadataAccount = await program.account.nftMint.fetch(metadataPDA);
    
    // Verify metadata
    assert.equal(metadataAccount.mint.toString(), mint.publicKey.toString());
    assert.equal(metadataAccount.owner.toString(), owner.publicKey.toString());
    assert.equal(metadataAccount.name, nftName);
    assert.equal(metadataAccount.symbol, nftSymbol);
    assert.equal(metadataAccount.uri, nftUri);
    assert.equal(metadataAccount.collection.toString(), collectionPDA.toString());
    
    // Fetch the collection account
    const collectionAccount = await program.account.nftCollection.fetch(collectionPDA);
    
    // Verify collection NFT count
    assert.equal(collectionAccount.nftCount.toString(), "1");
  });

  it("Update NFT Metadata", async () => {
    // Update NFT metadata
    await program.methods
      .updateNftMetadata(updatedNftName, updatedNftUri)
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
    
    // Fetch the metadata account
    const metadataAccount = await program.account.nftMint.fetch(metadataPDA);
    
    // Verify updated metadata
    assert.equal(metadataAccount.name, updatedNftName);
    assert.equal(metadataAccount.uri, updatedNftUri);
  });

  it("Transfer NFT", async () => {
    // Create associated token accounts for owner and new owner
    const ownerATA = await getAssociatedTokenAddress(
      mint.publicKey,
      owner.publicKey
    );
    
    const newOwnerATA = await getAssociatedTokenAddress(
      mint.publicKey,
      newOwner.publicKey
    );
    
    // Create ATA for new owner if it doesn't exist
    try {
      await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(
          createAssociatedTokenAccountInstruction(
            payer.publicKey,
            newOwnerATA,
            newOwner.publicKey,
            mint.publicKey
          )
        ),
        [payer]
      );
    } catch (e) {
      // ATA might already exist, which is fine
    }
    
    // Transfer NFT
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
    
    // Fetch the metadata account
    const metadataAccount = await program.account.nftMint.fetch(metadataPDA);
    
    // Verify new owner
    assert.equal(metadataAccount.owner.toString(), newOwner.publicKey.toString());
  });
});