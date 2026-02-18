/**
 * Stub-Schnittstellen für Radio-Sender-Systeme
 * Diese Interfaces definieren die Verträge für die Integration mit externen Radio-Systemen
 */

import type { Review } from '../models';
import { reviewMocks } from '@/mock';

/**
 * Interface für die Rating API
 */
export interface IRatingAPI {
  /**
   * Fügt eine neue Bewertung ein
   * @param reviewerUserId - Die Benutzer-ID des Bewerteten
   * @param rating - Die Bewertungsdaten
   * @returns Promise<void>
   */
  submitRating(rating: Review): Promise<void>;

  /**
   * Ruft alle Bewertungen für einen Benutzer ab
   * @param reviewerUserId - Die Benutzer-ID des Bewerteten
   * @returns Promise mit Array von Bewertungen
   */
  getRatings(reviewerUserId: number): Promise<Review[]>;

  /**
   * Ruft alle Bewertungen ab
   * @returns Promise mit Array von allen Bewertungen
   */
  getAllRatings(): Promise<Review[]>;
}

/**
 * Stub-Implementierung der Now-Playing API
 * Simuliert Anfragen an echte Sender-Systeme mit Mock-Daten
 */
export class RatingAPIStub implements IRatingAPI {
    // Interner Speicher für die Bewertungen, simuliert den Server
  private ratings: Map<number, Review[]> = new Map();

  constructor() {
    // Initialisiere mit Beispiel-Track-Daten für verschiedene Sender
    reviewMocks.forEach(review => {
      if (review.reviewerUserId) {
        const existing = this.ratings.get(review.reviewerUserId) || [];
        this.ratings.set(review.reviewerUserId, [...existing, review]);
      }
    });
  }

  // Neue Bewertung einfügen
  async submitRating(review: Review): Promise<void> {
    const userRatings = this.ratings.get(review.reviewerUserId) || [];
    userRatings.push(review);
    this.ratings.set(review.reviewerUserId, userRatings);
    // Simuliert Netzwerklatenz
    return new Promise(resolve => setTimeout(resolve, 50));
  }

  // Bewertungen für einen bestimmten Benutzer abrufen
  async getRatings(reviewerUserId: number): Promise<Review[]> {
    const userRatings = this.ratings.get(reviewerUserId) || [];
    // Simuliert Netzwerklatenz
    return new Promise(resolve => setTimeout(() => resolve(userRatings), 50));
  }

  // Optional: Alle Bewertungen für alle Benutzer abrufen (z. B. für Moderatoren)
  async getAllRatings(): Promise<Review[]> {
    const allRatings: Review[] = [];
    this.ratings.forEach(userRatings => allRatings.push(...userRatings));
    return new Promise(resolve => setTimeout(() => resolve(allRatings), 50));
  }
}
