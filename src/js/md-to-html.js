const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

// Configure marked options
const options = {
    headerIds: true,
    gfm: true
};

// Footer template
const footer = `
    <footer class="bg-base-darker text-palenight-200 py-12 border-t border-palenight-400/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <p class="text-palenight-300">&copy; 2024 Glenn Thompson. All rights reserved.</p>
                <div class="webring-text mt-6">
                    <p class="text-palenight-300">I am part of the <a href="https://systemcrafters.net" target="_blank" class="text-accent-blue hover:text-accent-cyan">System Crafters</a> webring:</p>
                </div>
                <div class="craftering mt-2 flex items-center justify-center gap-4 text-accent-blue">
                    <a href="https://craftering.systemcrafters.net/@glenneth/previous" class="hover:text-accent-cyan">←</a>
                    <a href="https://craftering.systemcrafters.net/" class="hover:text-accent-cyan">craftering</a>
                    <a href="https://craftering.systemcrafters.net/@glenneth/next" class="hover:text-accent-cyan">→</a>
                </div>
                <p class="text-palenight-300 mt-2">
                    <a href="mailto:glenn@glenneth.org" class="text-accent-blue hover:text-accent-cyan transition-colors">glenn@glenneth.org</a> | 
                    <a href="https://glenneth.org" class="text-accent-blue hover:text-accent-cyan transition-colors">glenneth.org</a>
                </p>
            </div>
        </div>
    </footer>
</body>
</html>`;

function convertMarkdownToHtml(mdFilePath) {
    // Read markdown file
    const markdown = fs.readFileSync(mdFilePath, 'utf-8');
    
    // Extract metadata from markdown (assuming front matter)
    const metadata = {};
    const content = markdown.replace(/^---\n([\s\S]*?)\n---\n/, (_, frontMatter) => {
        frontMatter.split('\n').forEach(line => {
            const [key, value] = line.split(': ');
            if (key && value) {
                metadata[key.trim()] = value.trim();
            }
        });
        return '';
    });

    // Convert markdown to HTML
    const articleContent = marked.parse(content, options);

    // Create full HTML document
    const html = `<!DOCTYPE html>
<html lang="en" class="bg-base-bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title || 'Blog Post'} - Glenn Thompson</title>
    <link href="/dist/styles.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="bg-base-bg text-palenight-200 font-sans">
    <header class="bg-base-darker border-b border-palenight-400/20">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <a href="/" class="text-2xl font-serif font-bold text-accent-yellow hover:text-accent-cyan transition-colors">Glenn Thompson</a>
                <div class="flex space-x-6">
                    <a href="/" class="text-palenight-200 hover:text-accent-cyan transition-colors">Home</a>
                    <a href="/#blog" class="text-palenight-200 hover:text-accent-cyan transition-colors">Blog</a>
                </div>
            </div>
        </nav>
    </header>

    <main class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <article class="prose prose-invert prose-palenight max-w-none">
                <h1>${metadata.title || 'Blog Post'}</h1>
                <div class="flex items-center gap-2 text-accent-cyan text-sm mb-8">
                    <span>${metadata.category || 'Blog'}</span>
                    <span>•</span>
                    <time datetime="${metadata.date || ''}">${metadata.date || ''}</time>
                </div>
                ${articleContent}
            </article>
        </div>
    </main>${footer}`;

    // Write HTML file
    const htmlFilePath = mdFilePath.replace(/\.md$/, '.html');
    fs.writeFileSync(htmlFilePath, html);
    console.log(`Converted ${path.basename(mdFilePath)} to HTML`);
}

// If running from command line
if (require.main === module) {
    const mdFilePath = process.argv[2];
    if (!mdFilePath) {
        console.error('Please provide a markdown file path');
        process.exit(1);
    }
    convertMarkdownToHtml(mdFilePath);
}
