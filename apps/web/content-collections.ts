import { exec as syncExec } from "node:child_process";
import { promisify } from "node:util";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import rehypeImages from "@repo/rehype-images";
import remarkObsidian from "@repo/remark-obsidian";

const exec = promisify(syncExec);

const postDirectory = "../../content/posts";

const posts = defineCollection({
  name: "posts",
  directory: postDirectory,
  include: "**/*.md",
  schema: (z) => ({
    slug: z.string(),
    tags: z.array(z.string()),
    date: z.string().date(),
    aliases: z.array(z.string()),
    references: z.array(z.string()),
    draft: z.boolean(),
  }),
  transform: async (post, ctx) => {
    const lastModified = await ctx.cache(
      post._meta.filePath,
      async (filePath) => {
        const { stdout } = await exec(`git log -1 --format=%ai -- ${filePath}`);
        if (stdout) {
          return new Date(stdout.trim()).toISOString();
        }
        return new Date().toISOString();
      },
    );

    const html = await compileMarkdown(ctx, post, {
      remarkPlugins: [
        [
          remarkObsidian,
          {
            linkTextTransform: () => `/posts/${post.slug}`,
          },
        ],
      ],
      rehypePlugins: [
        [
          rehypeImages,
          {
            sourceDir: "../../content/assets", // 원본 이미지 위치
            targetDir: "./public/images", // Next.js public 디렉토리 내 images
            publicPath: "/images", // 웹 접근 경로
          },
        ],
      ],
    });

    return {
      ...post,
      html,
      lastModified,
    };
  },

  onSuccess: (docs) => {
    console.log(`generated collection with ${docs.length}`);
  },
});

export default defineConfig({
  collections: [posts],
});
