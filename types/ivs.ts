export type IVSPlayerState =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "buffering"
  | "ended"
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
