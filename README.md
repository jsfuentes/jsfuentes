## Quick Start

### Start Developing

Navigate into your new site’s directory and start it up.

```sh
gatsby develop
```

`http://localhost:8000`!

`http://localhost:8000/___graphql` has GraphQL explorer [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).

Change sitemetadata in `config.js` and template/pages on `src/templates/`. Add new posts to the `content` folder.

## Deploy with Netlify

```sh
now --prod
```

Also has netlify CMS.

#### Access Locally

```
$ git clone https://github.com/[GITHUB_USERNAME]/[REPO_NAME].git
$ cd [REPO_NAME]
$ yarn
$ npm run develop
```

To test the CMS locally, you'll need run a production build of the site:

```
$ npm run build
$ gatsby serve
```

Import medium posts with

```sh
npx mediumexporter https://medium.com/p/export-your-medium-posts-to-markdown-b5ccc8cb0050 | pbcopy
```
