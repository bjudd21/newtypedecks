/**
 * Event Emitter for PWA Events
 */

import type { PWAEventListener } from '../types';

export class EventEmitter {
  private listeners: Map<string, PWAEventListener[]> = new Map();

  emit(event: string, data: unknown) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }

  on(event: string, callback: PWAEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }
}
