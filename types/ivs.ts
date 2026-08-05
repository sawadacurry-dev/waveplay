export type IVSPlayerState =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "buffering"
  | "ended"
  // チャンネルは存在するが、配信ソフトから映像が送られていない状態。
  // 試合前・試合間はこれが常態なので、エラーとは明確に区別する。
  | "offline"
  | "error";

export interface IVSPlayerQuality {
  name: string;
  bitrate: number;
  width: number;
  height: number;
}

export interface IVSPlayerHandle {
  play: () => void;
  pause: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  getQualities: () => IVSPlayerQuality[];
  setQuality: (quality: IVSPlayerQuality | null) => void; // null = auto
}
