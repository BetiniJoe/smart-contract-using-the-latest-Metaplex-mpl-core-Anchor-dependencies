pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		metaplex_nft_program_ix_interface,
		csl_spl_token_ix_interface,
		csl_spl_assoc_token_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn mint_nft_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	program_test.add_program(
		"csl_spl_token",
		Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap(),
		None,
	);

	program_test.add_program(
		"csl_spl_assoc_token",
		Pubkey::from_str("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL").unwrap(),
		None,
	);

	// DATA
	let name: String = Default::default();
	let symbol: String = Default::default();
	let uri: String = Default::default();

	// KEYPAIR
	let fee_payer_keypair = Keypair::new();
	let mint_keypair = Keypair::new();
	let authority_keypair = Keypair::new();
	let owner_keypair = Keypair::new();
	let funding_keypair = Keypair::new();

	// PUBKEY
	let fee_payer_pubkey = fee_payer_keypair.pubkey();
	let mint_pubkey = mint_keypair.pubkey();
	let authority_pubkey = authority_keypair.pubkey();
	let owner_pubkey = owner_keypair.pubkey();
	let funding_pubkey = funding_keypair.pubkey();
	let wallet_pubkey = Pubkey::new_unique();
	let token_program_pubkey = csl_spl_token_ix_interface::ID;

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();
	let csl_spl_token_v0_0_0_pubkey = Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap();
	let csl_spl_assoc_token_v0_0_0_pubkey = Pubkey::from_str("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL").unwrap();

	// PDA
	let (collection_pda, _collection_pda_bump) = Pubkey::find_program_address(
		&[
			b"collection",
			authority_pubkey.as_ref(),
		],
		&metaplex_nft_program::ID,
	);

	let (metadata_pda, _metadata_pda_bump) = Pubkey::find_program_address(
		&[
			b"metadata",
			mint_pubkey.as_ref(),
		],
		&metaplex_nft_program::ID,
	);

	let (assoc_token_account_pda, _assoc_token_account_pda_bump) = Pubkey::find_program_address(
		&[
			wallet_pubkey.as_ref(),
			token_program_pubkey.as_ref(),
			mint_pubkey.as_ref(),
		],
		&csl_spl_token_ix_interface::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		mint_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		fee_payer_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		mint_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		authority_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		owner_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		funding_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = metaplex_nft_program_ix_interface::mint_nft_ix_setup(
		&fee_payer_keypair,
		collection_pda,
		&mint_keypair,
		metadata_pda,
		&authority_keypair,
		&owner_keypair,
		system_program_pubkey,
		&funding_keypair,
		assoc_token_account_pda,
		wallet_pubkey,
		token_program_pubkey,
		csl_spl_token_v0_0_0_pubkey,
		csl_spl_assoc_token_v0_0_0_pubkey,
		&name,
		&symbol,
		&uri,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
