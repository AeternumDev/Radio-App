/**
 * Radio Service - Verwaltet die Interaktion mit Radio-APIs
 * Verwendet die Stub-Implementierungen für Entwicklung und Tests
 */

import type { RadioStation, Track } from '../models';
import { 
  NowPlayingAPIStub, 
  StreamMetadataAPIStub, 
  RadioStationAPIStub 
} from '../api/radio-api-stubs';

class RadioService {
  private nowPlayingAPI: NowPlayingAPIStub;
  private streamAPI: StreamMetadataAPIStub;
  private stationAPI: RadioStationAPIStub | null = null;

  constructor() {
    this.nowPlayingAPI = new NowPlayingAPIStub();
    this.streamAPI = new StreamMetadataAPIStub();
  }

  /**
   * Initialisiert den Service mit Radiosender-Daten
   */
  initialize(stations: RadioStation[]): void {
    this.stationAPI = new RadioStationAPIStub(stations);
    
    // Initialisiere Mock-Tracks für alle Stationen
    stations.forEach(station => {
      if (station.currentTrack) {
        this.nowPlayingAPI.setMockTrack(station.id, station.currentTrack);
      }
    });
  }

  /**
   * Ruft alle verfügbaren Radiosender ab
   */
  async getAllStations(): Promise<RadioStation[]> {
    if (!this.stationAPI) {
      throw new Error('RadioService wurde nicht initialisiert. Rufe initialize() auf.');
    }
    return await this.stationAPI.getAllStations();
  }

  /**
   * Ruft einen spezifischen Radiosender ab
   */
  async getStation(stationId: string): Promise<RadioStation | null> {
    if (!this.stationAPI) {
      throw new Error('RadioService wurde nicht initialisiert. Rufe initialize() auf.');
    }
    return await this.stationAPI.getStation(stationId);
  }

  /**
   * Ruft den aktuell laufenden Titel eines Senders ab
   */
  async getCurrentTrack(stationId: string): Promise<Track | null> {
    return await this.nowPlayingAPI.getCurrentTrack(stationId);
  }

  /**
   * Ruft die Track-History eines Senders ab
   */
  async getTrackHistory(stationId: string, limit: number = 10): Promise<Track[]> {
    return await this.nowPlayingAPI.getTrackHistory(stationId, limit);
  }

  /**
   * Aktualisiert die Informationen eines Senders
   */
  async refreshStation(stationId: string): Promise<RadioStation> {
    if (!this.stationAPI) {
      throw new Error('RadioService wurde nicht initialisiert. Rufe initialize() auf.');
    }
    
    // Aktualisiere Sender-Daten
    const station = await this.stationAPI.refreshStationData(stationId);
    
    // Aktualisiere aktuellen Track
    const track = await this.getCurrentTrack(stationId);
    if (track) {
      station.currentTrack = track;
    }
    
    return station;
  }

  /**
   * Validiert ob der Stream eines Senders aktiv ist
   */
  async isStationActive(streamUrl: string): Promise<boolean> {
    return await this.streamAPI.isStreamActive(streamUrl);
  }

  /**
   * Simuliert das Aktualisieren des aktuell laufenden Titels
   * (Nur für Stub-Implementierung - würde in Produktion automatisch geschehen)
   */
  updateCurrentTrack(stationId: string, track: Track): void {
    this.nowPlayingAPI.setMockTrack(stationId, track);
  }
}

// Singleton-Instanz
export const radioService = new RadioService();

export default RadioService;
