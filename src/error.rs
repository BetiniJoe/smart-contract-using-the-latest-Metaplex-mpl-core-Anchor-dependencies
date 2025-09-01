// This file is auto-generated from the CIDL source.
// Editing this file directly is not recommended as it may be overwritten.
//
// Docs: https://docs.codigo.ai/c%C3%B3digo-interface-description-language/specification#errors

use anchor_lang::prelude::*;

#[error_code]
pub enum MetaplexNftProgramError {
	#[msg("The specified collection does not exist")]
	CollectionNotFound,
	#[msg("Only the collection authority can perform this action")]
	InvalidAuthority,
	#[msg("The provided metadata is invalid")]
	InvalidMetadata,
	#[msg("The specified NFT does not exist")]
	NftNotFound,
}
