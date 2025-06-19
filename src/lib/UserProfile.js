// User Profile System - Complete Backend Data Structure

class UserProfile {
  constructor(userId) {
    this.userId = userId;
    this.accountInfo = {
      username: '',
      email: '',
      createdAt: new Date(),
      lastActive: new Date(),
      profilePicture: '',
      bio: '',
      verified: false,
      premiumSince: null,
      referralCode: this.generateReferralCode(),
      referredBy: null
    };

    this.progression = {
      level: 1,
      experience: 0,
      experienceToNext: 1000,
      tier: 'free', // free, vip, black, red
      tierExpiration: null,
      lifetimeSpent: 0,
      totalCreditsEarned: 0,
      creditsBalance: 1000,
      premiumCredits: 0,
      vipPoints: 0
    };

    this.statistics = {
      totalReactionsDeployed: 0,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      winStreak: 0,
      bestWinStreak: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      winRate: 0,
      averageScorePerBattle: 0,
      highestSingleBattleScore: 0,
      totalBattleTime: 0, // in seconds
      favoriteWeapon: null,
      accuracyRate: 0,
      criticalHitRate: 0,
      dodgeRate: 0
    };

    this.inventory = {
      weapons: {
        owned: ['heart'], // default starter weapon
        equipped: 'heart',
        upgrades: {
          heart: { level: 1, damage: 1, fireRate: 1, range: 1 },
          star: { level: 0, damage: 0, fireRate: 0, range: 0 },
          zap: { level: 0, damage: 0, fireRate: 0, range: 0 },
          sparkles: { level: 0, damage: 0, fireRate: 0, range: 0 },
          shield: { level: 0, damage: 0, fireRate: 0, range: 0 },
          rocket: { level: 0, damage: 0, fireRate: 0, range: 0 }
        }
      },
      consumables: {
        speedBoost: 0,
        damageBoost: 0,
        shield: 0,
        revive: 0,
        bomb: 0,
        airstrike: 0
      },
      cosmetics: {
        trails: [],
        explosionEffects: [],
        victoryAnimations: [],
        profileBorders: [],
        badges: []
      },
      lootBoxes: {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      }
    };

    this.achievements = {
      unlocked: [],
      progress: {
        firstBlood: { current: 0, target: 1, completed: false },
        centurion: { current: 0, target: 100, completed: false },
        millionaire: { current: 0, target: 1000000, completed: false },
        perfectAim: { current: 0, target: 100, completed: false },
        survivor: { current: 0, target: 10, completed: false },
        bigSpender: { current: 0, target: 10000, completed: false },
        socialButterfly: { current: 0, target: 50, completed: false },
        tournamentChampion: { current: 0, target: 1, completed: false },
        weaponMaster: { current: 0, target: 6, completed: false },
        tierClimber: { current: 0, target: 4, completed: false }
      },
      points: 0,
      titles: ['Newcomer'] // Displayed titles
    };

    this.social = {
      friends: [],
      blocked: [],
      followers: 0,
      following: 0,
      guilds: [],
      reputation: 0,
      endorsements: {
        friendly: 0,
        skilled: 0,
        helpful: 0,
        leader: 0
      },
      messages: {
        sent: 0,
        received: 0,
        unread: 0
      },
      customEmojis: {
        owned: ['🎉'],
        slots: 1,
        uploaded: []
      }
    };

    this.battleHistory = {
      recent: [], // Last 50 battles
      seasons: {
        current: {
          season: 1,
          rank: 'bronze',
          points: 0,
          wins: 0,
          losses: 0,
          placement: null
        },
        previous: []
      },
      tournaments: {
        entered: 0,
        wins: 0,
        topThree: 0,
        earnings: 0
      }
    };

    this.monetization = {
      purchases: [],
      subscriptions: {
        active: false,
        type: null, // monthly, yearly
        startDate: null,
        nextBilling: null,
        benefits: []
      },
      vipBenefits: {
        dailyCredits: false,
        exclusiveWeapons: false,
        priorityMatchmaking: false,
        customEmojis: 1,
        profileCustomization: false,
        adFree: false
      },
      spentByCategory: {
        weapons: 0,
        cosmetics: 0,
        consumables: 0,
        tierUpgrades: 0,
        tournaments: 0
      },
      lifetimeValue: 0,
      lastPurchase: null,
      preferredPaymentMethod: null
    };

    this.settings = {
      privacy: {
        profileVisibility: 'public', // public, friends, private
        showOnlineStatus: true,
        allowFriendRequests: true,
        allowMessages: 'everyone', // everyone, friends, none
        shareStatistics: true
      },
      notifications: {
        battleInvites: true,
        friendRequests: true,
        tournamentReminders: true,
        dailyRewards: true,
        promotional: false,
        achievements: true
      },
      gameplay: {
        autoAim: false,
        particleEffects: 'high', // low, medium, high
        soundEffects: true,
        music: true,
        screenShake: true,
        damageNumbers: true,
        minimap: true
      },
      accessibility: {
        colorblindMode: 'none', // none, protanopia, deuteranopia, tritanopia
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false
      }
    };

    this.rewards = {
      daily: {
        lastClaim: null,
        streak: 0,
        bestStreak: 0,
        nextReward: null
      },
      weekly: {
        tasksCompleted: [],
        rewardsClaimed: false
      },
      seasonal: {
        passOwned: false,
        passLevel: 0,
        claimedRewards: []
      }
    };

    this.analytics = {
      sessions: {
        total: 0,
        averageDuration: 0,
        lastSession: null,
        devices: []
      },
      engagement: {
        daysActive: 0,
        consecutiveDays: 0,
        peakPlayTime: null, // hour of day
        preferredMode: null,
        churnRisk: 'low' // low, medium, high
      },
      performance: {
        fps: [],
        ping: [],
        crashes: 0,
        reportedBugs: 0
      }
    };

    this.moderation = {
      warnings: 0,
      restrictions: [],
      reports: {
        made: 0,
        received: 0,
        resolved: 0
      },
      chatLogs: [],
      suspensions: [],
      trustScore: 100
    };
  }

  generateReferralCode() {
    return 'REF-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Method to calculate user's overall power level
  calculatePowerLevel() {
    const weaponPower = Object.values(this.inventory.weapons.upgrades)
      .reduce((sum, weapon) => sum + weapon.level, 0);
    const achievementPower = this.achievements.points / 100;
    const tierMultiplier = {
      free: 1,
      vip: 1.5,
      black: 2,
      red: 3
    }[this.progression.tier];
    
    return Math.floor((this.progression.level * 10 + weaponPower * 5 + achievementPower) * tierMultiplier);
  }

  // Method to check if user can participate in premium features
  canAccessPremiumFeature(feature) {
    const tierAccess = {
      airstrike: ['vip', 'black', 'red'],
      nuclearBomb: ['red'],
      customEmojis: ['vip', 'black', 'red'],
      exclusiveWeapons: ['black', 'red'],
      tournaments: ['vip', 'black', 'red']
    };
    
    return tierAccess[feature]?.includes(this.progression.tier) || false;
  }

  // Method to update battle statistics
  updateBattleStats(result) {
    this.statistics.totalBattleTime += result.duration;
    this.statistics.totalReactionsDeployed += result.reactionsUsed;
    this.statistics.totalDamageDealt += result.damageDealt;
    this.statistics.totalDamageReceived += result.damageReceived;
    
    if (result.won) {
      this.statistics.totalWins++;
      this.statistics.winStreak++;
      this.statistics.bestWinStreak = Math.max(this.statistics.winStreak, this.statistics.bestWinStreak);
    } else {
      this.statistics.totalLosses++;
      this.statistics.winStreak = 0;
    }
    
    this.statistics.winRate = (this.statistics.totalWins / (this.statistics.totalWins + this.statistics.totalLosses)) * 100;
    
    // Add to battle history
    this.battleHistory.recent.unshift({
      timestamp: new Date(),
      result: result.won ? 'win' : 'loss',
      score: result.score,
      opponent: result.opponent,
      duration: result.duration
    });
    
    // Keep only last 50 battles
    if (this.battleHistory.recent.length > 50) {
      this.battleHistory.recent.pop();
    }
  }

  // Method to check and unlock achievements
  checkAchievements() {
    const checks = {
      firstBlood: this.statistics.totalWins >= 1,
      centurion: this.statistics.totalReactionsDeployed >= 100,
      millionaire: this.progression.totalCreditsEarned >= 1000000,
      perfectAim: this.statistics.accuracyRate >= 100,
      survivor: this.statistics.winStreak >= 10,
      bigSpender: this.monetization.lifetimeValue >= 10000,
      socialButterfly: this.social.friends.length >= 50,
      tournamentChampion: this.battleHistory.tournaments.wins >= 1,
      weaponMaster: Object.keys(this.inventory.weapons.owned).length >= 6,
      tierClimber: ['red'].includes(this.progression.tier)
    };
    
    Object.entries(checks).forEach(([achievement, condition]) => {
      if (condition && !this.achievements.progress[achievement].completed) {
        this.achievements.progress[achievement].completed = true;
        this.achievements.unlocked.push(achievement);
        this.achievements.points += 100;
      }
    });
  }

  // Serialize profile for database storage
  serialize() {
    return JSON.stringify(this);
  }

  // Load profile from database
  static deserialize(data) {
    const parsed = JSON.parse(data);
    const profile = new UserProfile(parsed.userId);
    Object.assign(profile, parsed);
    return profile;
  }
}

// Profile manager for handling multiple users
class ProfileManager {
  constructor() {
    this.profiles = new Map();
  }

  createProfile(userId) {
    const profile = new UserProfile(userId);
    this.profiles.set(userId, profile);
    return profile;
  }

  getProfile(userId) {
    return this.profiles.get(userId);
  }

  saveProfile(userId) {
    const profile = this.profiles.get(userId);
    if (profile) {
      // Save to database
      localStorage.setItem(`profile_${userId}`, profile.serialize());
      return true;
    }
    return false;
  }

  loadProfile(userId) {
    const data = localStorage.getItem(`profile_${userId}`);
    if (data) {
      const profile = UserProfile.deserialize(data);
      this.profiles.set(userId, profile);
      return profile;
    }
    return null;
  }

  // Analytics aggregation across all profiles
  getAggregatedStats() {
    const stats = {
      totalUsers: this.profiles.size,
      totalRevenue: 0,
      averageLevel: 0,
      tierDistribution: { free: 0, vip: 0, black: 0, red: 0 },
      mostPopularWeapon: {},
      activeUsers: 0
    };
    
    this.profiles.forEach(profile => {
      stats.totalRevenue += profile.monetization.lifetimeValue;
      stats.averageLevel += profile.progression.level;
      stats.tierDistribution[profile.progression.tier]++;
      
      // Track active users (played in last 7 days)
      const lastActive = new Date(profile.accountInfo.lastActive);
      const daysSinceActive = (Date.now() - lastActive) / (1000 * 60 * 60 * 24);
      if (daysSinceActive <= 7) stats.activeUsers++;
    });
    
    stats.averageLevel /= this.profiles.size;
    return stats;
  }
}

// Export for use in other systems
export { UserProfile, ProfileManager };
