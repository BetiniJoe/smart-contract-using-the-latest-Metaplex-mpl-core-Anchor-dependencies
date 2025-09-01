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
	pub struct MintNft<'info> {
		#[account(
			mut,
		)]
		pub fee_payer: Signer<'info>,

		#[account(
			mut,
			seeds = [
				b"collection",
				authority.key().as_ref(),
			],
			bump,
		)]
		pub collection: Account<'info, NftCollection>,

		#[account(
			init,
			payer = fee_payer,
			mint::decimals = 0,
		)]
		pub mint: Account<'info, Mint>,

		#[account(
			init,
			space=358,
			payer=fee_payer,
			seeds = [
				b"metadata",
				mint.key().as_ref(),
			],
			bump,
		)]
		pub metadata: Account<'info, NftMint>,

		pub authority: Signer<'info>,

		pub owner: Signer<'info>,

		pub system_program: Program<'info, System>,

		#[account(
			mut,
			owner=Pubkey::from_str("11111111111111111111111111111111").unwrap(),
		)]
		pub funding: Signer<'info>,

		#[account(
			init,
			payer = funding,
			associated_token::mint = mint,
			associated_token::authority = wallet,
			associated_token::token_program = token_program,
		)]
		pub assoc_token_account: Account<'info, TokenAccount>,

		/// CHECK: implement manual checks if needed
		pub wallet: UncheckedAccount<'info>,

		pub token_program: Program<'info, Token>,

		pub csl_spl_token_v0_0_0: Program<'info, Token>,

		pub csl_spl_assoc_token_v0_0_0: Program<'info, AssociatedToken>,
	}

	impl<'info> MintNft<'info> {
		pub fn cpi_csl_spl_token_initialize_mint2(&self, decimals: u8, mint_authority: Pubkey, freeze_authority: Option<Pubkey>) -> Result<()> {
			anchor_spl::token::initialize_mint2(
				CpiContext::new(self.csl_spl_token_v0_0_0.to_account_info(), 
					anchor_spl::token::InitializeMint2 {
						mint: self.mint.to_account_info()
					}
				),
				decimals, 
				mint_authority, 
				freeze_authority, 
			)
		}
		pub fn cpi_csl_spl_token_mint_to(&self, amount: u64) -> Result<()> {
			anchor_spl::token::mint_to(
				CpiContext::new(self.csl_spl_token_v0_0_0.to_account_info(), 
					anchor_spl::token::MintTo {
						mint: self.mint.to_account_info(),
						to: self.assoc_token_account.to_account_info(),
						authority: self.owner.to_account_info()
					}
				),
				amount, 
			)
		}
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
pub fn handler(
	ctx: Context<MintNft>,
	name: String,
	symbol: String,
	uri: String,
) -> Result<()> {
    // Implement your business logic here...
	
	// Cpi calls wrappers
	ctx.accounts.cpi_csl_spl_token_initialize_mint2(
		Default::default(),
		Pubkey::default(),
		None,
	)?;

	ctx.accounts.cpi_csl_spl_token_mint_to(
		Default::default(),
	)?;

	Ok(())
}
