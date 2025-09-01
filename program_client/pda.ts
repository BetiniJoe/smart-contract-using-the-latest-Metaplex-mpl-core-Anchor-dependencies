import {PublicKey} from "@solana/web3.js";
import {BN} from "@coral-xyz/anchor";

export type CollectionSeeds = {
    authority: PublicKey, 
};

export const deriveCollectionPDA = (
    seeds: CollectionSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("collection"),
            seeds.authority.toBuffer(),
        ],
        programId,
    )
};

export type NftMetadataSeeds = {
    mint: PublicKey, 
};

export const deriveNftMetadataPDA = (
    seeds: NftMetadataSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            seeds.mint.toBuffer(),
        ],
        programId,
    )
};

export module CslSplTokenPDAs {
    export type AccountSeeds = {
        wallet: PublicKey, 
        tokenProgram: PublicKey, 
        mint: PublicKey, 
    };
    
    export const deriveAccountPDA = (
        seeds: AccountSeeds,
        programId: PublicKey
    ): [PublicKey, number] => {
        return PublicKey.findProgramAddressSync(
            [
                seeds.wallet.toBuffer(),
                seeds.tokenProgram.toBuffer(),
                seeds.mint.toBuffer(),
            ],
            programId,
        )
    };
    
}

export module CslSplAssocTokenPDAs {
    export module CslSplTokenPDAs {
        export type AccountSeeds = {
            wallet: PublicKey, 
            tokenProgram: PublicKey, 
            mint: PublicKey, 
        };
        
        export const deriveAccountPDA = (
            seeds: AccountSeeds,
            programId: PublicKey
        ): [PublicKey, number] => {
            return PublicKey.findProgramAddressSync(
                [
                    seeds.wallet.toBuffer(),
                    seeds.tokenProgram.toBuffer(),
                    seeds.mint.toBuffer(),
                ],
                programId,
            )
        };
        
    }
    
}

