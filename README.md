# Personal Website

This is a personal website built with React, Vite, TypeScript, and Tailwind CSS. It features a Bento-style home page with interactive tiles.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd personal-website
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Development Server

To start the development server, run the following command:

```sh
npm run dev
```

This will start the Vite development server and open the website in your default browser at `http://localhost:5173`.

### Building for Production

To build the website for production, run the following command:

```sh
npm run build
```

This will create a `dist` directory with the optimized production build of the website.

## Adding New Tiles

To add a new tile to the Bento grid on the home page, you need to modify the `src/lib/tiles.ts` file.

1. Open `src/lib/tiles.ts`.
2. Add a new object to the `tiles` array with the following properties:
   - `id`: A unique number for the tile.
   - `title`: The title of the tile.
   - `description`: A short description of the tile.
   - `to`: The route to navigate to when the tile is clicked.
   - `staticSrc`: The path to the static preview image for the tile.
   - `gifSrc`: The path to the GIF to display on hover.
   - `colSpan`: The number of columns the tile should span on medium screens and larger.
   - `rowSpan`: The number of rows the tile should span on medium screens and larger.
   - `icon`: (Optional) An icon component from `lucide-react`.

### Example

```ts
{
  id: 6,
  title: 'New Tile',
  description: 'This is a new tile.',
  to: '/new-page',
  staticSrc: '/images/new-tile.png',
  gifSrc: '/gifs/new-tile.gif',
  colSpan: 3,
  rowSpan: 2,
},
```

3. Make sure to create a corresponding route in `src/routes/router.tsx` and a page component in `src/pages` for the new tile.
4. Add the new static image and GIF to the `src/assets/images` and `src/assets/gifs` directories, respectively.
