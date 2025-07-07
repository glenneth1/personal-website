---
title: Transitioning from Hugo to Haunt: Embracing Scheme and GNU Guix
author: Glenn Thompson
date: 2024-05-15 10:30
tags: personal, tech, keyboards, glove80
---

# Transitioning from Hugo to Haunt: Embracing Scheme and GNU Guix

Hello there! I'm Glenn Thompson, and today, I want to share a significant part of my recent journey into the world of Scheme, GNU Guix, and static site generation.

## Discovering Scheme with System Crafters

My journey began with a desire to dive deeper into programming languages and their ecosystems. I am a member of the [System Crafters Community](https://systemcrafters.net/community/), and its founder, David Wilson, announced a short four week course as an introduction to Guile Scheme. The course, [Hands-On Guile Scheme for Beginners](https://systemcrafters.net/courses/hands-on-guile-scheme-beginners/), provided me with a robust introduction to Guile Scheme, a language that emphasizes simplicity and elegance. David's clear explanations and practical examples made learning Scheme both engaging and approachable.

## The Move to GNU Guix

Inspired by the principles of Scheme, I decided to take a leap further into the open-source world by transitioning from Arch Linux to GNU Guix. The Guix community, particularly the folks in the `#systemcrafters` channel on `irc.libera.chat`, were incredibly supportive and instrumental in helping me navigate this new environment. Their guidance made the switch smooth and rewarding, reinforcing the power and flexibility of GNU Guix as a functional package manager and operating system.  More about that experience in another post.

There are too many individuals to name here that have helped with the installation and configuration on Gnu guix to mention here.  You all have been an incredible help for which I am extremely grateful.  Thank you all , for enduring my ignorance, and for your patience and your help.

## From Hugo to Haunt

As I settled into Guix, I faced a challenge: Hugo, the static site generator I previously used, was not available as a Guix package. This led me to explore alternatives and eventually discover [Haunt](https://dthompson.us/projects/haunt.html), a Scheme-based static site generator that aligns perfectly with my newfound appreciation for Scheme and Guix.

## Overcoming Challenges with Haunt

Transitioning to Haunt wasn't without its challenges. There are no readily available templating systems available for haunt like there are for hugo, but there are plenty of examples [here](https://awesome.haunt.page/). One of my own primary difficulties was creating a custom template that matched my site's aesthetic requirements and functionality needs. Initially, I struggled with configuring the theme layout and ensuring the CSS was applied correctly. Another hurdle was generating the correct URLs for posts and ensuring that summaries appeared as intended on the front page.

Thankfully, the Haunt manual proved to be an invaluable resource throughout this process. The comprehensive documentation provided clear guidance on using various modules, functions, and procedures. By carefully studying the examples and explanations, I was able to overcome the obstacles and achieve the desired results for my site. The manual's detailed descriptions of Haunt's inner workings were particularly helpful in understanding how to leverage the flexibility of Scheme to customize my blog.

## Crafting My Own Template

Moving from Hugo to Haunt required me to create my own template and customize my site's appearance. This was an exciting opportunity to apply the skills I had learned from David's course and experiment with Scheme in a practical context.

#### Creating the Template

Haunt's flexibility allowed me to define my own theme layout and structure. Here's a snippet of my `haunt.scm` file, where I defined the theme layout and added custom footer content:

```scheme
(use-modules (haunt asset)
             (haunt builder blog)
             (haunt builder atom)
             (haunt builder assets)
             (haunt reader commonmark)
             (haunt site)
             (haunt post)
             (sxml simple)    ; For HTML generation
             (srfi srfi-1)
             (srfi srfi-19))  ; For date and time procedures

;; Load custom templates
(load "templates/post.scm")

(define (format-date date)
  (date->string date "~Y-~m-~d"))

;; Define a function to generate the URL for a post
(define (post-url post)
  (string-append "/" (post-slug post) ".html"))

;; Define a function to extract a summary from the post content
(define (post-summary post)
  (let ((content (post-sxml post)))
    (if (null? content)
        ""
        (let ((first-paragraph (car content)))
          (if (string? first-paragraph)
              (substring first-paragraph 0 (min 200 (string-length first-paragraph)))
              (sxml->string first-paragraph))))))

;; Define the theme layout
(define (theme-layout site title content)
  (let ((current-year (number->string (date-year (current-date)))))
    `(html
      (head
       (meta (@ (charset "utf-8")))
       (meta (@ (name "viewport") (content "width=device-width, initial-scale=1.0, shrink-to-fit=no")))
       (link (@ (rel "stylesheet") (href "/assets/palenight.css")))
       (style
        " .craftering {
            margin: auto;
            width: 50%;
            text-align: center;
        }
        .webring-text {
            text-align: center;
            margin-bottom: 20px;
            color: white;
        }
        .craftering a {
            color: #dddddd;
        }
        .webring-text a {
            color: #dddddd;
        }")
       (title ,title))
      (body
       (header (h1 ,(site-title site)))
       (main ,content)
       (footer (@ (class "bg-black bottom-0 w-100 pa3") (role "contentinfo"))
               (div (@ (class "flex justify-between"))
                    (div (@ (class "webring-text"))
                         (p "I am part of the " (a (@ (href "https://systemcrafters.net") (target "_blank")) "System Crafters") " webring:"))
                    (div (@ (class "craftering"))
                         (a (@ (href "https://craftering.systemcrafters.net/@glenneth/previous")) "←")
                         (a (@ (href "https://craftering.systemcrafters.net/")) "craftering")
                         (a (@ (href "https://craftering.systemcrafters.net/@glenneth/next")) "→"))))))))

;; Define the custom theme with a consistent layout for index
(define my-theme
  (theme #:name "My Custom Theme"
         #:layout theme-layout
         #:post-template post-template
         #:collection-template
         (lambda (site title posts prefix)
           `(div (@ (class "content"))
              (h2 ,title)
              (ul
                ,@(map (lambda (post)
                         `(li
                            (article
                              (header
                               (h3 (a (@ (href ,(post-url post))) ,(post-title post))))
                              (p ,(format-date (post-date post)))
                              (p ,(post-summary post))
                              (p (a (@ (href ,(post-url post))) "Read more...")))))
                       posts))))))

;; Site configuration
(site #:title "Just Another Personal Blog"
      #:domain "glenneth.srht.site"
      #:default-metadata
      '((author . "Glenn Thompson")
        (email  . "glenn@kirstol.org"))
      #:readers (list commonmark-reader)
      #:builders (list
                  (blog #:theme my-theme)
                  (atom-feed)
                  (atom-feeds-by-tag)
                  (static-directory "images")
                  (static-directory "assets")))
```

### Customizing the CSS

To give my site a personalized touch, I crafted a CSS stylesheet that matched my aesthetic preferences. Here’s an excerpt from my `palenight.css` file:

```css
body {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.content, header, footer, main {
  max-width: 90%;
  padding: 0 5%;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

footer {
  text-align: center;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

body {
  background-color: #292d3e;
  color: #d0d0d0;
}

a {
  color: #82aaff;
}

h1, h2, h3, h4, h5, h6 {
  color: #c792ea;
}

.content {
  background-color: #1e1e2e;
  padding: 20px;
  border-radius: 5px;
}

article {
  background-color: #282a36;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

article header {
  margin-bottom: 10px;
}

.date {
  color: #6272a4;
  font-size: 0.9em;
}

/* Additional styles for the craftering */
.craftering {
  margin: auto;
  width: 50%;
  text-align: center;
}

.webring-text {
  text-align: center;
  margin-bottom: 20px;
  color: white;
}

.craftering a {
  color: #dddddd;
}

.webring-text a {
  color: #dddddd;
}

/* Additions for mobile device readability */

meta {
  name: viewport;
  content: width=device-width, initial-scale=1, shrink-to-fit=no;
}

@media screen and (max-width: 767px) {
  /* Customize styles for smaller screens */
  .logo {
    max-width: 200px;
  }

}

```

I use the `doom-palenight` theme in Emacs, my preferred text editor, and I wanted my site to match that aesthetic.

### Publishing with Haunt and Hut

In addition to using Haunt, I adopted hut, a set of command-line tools for interacting with SourceHut, to publish my blog. This streamlined my workflow, making it easier to manage and deploy my site directly from my local environment.

### Conclusion

Transitioning from Hugo to Haunt, learning Scheme, and embracing GNU Guix has been an enriching experience. It's not just about using new tools; it's about joining a community that values simplicity, transparency, and collaboration. If you're curious about Scheme or GNU Guix, I highly recommend checking out David Wilson's course on System Crafters and joining the discussions on IRC.

I am not a developer of any kind, and learning Scheme has opened my eyes as to how I can craft an environment that I want to work in, and not endure a working environment that the computer is forcing upon me.

Thank you for reading, and stay tuned for more updates on my journey!
