import type { Settings } from '@/lib/models/settings';

export class SettingsEntity implements Settings {
  enableNotifications: boolean;

  constructor(init: Settings) {
    this.enableNotifications = init.enableNotifications;
  }

  toSettings(): Settings {
    return {
      enableNotifications: this.enableNotifications,
    };
  }

  static fromSettings(settings: Settings): SettingsEntity {
    return new SettingsEntity(settings);
  }
}
