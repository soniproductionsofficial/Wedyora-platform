import {
  Camera,
  Video,
  Drone,
  Flower2,
  Flower,
  WandSparkles,
  UtensilsCrossed,
  Building2,
  Palette,
  Music,
  ScrollText,
  Car,
  Image,
  Radio,
  Mail,
  PartyPopper,
  Lightbulb,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Maps a service_categories.slug to an icon for the homepage/category strip.
// Falls back to a generic sparkle for any category added later that isn't
// listed here yet, so a new category never breaks the page — it just shows
// a plain icon until someone adds a better match.
const ICONS: Record<string, LucideIcon> = {
  photography: Camera,
  videography: Video,
  drone: Drone,
  decoration: Flower2,
  makeup: WandSparkles,
  catering: UtensilsCrossed,
  venue: Building2,
  mehendi: Palette,
  music: Music,
  priest: ScrollText,
  transportation: Car,
  album: Image,
  "live-streaming": Radio,
  invitation: Mail,
  entertainment: PartyPopper,
  lighting: Lightbulb,
  "flower-arrangement": Flower,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return ICONS[slug] ?? Sparkles;
}
