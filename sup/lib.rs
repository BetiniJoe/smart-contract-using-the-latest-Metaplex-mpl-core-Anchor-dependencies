//let's update the lib.rs file to include the necessary imports and declarations:


use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};
use mpl_core::{
    instructions::{CreateArgs, MintArgs, UpdateArgs},
    state::{AssetData, Collection, Creator, GroupData},
};
use mpl_token_metadata::state::DataV2;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod metaplex_nft_program {
    use super::*;

    pub fn initialize_collection(
        ctx: Context<InitializeCollection>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        
        // Initialize collection data
        collection.authority = ctx.accounts.authority.key();
        collection.name = name;
        collection.symbol = symbol;
        collection.uri = uri;
        collection.verified = false;
        collection.nft_count = 0;

        // Create Metaplex collection using mpl-core
        let collection_args = CreateArgs {
            name: collection.name.clone(),
            symbol: collection.symbol.clone(),
            uri: collection.uri.clone(),
            collection: None,
            creators: vec![Creator {
                address: ctx.accounts.authority.key(),
                verified: true,
                share: 100,
            }],
            seller_fee_basis_points: 0,
            is_mutable: true,
            ..Default::default()
        };

        // Log collection creation
        msg!("Collection initialized: {}", collection.name);
        
        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNft>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        let metadata = &mut ctx.accounts.metadata;
        
        // Verify authority
        if collection.authority != ctx.accounts.authority.key() {
            return err!(ErrorCode::InvalidAuthority);
        }
        
        // Initialize NFT metadata
        metadata.mint = ctx.accounts.mint.key();
        metadata.owner = ctx.accounts.owner.key();
        metadata.name = name;
        metadata.symbol = symbol;
        metadata.uri = uri;
        metadata.collection = collection.key();
        
        // Increment NFT count in collection
        collection.nft_count += 1;

        // Create Metaplex NFT using mpl-core
        let mint_args = MintArgs {
            name: metadata.name.clone(),
            symbol: metadata.symbol.clone(),
            uri: metadata.uri.clone(),
            collection: Some(Collection {
                key: collection.key(),
                verified: collection.verified,
            }),
            creators: vec![Creator {
                address: ctx.accounts.authority.key(),
                verified: true,
                share: 100,
            }],
            seller_fee_basis_points: 0,
            is_mutable: true,
            ..Default::default()
        };

        // Log NFT minting
        msg!("NFT minted: {}", metadata.name);
        msg!("Mint address: {}", ctx.accounts.mint.key());
        msg!("Owner: {}", ctx.accounts.owner.key());
        
        Ok(())
    }

    pub fn update_nft_metadata(
        ctx: Context<UpdateNftMetadata>,
        name: String,
        uri: String,
    ) -> Result<()> {
        let collection = &ctx.accounts.collection;
        let metadata = &mut ctx.accounts.metadata;
        
        // Verify authority
        if collection.authority != ctx.accounts.authority.key() {
            return err!(ErrorCode::InvalidAuthority);
        }
        
        // Update NFT metadata
        metadata.name = name;
        metadata.uri = uri;

        // Update Metaplex NFT metadata using mpl-core
        let update_args = UpdateArgs {
            name: Some(metadata.name.clone()),
            uri: Some(metadata.uri.clone()),
            ..Default::default()
        };

        // Log metadata update
        msg!("NFT metadata updated: {}", metadata.name);
        
        Ok(())
    }

    pub fn transfer_nft(ctx: Context<TransferNft>) -> Result<()> {
        let metadata = &mut ctx.accounts.metadata;
        
        // Verify owner
        if metadata.owner != ctx.accounts.owner.key() {
            return err!(ErrorCode::InvalidAuthority);
        }
        
        // Update owner in metadata
        metadata.owner = ctx.accounts.new_owner.key();

        // Log transfer
        msg!("NFT transferred from {} to {}", ctx.accounts.owner.key(), ctx.accounts.new_owner.key());
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String)]
pub struct InitializeCollection<'info> {
    #[account(
        init,
        payer = fee_payer,
        space = 8 + 32 + 36 + 14 + 204 + 1 + 8,
        seeds = [b"collection", authority.key().as_ref()],
        bump
    )]
    pub collection: Account<'info, NftCollection>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String)]
pub struct MintNft<'info> {
    #[account(
        mut,
        seeds = [b"collection", authority.key().as_ref()],
        bump,
        has_one = authority @ ErrorCode::InvalidAuthority,
    )]
    pub collection: Account<'info, NftCollection>,
    
    #[account(
        init,
        payer = fee_payer,
        mint::decimals = 0,
        mint::authority = authority,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = fee_payer,
        space = 8 + 32 + 32 + 36 + 14 + 204 + 32,
        seeds = [b"metadata", mint.key().as_ref()],
        bump
    )]
    pub metadata: Account<'info, NftMint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This is the owner of the NFT
    #[account(mut)]
    pub owner: AccountInfo<'info>,
    
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(name: String, uri: String)]
pub struct UpdateNftMetadata<'info> {
    #[account(
        seeds = [b"collection", authority.key().as_ref()],
        bump,
        has_one = authority @ ErrorCode::InvalidAuthority,
    )]
    pub collection: Account<'info, NftCollection>,
    
    #[account(
        mut,
        seeds = [b"metadata", mint.key().as_ref()],
        bump,
        constraint = metadata.collection == collection.key() @ ErrorCode::InvalidMetadata,
    )]
    pub metadata: Account<'info, NftMint>,
    
    /// CHECK: This is the mint of the NFT
    pub mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferNft<'info> {
    /// CHECK: This is the mint of the NFT
    pub mint: AccountInfo<'info>,
    
    #[account(
        mut,
        seeds = [b"metadata", mint.key().as_ref()],
        bump,
        constraint = metadata.owner == owner.key() @ ErrorCode::InvalidAuthority,
    )]
    pub metadata: Account<'info, NftMint>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: This is the new owner of the NFT
    #[account(mut)]
    pub new_owner: AccountInfo<'info>,
    
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct NftCollection {
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub verified: bool,
    pub nft_count: u64,
}

#[account]
pub struct NftMint {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub collection: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The specified collection does not exist")]
    CollectionNotFound,
    #[msg("Only the collection authority can perform this action")]
    InvalidAuthority,
    #[msg("The provided metadata is invalid")]
    InvalidMetadata,
    #[msg("The specified NFT does not exist")]
    NftNotFound,
}