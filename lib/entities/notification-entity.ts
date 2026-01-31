import type { Notification } from '@/lib/models/notification';

export class NotificationEntity implements Notification {
  id: number;
  title: string;
  when: number;

  constructor(init: Notification | string) {
    if (typeof init === 'string') {
      this.id = 0; // Dummy ID, sollte in der Praxis anders gehandhabt werden
      this.title = init;
      this.when = Date.now();
    } else {
      this.id = init.id;
      this.title = init.title;
      this.when = init.when;
    }
  }
}
