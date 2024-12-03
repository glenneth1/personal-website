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
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                metadata[key.trim()] = valueParts.join(':').trim();
            }
        });
        return '';
    });

    // Configure marked options for proper heading rendering
    const markedOptions = {
        headerIds: true,
        gfm: true,
        breaks: true,
        pedantic: false,
        smartLists: true,
        smartypants: true
    };

    // Convert markdown to HTML
    const articleContent = marked.parse(content, markedOptions);

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Create full HTML document
    const html = `<!DOCTYPE html>
<html lang="en" class="bg-base-bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${metadata.description || ''}">
    <meta property="og:title" content="${metadata.title || 'Blog Post'}">
    <meta property="og:description" content="${metadata.description || ''}">
    <meta property="og:url" content="https://glenneth.org${mdFilePath.replace(/\.md$/, '')}">
    <title>${metadata.title || 'Blog Post'} - Glenn Thompson</title>
    <link href="../../dist/styles.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        .prose-palenight {
            --tw-prose-body: #bfc7d5;
            --tw-prose-headings: #ffd580;
            --tw-prose-links: #82aaff;
            --tw-prose-code: #c792ea;
            --tw-prose-pre-bg: #1b1e2b;
        }
        .prose h2 {
            color: var(--tw-prose-headings);
            font-family: Merriweather, serif;
            font-weight: 700;
            font-size: 1.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        .prose p {
            margin-bottom: 1rem;
            line-height: 1.625;
        }
        .prose a {
            color: var(--tw-prose-links);
            text-decoration: none;
        }
        .prose a:hover {
            color: #89ddff;
        }
        .prose code {
            color: var(--tw-prose-code);
            font-family: 'JetBrains Mono', monospace;
        }
        .prose pre {
            background-color: var(--tw-prose-pre-bg);
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin-bottom: 1rem;
        }
        .prose ul, .prose ol {
            margin-top: 0.5rem;
            margin-bottom: 1rem;
            padding-left: 1.5rem;
        }
        .prose ul {
            list-style-type: disc;
        }
        .prose ol {
            list-style-type: decimal;
        }
    </style>
</head>
<body class="bg-base-bg text-palenight-50">
    <nav class="fixed w-full bg-base-darker/80 backdrop-blur-sm shadow-sm z-50 border-b border-palenight-400/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <a href="/" class="flex items-center font-serif text-xl font-bold text-accent-purple">Glenn Thompson</a>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/#about" class="nav-link text-accent-blue hover:text-accent-cyan">About</a>
                    <a href="/#blog" class="nav-link text-accent-blue hover:text-accent-cyan">Blog</a>
                    <a href="/#projects" class="nav-link text-accent-blue hover:text-accent-cyan">Projects</a>
                </div>
            </div>
        </div>
    </nav>

    <main class="pt-24 pb-16 px-4">
        <div class="max-w-4xl mx-auto">
            <div class="content text-palenight-100 space-y-6">
                <div class="flex items-center justify-between mb-8">
                    <a href="/" class="inline-flex items-center text-accent-blue hover:text-accent-cyan transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                        </svg>
                        Back to Home
                    </a>
                    <time datetime="${metadata.date || ''}" class="text-palenight-300">${metadata.date || ''}</time>
                </div>

                <header class="mb-8">
                    <h1 class="text-4xl font-serif font-bold text-accent-yellow">${metadata.title || 'Blog Post'}</h1>
                    <div class="flex items-center gap-4 text-palenight-300 mt-4">
                        <time datetime="${metadata.date || ''}">${metadata.date || ''}</time>
                        <span>•</span>
                        <span>${readTime} min read</span>
                        <span>•</span>
                        <span>By ${metadata.author || 'Glenn Thompson'}</span>
                    </div>
                </header>

                <article class="prose prose-palenight max-w-none">
                    ${articleContent}
                </article>
            </div>
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
