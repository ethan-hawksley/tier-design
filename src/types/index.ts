export interface TierItem {
  id: string;
  content: string;
}

export interface Tier {
  id: string;
  label: string;
  colour: string;
  items: TierItem[];
}
