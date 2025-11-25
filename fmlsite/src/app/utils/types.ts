export enum MatchType {
  Casual = "Casual",
  Official = "Official",
  Ranked = "Ranked",
  Tournament = "Tournament",
  Matchmaking = "Matchmaking",
}

export enum MatchTypeTrue {
  Casual = 0,
  Official = 1,
  Ranked = 2,
  Tournament = 3,
  Matchmaking = 4,
}

export type History = Record<
  string,
  {
    User: {
      Discord: string
      Kills: number
      KillsRolas: number
      Dead: boolean
      Id: string
      Headshots: number
      Damage: number
      DamageTakenList: Record<string, number>
      DamageGivenList: Record<string, number>
      Played: boolean
      Kicked: boolean
      Crashed: boolean
      CrashedCount: number
      Name: string
      Avatar: string
    }[]
    Teams: {
      // Team round
      Score: number
      Timeouts: number
      Flawless: boolean
    }
  }
>

export interface Matchh {
  teamsData: {
    Score: number
    Name: string
    Timeouts: number
  }[]
  matchData: {
    Id: string
    Type: number
    Teams: number
    Duration: number
    Map: string
    Date: number
    RadioAnimations: boolean
    Crouch: boolean
    Energetic: boolean
    DefaultScore: number
    ScoreToWin: number
    Weapons: string[]
    OnlyHs: boolean
    FF: boolean
    Winner: string
  }
  roundsData: {
    Index: number
    Winner: string
    Duration: number
    Overtime: boolean
    isHalf: boolean
    Cancelled: boolean
    Spectators: {
      Discord: string
      Id: string
      Avatar: string
      Name: string
    }[]
    History: History
  }[]
}

