export default function(eleventyConfig) {
  // Filtre pour formater les dates
  eleventyConfig.addFilter("date", (date, format) => {
    const d = new Date(date);
    const formats = {
      "%Y-%m-%d": () => d.toISOString().split("T")[0],
      "%d/%m/%Y": () => d.toLocaleDateString("fr-FR"),
      "%Y": () => d.getFullYear().toString()
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
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
