export interface TierItem {
  id: number;
  content: string;
}

export interface Tier {
  label: string;
  colour: string;
  items: TierItem[];
}
