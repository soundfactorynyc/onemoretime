// Revolutionary Component Breeding Engine
// AI-powered system for creating hybrid components from parent DNA

export interface ComponentDNA {
  id: string;
  name: string;
  category: 'hypnotic' | 'crowd' | 'environmental' | 'engagement';
  visualStyle: 'neon' | 'organic' | 'geometric' | 'fluid';
  interactionType: 'touch' | 'voice' | 'movement' | 'biometric';
  audioResponse: 'beat' | 'frequency' | 'amplitude' | 'harmony';
  socialLevel: 'individual' | 'group' | 'crowd' | 'global';
  energySignature: number; // 0-100 intensity scale
  memoryCapacity: 'ephemeral' | 'session' | 'persistent' | 'eternal';
  colors: string[];
  effects: string[];
  animations: string[];
  tier: 'free' | 'vip' | 'legend' | 'producer';
}

export interface HybridComponent extends ComponentDNA {
  parentIds: string[];
  breedingTimestamp: number;
  uniqueTraits: string[];
  popularity: number;
  creatorId?: string;
}

export class ComponentBreedingEngine {
  private components: Map<string, ComponentDNA> = new Map();
  private hybrids: Map<string, HybridComponent> = new Map();
  private breedingHistory: Array<{
    parents: string[];
    hybrid: string;
    timestamp: number;
    success: boolean;
  }> = [];

  constructor() {
    this.initializeBaseComponents();
  }

  // Initialize the first 64 base components
  private initializeBaseComponents() {
    // Hypnotic Visual Synchronizers (1-16)
    this.registerComponent({
      id: 'beat-pulse-detector',
      name: 'Beat Pulse Detector',
      category: 'hypnotic',
      visualStyle: 'neon',
      interactionType: 'movement',
      audioResponse: 'beat',
      socialLevel: 'crowd',
      energySignature: 85,
      memoryCapacity: 'ephemeral',
      colors: ['#00ff00', '#ffffff', '#ffff00'],
      effects: ['pulse', 'strobe', 'sync'],
      animations: ['beat-sync', 'intensity-scale'],
      tier: 'free'
    });

    this.registerComponent({
      id: 'energy-wave-visualizer',
      name: 'Energy Wave Visualizer',
      category: 'hypnotic',
      visualStyle: 'fluid',
      interactionType: 'biometric',
      audioResponse: 'amplitude',
      socialLevel: 'crowd',
      energySignature: 75,
      memoryCapacity: 'session',
      colors: ['#0099ff', '#00ffff', '#9900ff'],
      effects: ['wave', 'flow', 'ripple'],
      animations: ['wave-motion', 'energy-flow'],
      tier: 'free'
    });

    this.registerComponent({
      id: 'geometric-pattern-generator',
      name: 'Geometric Pattern Generator',
      category: 'hypnotic',
      visualStyle: 'geometric',
      interactionType: 'voice',
      audioResponse: 'harmony',
      socialLevel: 'individual',
      energySignature: 60,
      memoryCapacity: 'persistent',
      colors: ['#ff6600', '#ffff00', '#ff0099'],
      effects: ['pattern', 'sacred-geometry', 'fractal'],
      animations: ['geometric-morph', 'pattern-shift'],
      tier: 'vip'
    });

    this.registerComponent({
      id: 'light-frequency-mapper',
      name: 'Light Frequency Mapper',
      category: 'hypnotic',
      visualStyle: 'neon',
      interactionType: 'touch',
      audioResponse: 'frequency',
      socialLevel: 'group',
      energySignature: 90,
      memoryCapacity: 'ephemeral',
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
      effects: ['spectrum', 'frequency-map', 'color-shift'],
      animations: ['frequency-dance', 'spectrum-flow'],
      tier: 'vip'
    });

    // Add more components...
    this.addCrowdIntelligenceComponents();
    this.addEnvironmentalEffectComponents();
    this.addFanEngagementComponents();
  }

  private addCrowdIntelligenceComponents() {
    // Crowd Intelligence Visualizers (17-32)
    this.registerComponent({
      id: 'collective-consciousness-mapper',
      name: 'Collective Consciousness Mapper',
      category: 'crowd',
      visualStyle: 'organic',
      interactionType: 'biometric',
      audioResponse: 'harmony',
      socialLevel: 'global',
      energySignature: 95,
      memoryCapacity: 'eternal',
      colors: ['#9900ff', '#00ffff', '#ffffff'],
      effects: ['consciousness-map', 'neural-network', 'mind-meld'],
      animations: ['consciousness-flow', 'neural-pulse'],
      tier: 'legend'
    });

    this.registerComponent({
      id: 'energy-momentum-predictor',
      name: 'Energy Momentum Predictor',
      category: 'crowd',
      visualStyle: 'fluid',
      interactionType: 'movement',
      audioResponse: 'amplitude',
      socialLevel: 'crowd',
      energySignature: 80,
      memoryCapacity: 'session',
      colors: ['#ff9900', '#ffff00', '#00ff00'],
      effects: ['prediction', 'momentum', 'energy-forecast'],
      animations: ['momentum-build', 'energy-prediction'],
      tier: 'vip'
    });
  }

  private addEnvironmentalEffectComponents() {
    // Environmental Effects (33-48)
    this.registerComponent({
      id: 'virtual-fog-machine',
      name: 'Virtual Fog Machine',
      category: 'environmental',
      visualStyle: 'organic',
      interactionType: 'voice',
      audioResponse: 'beat',
      socialLevel: 'crowd',
      energySignature: 70,
      memoryCapacity: 'ephemeral',
      colors: ['#ffffff', '#cccccc', '#999999'],
      effects: ['fog', 'mist', 'atmosphere'],
      animations: ['fog-roll', 'mist-swirl'],
      tier: 'free'
    });

    this.registerComponent({
      id: 'digital-strobe-controller',
      name: 'Digital Strobe Controller',
      category: 'environmental',
      visualStyle: 'neon',
      interactionType: 'touch',
      audioResponse: 'beat',
      socialLevel: 'crowd',
      energySignature: 100,
      memoryCapacity: 'ephemeral',
      colors: ['#ffffff', '#ffff00', '#ff0000'],
      effects: ['strobe', 'flash', 'intensity'],
      animations: ['strobe-sync', 'flash-burst'],
      tier: 'vip'
    });
  }

  private addFanEngagementComponents() {
    // Fan Engagement (49-64)
    this.registerComponent({
      id: 'dance-move-recognition',
      name: 'Dance Move Recognition Display',
      category: 'engagement',
      visualStyle: 'geometric',
      interactionType: 'movement',
      audioResponse: 'beat',
      socialLevel: 'individual',
      energySignature: 85,
      memoryCapacity: 'session',
      colors: ['#00ff00', '#ffff00', '#ff6600'],
      effects: ['recognition', 'scoring', 'highlight'],
      animations: ['move-track', 'score-display'],
      tier: 'legend'
    });

    this.registerComponent({
      id: 'virtual-dance-battle',
      name: 'Virtual Dance Battle Arena',
      category: 'engagement',
      visualStyle: 'neon',
      interactionType: 'movement',
      audioResponse: 'beat',
      socialLevel: 'group',
      energySignature: 95,
      memoryCapacity: 'session',
      colors: ['#ff0000', '#0000ff', '#ffff00'],
      effects: ['battle', 'competition', 'arena'],
      animations: ['battle-mode', 'competition-ui'],
      tier: 'legend'
    });
  }

  // Register a new component
  registerComponent(component: ComponentDNA) {
    this.components.set(component.id, component);
  }

  // Get component by ID
  getComponent(id: string): ComponentDNA | undefined {
    return this.components.get(id);
  }

  // Get all components by tier
  getComponentsByTier(tier: string): ComponentDNA[] {
    return Array.from(this.components.values()).filter(c => c.tier === tier);
  }

  // Get all components by category
  getComponentsByCategory(category: string): ComponentDNA[] {
    return Array.from(this.components.values()).filter(c => c.category === category);
  }

  // Simple trait mixing for real-time breeding (<50ms)
  simpleBreed(parentIds: string[]): HybridComponent | null {
    if (parentIds.length < 2 || parentIds.length > 8) {
      return null;
    }

    const parents = parentIds.map(id => this.components.get(id)).filter(Boolean) as ComponentDNA[];
    if (parents.length !== parentIds.length) {
      return null;
    }

    const hybridId = `hybrid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Simple trait mixing
    const hybrid: HybridComponent = {
      id: hybridId,
      name: this.generateHybridName(parents),
      category: parents[0].category, // Primary parent's category
      visualStyle: this.blendVisualStyles(parents),
      interactionType: parents[Math.floor(Math.random() * parents.length)].interactionType,
      audioResponse: this.blendAudioResponses(parents),
      socialLevel: this.blendSocialLevels(parents),
      energySignature: this.averageEnergySignatures(parents),
      memoryCapacity: this.selectBestMemoryCapacity(parents),
      colors: this.blendColors(parents),
      effects: this.combineEffects(parents),
      animations: this.combineAnimations(parents),
      tier: this.determineTier(parents),
      parentIds,
      breedingTimestamp: Date.now(),
      uniqueTraits: this.generateUniqueTraits(parents),
      popularity: 0
    };

    this.hybrids.set(hybridId, hybrid);
    this.recordBreeding(parentIds, hybridId, true);

    return hybrid;
  }

  // Advanced ML breeding (background processing)
  async advancedBreed(parentIds: string[], userPreferences?: any): Promise<HybridComponent | null> {
    // This would use machine learning for sophisticated breeding
    // For now, we'll use enhanced simple breeding with ML-like features
    
    const simpleHybrid = this.simpleBreed(parentIds);
    if (!simpleHybrid) return null;

    // Enhance with ML-like features
    simpleHybrid.energySignature = this.optimizeEnergySignature(simpleHybrid, userPreferences);
    simpleHybrid.colors = this.optimizeColors(simpleHybrid, userPreferences);
    simpleHybrid.uniqueTraits.push('ml-optimized');

    return simpleHybrid;
  }

  // Helper methods for trait mixing
  private generateHybridName(parents: ComponentDNA[]): string {
    const adjectives = ['Fusion', 'Hybrid', 'Blend', 'Mix', 'Synthesis', 'Merge'];
    const descriptors = parents.map(p => p.name.split(' ')[0]).slice(0, 2);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${descriptors.join('-')} ${adjective}`;
  }

  private blendVisualStyles(parents: ComponentDNA[]): ComponentDNA['visualStyle'] {
    const styles = parents.map(p => p.visualStyle);
    const styleCounts = styles.reduce((acc, style) => {
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(styleCounts).reduce((a, b) => 
      styleCounts[a] > styleCounts[b] ? a : b
    ) as ComponentDNA['visualStyle'];
  }

  private blendAudioResponses(parents: ComponentDNA[]): ComponentDNA['audioResponse'] {
    const responses = parents.map(p => p.audioResponse);
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private blendSocialLevels(parents: ComponentDNA[]): ComponentDNA['socialLevel'] {
    const levels = ['individual', 'group', 'crowd', 'global'];
    const parentLevels = parents.map(p => levels.indexOf(p.socialLevel));
    const avgLevel = Math.round(parentLevels.reduce((a, b) => a + b, 0) / parentLevels.length);
    return levels[Math.max(0, Math.min(levels.length - 1, avgLevel))] as ComponentDNA['socialLevel'];
  }

  private averageEnergySignatures(parents: ComponentDNA[]): number {
    const avg = parents.reduce((sum, p) => sum + p.energySignature, 0) / parents.length;
    return Math.round(avg);
  }

  private selectBestMemoryCapacity(parents: ComponentDNA[]): ComponentDNA['memoryCapacity'] {
    const capacities = ['ephemeral', 'session', 'persistent', 'eternal'];
    const parentCapacities = parents.map(p => capacities.indexOf(p.memoryCapacity));
    const maxCapacity = Math.max(...parentCapacities);
    return capacities[maxCapacity] as ComponentDNA['memoryCapacity'];
  }

  private blendColors(parents: ComponentDNA[]): string[] {
    const allColors = parents.flatMap(p => p.colors);
    const uniqueColors = [...new Set(allColors)];
    return uniqueColors.slice(0, 5); // Max 5 colors
  }

  private combineEffects(parents: ComponentDNA[]): string[] {
    const allEffects = parents.flatMap(p => p.effects);
    const uniqueEffects = [...new Set(allEffects)];
    return uniqueEffects.slice(0, 6); // Max 6 effects
  }

  private combineAnimations(parents: ComponentDNA[]): string[] {
    const allAnimations = parents.flatMap(p => p.animations);
    const uniqueAnimations = [...new Set(allAnimations)];
    return uniqueAnimations.slice(0, 4); // Max 4 animations
  }

  private determineTier(parents: ComponentDNA[]): ComponentDNA['tier'] {
    const tiers = ['free', 'vip', 'legend', 'producer'];
    const parentTiers = parents.map(p => tiers.indexOf(p.tier));
    const maxTier = Math.max(...parentTiers);
    return tiers[maxTier] as ComponentDNA['tier'];
  }

  private generateUniqueTraits(parents: ComponentDNA[]): string[] {
    const traits: string[] = [];
    
    // Add combination-specific traits
    if (parents.length >= 3) traits.push('multi-parent');
    if (parents.some(p => p.category === 'hypnotic') && parents.some(p => p.category === 'crowd')) {
      traits.push('hypno-crowd-fusion');
    }
    if (parents.every(p => p.energySignature > 80)) traits.push('high-energy');
    if (parents.some(p => p.visualStyle === 'neon') && parents.some(p => p.visualStyle === 'organic')) {
      traits.push('neo-organic');
    }

    return traits;
  }

  private optimizeEnergySignature(hybrid: HybridComponent, preferences?: any): number {
    // ML-like optimization based on user preferences
    if (preferences?.preferHighEnergy) {
      return Math.min(100, hybrid.energySignature + 10);
    }
    if (preferences?.preferSubtle) {
      return Math.max(0, hybrid.energySignature - 15);
    }
    return hybrid.energySignature;
  }

  private optimizeColors(hybrid: HybridComponent, preferences?: any): string[] {
    // ML-like color optimization
    if (preferences?.favoriteColors) {
      const favoriteColors = preferences.favoriteColors as string[];
      return [...favoriteColors.slice(0, 2), ...hybrid.colors.slice(0, 3)];
    }
    return hybrid.colors;
  }

  private recordBreeding(parentIds: string[], hybridId: string, success: boolean) {
    this.breedingHistory.push({
      parents: parentIds,
      hybrid: hybridId,
      timestamp: Date.now(),
      success
    });
  }

  // Get breeding suggestions based on compatibility
  getBreedingSuggestions(componentId: string, userTier: string = 'free'): ComponentDNA[] {
    const component = this.components.get(componentId);
    if (!component) return [];

    const availableComponents = Array.from(this.components.values())
      .filter(c => c.id !== componentId && this.isAccessible(c, userTier));

    // Score compatibility
    const scored = availableComponents.map(c => ({
      component: c,
      score: this.calculateCompatibility(component, c)
    }));

    // Return top 5 suggestions
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.component);
  }

  private calculateCompatibility(comp1: ComponentDNA, comp2: ComponentDNA): number {
    let score = 0;

    // Same category bonus
    if (comp1.category === comp2.category) score += 20;
    
    // Complementary visual styles
    if (comp1.visualStyle !== comp2.visualStyle) score += 15;
    
    // Similar energy signatures
    const energyDiff = Math.abs(comp1.energySignature - comp2.energySignature);
    score += Math.max(0, 20 - energyDiff / 5);
    
    // Audio response compatibility
    if (comp1.audioResponse === comp2.audioResponse) score += 10;
    
    // Social level compatibility
    const socialLevels = ['individual', 'group', 'crowd', 'global'];
    const level1 = socialLevels.indexOf(comp1.socialLevel);
    const level2 = socialLevels.indexOf(comp2.socialLevel);
    const levelDiff = Math.abs(level1 - level2);
    score += Math.max(0, 15 - levelDiff * 5);

    return score;
  }

  private isAccessible(component: ComponentDNA, userTier: string): boolean {
    const tierHierarchy = ['free', 'vip', 'legend', 'producer'];
    const userLevel = tierHierarchy.indexOf(userTier);
    const componentLevel = tierHierarchy.indexOf(component.tier);
    return userLevel >= componentLevel;
  }

  // Get all available components for user tier
  getAvailableComponents(userTier: string): ComponentDNA[] {
    return Array.from(this.components.values())
      .filter(c => this.isAccessible(c, userTier));
  }

  // Get hybrid by ID
  getHybrid(id: string): HybridComponent | undefined {
    return this.hybrids.get(id);
  }

  // Get all hybrids
  getAllHybrids(): HybridComponent[] {
    return Array.from(this.hybrids.values());
  }

  // Get popular hybrids
  getPopularHybrids(limit: number = 10): HybridComponent[] {
    return Array.from(this.hybrids.values())
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  // Increment hybrid popularity
  incrementPopularity(hybridId: string): void {
    const hybrid = this.hybrids.get(hybridId);
    if (hybrid) {
      hybrid.popularity++;
    }
  }

  // Get breeding statistics
  getBreedingStats() {
    return {
      totalComponents: this.components.size,
      totalHybrids: this.hybrids.size,
      totalBreedings: this.breedingHistory.length,
      successRate: this.breedingHistory.filter(b => b.success).length / this.breedingHistory.length,
      popularHybrids: this.getPopularHybrids(5)
    };
  }
}

// Global instance
export const breedingEngine = new ComponentBreedingEngine();
