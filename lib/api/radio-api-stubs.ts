/**
 * Stub-Schnittstellen für Radio-Sender-Systeme
 * Diese Interfaces definieren die Verträge für die Integration mit externen Radio-Systemen
 */

import type { Track, RadioStation } from '../models';

/**
 * Interface für die Now-Playing API eines Radiosenders
 */
export interface INowPlayingAPI {
  /**
   * Ruft den aktuell gespielten Titel ab
   * @param stationId - Die ID des Radiosenders
   * @returns Promise mit dem aktuellen Track oder null
   */
  getCurrentTrack(stationId: string): Promise<Track | null>;
  
  /**
   * Ruft die History der gespielten Titel ab
   * @param stationId - Die ID des Radiosenders
   * @param limit - Anzahl der Titel (Standard: 10)
   * @returns Promise mit Array von Tracks
   */
  getTrackHistory(stationId: string, limit?: number): Promise<Track[]>;
}

/**
 * Interface für die Stream-Metadaten API
 */
export interface IStreamMetadataAPI {
  /**
   * Ruft Metadaten vom Stream ab
   * @param streamUrl - Die Stream-URL
   * @returns Promise mit Track-Informationen
   */
  getStreamMetadata(streamUrl: string): Promise<Track | null>;
  
  /**
   * Validiert ob ein Stream aktiv ist
   * @param streamUrl - Die Stream-URL
   * @returns Promise mit boolean
   */
  isStreamActive(streamUrl: string): Promise<boolean>;
}

/**
 * Interface für die Radiosender-Verwaltung API
 */
export interface IRadioStationAPI {
  /**
   * Ruft alle verfügbaren Radiosender ab
   * @returns Promise mit Array von RadioStations
   */
  getAllStations(): Promise<RadioStation[]>;
  
  /**
   * Ruft einen spezifischen Radiosender ab
   * @param stationId - Die ID des Radiosenders
   * @returns Promise mit RadioStation oder null
   */
  getStation(stationId: string): Promise<RadioStation | null>;
  
  /**
   * Aktualisiert die Daten eines Radiosenders
   * @param stationId - Die ID des Radiosenders
   * @returns Promise mit aktualisierter RadioStation
   */
  refreshStationData(stationId: string): Promise<RadioStation>;
}

/**
 * Stub-Implementierung der Now-Playing API
 * Simuliert Anfragen an echte Sender-Systeme mit Mock-Daten
 */
export class NowPlayingAPIStub implements INowPlayingAPI {
  private mockTracks: Map<string, Track> = new Map();
  private mockHistory: Map<string, Track[]> = new Map();

  async getCurrentTrack(stationId: string): Promise<Track | null> {
    // Simuliere Netzwerk-Verzögerung
    await this.delay(100);
    
    // Gebe gespeicherten Mock-Track zurück oder null
    return this.mockTracks.get(stationId) || null;
  }

  async getTrackHistory(stationId: string, limit: number = 10): Promise<Track[]> {
    await this.delay(150);
    
    // Simuliere Track-History (würde normalerweise vom Server kommen)
    const history = this.mockHistory.get(stationId) || [];
    return history.slice(0, limit);
  }

  /**
   * Hilfsmethode zum Setzen von Mock-Daten (nur für Stub-Implementierung)
   */
  setMockTrack(stationId: string, track: Track): void {
    this.mockTracks.set(stationId, track);
  }

  /**
   * Hilfsmethode zum Setzen von Mock-History (nur für Stub-Implementierung)
   */
  setMockHistory(stationId: string, tracks: Track[]): void {
    this.mockHistory.set(stationId, tracks);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Stub-Implementierung der Stream-Metadata API
 */
export class StreamMetadataAPIStub implements IStreamMetadataAPI {
  async getStreamMetadata(streamUrl: string): Promise<Track | null> {
    await this.delay(100);
    
    // In einer echten Implementierung würde hier der Stream geparst werden
    return null;
  }

  async isStreamActive(streamUrl: string): Promise<boolean> {
    await this.delay(50);
    
    // Stub gibt immer true zurück
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Stub-Implementierung der RadioStation API
 */
export class RadioStationAPIStub implements IRadioStationAPI {
  private stations: RadioStation[] = [];

  constructor(stations: RadioStation[]) {
    this.stations = stations;
  }

  async getAllStations(): Promise<RadioStation[]> {
    await this.delay(100);
    return [...this.stations];
  }

  async getStation(stationId: string): Promise<RadioStation | null> {
    await this.delay(50);
    return this.stations.find(s => s.id === stationId) || null;
  }

  async refreshStationData(stationId: string): Promise<RadioStation> {
    await this.delay(200);
    
    const station = this.stations.find(s => s.id === stationId);
    if (!station) {
      throw new Error(`Station ${stationId} not found`);
    }
    
    // In einer echten Implementierung würden hier Daten vom Server geladen
    return station;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
