import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";
import initializeBundleAnalyzer from "@next/bundle-analyzer";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();
const withBundleAnalyzer = initializeBundleAnalyzer({
  enabled: process.env.BUNDLE_ANALYZER_ENABLED === "true",
});

// https://nextjs.org/docs/pages/api-reference/next-config-js
const nextConfig: NextConfig = {
  output: "standalone",
};

export default withBundleAnalyzer(
  withContentCollections(withVanillaExtract(nextConfig)),
);
