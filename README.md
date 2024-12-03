# Glenn Thompson's Personal Website

A modern, responsive personal blog built to share experiences in technology, engineering, and travel, with a focus on life in the Middle East and technical explorations.

Visit the live site at [https://glenneth.org](https://glenneth.org)

## Features
- Responsive design optimized for all devices
- Clean, modern UI with subtle animations
- RSS feed support for blog posts
- Markdown-to-HTML conversion for content
- Dedicated sections for:
  - Technical blog posts
  - Travel stories
  - Engineering insights
  - About me
  - Project showcase

## Technology Stack
- HTML5
- CSS (Tailwind CSS for styling)
- JavaScript
- Node.js for build tools
- Live-server for development
- Static site generation with markdown support

## Local Development
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ./serve.sh
   ```
   This will start a live-server instance with auto-reload on port 3001.

## Content Management
### Adding New Blog Posts
1. Create a new markdown file in `content/posts/`
2. Include frontmatter with title, date, and tags:
   ```markdown
   ---
   title: Your Post Title
   author: Glenn Thompson
   date: YYYY-MM-DD HH:MM
   tags: tech, programming, travel
   ---
   ```
3. Run the build script to convert markdown to HTML:
   ```bash
   ./build.sh
   ```
   This will:
   - Convert any new or modified markdown files to HTML
   - Update the RSS feed
   - Generate the deployment package

## Deployment
The site is deployed as a static website. Run `./deploy.sh` to create a deployment package.

## RSS Feed
An RSS feed is available at `/feed.xml` for subscribing to blog updates.

## Contact
For any inquiries, please reach out to [glenn@glenneth.org](mailto:glenn@glenneth.org)

## License
MIT License
