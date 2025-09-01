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
		uri: String,
	)]
	pub struct UpdateNftMetadata<'info> {
		#[account(
			mut,
		)]
		pub fee_payer: Signer<'info>,

		#[account(
			seeds = [
				b"collection",
				authority.key().as_ref(),
			],
			bump,
		)]
		pub collection: Account<'info, NftCollection>,

		#[account(
			mut,
			seeds = [
				b"metadata",
				mint.key().as_ref(),
			],
			bump,
		)]
		pub metadata: Account<'info, NftMint>,

		pub mint: Account<'info, Mint>,

		pub authority: Signer<'info>,
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
pub fn handler(
	ctx: Context<UpdateNftMetadata>,
	name: String,
	uri: String,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
