# Reveal ToC Progress Plugin

This plugin allows to have a Progress bar for a Table of Contents.

## Usage

The plugin auto generates a dynamic ToC view in the bottom left corner.

### data-no-toc-view

When adding the attribute "data-no-toc-view" to a slide, the toc is not shown on this slide.
This is especially helpful, when using the plugin with reveal.js markdown and pandoc

```md
## my slide name { no-toc-view="true" }

This is a slide which should not show the ToC
```

### data-toc-entry

Similarly entries can be added to the toc by adding the toc-entry attribute.
This is required for at least one slide, as the plugin shows an empty square otherwise to indicate the successful inclusion.

```md
## my toc header slide { toc-entry="true" }

This is a slide with a new topic, which marks a new ToC section
```

## Styling

One can adjust the classes in the css file to override colors.
This is best done in a custom `style.css`.
With pandoc reveal.js conversion this can be done through:

```
css:
  - "style.css"
```

in the frontmatter of your file.

## Credits

A smiliar older plugin is available with https://github.com/e-gor/Reveal.js-TOC-Progress
