import { HomeContent } from "../components/home-content";
import { getSiteConfig } from "../lib/site-config";

export default function HomePage() {
  return <HomeContent config={getSiteConfig()} />;
}
