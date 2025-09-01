
use anchor_lang::prelude::*;

#[account]
pub struct NftCollection {
	pub authority: Pubkey,
	pub name: String,
	pub symbol: String,
	pub uri: String,
	pub verified: bool,
	pub nft_count: u64,
}
