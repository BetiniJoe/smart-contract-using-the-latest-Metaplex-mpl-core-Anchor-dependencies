import {
  AnchorProvider,
  BN,
  IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import { MetaplexNftProgram } from "../../target/types/metaplex_nft_program";
import idl from "../../target/idl/metaplex_nft_program.json";
import * as pda from "./pda";

import { CslSplToken } from "../../target/types/csl_spl_token";
import idlCslSplToken from "../../target/idl/csl_spl_token.json";

import { CslSplAssocToken } from "../../target/types/csl_spl_assoc_token";
import idlCslSplAssocToken from "../../target/idl/csl_spl_assoc_token.json";



let _program: Program<MetaplexNftProgram>;
let _programCslSplToken: Program<CslSplToken>;
let _programCslSplAssocToken: Program<CslSplAssocToken>;


export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<MetaplexNftProgram>(
        idl as never,
        programId,
        anchorProvider,
    );

    _programCslSplToken = new Program<CslSplToken>(
        idlCslSplToken as never,
        new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        anchorProvider,
    );
    _programCslSplAssocToken = new Program<CslSplAssocToken>(
        idlCslSplAssocToken as never,
        new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
        anchorProvider,
    );

};

export type InitializeCollectionArgs = {
  feePayer: web3.PublicKey;
  authority: web3.PublicKey;
  name: string;
  symbol: string;
  uri: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Creates a new NFT collection
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` collection: {@link NftCollection} The collection account to initialize
 * 2. `[signer]` authority: {@link PublicKey} The authority that can mint NFTs to this collection
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Name of the collection
 * - symbol: {@link string} Symbol of the collection
 * - uri: {@link string} URI to the collection metadata
 */
export const initializeCollectionBuilder = (
	args: InitializeCollectionArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<MetaplexNftProgram, never> => {
    const [collectionPubkey] = pda.deriveCollectionPDA({
        authority: args.authority,
    }, _program.programId);

  return _program
    .methods
    .initializeCollection(
      args.name,
      args.symbol,
      args.uri,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      collection: collectionPubkey,
      authority: args.authority,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Creates a new NFT collection
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` collection: {@link NftCollection} The collection account to initialize
 * 2. `[signer]` authority: {@link PublicKey} The authority that can mint NFTs to this collection
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Name of the collection
 * - symbol: {@link string} Symbol of the collection
 * - uri: {@link string} URI to the collection metadata
 */
export const initializeCollection = (
	args: InitializeCollectionArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    initializeCollectionBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Creates a new NFT collection
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` collection: {@link NftCollection} The collection account to initialize
 * 2. `[signer]` authority: {@link PublicKey} The authority that can mint NFTs to this collection
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Name of the collection
 * - symbol: {@link string} Symbol of the collection
 * - uri: {@link string} URI to the collection metadata
 */
export const initializeCollectionSendAndConfirm = async (
  args: Omit<InitializeCollectionArgs, "feePayer" | "authority"> & {
    signers: {
      feePayer: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return initializeCollectionBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.authority])
    .rpc();
}

export type MintNftArgs = {
  feePayer: web3.PublicKey;
  mint: web3.PublicKey;
  authority: web3.PublicKey;
  owner: web3.PublicKey;
  funding: web3.PublicKey;
  wallet: web3.PublicKey;
  name: string;
  symbol: string;
  uri: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Mints a new NFT to a collection
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` collection: {@link NftCollection} The collection to mint the NFT to
 * 2. `[writable, signer]` mint: {@link Mint} The mint account for the new NFT
 * 3. `[writable]` metadata: {@link NftMint} The metadata account for the new NFT
 * 4. `[signer]` authority: {@link PublicKey} The authority of the collection
 * 5. `[signer]` owner: {@link PublicKey} The owner of the new NFT
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 7. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 8. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 9. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 10. `[]` token_program: {@link PublicKey} SPL Token program
 * 11. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 * 12. `[]` csl_spl_assoc_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplAssocTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} Name of the NFT
 * - symbol: {@link string} Symbol of the NFT
 * - uri: {@link string} URI to the NFT metadata
 */
export const mintNftBuilder = (
	args: MintNftArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<MetaplexNftProgram, never> => {
    const [collectionPubkey] = pda.deriveCollectionPDA({
        authority: args.authority,
    }, _program.programId);
    const [metadataPubkey] = pda.deriveNftMetadataPDA({
        mint: args.mint,
    }, _program.programId);
    const [assocTokenAccountPubkey] = pda.CslSplTokenPDAs.deriveAccountPDA({
        wallet: args.wallet,
        tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        mint: args.mint,
    }, new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"));

  return _program
    .methods
    .mintNft(
      args.name,
      args.symbol,
      args.uri,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      collection: collectionPubkey,
      mint: args.mint,
      metadata: metadataPubkey,
      authority: args.authority,
      owner: args.owner,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
      funding: args.funding,
      assocTokenAccount: assocTokenAccountPubkey,
      wallet: args.wallet,
      tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      cslSplAssocTokenV000: new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Mints a new NFT to a collection
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` collection: {@link NftCollection} The collection to mint the NFT to
 * 2. `[writable, signer]` mint: {@link Mint} The mint account for the new NFT
 * 3. `[writable]` metadata: {@link NftMint} The metadata account for the new NFT
 * 4. `[signer]` authority: {@link PublicKey} The authority of the collection
 * 5. `[signer]` owner: {@link PublicKey} The owner of the new NFT
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 7. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 8. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 9. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 10. `[]` token_program: {@link PublicKey} SPL Token program
 * 11. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 * 12. `[]` csl_spl_assoc_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplAssocTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} Name of the NFT
 * - symbol: {@link string} Symbol of the NFT
 * - uri: {@link string} URI to the NFT metadata
 */
export const mintNft = (
	args: MintNftArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    mintNftBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Mints a new NFT to a collection
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` collection: {@link NftCollection} The collection to mint the NFT to
 * 2. `[writable, signer]` mint: {@link Mint} The mint account for the new NFT
 * 3. `[writable]` metadata: {@link NftMint} The metadata account for the new NFT
 * 4. `[signer]` authority: {@link PublicKey} The authority of the collection
 * 5. `[signer]` owner: {@link PublicKey} The owner of the new NFT
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 7. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 8. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 9. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 10. `[]` token_program: {@link PublicKey} SPL Token program
 * 11. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 * 12. `[]` csl_spl_assoc_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplAssocTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} Name of the NFT
 * - symbol: {@link string} Symbol of the NFT
 * - uri: {@link string} URI to the NFT metadata
 */
export const mintNftSendAndConfirm = async (
  args: Omit<MintNftArgs, "feePayer" | "mint" | "authority" | "owner" | "funding"> & {
    signers: {
      feePayer: web3.Signer,
      mint: web3.Signer,
      authority: web3.Signer,
      owner: web3.Signer,
      funding: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return mintNftBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      mint: args.signers.mint.publicKey,
      authority: args.signers.authority.publicKey,
      owner: args.signers.owner.publicKey,
      funding: args.signers.funding.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.mint, args.signers.authority, args.signers.owner, args.signers.funding])
    .rpc();
}

export type UpdateNftMetadataArgs = {
  feePayer: web3.PublicKey;
  mint: web3.PublicKey;
  authority: web3.PublicKey;
  name: string;
  uri: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Updates the metadata of an existing NFT
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[]` collection: {@link NftCollection} The collection the NFT belongs to
 * 2. `[writable]` metadata: {@link NftMint} The metadata account to update
 * 3. `[]` mint: {@link Mint} The mint account of the NFT
 * 4. `[signer]` authority: {@link PublicKey} The authority of the collection
 *
 * Data:
 * - name: {@link string} New name of the NFT
 * - uri: {@link string} New URI to the NFT metadata
 */
export const updateNftMetadataBuilder = (
	args: UpdateNftMetadataArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<MetaplexNftProgram, never> => {
    const [collectionPubkey] = pda.deriveCollectionPDA({
        authority: args.authority,
    }, _program.programId);
    const [metadataPubkey] = pda.deriveNftMetadataPDA({
        mint: args.mint,
    }, _program.programId);

  return _program
    .methods
    .updateNftMetadata(
      args.name,
      args.uri,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      collection: collectionPubkey,
      metadata: metadataPubkey,
      mint: args.mint,
      authority: args.authority,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Updates the metadata of an existing NFT
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[]` collection: {@link NftCollection} The collection the NFT belongs to
 * 2. `[writable]` metadata: {@link NftMint} The metadata account to update
 * 3. `[]` mint: {@link Mint} The mint account of the NFT
 * 4. `[signer]` authority: {@link PublicKey} The authority of the collection
 *
 * Data:
 * - name: {@link string} New name of the NFT
 * - uri: {@link string} New URI to the NFT metadata
 */
export const updateNftMetadata = (
	args: UpdateNftMetadataArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateNftMetadataBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Updates the metadata of an existing NFT
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[]` collection: {@link NftCollection} The collection the NFT belongs to
 * 2. `[writable]` metadata: {@link NftMint} The metadata account to update
 * 3. `[]` mint: {@link Mint} The mint account of the NFT
 * 4. `[signer]` authority: {@link PublicKey} The authority of the collection
 *
 * Data:
 * - name: {@link string} New name of the NFT
 * - uri: {@link string} New URI to the NFT metadata
 */
export const updateNftMetadataSendAndConfirm = async (
  args: Omit<UpdateNftMetadataArgs, "feePayer" | "authority"> & {
    signers: {
      feePayer: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateNftMetadataBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.authority])
    .rpc();
}

export type TransferNftArgs = {
  feePayer: web3.PublicKey;
  mint: web3.PublicKey;
  owner: web3.PublicKey;
  newOwner: web3.PublicKey;
  funding: web3.PublicKey;
  wallet: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Transfers an NFT to another wallet
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[]` mint: {@link Mint} The mint account of the NFT
 * 2. `[writable]` metadata: {@link NftMint} The metadata account of the NFT
 * 3. `[signer]` owner: {@link PublicKey} The current owner of the NFT
 * 4. `[]` new_owner: {@link PublicKey} The new owner of the NFT
 * 5. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 6. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 7. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 8. `[]` system_program: {@link PublicKey} System program
 * 9. `[]` token_program: {@link PublicKey} SPL Token program
 * 10. `[writable]` source: {@link PublicKey} The source account.
 * 11. `[writable]` destination: {@link PublicKey} The destination account.
 * 12. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 13. `[]` csl_spl_assoc_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplAssocTokenProgram v0.0.0
 * 14. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 */
export const transferNftBuilder = (
	args: TransferNftArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<MetaplexNftProgram, never> => {
    const [metadataPubkey] = pda.deriveNftMetadataPDA({
        mint: args.mint,
    }, _program.programId);
    const [assocTokenAccountPubkey] = pda.CslSplTokenPDAs.deriveAccountPDA({
        wallet: args.wallet,
        tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        mint: args.mint,
    }, new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"));

  return _program
    .methods
    .transferNft(

    )
    .accountsStrict({
      feePayer: args.feePayer,
      mint: args.mint,
      metadata: metadataPubkey,
      owner: args.owner,
      newOwner: args.newOwner,
      funding: args.funding,
      assocTokenAccount: assocTokenAccountPubkey,
      wallet: args.wallet,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
      tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      cslSplAssocTokenV000: new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Transfers an NFT to another wallet
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[]` mint: {@link Mint} The mint account of the NFT
 * 2. `[writable]` metadata: {@link NftMint} The metadata account of the NFT
 * 3. `[signer]` owner: {@link PublicKey} The current owner of the NFT
 * 4. `[]` new_owner: {@link PublicKey} The new owner of the NFT
 * 5. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 6. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 7. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 8. `[]` system_program: {@link PublicKey} System program
 * 9. `[]` token_program: {@link PublicKey} SPL Token program
 * 10. `[writable]` source: {@link PublicKey} The source account.
 * 11. `[writable]` destination: {@link PublicKey} The destination account.
 * 12. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 13. `[]` csl_spl_assoc_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplAssocTokenProgram v0.0.0
 * 14. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 */
export const transferNft = (
	args: TransferNftArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    transferNftBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Transfers an NFT to another wallet
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[]` mint: {@link Mint} The mint account of the NFT
 * 2. `[writable]` metadata: {@link NftMint} The metadata account of the NFT
 * 3. `[signer]` owner: {@link PublicKey} The current owner of the NFT
 * 4. `[]` new_owner: {@link PublicKey} The new owner of the NFT
 * 5. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 6. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 7. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 8. `[]` system_program: {@link PublicKey} System program
 * 9. `[]` token_program: {@link PublicKey} SPL Token program
 * 10. `[writable]` source: {@link PublicKey} The source account.
 * 11. `[writable]` destination: {@link PublicKey} The destination account.
 * 12. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 13. `[]` csl_spl_assoc_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplAssocTokenProgram v0.0.0
 * 14. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 */
export const transferNftSendAndConfirm = async (
  args: Omit<TransferNftArgs, "feePayer" | "owner" | "funding" | "authority"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
      funding: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return transferNftBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
      funding: args.signers.funding.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner, args.signers.funding, args.signers.authority])
    .rpc();
}

// Getters

export const getNftCollection = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<MetaplexNftProgram>["nftCollection"]> => _program.account.nftCollection.fetch(publicKey, commitment);

export const getNftMint = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<MetaplexNftProgram>["nftMint"]> => _program.account.nftMint.fetch(publicKey, commitment);
export module CslSplTokenGetters {
    export const getMint = (
        publicKey: web3.PublicKey,
        commitment?: web3.Commitment
    ): Promise<IdlAccounts<CslSplToken>["mint"]> => _programCslSplToken.account.mint.fetch(publicKey, commitment);
    
    export const getAccount = (
        publicKey: web3.PublicKey,
        commitment?: web3.Commitment
    ): Promise<IdlAccounts<CslSplToken>["account"]> => _programCslSplToken.account.account.fetch(publicKey, commitment);
}

