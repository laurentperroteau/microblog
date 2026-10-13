import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  // Blocs ```mermaid rendus côté client par mermaid.js (cf. base.njk)
  eleventyConfig.amendLibrary("md", (md) => {
    const fence = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, idx, ...rest) => {
      const token = tokens[idx];
      if (token.info.trim() === "mermaid") {
        return `<pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre>\n`;
      }
      return fence(tokens, idx, ...rest);
    };
  });
  // Filtre pour formater les dates
  eleventyConfig.addFilter("date", (date, format) => {
    const d = date === "now" ? new Date() : new Date(date);
    const moisFr = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
    const formats = {
      "%Y-%m-%d": () => d.toISOString().split("T")[0],
      "%d/%m/%Y": () => d.toLocaleDateString("fr-FR"),
      "%Y": () => d.getFullYear().toString(),
      "%d %b %Y": () => `${d.getDate()} ${moisFr[d.getMonth()]} ${d.getFullYear()}`
    };
    return formats[format] ? formats[format]() : d.toISOString();
  });

  // Copier les assets statiques
  eleventyConfig.addPassthroughCopy("src/css");

  // Collection de posts triés par date
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    pathPrefix: "/microblog/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
