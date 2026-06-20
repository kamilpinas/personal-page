# CAST

A personal portfolio site built around a single conceit: the page is a foundry, and scrolling it pours a sphere of liquid chrome through every stage of being cast into a finished object. Identity, experience, skills, and work all read as states of the same metal — molten, poured, cooling, struck — rather than as separate pages.

**[kamilpinas.dev](https://kamilpinas.dev)**

## The conceit

Most portfolio sites separate "who I am" from "what I've built" into distinct pages with distinct visual languages. CAST instead treats the whole site as one continuous physical process, told in six acts:

- **Hero** — a sphere of molten metal pours into shape and cools into a name.
- **Maker** *(about)* — the metal rises into a mercury silhouette, then drains away to reveal a portrait underneath, like the photo was born from the material.
- **Forge** *(experience)* — a stream of chrome pours down the page, blooming into a distinct shape at each career milestone as it reaches it.
- **Alloy** *(skills)* — a mercury ingot pools and reacts to the cursor, its surface read as a composition of separate metals.
- **Castings** *(projects)* — a horizontal gallery of finished work, with a literal casting rail tracking progress and marking each piece as it's struck.
- **Offering** *(contact)* — the metal coalesces one last time into a solid block, the finished object the whole process was building toward.

A small liquid-chrome orb persists in the corner once the intro settles — both a visual anchor back to the opening sphere and the door into an embedded AI assistant that can answer questions about the work on the page.

## How it's built

Every liquid surface on the page is a real-time raymarched signed-distance-field, not a video or a pre-baked animation. Each section owns a small WebGL2 canvas with its own shader, composed from a shared library of noise functions, SDF primitives, and a common chrome shading model — so every act looks like the same material, lit the same way, while each one defines its own geometry independently. Scroll position drives the shapes directly: GSAP's ScrollTrigger reads where the user is and writes into a small shared state object that every shader samples per frame, with Lenis smoothing the underlying scroll so the metal never feels like it's reacting to a raw wheel event.

The whole thing degrades deliberately rather than apologetically: a `prefers-reduced-motion`-respecting static path swaps every scroll-driven shape for its resting state and turns off the ambient animation, while staying visually coherent with the full experience rather than reading as a stripped-down fallback.

**Stack:** React, TypeScript, Vite, GSAP + ScrollTrigger, Lenis, raw WebGL2/GLSL.
