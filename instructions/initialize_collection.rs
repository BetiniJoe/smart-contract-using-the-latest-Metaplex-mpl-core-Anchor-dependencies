use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};




	#[derive(Accounts)]
	#[instruction(
		name: String,
		symbol: String,
		uri: String,
	)]
	pub struct InitializeCollection<'info> {
		#[account(
			mut,
		)]
		pub fee_payer: Signer<'info>,

		#[account(
			init,
			space=303,
			payer=fee_payer,
			seeds = [
				b"collection",
				authority.key().as_ref(),
			],
			bump,
		)]
		pub collection: Account<'info, NftCollection>,

		pub authority: Signer<'info>,

		pub system_program: Program<'info, System>,
	}

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
pub fn handler(
	ctx: Context<InitializeCollection>,
	name: String,
	symbol: String,
	uri: String,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
