# `braind`

Currently only note formatting is implemented. To use, ensure you have a LaTeX distro with `latexindent`, and install `markdownfmt` via go. Then

```sh
git clone <url>
yarn
yarn build
alias <aliasname>='node /path/to/out/out.js'
```

`braind format` is optimized for being run a lot on the same note, via format-on-save or a similar editor feature. It splits the document into chunks, tracks which chunks change, and then formats only the changed chunks.

Then to format notes run `<aliasname> format -w note.md`. To have the alias persist, add it to your `.profile` or other interactive shell init script.

## Overview

Braind is a program for taking a bunch of tagged, backlinked markdown notes and turning them into a beautiful, minimal knowledge base, facilitating exporting and interactions. Braind does not replicate any of the functionality of your editor or your file-finding tools. It only responds to file system changes.

Given a **volume**, braind watches the volume for changes and recompiles the **view**. The view consists of beautifully rendered, interlinked PDF files as well as a directory structure representing tags containing symlinks to notes.

## Note Properties

`format-on-save` - flag representing whether a file should be formatted when it is saved.

`synctex` - flag representing whether synctex information should be maintained about a file when it is saved.

`preview` - describes note preview behaviour when it is written to. By default
- `"page"` - only shows the current page of the note. Useful for long documents.
- `"all"` - default. Previews the entire note.
- `"none"` - does not generate a preview for the note

`format` - describes whether to format the note when it is saved

`tags` - the most important property. Describes what tags a note should contain. Tags are structured hierarchically. For example, `math/probability` and `math/optimization`.

`_backlinks` - autogenerated property describing what notes a note is linked to.

`export` - format to export the note as

Pandoc properties describing file output

## Volume Structure

### Content

`mem` - flat directory of markdown files with YAML frontmatter describing properties.

`assets` - pdf files such as textbooks and json files describing metadata.

`img` - images

### View

`mem/[tag]` - autogenerated directory that contains each tag. When a file is built it is symlinked into the correct directories. This directory is an index that facilitates fast search of the volume based on tag. Because tags are hierarchical, each directory will also contain a symlink to notes contained in its children. This makes searching easy - `cat *.md | fzf`

`out` - autogenerated directory that contains PDF files for each note.

`preview.pdf` - symlinked to the current pdf being edited by the editor to facilitate fast preview

## Volume Functionality

`note` - creates a new note from a template

`preview` - opens up a preview containing a note's content

`asset` - adds an asset to the `assets` directory and generates metadata for it

`find` - finds a note with certain categories

`filter` - creates a temporary filter directory containing notes with certain properties

## Architecture

### `.braind`

Directory containing braind state local to the volume.

`.braind/docs.sqlite` - SQLite database containing information about notes. Facilitates fast querying and also stores the previous tag state of the note, enabling `braind` to garbage-collect unused symlinks in `mem/tag`.

`.braind/cache/mem/*/*.tex|.log|.synctex.gz|etc` - cache folder containing synctex build information

`.braind/cache/asset` - cache folder containing documents in `./asset` compiled to plaintext to facilitate fast searching

`.braind/.git` - temporary git repo that stores previous state of $.tex$ files, for use with synctex without requiring editor integration

### Build Process

When braind is active, it watches a repo for changes and then compiles the files.

1. Parse header - the YAML frontmatter is parsed and compared to the previous state.

2. 

## Inspiration

I am inspired by [org-mode](https://orgmode.org/), [dendron](https://wiki.dendron.so/), and the [Zettelkasten method](https://zettelkasten.de/posts/overview/).

Workflow inspiration came in a great deal from [Gilles Castel's posts about mathematics notes in plaintext](https://castel.dev/).
