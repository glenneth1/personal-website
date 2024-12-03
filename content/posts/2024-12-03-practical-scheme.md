---
title: Beyond Theory: Building Practical Tools with Guile Scheme
author: Glenn Thompson
date: 2024-12-03 10:00
tags: tech, guile, scheme, development, functional-programming
---

# Beyond Theory: Building Practical Tools with Guile Scheme

## Introduction

A few months ago, I shared my journey into learning Scheme through building `stash`, a symlink manager. Since then, I've discovered that the gap between learning Scheme and applying it to real-world problems is where the most valuable lessons emerge. This post explores what I've learned about building practical tools with Guile Scheme, sharing both successes and challenges along the way.

## The Power of Modular Design

One of the most important lessons I learned was the value of modular design. Breaking down a program into focused, single-responsibility modules not only makes the code more maintainable but also helps in reasoning about the program's behavior. Here's how I structured `stash`:

```scheme
(use-modules (ice-9 getopt-long)
             (stash help)         ;; Help module
             (stash colors)       ;; ANSI colors
             (stash log)          ;; Logging module
             (stash paths)        ;; Path handling module
             (stash conflict)     ;; Conflict resolution module
             (stash file-ops))    ;; File and symlink operations module
```

Each module has a specific responsibility:
- `colors.scm`: Handles ANSI color formatting for terminal output
- `conflict.scm`: Manages conflict resolution when files already exist
- `file-ops.scm`: Handles file system operations
- `help.scm`: Provides usage information
- `log.scm`: Manages logging operations
- `paths.scm`: Handles path manipulation and normalization

## Robust Path Handling

One of the first challenges in building a file management tool is handling paths correctly. Here's how I approached it:

```scheme
(define (expand-home path)
  "Expand ~ to the user's home directory."
  (if (string-prefix? "~" path)
      (string-append (getenv "HOME") (substring path 1))
      path))

(define (concat-path base path)
  "Concatenate two paths, ensuring there are no double slashes."
  (if (string-suffix? "/" base)
      (string-append (string-drop-right base 1) "/" path)
      (string-append base "/" path)))

(define (ensure-config-path target-dir)
  "Ensure that the target directory has .config appended, avoiding double slashes."
  (let ((target-dir (expand-home target-dir)))
    (if (string-suffix? "/" target-dir)
        (set! target-dir (string-drop-right target-dir 1)))
    (if (not (string-suffix? "/.config" target-dir))
        (string-append target-dir "/.config")
        target-dir)))
```

This approach ensures that:
- Home directory references (`~`) are properly expanded
- Path concatenation doesn't create double slashes
- Configuration paths are consistently structured

## Interactive Conflict Resolution

Real-world tools often need to handle conflicts. I implemented an interactive conflict resolution system:

```scheme
(define (prompt-user-for-action)
  "Prompt the user to decide how to handle a conflict: overwrite (o), skip (s), or cancel (c)."
  (display (color-message 
    "A conflict was detected. Choose action - Overwrite (o), Skip (s), or Cancel (c): " 
    yellow-text))
  (let ((response (read-line)))
    (cond
      ((string-ci=? response "o") 'overwrite)
      ((string-ci=? response "s") 'skip)
      ((string-ci=? response "c") 'cancel)
      (else
       (display "Invalid input. Please try again.\n")
       (prompt-user-for-action)))))
```

This provides a user-friendly interface for resolving conflicts while maintaining data safety.

## Logging for Debugging and Auditing

Proper logging is crucial for debugging and auditing. I implemented a simple but effective logging system:

```scheme
(define (current-timestamp)
  "Return the current date and time as a formatted string."
  (let* ((time (current-time))
         (seconds (time-second time)))
    (strftime "%Y-%m-%d-%H-%M-%S" (localtime seconds))))

(define (log-action message)
  "Log an action with a timestamp to the stash.log file."
  (let ((log-port (open-file "stash.log" "a")))
    (display (color-message 
      (string-append "[" (current-timestamp) "] " message) 
      green-text) log-port)
    (newline log-port)
    (close-port log-port)))
```

This logging system:
- Timestamps each action
- Uses color coding for better readability
- Maintains a persistent log file
- Properly handles file operations

## File Operations with Safety

When dealing with file system operations, safety is paramount. Here's how I handle moving directories:

```scheme
(define (move-source-to-target source-dir target-dir)
  "Move the entire source directory to the target directory, ensuring .config in the target path."
  (let* ((target-dir (ensure-config-path target-dir))
         (source-dir (expand-home source-dir))
         (source-name (basename source-dir))
         (target-source-dir (concat-path target-dir source-name)))
    (if (not (file-exists? target-dir))
        (mkdir target-dir #o755))
    (if (file-exists? target-source-dir)
        (handle-conflict target-source-dir source-dir delete-directory log-action)
        (begin
          (rename-file source-dir target-source-dir)
          (display (format #f "Moved ~a to ~a\n" source-dir target-source-dir))
          (log-action (format #f "Moved ~a to ~a" source-dir target-source-dir))))
    target-source-dir))
```

This implementation:
- Ensures paths are properly formatted
- Creates necessary directories
- Handles conflicts gracefully
- Logs all operations
- Returns the new path for further operations

## Lessons Learned

### What Worked Well
1. **Modular Design**: Breaking the code into focused modules made it easier to maintain and test
2. **Functional Approach**: Using pure functions where possible made the code more predictable
3. **Interactive Interface**: Providing clear user prompts and colored output improved usability
4. **Robust Logging**: Detailed logging helped with debugging and understanding program flow

### Challenges Faced
1. **Path Handling**: Dealing with different path formats and edge cases required careful attention
2. **Error States**: Managing various error conditions while keeping the code clean
3. **User Interface**: Balancing between automation and user control
4. **Documentation**: Writing clear documentation that helps users understand the tool

## Moving Forward

Building `stash` has taught me that while functional programming principles are valuable, pragmatism is equally important. The key is finding the right balance between elegant functional code and practical solutions.

## Resources

1. [Guile Manual](https://www.gnu.org/software/guile/manual/)
2. [My Previous Scheme Journey Post](/content/posts/scheme-journey.html)
3. [System Crafters Community](https://systemcrafters.net/community)
4. [Stash on Codeberg](https://codeberg.org/glenneth/stash)

The code examples in this post are from my actual implementation of `stash`. Feel free to explore, use, and improve upon them!
