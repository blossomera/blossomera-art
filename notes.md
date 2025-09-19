
I'm building in 11ty. I'm so frustrated that nothing is just working as intended.

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};


You’ll mainly use Nunjucks templates (.njk).

{{ variable }} → outputs a value.

{% block %} ... {% endblock %} → logic or reusable parts.

{% include "file.njk" %} → inserts another template.

{% for item in collection %} ... {% endfor %} → loops through items.

Example:

<h1>{{ title }}</h1>

{% for post in collections.blog %}
  <article>
    <h2>{{ post.data.title }}</h2>
    <p>{{ post.data.description }}</p>
  </article>
{% endfor %}



Every .md or .njk content file starts with front matter (YAML at the top):

src/gallery/sunset-painting.md

---
title: "Sunset Painting"
date: 2024-05-10
upload_date: 2024-05-12
description: "An oil painting..."
src: "/images/sunset.jpg"
alt: "A sunset oil painting"
tags: ["oil", "sunset", "landscape"]
gallery: true
og:image: "/images/social/sunset-og.jpg"
---
This is the body of the page.


src/blog/creative-process.md

---
title: "My Creative Process"
date: 2025-01-10
description: "Behind the scenes..."
src: "/images/blog.jpg"
alt: "Art desk with paints"
tags: ["blog", "art"]
displayInGallery: true
og:image: "/images/social/blog-og.jpg"
---
The markdown body goes here...








====================




My goals.
1. Create a system where I create new content and it appears on two other web pages /gallery and /home
create a system where if I write a blog and want it to appear in /galeery it will if i set a tag for it to be true -- only for the blog. -- all gallery/slug images must go to the gallery.

The gallery/slug may feature images that are WIP of the final image if I still have them.


src/gallery/*.md
---
title: "title here"
date created: "YYYY-MM-DD"
published: "YYYY-MM-DD"
description: "An original oil painting capturing the brilliant, warm colors of a sunset over a rolling landscape."
src: "/src/images/sunset-painting.jpg"
alt: "An oil painting of a vibrant red and orange sunset."
gallery:
  - "My Favorites"
  - "Landscapes"
tags:
  - oil painting
  - landscape
  - sunset
  - 2024
og:image: "/src/images/social/sunset-painting-og.jpg"
og:image:alt: "Social media preview of the Sunset Painting."

in some situations where the date created is not the same as the published date eg uploaded date the date created defaults to the published date



src/blog -- might rename to post -- /*.md
title: "My Creative Process"
published: "YYYY-MM-DD": "2025-01-10"
description: "A behind-the-scenes look at my recent work and creative inspirations."
src: "/src/images/blog-post.jpg"
alt: "My desk with painting supplies and sketches."
tags:
  - blog
  - art
displayInGallery: true # This is the toggle you'll use for blogs
og:image: "/src/images/social/sunset-painting-og.jpg"
og:image:alt: "Social media preview of the Sunset Painting."

============= Ecample Code Start ===============

config.yml
backend:
  name: git-gateway
  branch: main

publish_mode: editorial_workflow

media_folder: "src/images"
public_folder: "/images"

collections:
  - name: "gallery"
    label: "Artwork"
    folder: "src/gallery"
    create: true
    slug: "{{title | slugify}}"
    editor:
      preview: false
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false}
      - {label: "Upload Date", name: "upload_date", widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false}
      - {label: "Main Image", name: "src", widget: "image", required: true}
      - {label: "Alternate Text", name: "alt", widget: "string"}
      - {label: "Description", name: "description", widget: "markdown"}
      - {label: "Extra Images", name: "extra_images", widget: "list", field: {label: "Image", name: "image", widget: "image"}, required: false}
      - {label: "Tags", name: "tags", widget: "list", allow_add: true, default: []}
      - {label: "Gallery", name: "gallery", widget: "list", allow_add: true, default: []}

  - name: "blog"
    label: "Blog Posts"
    folder: "src/blog"
    create: true
    slug: "{{title | slugify}}"
    editor:
      preview: false
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false}
      - {label: "Main Image", name: "src", widget: "image", required: true}
      - {label: "Alternate Text", name: "alt", widget: "string"}
      - {label: "Body", name: "body", widget: "markdown"}
      - {label: "Display in Gallery", name: "displayInGallery", widget: "boolean", default: false}
      - {label: "Tags", name: "tags", widget: "list", allow_add: true, default: []}

---
module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection("gallery", function(collectionApi) {
    // Get all artwork and blog posts
    const allItems = collectionApi.getAll();

    // Filter to include only artwork and blogs with the specific field
    const galleryItems = allItems.filter(item => {
      // Include all items from the 'gallery' folder
      const isArtwork = item.inputPath.startsWith("./src/gallery/");
      // Include blog posts with the 'displayInGallery: true' field
      const isGalleryBlog = item.data.displayInGallery === true;

      return isArtwork || isGalleryBlog;
    });

    // Sort the combined collection
    galleryItems.sort((a, b) => {
      // Use upload_date if available, otherwise fallback to date
      const dateA = new Date(a.data.upload_date || a.data.date);
      const dateB = new Date(b.data.upload_date || b.data.date);
      return dateB - dateA; // Newest first
    });

    return galleryItems;
  });

  // ... rest of your config
};

============= Ecample Code END ===============



on my gallery/slug and blog/slug
i want there to be a modeu


Vscodium + Netlify + Github + Decap CMS will be my work flow.
My website will have 3 or 4 collections

0. Index redir to /Home
/* Dynamic Content */
1. /Home -- includes some modules with content from my /Gallery/Slug; maybe 3 entrys from my latest blog/slug
2. /Gallery -- to me this is my most important feature -- it is a filterable and sortable page without nsfw.
3. /NSFW -- nsfw gallery a future project. uses the same framework, not advertised. featuring r rated, mature rated nc 17, explicit or parental adverisory content -- this is not important ---
4. /Blog -- self explanitory
5. /WebNovel -- maybe i want to write a book -- not important right now --
6. /Webcomic -- might be interchangable with web novel tbh just thinking
7. broken-index - a site map of mywebsite -- no css styling other than centering the web page


/* Static Content I want full control over */
/Home - i want to update this manually as well as having modular content on it.
About ME
About the Brand
Portfolio - my portfolio
Comissions - comission based information
litteraly eveyrhing else.


========================

src/assets/gallery

# Working on My Site Map

* **Build**: `npx @11ty/eleventy`
* **Live Preview**: `npx @11ty/eleventy --serve`
* **NPM Scripts**: `npm run build` / `npm run serve`
* **Rebuilds Automatically**: `npx eleventy --watch`

The Project Root: The Business Office
Your project's root folder is the business office. This is where all the high-level management files are kept. These files are for the developer and the build process itself, not for the final product.

package.json: The business's personnel file. It lists all the employees (npm packages) you need.

.eleventy.js: The factory manager's rulebook. It tells Eleventy what to do and where to find everything.

site.webmanifest: A business card for the entire website. This file is a key part of the final product, but it's generated for the overall project, not a single page.

The src Folder: The Factory Floor
The src folder is the factory floor. This is where all the work happens. It's where you put all the raw materials and blueprints for your final website.

Your Markdown files (.md) are the blueprints for each page.

Your layout files (_layouts) are the assembly line templates.

Your include files (_includes) are the reusable component parts.

The src folder is a workspace. The browser never sees it.

The src/assets Folder: The Warehouse
The src/assets folder is a special room on the factory floor—a warehouse where you store all your static materials that don't need to be processed, like images and CSS files.

The "Website's Perspective"
When you run npm start, Eleventy, the factory, takes everything from the src folder and builds the final product in the _site folder.

The paths in your code (/assets/favicon.ico) are for the browser. They tell the browser where to look in the finished _site folder, not where to find the original file on the factory floor. That's why the paths don't include src. The browser only ever sees the final product.



src/: This is your main input directory, as defined by input: "src" in your .eleventy.js file. It's best to keep all your source files (HTML, CSS, JS, etc.) in a single folder to keep the root directory clean.

src/_includes/: This is for reusable HTML snippets or partials, like a navigation bar or a footer.

src/_layouts/: This folder contains the main HTML shell for your pages, so you don't have to repeat the <!DOCTYPE html>, <head>, and <body> tags.

src/_data/: This is where you store global data that can be used across your site, such as site titles, navigation links, or team member lists. You can use .json or .js files here.

src/assets/: This folder is for static files that don't need to be processed by Eleventy, such as images, fonts, and PDFs. Because we added eleventyConfig.addPassthroughCopy("src/assets");, Eleventy knows to copy this entire folder to the _site output.

src/main.css and src/main.js: These are your main stylesheet and JavaScript files. The passthrough copies in your configuration file handle moving these to the final output.

package.json and package-lock.json: These files are automatically generated when you initialize and install dependencies. They manage your project's dependencies and scripts.


## Independent Pages
index /* redir to homepage, but will have a funny error message if it doesn't /*
homepage /* this page may have random images from my gallery, latest blog post, and work on sale from redbubble /*
portfolio
contact /* central hub for all your social media links, email, and a contact form /*
about
404
terms-of-service /* privacy notice located here /*
comission /* maybe explain my art process; end of page call to action: Request a Quote; explains Licensing & Commercial Use if someone buys a commercial liscense, I am okay with them having full rights to that image. I wish to only host it in my portfolio or gallery /*
faq

## Slugs or Needs Templates
gallery.html
gallery/slug

Testimonials.html
Testimonials.slug

blog.html
blog/slug


## Misc
broken-index
400
404
401
410 
403
501
429
500
502
504

# Footer Links
## Pages  
Home
Portfolio
Gallery
Blog
Testimonials
FAQ

## Business 
Commissions
Behind the Scenes /* brand.html /*
Redbubble

## Connect  
Social Media 1
Social Media 2
Find me Somewhere Else

## Legal 
Terms of Service
Privacy Policy

## Misc /* might be deleted or placed under the other links but moved to about me page and or branding page /*
Broken Index
404
400, 401, 403, 410, 429
500, 501, 502, 503, 504



