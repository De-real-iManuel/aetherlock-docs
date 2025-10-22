# Solana Escrow Contract

## Contract Overview

The AetherLock Solana escrow contract is built using the Anchor framework, providing type-safe and secure escrow functionality with AI verification integration and cross-chain compatibility.

## Core Data Structures

### EscrowAccount Structure

```rust
#[account]
pub struct EscrowAccount {
    /// Unique identifier for the escrow
    pub escrow_id: u64,
    /// Public key of the payer (funds sender)
    pub payer: Pubkey,
    /// Public key of the payee (funds receiver)
    pub payee: Pubkey,
    /// Amount locked in escrow (in lamports for SOL)
    pub amount: u64,
    /// Token mint address (None for SOL)
    pub token_mint: Option<Pubkey>,
    /// Current status of the escrow
    pub status: EscrowStatus,
    /// Deadline for task completion (Unix timestamp)
    pub deadline: i64,
    /// IPFS hash of task description and requirements
    pub task_metadata_hash: String,
    /// IPFS hash of submitted evidence
    pub evidence_hash: Option<String>,
    /// AI verification result
    pub verification_result: Option<VerificationResult>,
    /// zkMe KYC verification status
    pub kyc_verified: bool,
    /// Treasury fee amount (2% of escrow amount)
    pub treasury_fee: u64,
    /// Timestamp when escrow was created
    pub created_at: i64,
    /// Bump seed for PDA derivation
    pub bump: u8,
}
```

### Escrow Status Enum

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EscrowStatus {
    /// Escrow created, awaiting fund deposit
    Created,
    /// Funds deposited, awaiting task completion
    Funded,
    /// Evidence submitted, awaiting AI verification
    PendingVerification,
    /// AI verification completed, funds can be released
    Verified,
    /// Dispute initiated, awaiting resolution
    Disputed,
    /// Escrow completed successfully
    Completed,
    /// Escrow cancelled or refunded
    Cancelled,
}
```

### Verification Result Structure

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VerificationResult {
    /// AI confidence score (0-100)
    pub confidence_score: u8,
    /// Verification decision
    pub decision: VerificationDecision,
    /// IPFS hash of detailed AI analysis
    pub analysis_hash: String,
    /// Timestamp of verification
    pub verified_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VerificationDecision {
    Approved,
    Rejected,
    NeedsReview,
}
```

## Key Contract Functions

### Initialize Escrow

```rust
#[derive(Accounts)]
#[instruction(escrow_id: u64)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        payer = payer,
        space = EscrowAccount::LEN,
        seeds = [b"escrow", escrow_id.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Payee address validation handled in instruction
    pub payee: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn initialize_escrow(
    ctx: Context<InitializeEscrow>,
    escrow_id: u64,
    amount: u64,
    deadline: i64,
    task_metadata_hash: String,
    token_mint: Option<Pubkey>,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow_account;
    
    escrow.escrow_id = escrow_id;
    escrow.payer = ctx.accounts.payer.key();
    escrow.payee = ctx.accounts.payee.key();
    escrow.amount = amount;
    escrow.token_mint = token_mint;
    escrow.status = EscrowStatus::Created;
    escrow.deadline = deadline;
    escrow.task_metadata_hash = task_metadata_hash;
    escrow.evidence_hash = None;
    escrow.verification_result = None;
    escrow.kyc_verified = false;
    escrow.treasury_fee = amount * 2 / 100; // 2% fee
    escrow.created_at = Clock::get()?.unix_timestamp;
    escrow.bump = *ctx.bumps.get("escrow_account").unwrap();
    
    emit!(EscrowCreated {
        escrow_id,
        payer: escrow.payer,
        payee: escrow.payee,
        amount,
        deadline,
    });
    
    Ok(())
}
```

### Deposit Funds

```rust
#[derive(Accounts)]
pub struct DepositFunds<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow_account.escrow_id.to_le_bytes().as_ref()],
        bump = escrow_account.bump,
        constraint = escrow_account.status == EscrowStatus::Created
    )]
    pub escrow_account: Account<'info, EscrowAccount>,
    
    #[account(
        mut,
        constraint = payer.key() == escrow_account.payer
    )]
    pub payer: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"escrow_vault", escrow_account.escrow_id.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow_vault: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn deposit_funds(ctx: Context<DepositFunds>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow_account;
    
    // Transfer funds to escrow vault
    let transfer_instruction = system_instruction::transfer(
        &ctx.accounts.payer.key(),
        &ctx.accounts.escrow_vault.key(),
        escrow.amount + escrow.treasury_fee,
    );
    
    invoke(
        &transfer_instruction,
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.escrow_vault.to_account_info(),
        ],
    )?;
    
    escrow.status = EscrowStatus::Funded;
    
    emit!(FundsDeposited {
        escrow_id: escrow.escrow_id,
        amount: escrow.amount,
        treasury_fee: escrow.treasury_fee,
    });
    
    Ok(())
}
```

### Submit Evidence

```rust
pub fn submit_evidence(
    ctx: Context<SubmitEvidence>,
    evidence_hash: String,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow_account;
    
    require!(
        escrow.status == EscrowStatus::Funded,
        EscrowError::InvalidStatus
    );
    
    require!(
        Clock::get()?.unix_timestamp < escrow.deadline,
        EscrowError::DeadlineExceeded
    );
    
    escrow.evidence_hash = Some(evidence_hash.clone());
    escrow.status = EscrowStatus::PendingVerification;
    
    emit!(EvidenceSubmitted {
        escrow_id: escrow.escrow_id,
        evidence_hash,
        submitted_by: ctx.accounts.payee.key(),
    });
    
    Ok(())
}
```

### Process AI Verification

```rust
pub fn process_verification(
    ctx: Context<ProcessVerification>,
    confidence_score: u8,
    decision: VerificationDecision,
    analysis_hash: String,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow_account;
    
    require!(
        escrow.status == EscrowStatus::PendingVerification,
        EscrowError::InvalidStatus
    );
    
    escrow.verification_result = Some(VerificationResult {
        confidence_score,
        decision: decision.clone(),
        analysis_hash: analysis_hash.clone(),
        verified_at: Clock::get()?.unix_timestamp,
    });
    
    match decision {
        VerificationDecision::Approved => {
            escrow.status = EscrowStatus::Verified;
        },
        VerificationDecision::Rejected => {
            escrow.status = EscrowStatus::Funded; // Allow resubmission
        },
        VerificationDecision::NeedsReview => {
            escrow.status = EscrowStatus::Disputed;
        },
    }
    
    emit!(VerificationProcessed {
        escrow_id: escrow.escrow_id,
        decision,
        confidence_score,
        analysis_hash,
    });
    
    Ok(())
}
```

### Release Funds

```rust
pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow_account;
    
    require!(
        escrow.status == EscrowStatus::Verified,
        EscrowError::InvalidStatus
    );
    
    // Transfer funds to payee
    **ctx.accounts.escrow_vault.to_account_info().try_borrow_mut_lamports()? -= escrow.amount;
    **ctx.accounts.payee.to_account_info().try_borrow_mut_lamports()? += escrow.amount;
    
    // Transfer treasury fee
    **ctx.accounts.escrow_vault.to_account_info().try_borrow_mut_lamports()? -= escrow.treasury_fee;
    **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? += escrow.treasury_fee;
    
    escrow.status = EscrowStatus::Completed;
    
    emit!(FundsReleased {
        escrow_id: escrow.escrow_id,
        payee: escrow.payee,
        amount: escrow.amount,
        treasury_fee: escrow.treasury_fee,
    });
    
    Ok(())
}
```

## Events and Error Handling

### Event Definitions

```rust
#[event]
pub struct EscrowCreated {
    pub escrow_id: u64,
    pub payer: Pubkey,
    pub payee: Pubkey,
    pub amount: u64,
    pub deadline: i64,
}

#[event]
pub struct FundsDeposited {
    pub escrow_id: u64,
    pub amount: u64,
    pub treasury_fee: u64,
}

#[event]
pub struct EvidenceSubmitted {
    pub escrow_id: u64,
    pub evidence_hash: String,
    pub submitted_by: Pubkey,
}

#[event]
pub struct VerificationProcessed {
    pub escrow_id: u64,
    pub decision: VerificationDecision,
    pub confidence_score: u8,
    pub analysis_hash: String,
}

#[event]
pub struct FundsReleased {
    pub escrow_id: u64,
    pub payee: Pubkey,
    pub amount: u64,
    pub treasury_fee: u64,
}
```

### Custom Errors

```rust
#[error_code]
pub enum EscrowError {
    #[msg("Invalid escrow status for this operation")]
    InvalidStatus,
    #[msg("Deadline has been exceeded")]
    DeadlineExceeded,
    #[msg("Insufficient funds for escrow amount")]
    InsufficientFunds,
    #[msg("Unauthorized operation")]
    Unauthorized,
    #[msg("KYC verification required")]
    KycRequired,
    #[msg("Invalid verification result")]
    InvalidVerification,
}
```

This Solana escrow contract provides a robust foundation for AetherLock's AI-driven escrow functionality, with comprehensive error handling, event emission, and integration points for AI verification and cross-chain messaging.