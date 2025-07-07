const fs = require('fs');
const path = require('path');
const marked = require('marked');

function sanitizeTitle(title) {
    // Remove any surrounding quotes and trim whitespace
    return title.replace(/^["']|["']$/g, '').trim();
}

function formatDate(dateStr) {
    // Ensure consistent date format
    const date = new Date(dateStr);
    return date.toUTCString();
}

function extractMetadata(markdown) {
    const metadata = {};
    const match = markdown.match(/^---\n([\s\S]*?)\n---/);
    
    if (match) {
        const frontMatter = match[1];
        frontMatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                metadata[key.trim()] = valueParts.join(':').trim();
            }
        });
    }
    
    // Get content without front matter
    const content = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Extract first paragraph as description if no description in metadata
    if (!metadata.description) {
        const firstParagraph = content.match(/\n\n(.*?)\n\n/);
        if (firstParagraph) {
            metadata.description = firstParagraph[1].replace(/[#*`]/g, '').trim();
        }
    }
    
    // Convert markdown content to HTML
    const htmlContent = marked.parse(content, {
        gfm: true,
        breaks: true,
        smartLists: true,
        smartypants: true
    });
    
    metadata.content = htmlContent;
    
    return metadata;
}

function generateRSSFeed() {
    const postsDir = path.join(__dirname, '../../content/posts');
    const posts = [];
    
    // Read all markdown files
    fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'))
        .forEach(file => {
            const filePath = path.join(postsDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const metadata = extractMetadata(content);
            
            if (metadata.title && metadata.date) {
                posts.push({
                    title: sanitizeTitle(metadata.title),
                    date: formatDate(metadata.date),
                    description: metadata.description || '',
                    content: metadata.content,
                    author: metadata.author || 'Glenn Thompson',
                    link: `https://glenneth.org/content/posts/${file.replace('.md', '.html')}`,
                    tags: metadata.tags || ''
                });
            }
        });
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
        <title>Glenn Thompson's Blog</title>
        <description>Personal blog about programming, technology, and other interests</description>
        <link>https://glenneth.org</link>
        <atom:link href="https://glenneth.org/feed.xml" rel="self" type="application/rss+xml" />
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${posts.map(post => `
        <item>
            <title>${post.title}</title>
            <description>${post.description}</description>
            <content:encoded><![CDATA[${post.content}]]></content:encoded>
            <link>${post.link}</link>
            <guid isPermaLink="true">${post.link}</guid>
            <pubDate>${post.date}</pubDate>
            <author>${post.author}</author>
            ${post.tags ? `<category>${post.tags}</category>` : ''}
        </item>`).join('\n        ')}
    </channel>
</rss>`;
    
    // Write the RSS feed to file
    fs.writeFileSync(path.join(__dirname, '../../feed.xml'), rss);
    console.log('Generated RSS feed at feed.xml');
}

generateRSSFeed();
