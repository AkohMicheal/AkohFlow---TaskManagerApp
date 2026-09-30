import { Capacitor } from '@capacitor/core';

// Official Google AdMob Test Ad Unit IDs (guaranteed safe for development & testing)
// https://developers.google.com/admob/android/test-ads
export const ADMOB_TEST_IDS = {
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  }
};

class AdManager {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.platform = Capacitor.getPlatform(); // 'android', 'ios', or 'web'
    this.initialized = false;
    this.actionCount = 0; // Tracks task actions to trigger interstitial ads gracefully
  }

  async initialize() {
    if (!this.isNative) {
      // Running on Web: AdSense is used instead of AdMob
      console.log('[AdManager] Running on Web - AdSense mode active');
      return;
    }

    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.initialize({
        testingDevices: ['EMULATOR'],
        initializeForTesting: true,
      });
      this.initialized = true;
      console.log('[AdManager] Native AdMob initialized successfully');
    } catch (err) {
      console.warn('[AdManager] AdMob plugin not loaded or not in native context:', err);
    }
  }

  async showBanner() {
    if (!this.isNative) return;

    try {
      const { AdMob, BannerAdPosition, BannerAdSize } = await import('@capacitor-community/admob');
      const adId = this.platform === 'ios' ? ADMOB_TEST_IDS.ios.banner : ADMOB_TEST_IDS.android.banner;

      await AdMob.showBanner({
        adId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true,
      });
    } catch (err) {
      console.warn('[AdManager] Failed to show native banner ad:', err);
    }
  }

  async hideBanner() {
    if (!this.isNative) return;
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.hideBanner();
    } catch (err) {
      console.warn('[AdManager] Failed to hide banner:', err);
    }
  }

  /**
   * Call after user completes a task.
   * Gracefully displays an interstitial ad every 5 completed tasks.
   */
  async recordTaskAction() {
    this.actionCount += 1;
    if (this.actionCount % 5 === 0) {
      await this.showInterstitial();
    }
  }

  async showInterstitial() {
    if (!this.isNative) {
      console.log('[AdManager] Web: Interstitial milestone reached (e.g. 5 tasks completed)');
      return;
    }

    try {
      const { AdMob } = await import('@capacitor-community/admob');
      const adId = this.platform === 'ios' ? ADMOB_TEST_IDS.ios.interstitial : ADMOB_TEST_IDS.android.interstitial;

      await AdMob.prepareInterstitial({
        adId,
        isTesting: true,
      });
      await AdMob.showInterstitial();
    } catch (err) {
      console.warn('[AdManager] Interstitial ad failed to show:', err);
    }
  }

  async showRewarded(onRewardEarned) {
    if (!this.isNative) {
      alert('Rewarded Ad simulated for Web: You earned custom theme perks!');
      if (onRewardEarned) onRewardEarned();
      return;
    }

    try {
      const { AdMob } = await import('@capacitor-community/admob');
      const adId = this.platform === 'ios' ? ADMOB_TEST_IDS.ios.rewarded : ADMOB_TEST_IDS.android.rewarded;

      await AdMob.prepareRewardVideoAd({
        adId,
        isTesting: true,
      });

      AdMob.addListener('onRewardVideoAdRewarded', (reward) => {
        if (onRewardEarned) onRewardEarned(reward);
      });

      await AdMob.showRewardVideoAd();
    } catch (err) {
      console.warn('[AdManager] Rewarded ad failed:', err);
      // Fallback
      if (onRewardEarned) onRewardEarned();
    }
  }
}

export const adManager = new AdManager();
export default adManager;
