
use anchor_lang::prelude::*;

#[account]
pub struct NftMint {
	pub mint: Pubkey,
	pub owner: Pubkey,
	pub name: String,
	pub symbol: String,
	pub uri: String,
	pub collection: Pubkey,
}
