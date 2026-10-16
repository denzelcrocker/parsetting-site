import rawConfig from "../site.config.json";
import {
  publicationOptions,
  resolveConfig,
  type PublicSiteConfig,
} from "./config";

export function getSiteConfig(): PublicSiteConfig {
  const { mode, indexableBrochure } = publicationOptions(process.env);
  return resolveConfig(rawConfig, mode, indexableBrochure);
}
