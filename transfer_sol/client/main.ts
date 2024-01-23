import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import {readFileSync} from "fs";
import path from 'path';

const lo = require("buffer-layout");

let connection: Connection;
let programKeypair: Keypair;
let programId: PublicKey;

let ringoKeypair: Keypair;
let georgeKeypair: Keypair;
let paulKeypair: Keypair;
let johnKeypair: Keypair;

function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(readFileSync(path, "utf-8")))
    )
}

async function sendLamports(from: Keypair, to: PublicKey, amount: number) {
    
    let data = Buffer.alloc(8) // 8 bytes
    lo.ns64("value").encode(amount, data);

    let ins = new TransactionInstruction({
        keys: [
            {pubkey: from.publicKey, isSigner: true, isWritable: true},
            {pubkey: to, isSigner: false, isWritable: true},
            {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        programId: programId,
        data: data,
    })

    await sendAndConfirmTransaction(
        connection, 
        new Transaction().add(ins), 
        [from]
    );
}

async function main() {
    
    connection = new Connection("https://quiet-young-pallet.solana-devnet.quiknode.pro/3404df0b4463b4a85ae6781e7161814488e44918/");

    programKeypair = createKeypairFromFile(
        path.join(
            path.resolve(__dirname, '../_dist/program'), 
            'program-keypair.json'
        )
    );
    programId = programKeypair.publicKey;

    // Our sample members are Ringo, George, Paul & John.
    ringoKeypair = createKeypairFromFile(__dirname + "/../accounts/ringo.json");
    georgeKeypair = createKeypairFromFile(__dirname + "/../accounts/george.json");
    paulKeypair = createKeypairFromFile(__dirname + "/../accounts/paul.json");
    johnKeypair = createKeypairFromFile(__dirname + "/../accounts/john.json");

    // John sends some SOL to Ringo.
    console.log("John sends some SOL to Ringo...");
    console.log(`   John's public key: ${johnKeypair.publicKey}`);
    console.log(`   Ringo's public key: ${ringoKeypair.publicKey}`);
    await sendLamports(johnKeypair, ringoKeypair.publicKey, 50000);

    // Paul sends some SOL to George.
    console.log("Paul sends some SOL to George...");
    console.log(`   Paul's public key: ${paulKeypair.publicKey}`);
    console.log(`   George's public key: ${georgeKeypair.publicKey}`);
    await sendLamports(paulKeypair, georgeKeypair.publicKey, 40000);

    // George sends some SOL over to John.
    console.log("George sends some SOL over to John...");
    console.log(`   George's public key: ${georgeKeypair.publicKey}`);
    console.log(`   John's public key: ${johnKeypair.publicKey}`);
    await sendLamports(georgeKeypair, johnKeypair.publicKey, 20000);
}

main()