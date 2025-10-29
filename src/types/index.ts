export interface TierItem {
  id: number;
  content: string;
}

export interface Tier {
  id: number;
  label: string;
  colour: string;
  items: TierItem[];
}
