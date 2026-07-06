# Hello, world

_July 5, 2026_

This is the first post. You can write anything here using Markdown — and it'll
render automatically on the site.

## Writing a new post

1. Create a new `.md` file in the `posts/` folder
2. Write your content in Markdown (see below for what's supported)
3. Add a link to it from any page using:

```html
<a href="post.html?src=../posts/your-file.md&page=hobbies" class="post-card">
  ...
</a>
```

The `&page=hobbies` part tells the post page which color accent to use (matches
the page you're linking from). Use `page=research` or `page=about` for those
sections.

## What Markdown supports

**Bold**, _italic_, and `inline code`.

> Blockquotes look like this — great for pull quotes.

### Lists

- Photography
- Crochet
- Writing
- Other things

### Tables

| Thing      | Why it's good            |
| ---------- | ------------------------ |
| Markdown   | Write once, looks nice   |
| Plain HTML | Full control when needed |

### Code blocks

```python
def hello():
    print("hello, world")
```

---

That's it. Delete this file when you've written your own first post.
