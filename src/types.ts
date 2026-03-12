export interface Version {
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  imageDataUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaName?: string;
  mediaObjectUrl?: string;
}

export interface Scene {
  name: string;
  desc: string;
  duration: number;
  status: 'draft' | 'sketch' | 'image' | 'video';
  versions: Version[];
  activeVersion: number;
  activeRoles: string[];
  canvasPos?: { x: number; y: number };
  favorite?: boolean;
  sceneStatus?: string;
}

export interface Project {
  id: string;
  name: string;
  icon?: string;
  type?: string;
  expanded?: boolean;
  status?: string;
  desc?: string;
  cover?: string;
  participants?: string[];
  sceneCount?: number;
  updatedAt?: string;
  deletedAt?: string;
  archived?: boolean;
  deleted?: boolean;
  favorite?: boolean;
  children?: Project[];
}

export interface Preset {
  name: string;
  panel: string;
  params: Record<string, string[]>;
}
