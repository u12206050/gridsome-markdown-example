const activeEnv = process.env.NODE_ENV || "development"

require("dotenv").config({
  path: `.env.${activeEnv}`,
})

module.exports = {
  transformers: {
    remark: {
      externalLinksTarget: "_blank",
      externalLinksRel: ["nofollow", "noopener", "noreferrer"],
      anchorClassName: "icon icon-link"
    }
  },

  plugins: [
    {
      use: "@gridsome/source-filesystem",
      options: {
        path: "/blog/**/*.md",
        route: "/blog/:slug",
        typeName: "Post",
        remark: {
          plugins: [
            // ...local plugins
          ]
        }
      }
    },
    {
      use: `gridsome-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        collections: [{
          contentTypeName: 'Post',
          indexName: 'posts', // Algolia index name
          itemFormatter: (item) => {
            return {
              objectID: item.id,
              title: item.title,
              slug: item.slug,
              modified: item.modified
            };
          }, // optional
          matchFields: ['modified'], // Array<String> required with PartialUpdates
        }],
        chunkSize: 10000, // default: 1000
        enablePartialUpdates: true, // default: false
      },
    },
  ]
};
