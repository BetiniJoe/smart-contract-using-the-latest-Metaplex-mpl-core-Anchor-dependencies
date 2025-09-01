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
async fn initialize_collection_ix_success() {
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

	// DATA
	let name: String = Default::default();
	let symbol: String = Default::default();
	let uri: String = Default::default();

	// KEYPAIR
	let fee_payer_keypair = Keypair::new();
	let authority_keypair = Keypair::new();

	// PUBKEY
	let fee_payer_pubkey = fee_payer_keypair.pubkey();
	let authority_pubkey = authority_keypair.pubkey();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// PDA
	let (collection_pda, _collection_pda_bump) = Pubkey::find_program_address(
		&[
			b"collection",
			authority_pubkey.as_ref(),
		],
		&metaplex_nft_program::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
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
		authority_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = metaplex_nft_program_ix_interface::initialize_collection_ix_setup(
		&fee_payer_keypair,
		collection_pda,
		&authority_keypair,
		system_program_pubkey,
		&name,
		&symbol,
		&uri,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
