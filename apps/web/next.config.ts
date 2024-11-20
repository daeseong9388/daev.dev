import type { NextMDXOptions } from "@next/mdx";
import type { NextConfig } from "next";
import initializeBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";

const withVanillaExtract = createVanillaExtractPlugin();
const withBundleAnalyzer = initializeBundleAnalyzer({
  enabled: process.env.BUNDLE_ANALYZER_ENABLED === "true",
});

const chConfig = {
  components: { code: "Code" },
};

const mdxOptions = {
  remarkPlugins: [[remarkCodeHike, chConfig]],
  recmaPlugins: [[recmaCodeHike, chConfig]],
  jsx: true,
} satisfies NextMDXOptions["options"];

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: mdxOptions,
});

// https://nextjs.org/docs/pages/api-reference/next-config-js
const nextConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withBundleAnalyzer(withMDX(withVanillaExtract(nextConfig)));
