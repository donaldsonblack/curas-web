import Dexie, { Table } from 'dexie';

// Define the interfaces for our offline data. These are simplified for the client.
// We can expand these as we build out the features.

export interface OfflineAsset {
  id: string;
  assetTag: string;
  type: string;
  location: string;
  wardId: string;
  critical: boolean;
}

export interface OfflineChecklistTemplate {
  id: string;
  name: string;
  items: any[]; // Simplified for now
}

export interface OfflineChecklistSubmission {
  id?: number; // Auto-incremented primary key
  instanceId: string;
  payload: any;
  createdAt: Date;
}

export interface OfflineIssueSubmission {
  id?: number; // Auto-incremented primary key
  payload: any;
  createdAt: Date;
}

/**
 * Defines the client-side database schema using Dexie.
 * This database is used for caching data for offline use and queueing mutations.
 */
export class CurasDexieDB extends Dexie {
  assets!: Table<OfflineAsset>;
  checklistTemplates!: Table<OfflineChecklistTemplate>;
  
  // Outbox tables for background sync
  checklistSubmissions!: Table<OfflineChecklistSubmission>;
  issueSubmissions!: Table<OfflineIssueSubmission>;

  constructor() {
    super('curasDB');
    this.version(1).stores({
      assets: 'id, assetTag, wardId',
      checklistTemplates: 'id, name',
      checklistSubmissions: '++id, instanceId, createdAt',
      issueSubmissions: '++id, createdAt',
    });
  }
}

export const db = new CurasDexieDB();
