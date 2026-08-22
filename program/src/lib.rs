use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod omniver_quantum_decoder {
    use super::*;

    /// Initialize a new researcher / student player profile PDA
    pub fn initialize_player(ctx: Context<InitializePlayer>) -> Result<()> {
        let player_profile = &mut ctx.accounts.player_profile;
        player_profile.player = ctx.accounts.player.key();
        player_profile.level = 1;
        player_profile.score = 0;
        player_profile.tasks_completed = 0;
        player_profile.bump = ctx.bumps.player_profile;
        
        msg!("Quantum Decoder Registered: {}", player_profile.player);
        Ok(())
    }

    /// Oracle/Relayer updates score upon verified Shor's / Bitcoin cryptographic decode proof
    pub fn update_score(
        ctx: Context<UpdateScore>, 
        points_earned: u64,
        task_hash: [u8; 32],
    ) -> Result<()> {
        let player_profile = &mut ctx.accounts.player_profile;
        
        player_profile.score = player_profile.score.checked_add(points_earned).unwrap();
        player_profile.tasks_completed = player_profile.tasks_completed.checked_add(1).unwrap();

        // Level up formula: every 100 points = +1 Level
        player_profile.level = ((player_profile.score / 100) as u8) + 1;

        emit!(QuantumDecodedEvent {
            player: player_profile.player,
            score: player_profile.score,
            level: player_profile.level,
            task_hash,
        });

        msg!("Score updated! New score: {}, Level: {}", player_profile.score, player_profile.level);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePlayer<'info> {
    #[account(
        init,
        payer = player,
        space = 8 + 32 + 1 + 8 + 8 + 1,
        seeds = [b"player_profile", player.key().as_ref()],
        bump
    )]
    pub player_profile: Account<'info, PlayerProfile>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateScore<'info> {
    #[account(
        mut,
        seeds = [b"player_profile", player_profile.player.as_ref()],
        bump = player_profile.bump
    )]
    pub player_profile: Account<'info, PlayerProfile>,
    /// Authorized Relayer / Oracle Authority
    #[account(mut)]
    pub relayer_authority: Signer<'info>,
}

#[account]
pub struct PlayerProfile {
    pub player: Pubkey,
    pub level: u8,
    pub score: u64,
    pub tasks_completed: u64,
    pub bump: u8,
}

#[event]
pub struct QuantumDecodedEvent {
    pub player: Pubkey,
    pub score: u64,
    pub level: u8,
    pub task_hash: [u8; 32],
}
