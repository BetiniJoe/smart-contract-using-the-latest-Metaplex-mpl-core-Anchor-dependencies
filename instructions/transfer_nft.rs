use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};




	#[derive(Accounts)]
	pub struct TransferNft<'info> {
		#[account(
			mut,
		)]
		pub fee_payer: Signer<'info>,

		pub mint: Account<'info, Mint>,

		#[account(
			mut,
			seeds = [
				b"metadata",
				mint.key().as_ref(),
			],
			bump,
		)]
		pub metadata: Account<'info, NftMint>,

		pub owner: Signer<'info>,

		/// CHECK: implement manual checks if needed
		pub new_owner: UncheckedAccount<'info>,

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

		pub system_program: Program<'info, System>,

		pub token_program: Program<'info, Token>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub source: UncheckedAccount<'info>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub destination: UncheckedAccount<'info>,

		pub authority: Signer<'info>,

		pub csl_spl_assoc_token_v0_0_0: Program<'info, AssociatedToken>,

		pub csl_spl_token_v0_0_0: Program<'info, Token>,
	}

	impl<'info> TransferNft<'info> {
		pub fn cpi_csl_spl_token_transfer_checked(&self, amount: u64, decimals: u8) -> Result<()> {
			anchor_spl::token::transfer_checked(
				CpiContext::new(self.csl_spl_token_v0_0_0.to_account_info(), 
					anchor_spl::token::TransferChecked {
						from: self.source.to_account_info(),
						mint: self.mint.to_account_info(),
						to: self.destination.to_account_info(),
						authority: self.authority.to_account_info()
					}
				),
				amount, 
				decimals, 
			)
		}
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
pub fn handler(
	ctx: Context<TransferNft>,
) -> Result<()> {
    // Implement your business logic here...
	
	// Cpi calls wrappers
	ctx.accounts.cpi_csl_spl_token_transfer_checked(
		Default::default(),
		Default::default(),
	)?;

	Ok(())
}
