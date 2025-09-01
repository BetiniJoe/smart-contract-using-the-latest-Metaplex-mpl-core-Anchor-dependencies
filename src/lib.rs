
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("4mAMsimURXatxBJNW6AydZBmHsmXrksPJDPafNAfHAeT");

#[program]
pub mod metaplex_nft_program {
    use super::*;

/// Creates a new NFT collection
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` collection: [NftCollection] The collection account to initialize
/// 2. `[signer]` authority: [AccountInfo] The authority that can mint NFTs to this collection
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] Name of the collection
/// - symbol: [String] Symbol of the collection
/// - uri: [String] URI to the collection metadata
	pub fn initialize_collection(ctx: Context<InitializeCollection>, name: String, symbol: String, uri: String) -> Result<()> {
		initialize_collection::handler(ctx, name, symbol, uri)
	}

/// Mints a new NFT to a collection
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` collection: [NftCollection] The collection to mint the NFT to
/// 2. `[writable, signer]` mint: [Mint] The mint account for the new NFT
/// 3. `[writable]` metadata: [NftMint] The metadata account for the new NFT
/// 4. `[signer]` authority: [AccountInfo] The authority of the collection
/// 5. `[signer]` owner: [AccountInfo] The owner of the new NFT
/// 6. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
/// 7. `[writable, signer]` funding: [AccountInfo] Funding account (must be a system account)
/// 8. `[writable]` assoc_token_account: [AccountInfo] Associated token account address to be created
/// 9. `[]` wallet: [AccountInfo] Wallet address for the new associated token account
/// 10. `[]` token_program: [AccountInfo] SPL Token program
/// 11. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
/// 12. `[]` csl_spl_assoc_token_v0_0_0: [AccountInfo] Auto-generated, CslSplAssocTokenProgram v0.0.0
///
/// Data:
/// - name: [String] Name of the NFT
/// - symbol: [String] Symbol of the NFT
/// - uri: [String] URI to the NFT metadata
	pub fn mint_nft(ctx: Context<MintNft>, name: String, symbol: String, uri: String) -> Result<()> {
		mint_nft::handler(ctx, name, symbol, uri)
	}

/// Updates the metadata of an existing NFT
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[]` collection: [NftCollection] The collection the NFT belongs to
/// 2. `[writable]` metadata: [NftMint] The metadata account to update
/// 3. `[]` mint: [Mint] The mint account of the NFT
/// 4. `[signer]` authority: [AccountInfo] The authority of the collection
///
/// Data:
/// - name: [String] New name of the NFT
/// - uri: [String] New URI to the NFT metadata
	pub fn update_nft_metadata(ctx: Context<UpdateNftMetadata>, name: String, uri: String) -> Result<()> {
		update_nft_metadata::handler(ctx, name, uri)
	}

/// Transfers an NFT to another wallet
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[]` mint: [Mint] The mint account of the NFT
/// 2. `[writable]` metadata: [NftMint] The metadata account of the NFT
/// 3. `[signer]` owner: [AccountInfo] The current owner of the NFT
/// 4. `[]` new_owner: [AccountInfo] The new owner of the NFT
/// 5. `[writable, signer]` funding: [AccountInfo] Funding account (must be a system account)
/// 6. `[writable]` assoc_token_account: [AccountInfo] Associated token account address to be created
/// 7. `[]` wallet: [AccountInfo] Wallet address for the new associated token account
/// 8. `[]` system_program: [AccountInfo] System program
/// 9. `[]` token_program: [AccountInfo] SPL Token program
/// 10. `[writable]` source: [AccountInfo] The source account.
/// 11. `[writable]` destination: [AccountInfo] The destination account.
/// 12. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
/// 13. `[]` csl_spl_assoc_token_v0_0_0: [AccountInfo] Auto-generated, CslSplAssocTokenProgram v0.0.0
/// 14. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
	pub fn transfer_nft(ctx: Context<TransferNft>) -> Result<()> {
		transfer_nft::handler(ctx)
	}



}
