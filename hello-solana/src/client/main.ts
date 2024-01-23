import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from 'mz/fs';
import path from 'path';
  
const PROGRAM_KEYPAIR_PATH = path.join(
    path.resolve(__dirname, '../../dist/program'),
    'program-keypair.json'
);

async function main() {
    console.log("Launching client...");
    
    let connection = new Connection('https://devnet.helius-rpc.com/?api-key=cdde3615-8180-47b7-b846-42b8d54035df', 'confirmed');

    // Get our program's public key
    const secretKeyString = await fs.readFile(PROGRAM_KEYPAIR_PATH, {encoding: 'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const programKeypair = Keypair.fromSecretKey(secretKey);
    let programId: PublicKey = programKeypair.publicKey;

    // my wallet keypair
    const secret = [9,177,228,250,192,101,170,154,165,119,146,14,189,36,103,217,86,103,249,80,52,82,23,253,177,3,97,244,122,15,192,182,213,100,78,210,46,31,154,198,104,236,28,176,108,85,198,196,69,74,40,164,44,119,64,216,244,240,36,176,85,130,97,219]; 
    const FROM_KEYPAIR = Keypair.fromSecretKey(new Uint8Array(secret));

    console.log('--Pinging Program ', programId.toBase58());
    const instruction = new TransactionInstruction({
        keys: [{pubkey: new PublicKey("FMzZ3PRuFPns7DmrU5aCFDeaSgSVmMtofVJGBJcFJCxr"), isSigner: false, isWritable: true}],
        programId,
        data: Buffer.alloc(0),
    });
    const receipt = await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [FROM_KEYPAIR],
    );
    console.log("sig:", receipt)
}

main()