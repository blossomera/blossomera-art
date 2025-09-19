module.exports = function(eleventyConfig) {
  // Copy static files (images)
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("admin");

  // Create a gallery collection
  eleventyConfig.addCollection("gallery", function(collectionApi) {
    return collectionApi.getAll()
      .filter(item => {
        const isArtwork = item.inputPath.startsWith("./src/gallery/");
        const isGalleryBlog = item.data.displayInGallery === true;
        return isArtwork || isGalleryBlog;
      })
      .sort((a, b) => {
        const dateA = new Date(a.data.upload_date || a.date);
        const dateB = new Date(b.data.upload_date || b.date);
        return dateB - dateA; // newest first
      });
  });

  // Blog collection
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/blog/*.md");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
