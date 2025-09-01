use {
	metaplex_nft_program::{
			entry,
			ID as PROGRAM_ID,
	},
	solana_sdk::{
		entrypoint::{ProcessInstruction, ProgramResult},
		pubkey::Pubkey,
	},
	anchor_lang::prelude::AccountInfo,
	solana_program_test::*,
};

// Type alias for the entry function pointer used to convert the entry function into a ProcessInstruction function pointer.
pub type ProgramEntry = for<'info> fn(
	program_id: &Pubkey,
	accounts: &'info [AccountInfo<'info>],
	instruction_data: &[u8],
) -> ProgramResult;

// Macro to convert the entry function into a ProcessInstruction function pointer.
#[macro_export]
macro_rules! convert_entry {
	($entry:expr) => {
		// Use unsafe block to perform memory transmutation.
		unsafe { core::mem::transmute::<ProgramEntry, ProcessInstruction>($entry) }
	};
}

pub fn get_program_test() -> ProgramTest {
	let program_test = ProgramTest::new(
		"metaplex_nft_program",
		PROGRAM_ID,
		processor!(convert_entry!(entry)),
	);
	program_test
}
	
pub mod metaplex_nft_program_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		metaplex_nft_program::{
			ID as PROGRAM_ID,
			accounts as metaplex_nft_program_accounts,
			instruction as metaplex_nft_program_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	pub fn initialize_collection_ix_setup(
		fee_payer: &Keypair,
		collection: Pubkey,
		authority: &Keypair,
		system_program: Pubkey,
		name: &String,
		symbol: &String,
		uri: &String,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = metaplex_nft_program_accounts::InitializeCollection {
			fee_payer: fee_payer.pubkey(),
			collection: collection,
			authority: authority.pubkey(),
			system_program: system_program,
		};

		let data = 	metaplex_nft_program_instruction::InitializeCollection {
				name: name.clone(),
				symbol: symbol.clone(),
				uri: uri.clone(),
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.sign(&[
			&fee_payer,
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn mint_nft_ix_setup(
		fee_payer: &Keypair,
		collection: Pubkey,
		mint: &Keypair,
		metadata: Pubkey,
		authority: &Keypair,
		owner: &Keypair,
		system_program: Pubkey,
		funding: &Keypair,
		assoc_token_account: Pubkey,
		wallet: Pubkey,
		token_program: Pubkey,
		csl_spl_token_v0_0_0: Pubkey,
		csl_spl_assoc_token_v0_0_0: Pubkey,
		name: &String,
		symbol: &String,
		uri: &String,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = metaplex_nft_program_accounts::MintNft {
			fee_payer: fee_payer.pubkey(),
			collection: collection,
			mint: mint.pubkey(),
			metadata: metadata,
			authority: authority.pubkey(),
			owner: owner.pubkey(),
			system_program: system_program,
			funding: funding.pubkey(),
			assoc_token_account: assoc_token_account,
			wallet: wallet,
			token_program: token_program,
			csl_spl_token_v0_0_0: csl_spl_token_v0_0_0,
			csl_spl_assoc_token_v0_0_0: csl_spl_assoc_token_v0_0_0,
		};

		let data = 	metaplex_nft_program_instruction::MintNft {
				name: name.clone(),
				symbol: symbol.clone(),
				uri: uri.clone(),
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.partial_sign(&[
			&fee_payer,
			&mint,
			&authority,
			&owner,
		], recent_blockhash);

		transaction.partial_sign(&[
			&funding,
		], recent_blockhash);

		return transaction;
	}

	pub fn update_nft_metadata_ix_setup(
		fee_payer: &Keypair,
		collection: Pubkey,
		metadata: Pubkey,
		mint: Pubkey,
		authority: &Keypair,
		name: &String,
		uri: &String,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = metaplex_nft_program_accounts::UpdateNftMetadata {
			fee_payer: fee_payer.pubkey(),
			collection: collection,
			metadata: metadata,
			mint: mint,
			authority: authority.pubkey(),
		};

		let data = 	metaplex_nft_program_instruction::UpdateNftMetadata {
				name: name.clone(),
				uri: uri.clone(),
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.sign(&[
			&fee_payer,
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn transfer_nft_ix_setup(
		fee_payer: &Keypair,
		mint: Pubkey,
		metadata: Pubkey,
		owner: &Keypair,
		new_owner: Pubkey,
		funding: &Keypair,
		assoc_token_account: Pubkey,
		wallet: Pubkey,
		system_program: Pubkey,
		token_program: Pubkey,
		source: Pubkey,
		destination: Pubkey,
		authority: &Keypair,
		csl_spl_assoc_token_v0_0_0: Pubkey,
		csl_spl_token_v0_0_0: Pubkey,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = metaplex_nft_program_accounts::TransferNft {
			fee_payer: fee_payer.pubkey(),
			mint: mint,
			metadata: metadata,
			owner: owner.pubkey(),
			new_owner: new_owner,
			funding: funding.pubkey(),
			assoc_token_account: assoc_token_account,
			wallet: wallet,
			system_program: system_program,
			token_program: token_program,
			source: source,
			destination: destination,
			authority: authority.pubkey(),
			csl_spl_assoc_token_v0_0_0: csl_spl_assoc_token_v0_0_0,
			csl_spl_token_v0_0_0: csl_spl_token_v0_0_0,
		};

		let data = metaplex_nft_program_instruction::TransferNft;
		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.sign(&[
			&fee_payer,
			&owner,
			&funding,
			&authority,
		], recent_blockhash);

		return transaction;
	}

}

pub mod csl_spl_token_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		csl_spl_token::{
			ID as PROGRAM_ID,
			accounts as csl_spl_token_accounts,
			instruction as csl_spl_token_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	declare_id!("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

}

pub mod csl_spl_assoc_token_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		csl_spl_assoc_token::{
			ID as PROGRAM_ID,
			accounts as csl_spl_assoc_token_accounts,
			instruction as csl_spl_assoc_token_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	declare_id!("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

}
