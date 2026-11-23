
---
title: MkDocs Material Admonitions Test
description: Comprehensive compatibility test for MkDocs Material admonitions in Astro Starlight.
sidebar:
  order: 1
---

# MkDocs Material Admonitions — Test Suite

This page demonstrates the features of MkDocs Material admonitions.

It is designed to test Markdown rendering, custom titles, aliases,
collapsible blocks, nested content, tables, and edge cases.

All examples use standard MkDocs Material syntax.

## 1. The 12 Admonition Types

!!! note "Note"
    This is a standard note.

    It contains a second paragraph to test spacing.

!!! abstract "Abstract"
    This section provides a short summary of a fictional project.

    The project aims to build a small library management system.

!!! info "Information"
    The library is open from Monday to Friday.

    Visitors can borrow books, magazines, and digital resources.

!!! tip "Useful Tip"
    Save your work regularly.

    Use descriptive filenames to make your documents easier to find.

!!! success "Success"
    The application has been installed successfully.

    All automated checks have passed.

!!! question "Question"
    What is the difference between a website and a web application?

!!! warning "Warning"
    This operation may overwrite existing files.

    Make sure you have a backup before continuing.

!!! failure "Failure"
    The application could not connect to the database.

    Please check the connection settings.

!!! danger "Danger"
    Deleting the database will permanently remove all stored records.

    This action cannot be undone.

!!! bug "Bug"
    An unexpected error occurs when the user submits an empty form.

    The issue has been reported to the development team.

!!! example "Example"
    A small library contains three categories of books:

    - Fiction
    - Science
    - History

!!! quote "Quotation"
    Simplicity is the ultimate sophistication.

---

## 2. MkDocs Material Aliases

Each alias should produce the same visual style as its corresponding type.

!!! summary "Summary"
    Alias of `abstract`.

!!! tldr "TL;DR"
    Another alias of `abstract`.

!!! hint "Hint"
    Alias of `tip`.

!!! important "Important"
    Another alias of `tip`.

!!! check "Check"
    Alias of `success`.

!!! done "Done"
    Another alias of `success`.

!!! help "Help"
    Alias of `question`.

!!! faq "Frequently Asked Questions"
    Another alias of `question`.

!!! caution "Caution"
    Alias of `warning`.

!!! attention "Attention"
    Another alias of `warning`.

!!! fail "Fail"
    Alias of `failure`.

!!! missing "Missing"
    Another alias of `failure`.

!!! error "Error"
    Alias of `danger`.

!!! cite "Citation"
    Alias of `quote`.

---

## 3. Rich Markdown Content

### 3.1 Multiple Paragraphs

!!! info "Multiple Paragraphs"
    This is the first paragraph.

    This is the second paragraph.

    This is the third paragraph.

    This is the fourth paragraph.

    All four paragraphs must remain inside the same admonition.

### 3.2 Text Formatting

!!! warning "Formatted Text"
    This sentence contains **bold text**, *italic text*,
    ~~strikethrough text~~, and `inline code`.

    You can also combine **bold and *italic* formatting**.

    Here is a [link to Astro](https://astro.build).

### 3.3 Unordered Lists

!!! example "Shopping List"
    Ingredients for a simple breakfast:

    - Bread
    - Butter
    - Jam
    - Coffee
    - Orange juice

    This paragraph must remain inside the admonition after the list.

### 3.4 Ordered Lists

!!! tip "Installation Procedure"
    Follow these steps:

    1. Download the application.
    2. Extract the archive.
    3. Open the configuration file.
    4. Start the application.
    5. Verify that everything works.

    The procedure is now complete.

### 3.5 Nested Lists

!!! note "Nested Lists"
    The fictional company has several departments:

    - Administration
        - Human Resources
        - Accounting
    - Technology
        - Development
        - Technical Support
    - Marketing
        - Advertising
        - Communication

    All nested items should render correctly.

### 3.6 Code Blocks

!!! example "Bash Commands"
    The following commands display basic system information:

    ```bash
    echo "Hello, world!"
    pwd
    ls -la
    whoami
    ```

    This sentence must appear after the code block,
    but still inside the admonition.

### 3.7 Multiple Code Blocks

!!! info "Python and JSON"
    First, a Python example:

    ```python
    def greet(name):
        return f"Hello, {name}!"

    print(greet("Alice"))
    ```

    Next, a JSON example:

    ```json
    {
      "name": "Alice",
      "role": "developer",
      "active": true
    }
    ```

    Both code blocks belong to the same admonition.

---

## 4. Tables Inside Admonitions

### 4.1 Simple Table

!!! example "Product Catalog"
    The following table contains fictional products.

    | ID | Product | Category | Price |
    |---:|---------|----------|------:|
    | 1 | Notebook | Stationery | $4.50 |
    | 2 | Keyboard | Electronics | $29.90 |
    | 3 | Coffee Mug | Kitchen | $8.00 |
    | 4 | Desk Lamp | Furniture | $35.00 |

    **Expected result:** The entire table must remain inside the admonition.

    The paragraph after the table must also remain inside.

### 4.2 Table With Formatting

!!! info "Employee Directory"
    This table contains formatted Markdown cells.

    | Employee | Department | Status |
    |----------|------------|--------|
    | **Alice** | Development | **Active** |
    | *Bob* | Marketing | On leave |
    | Charlie | `IT-SUPPORT` | Active |
    | Diana | [Documentation](https://example.com) | Active |

    Text formatting and links must work inside table cells.

### 4.3 Table Followed by a List

!!! tip "Course Results"
    The following students completed their assignments.

    | Student | Assignment 1 | Assignment 2 |
    |---------|-------------:|-------------:|
    | Alice | 18 | 16 |
    | Bob | 14 | 17 |
    | Charlie | 12 | 15 |

    Observations:

    - Alice obtained the highest first score.
    - Bob improved on the second assignment.
    - All students completed both assignments.

    **Conclusion:** The table and the list belong to the same admonition.

---

## 5. Collapsible Admonitions

### 5.1 Closed by Default

??? info "Click to Expand"
    This block should initially be collapsed.

    It contains multiple paragraphs.

    It also contains a list:

    - First item
    - Second item
    - Third item

### 5.2 Open by Default

???+ warning "Initially Expanded"
    This block should initially be expanded.

    The user should be able to collapse it.

    **Important:** The content must remain accessible.

### 5.3 Collapsible Block With a Table

??? example "Show Product Details"
    This table should only be visible when the block is expanded.

    | Product | Quantity | Available |
    |---------|---------:|-----------|
    | Apples | 25 | Yes |
    | Oranges | 12 | Yes |
    | Bananas | 0 | No |

    This paragraph follows the table.

### 5.4 Collapsible Block With Code

???+ tip "Show Configuration"
    Example configuration:

    ```yaml
    application:
      name: demo
      version: 1.0
      debug: false
    ```

    The code block must remain properly formatted.

---

## 6. Nested Admonitions

### 6.1 Two Levels

!!! info "Parent Admonition"
    This paragraph belongs to the parent admonition.

    !!! warning "Child Admonition"
        This paragraph belongs to the nested warning.

        The child has its own title, icon, and background.

    This paragraph belongs to the parent again.

### 6.2 Three Levels

!!! note "Level One"
    Content at the first level.

    !!! tip "Level Two"
        Content at the second level.

        !!! success "Level Three"
            Content at the third level.

            **All three levels should remain visually distinct.**

        Back to the second level.

    Back to the first level.

### 6.3 Nested Admonition Containing a Table

!!! info "Company Overview"
    A fictional company manages several projects.

    The following warning contains a complete Markdown table.

    !!! warning "Project Status"
        Some projects require attention.

        | Project | Manager | Progress | Status |
        |---------|---------|---------:|--------|
        | Alpha | Alice | 100% | Complete |
        | Beta | Bob | 65% | In progress |
        | Gamma | Charlie | 20% | Delayed |

        **Analysis:**

        - Project Alpha is complete.
        - Project Beta is progressing normally.
        - Project Gamma requires additional resources.

        The table, analysis, and this paragraph must remain
        inside the nested warning.

    The parent admonition continues here.

    **Expected result:** The nested warning must not terminate
    the parent admonition.

### 6.4 Nested Collapsible Admonition

!!! example "Frequently Asked Questions"
    This parent admonition contains collapsible questions.

    ??? question "What is Markdown?"
        Markdown is a lightweight markup language.

        It is commonly used for technical documentation.

    ???+ question "What is Astro?"
        Astro is a web framework for building content-driven websites.

        This answer is initially expanded.

    End of the parent admonition.

---

## 7. Mixed Complex Content

!!! example "Complete Recipe"
    This example combines several Markdown features.

    **Recipe:** Simple Pancakes

    ### Ingredients

    | Ingredient | Quantity |
    |------------|----------|
    | Flour | 200 g |
    | Milk | 300 ml |
    | Eggs | 2 |
    | Sugar | 20 g |

    ### Instructions

    1. Mix the flour and sugar.
    2. Add the eggs.
    3. Slowly pour in the milk.
    4. Mix until smooth.
    5. Cook in a hot pan.

    !!! tip "Cooking Tip"
        Let the batter rest for 10 minutes.

        This can improve the texture of the pancakes.

    ### Example Data

    ```json
    {
      "recipe": "pancakes",
      "servings": 4,
      "preparation_minutes": 15,
      "vegetarian": true
    }
    ```

    **Enjoy your breakfast!**

---

## 8. Custom Titles and Special Cases

### 8.1 No Custom Title

!!! note
    This admonition uses the default title.

### 8.2 Explicitly Empty Title

!!! info ""
    This admonition has an explicitly empty custom title.

### 8.3 Long Title

!!! warning "This Is a Very Long Admonition Title Designed to Test Text Wrapping and Layout Behavior on Narrow Screens"
    The title should wrap without overflowing the container.

### 8.4 Special Characters

!!! tip "Symbols: ! ? & / ( ) [ ]"
    Special characters in titles should be displayed correctly.

### 8.5 Unicode Characters

!!! success "Unicode Test — Café, naïve, résumé, 日本語, 🚀"
    Unicode characters should be preserved.

    Accented characters: é è ê ë à ù ç ñ ö.

### 8.6 Inline Code in Content

!!! note "Inline Code"
    Use `npm install` to install dependencies.

    The configuration file is named `astro.config.mjs`.

    The value `true` is different from the string `"true"`.

---

## 9. Boundary Detection

### 9.1 Text After an Admonition

!!! info "Inside the Admonition"
    This paragraph belongs to the admonition.

    This second paragraph also belongs to the admonition.

This paragraph must be **OUTSIDE** the admonition.

!!! danger "Another Admonition"
    This is a completely separate admonition.

This paragraph must also remain **OUTSIDE**.

### 9.2 Consecutive Admonitions

!!! note "First"
    First admonition.

!!! tip "Second"
    Second admonition.

!!! success "Third"
    Third admonition.

!!! warning "Fourth"
    Fourth admonition.

There should be four distinct blocks.

### 9.3 Empty Lines

!!! example "Spacing Test"
    First paragraph.


    Second paragraph after additional empty lines.


    Third paragraph.

The layout should remain consistent.

---

## 10. Invalid Syntax and Non-Admonition Content

The following examples should not be converted into admonitions.

### 10.1 Unknown Type

!!! warnin,g "Invalid Type"
    This declaration contains an invalid type name.

    It should remain ordinary Markdown text.

### 10.2 Admonition Syntax Inside a Code Block

The following code block contains literal MkDocs syntax.

```markdown
!!! warning "Literal Example"
    This is only a code sample.

??? info "Another Literal Example"
    This is not a real collapsible admonition.
```

The plugin must not convert the content of this code block.

### 10.3 Similar-Looking Text

This is an ordinary paragraph containing `!!! note`.

The following text is also ordinary Markdown:

`??? warning "Example"`

Neither inline expression should create an admonition.

---

## 11. Final Compatibility Checklist

Use this checklist to validate the rendered page.

- [ ] All 12 admonition types render correctly.
- [ ] All 14 aliases use the correct styles.
- [ ] Custom titles are preserved.
- [ ] Default titles are displayed correctly.
- [ ] Empty titles do not break rendering.
- [ ] Multiple paragraphs remain inside their blocks.
- [ ] Bold, italic, links, and inline code work.
- [ ] Ordered and unordered lists render correctly.
- [ ] Code blocks preserve syntax highlighting.
- [ ] Tables remain inside admonitions.
- [ ] Collapsible blocks open and close correctly.
- [ ] Nested admonitions render correctly.
- [ ] Tables inside nested admonitions render correctly.
- [ ] Parent admonitions continue after nested blocks.
- [ ] Text following admonitions remains outside.
- [ ] Invalid declarations are not transformed.
- [ ] Literal admonition syntax inside code blocks is preserved.
- [ ] Layout remains usable on mobile screens.

---

## 12. End of Test

!!! success "Test Page Complete"
    You have reached the end of the demonstration.

    If all examples render correctly, the plugin supports
    the principal features demonstrated on this page.

    **Congratulations! 🎉**
