---
title: My Development Environment in 2025: From Editor to Deployment
date: 2025-03-08
tags: development, guix, tools, workflow, productivity, web
description: A comprehensive look at my current development setup in 2025, covering everything from my GNU Guix system foundation to editor configurations, terminal tools, and deployment processes.
---

## Introduction

The tools we use shape how we work. Over the years, my development environment has evolved alongside my technical journey through different programming languages, paradigms, and projects. This post offers a snapshot of my current setup in early 2025, detailing the choices I've made and why they work for me.

## System Foundation: ArcoLinux with GNU Guix

My journey to [GNU Guix](https://guix.gnu.org/) began through my exploration of Scheme programming, as I detailed in my [GNU Guix Journey](/content/posts/2024-07-26-gnu-guix-journey.html) post. While I initially experimented with Guix System, I've settled on a hybrid approach: running Guix as a package manager on top of ArcoLinux (an Arch-based distribution).

### Current Configuration Approach

I manage my development environment using a combination of Arch's pacman, AUR, and Guix's declarative package management. My Guix configuration lives in a Git repository, allowing me to:

- Track changes to my development environment over time
- Reproduce my development setup on new hardware
- Roll back to previous package states when needed
- Share configuration snippets with the community

### Key Packages and Tools

I maintain a hybrid package approach:

**System packages (via pacman/AUR):**

- Base system utilities and desktop environment
- Graphics drivers and hardware support
- Some GUI applications

**Development tools (via Guix):**

```scheme
;; My primary development tools managed by Guix
(specifications->manifest
 '("emacs" "git" "openssh" "ripgrep" "fd" "exa" "bat"
   "guile" "node" "python" "gcc-toolchain" "make"
   "nss-certs" "glibc-locales"))
```

This hybrid approach gives me the best of both worlds: Arch's extensive package repository and up-to-date system packages, combined with Guix's reproducible development environments.

### Reproducibility Benefits

The reproducibility of Guix for development environments has been invaluable. I can:

- Spin up development environments with precise dependencies
- Ensure consistent behavior across machines
- Isolate project-specific dependencies using Guix environments
- Share exact environment specifications with collaborators

### Challenges and Solutions

Working with this hybrid approach isn't without challenges:

- **Challenge**: Keeping Guix packages in sync with system libraries  
  **Solution**: Careful management of library paths and containerization when needed

- **Challenge**: Learning curve for Guix's declarative configuration  
  **Solution**: Incremental adoption and community resources

- **Challenge**: Occasional conflicts between package managers  
  **Solution**: Clear separation of responsibilities (system vs. development tools)

## Editor Environment: Emacs

After experimenting with various editors, I've settled on Emacs as my primary development environment. Its extensibility and Scheme-based configuration language (Emacs Lisp) align well with my interests.

### Configuration Approach

I use a literate configuration with Org mode, which allows me to:
- Document my configuration choices
- Organize settings by purpose rather than file
- Selectively load components based on context
- Share readable documentation with others

### Key Extensions

My most valuable Emacs extensions include:

- **Magit**: Git interface that has transformed my version control workflow
- **LSP Mode**: Language server integration for intelligent code assistance
- **Org Mode**: For notes, task management, and literate programming
- **Projectile**: Project navigation and management
- **Company**: Completion framework
- **Consult/Vertico/Marginalia**: Modern completion UI
- **Tree-sitter**: Improved syntax highlighting and structural editing

### Language-Specific Setups

For my primary languages:

- **Scheme/Guile**: Geiser for REPL integration
- **JavaScript/TypeScript**: TypeScript LSP, prettier, eslint integration
- **Python**: Pyright LSP, black formatting
- **Web Development**: Web mode, emmet, css-mode

### Productivity Enhancements

Some productivity boosters in my setup:

- Custom keybindings for frequent operations
- Snippets for common code patterns
- Template generation for new projects
- Integration with system notifications

## Terminal and CLI Tools

While Emacs handles many tasks, I still rely heavily on terminal tools for specific workflows.

### Shell Configuration

I use Zsh with a custom configuration that provides:

- Intuitive aliases
- Helpful prompts with Git integration
- Command history management
- Directory navigation shortcuts

### Custom Scripts and Utilities

I've developed several custom scripts to streamline repetitive tasks:

- Project initialization templates
- Deployment automation
- System maintenance routines
- Content management for this blog

### Task Automation

For task automation, I use a combination of:

- Shell scripts for simple operations
- Guile scripts for more complex logic
- Make for build processes
- Cron for scheduled tasks

### Version Control Workflow

My Git workflow relies on:

- Branch-per-feature approach
- Interactive rebasing for clean history
- Commit message templates
- Hooks for quality checks

## Web Development Stack

As the creator of this website, my web development setup has been refined through experience.

### Local Development Server

For local development, I use:

- Live-server for static sites
- Custom Node.js servers for API development
- Docker containers for complex dependencies

### Build Tools and Processes

My build process typically involves:

- Tailwind CSS for styling
- Minimal JavaScript bundling
- Custom static site generation (as detailed in my [previous post](/content/posts/2025-01-02-from-haunt-to-custom.html))
- Automated optimization steps

### Testing Approach

For testing, I employ:

- Jest for JavaScript unit tests
- Cypress for end-to-end testing
- Manual testing across devices and browsers
- Accessibility validation tools

### Browser Tools and Extensions

Essential browser tools include:

- Firefox Developer Edition as my primary browser
- Chrome for cross-browser testing
- DevTools for performance analysis
- React and Redux DevTools
- Accessibility checkers

## Deployment Pipeline

My approach to deployment emphasizes security and reliability.

### Secure Deployment Process

As you might have noticed from my [.env.gpg file](/content/posts/2025-03-08-my-dev-environment-2025.html), I take security seriously:

- Credentials stored in GPG-encrypted files
- Separate development and production configurations
- Principle of least privilege for service accounts
- Regular security audits

### Automation Scripts

My deployment is automated through:

- Custom shell scripts for build and deploy
- Validation steps before deployment
- Rollback capabilities
- Notification systems for success/failure

### CI/CD Considerations

While not using a formal CI/CD pipeline for this personal site, I follow similar principles:

- Pre-commit checks for code quality
- Automated testing before deployment
- Consistent build environments
- Deployment approval steps

### Monitoring and Analytics

For site monitoring, I use:

- Simple analytics for privacy-respecting visitor tracking
- Uptime monitoring
- Performance metrics collection
- Error logging and alerting

## Future Improvements

My environment continues to evolve. Areas I'm exploring include:


- Further integration between Emacs and system tools
- More comprehensive test automation
- Expanded use of Guix channels for package management
- Improved mobile development workflow

## Conclusion

A development environment is deeply personal, reflecting both technical needs and individual preferences. Mine has evolved through years of experimentation, learning, and refinement.

The most important lesson I've learned is that tools should serve your workflow, not dictate it. Be willing to experiment, but also recognize when a tool is working well enough that further optimization yields diminishing returns.

I hope sharing my setup provides some inspiration for your own environment. I'd love to hear about your setup and what tools have made the biggest difference in your workflow.

What aspects of your development environment have you found most valuable? Are there tools or approaches you think I should consider? Let me know!
