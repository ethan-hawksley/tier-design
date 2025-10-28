export interface TierItem {
  id: string;
  content: string;
}

export interface Tier {
  name: string;
  colour: string;
  items: TierItem[];
}
