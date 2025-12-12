import { TFunction } from "i18next"

export type Skill = {
  id: string
  name: string
  category: string
  icon: string
  proficiency: number
  tags: string[]
  description: string
  highlights: string[]
  links: {
    label: string
    href: string
  }[]
}

export const getSkills = (t: TFunction): Array<Skill> => {
  return [
    // --- Core Programming (Existing + Refined) ---

    {
      id: "typescript",

      name: t("skillsPage.skills.typescript.name"),

      category: "core-programming",

      icon: "typescript",

      proficiency: 100,

      tags: ["types", "generics", "compiler", "type-safety"],

      description: t("skillsPage.skills.typescript.description"),

      highlights: [
        t("skillsPage.skills.typescript.highlights.0"),

        t("skillsPage.skills.typescript.highlights.1"),

        t("skillsPage.skills.typescript.highlights.2"),
      ],

      links: [
        {
          label: "TypeScript Docs",
          href: "https://www.typescriptlang.org/docs/",
        },
        {
          label: "TypeScript Deep Dive",
          href: "https://basarat.gitbook.io/typescript/",
        },
      ],
    },

    {
      id: "html5",
      name: t("skillsPage.skills.html5.name"),
      category: "core-programming",
      icon: "html5",
      proficiency: 55,
      tags: ["semantic-html", "accessibility", "aria", "web-components"],
      description: t("skillsPage.skills.html5.description"),
      highlights: [
        t("skillsPage.skills.html5.highlights.0"),
        t("skillsPage.skills.html5.highlights.1"),
        t("skillsPage.skills.html5.highlights.2"),
      ],
      links: [
        {
          label: "MDN HTML Reference",
          href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        },
        {
          label: "Web Accessibility Initiative",
          href: "https://www.w3.org/WAI/",
        },
      ],
    },
    {
      id: "css3",
      name: t("skillsPage.skills.css3.name"),
      category: "core-programming",
      icon: "css3",
      proficiency: 60,
      tags: ["responsive-design", "flexbox", "grid", "animations", "variables"],
      description: t("skillsPage.skills.css3.description"),
      highlights: [
        t("skillsPage.skills.css3.highlights.0"),
        t("skillsPage.skills.css3.highlights.1"),
        t("skillsPage.skills.css3.highlights.2"),
      ],
      links: [
        { label: "CSS-Tricks", href: "https://css-tricks.com/" },
        {
          label: "MDN CSS Reference",
          href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
        },
      ],
    },
    {
      id: "javascript",
      name: t("skillsPage.skills.javascript.name"),
      category: "core-programming",
      icon: "javascript",
      proficiency: 75,
      tags: ["es6", "async", "functional-programming", "modules"],
      description: t("skillsPage.skills.javascript.description"),
      highlights: [
        t("skillsPage.skills.javascript.highlights.0"),
        t("skillsPage.skills.javascript.highlights.1"),
        t("skillsPage.skills.javascript.highlights.2"),
      ],
      links: [
        {
          label: "MDN JavaScript",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        },
        { label: "JavaScript.info", href: "https://javascript.info/" },
      ],
    },
    {
      id: "performance-optimization",
      name: t("skillsPage.skills.performance-optimization.name"),
      category: "core-programming",
      icon: "performance",
      proficiency: 60,
      tags: ["lighthouse", "web-vitals", "bundle-analysis"],
      description: t("skillsPage.skills.performance-optimization.description"),
      highlights: [
        t("skillsPage.skills.performance-optimization.highlights.0"),
        t("skillsPage.skills.performance-optimization.highlights.1"),
        t("skillsPage.skills.performance-optimization.highlights.2"),
      ],
      links: [
        { label: "Web Vitals", href: "https://web.dev/vitals/" },
        {
          label: "Lighthouse",
          href: "https://developers.google.com/web/tools/lighthouse",
        },
      ],
    },
    {
      id: "web-security",
      name: t("skillsPage.skills.web-security.name"),
      category: "core-programming",
      icon: "security",
      proficiency: 20,
      tags: ["csp", "xss", "csrf", "jwt"],
      description: t("skillsPage.skills.web-security.description"),
      highlights: [
        t("skillsPage.skills.web-security.highlights.0"),
        t("skillsPage.skills.web-security.highlights.1"),
        t("skillsPage.skills.web-security.highlights.2"),
      ],
      links: [
        {
          label: "OWASP Top 10",
          href: "https://owasp.org/www-project-top-ten/",
        },
      ],
    },
    {
      id: "pwa",
      name: t("skillsPage.skills.pwa.name"),
      category: "core-programming",
      icon: "pwa",
      proficiency: 25,
      tags: ["service-workers", "offline", "installable"],
      description: t("skillsPage.skills.pwa.description"),
      highlights: [
        t("skillsPage.skills.pwa.highlights.0"),
        t("skillsPage.skills.pwa.highlights.1"),
        t("skillsPage.skills.pwa.highlights.2"),
      ],
      links: [
        { label: "Web.dev PWA", href: "https://web.dev/progressive-web-apps/" },
      ],
    },

    // --- Frontend Development ---
    {
      id: "react",
      name: t("skillsPage.skills.react.name"),
      category: "frontend-development",
      icon: "react",
      proficiency: 100,
      tags: ["hooks", "tsx", "a11y", "performance"],
      description: t("skillsPage.skills.react.description"),
      highlights: [
        t("skillsPage.skills.react.highlights.0"),
        t("skillsPage.skills.react.highlights.1"),
        t("skillsPage.skills.react.highlights.2"),
      ],
      links: [
        {
          label: "React Docs",
          href: "https://reactjs.org/docs/getting-started.html",
        },
        { label: "React Patterns", href: "https://reactpatterns.com/" },
      ],
    },
    {
      id: "redux-toolkit",
      name: t("skillsPage.skills.redux-toolkit.name"),
      category: "frontend-development",
      icon: "redux",
      proficiency: 80,
      tags: ["state-management", "flux", "middleware"],
      description: t("skillsPage.skills.redux-toolkit.description"),
      highlights: [
        t("skillsPage.skills.redux-toolkit.highlights.0"),
        t("skillsPage.skills.redux-toolkit.highlights.1"),
        t("skillsPage.skills.redux-toolkit.highlights.2"),
      ],
      links: [
        { label: "Redux Toolkit Docs", href: "https://redux-toolkit.js.org/" },
        {
          label: "Redux Essentials",
          href: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
        },
      ],
    },
    {
      id: "react-context",
      name: t("skillsPage.skills.react-context.name"),
      category: "frontend-development",
      icon: "react",
      proficiency: 80,
      tags: ["state-management", "dependency-injection"],
      description: t("skillsPage.skills.react-context.description"),
      highlights: [
        t("skillsPage.skills.react-context.highlights.0"),
        t("skillsPage.skills.react-context.highlights.1"),
        t("skillsPage.skills.react-context.highlights.2"),
      ],
      links: [
        {
          label: "React Context Docs",
          href: "https://reactjs.org/docs/context.html",
        },
      ],
    },
    {
      id: "axios",
      name: t("skillsPage.skills.axios.name"),
      category: "frontend-development",
      icon: "axios",
      proficiency: 70,
      tags: ["http-client", "api-integration"],
      description: t("skillsPage.skills.axios.description"),
      highlights: [
        t("skillsPage.skills.axios.highlights.0"),
        t("skillsPage.skills.axios.highlights.1"),
        t("skillsPage.skills.axios.highlights.2"),
      ],
      links: [
        { label: "Axios Docs", href: "https://axios-http.com/docs/intro" },
      ],
    },
    {
      id: "tailwind-css",
      name: t("skillsPage.skills.tailwind-css.name"),
      category: "frontend-development",
      icon: "tailwind-css",
      proficiency: 80,
      tags: ["utility-first", "css-framework", "jit"],
      description: t("skillsPage.skills.tailwind-css.description"),
      highlights: [
        t("skillsPage.skills.tailwind-css.highlights.0"),
        t("skillsPage.skills.tailwind-css.highlights.1"),
        t("skillsPage.skills.tailwind-css.highlights.2"),
      ],
      links: [
        { label: "Tailwind CSS Docs", href: "https://tailwindcss.com/docs" },
      ],
    },
    {
      id: "react-router",
      name: t("skillsPage.skills.react-router.name"),
      category: "frontend-development",
      icon: "react-router",
      proficiency: 30,
      tags: ["routing", "spa", "navigation"],
      description: t("skillsPage.skills.react-router.description"),
      highlights: [
        t("skillsPage.skills.react-router.highlights.0"),
        t("skillsPage.skills.react-router.highlights.1"),
        t("skillsPage.skills.react-router.highlights.2"),
      ],
      links: [{ label: "React Router Docs", href: "https://reactrouter.com/" }],
    },

    {
      id: "material-ui",
      name: t("skillsPage.skills.material-ui.name"),
      category: "frontend-development",
      icon: "material-ui",
      proficiency: 30,
      tags: ["component-library", "design-system", "theming"],
      description: t("skillsPage.skills.material-ui.description"),
      highlights: [
        t("skillsPage.skills.material-ui.highlights.0"),
        t("skillsPage.skills.material-ui.highlights.1"),
        t("skillsPage.skills.material-ui.highlights.2"),
      ],
      links: [{ label: "MUI Docs", href: "https://mui.com/" }],
    },

    {
      id: "styled-components",
      name: t("skillsPage.skills.styled-components.name"),
      category: "frontend-development",
      icon: "styled-components",
      proficiency: 25,
      tags: ["css-in-js", "theming", "scoped-css"],
      description: t("skillsPage.skills.styled-components.description"),
      highlights: [
        t("skillsPage.skills.styled-components.highlights.0"),
        t("skillsPage.skills.styled-components.highlights.1"),
        t("skillsPage.skills.styled-components.highlights.2"),
      ],
      links: [
        {
          label: "Styled Components Docs",
          href: "https://styled-components.com/",
        },
      ],
    },
    {
      id: "ag-grid",
      name: t("skillsPage.skills.ag-grid.name"),
      category: "frontend-development",
      icon: "ag-grid",
      proficiency: 70,
      tags: ["data-grid", "enterprise", "performance"],
      description: t("skillsPage.skills.ag-grid.description"),
      highlights: [
        t("skillsPage.skills.ag-grid.highlights.0"),
        t("skillsPage.skills.ag-grid.highlights.1"),
        t("skillsPage.skills.ag-grid.highlights.2"),
      ],
      links: [{ label: "Ag-Grid Docs", href: "https://www.ag-grid.com/" }],
    },

    {
      id: "recharts",
      name: t("skillsPage.skills.recharts.name"),
      category: "frontend-development",
      icon: "recharts",
      proficiency: 30,
      tags: ["data-visualization", "charts", "d3-wrapper"],
      description: t("skillsPage.skills.recharts.description"),
      highlights: [
        t("skillsPage.skills.recharts.highlights.0"),
        t("skillsPage.skills.recharts.highlights.1"),
        t("skillsPage.skills.recharts.highlights.2"),
      ],
      links: [{ label: "Recharts Docs", href: "https://recharts.org/en-US/" }],
    },
    {
      id: "react-hook-form",
      name: t("skillsPage.skills.react-hook-form.name"),
      category: "frontend-development",
      icon: "react-hook-form",
      proficiency: 20,
      tags: ["form-management", "performance", "uncontrolled"],
      description: t("skillsPage.skills.react-hook-form.description"),
      highlights: [
        t("skillsPage.skills.react-hook-form.highlights.0"),
        t("skillsPage.skills.react-hook-form.highlights.1"),
        t("skillsPage.skills.react-hook-form.highlights.2"),
      ],
      links: [
        { label: "React Hook Form Docs", href: "https://react-hook-form.com/" },
      ],
    },

    {
      id: "redux-saga",
      name: t("skillsPage.skills.redux-saga.name"),
      category: "frontend-development",
      icon: "redux-saga",
      proficiency: 55,
      tags: ["side-effects", "middleware", "functional"],
      description: t("skillsPage.skills.redux-saga.description"),
      highlights: [
        t("skillsPage.skills.redux-saga.highlights.0"),
        t("skillsPage.skills.redux-saga.highlights.1"),
        t("skillsPage.skills.redux-saga.highlights.2"),
      ],
      links: [{ label: "Redux Saga Docs", href: "https://redux-saga.js.org/" }],
    },

    {
      id: "d3",
      name: t("skillsPage.skills.d3.name"),
      category: "frontend-development",
      icon: "d3",
      proficiency: 50,
      tags: ["data-visualization", "svg", "manipulation"],
      description: t("skillsPage.skills.d3.description"),
      highlights: [
        t("skillsPage.skills.d3.highlights.0"),
        t("skillsPage.skills.d3.highlights.1"),
      ],
      links: [{ label: "D3 Docs", href: "https://d3js.org/" }],
    },
    {
      id: "emotion",
      name: t("skillsPage.skills.emotion.name"),
      category: "frontend-development",
      icon: "emotion",
      proficiency: 40,
      tags: ["css-in-js", "theming", "performance"],
      description: t("skillsPage.skills.emotion.description"),
      highlights: [
        t("skillsPage.skills.emotion.highlights.0"),
        t("skillsPage.skills.emotion.highlights.1"),
        t("skillsPage.skills.emotion.highlights.2"),
      ],
      links: [{ label: "Emotion Docs", href: "https://emotion.sh/" }],
    },

    // --- DevOps & Tools ---
    {
      id: "git",
      name: t("skillsPage.skills.git.name"),
      category: "devops-and-tools",
      icon: "git",
      proficiency: 70,
      tags: ["vcs", "collaboration", "github"],
      description: t("skillsPage.skills.git.description"),
      highlights: [
        t("skillsPage.skills.git.highlights.0"),
        t("skillsPage.skills.git.highlights.1"),
        t("skillsPage.skills.git.highlights.2"),
      ],
      links: [
        { label: "Git Documentation", href: "https://git-scm.com/doc" },
        {
          label: "GitHub Flow",
          href: "https://guides.github.com/introduction/flow/",
        },
      ],
    },
    {
      id: "chrome-devtools",
      name: t("skillsPage.skills.chrome-devtools.name"),
      category: "devops-and-tools",
      icon: "chrome",
      proficiency: 30,
      tags: ["debugging", "performance", "memory"],
      description: t("skillsPage.skills.chrome-devtools.description"),
      highlights: [
        t("skillsPage.skills.chrome-devtools.highlights.0"),
        t("skillsPage.skills.chrome-devtools.highlights.1"),
        t("skillsPage.skills.chrome-devtools.highlights.2"),
      ],
      links: [
        {
          label: "Chrome DevTools Docs",
          href: "https://developer.chrome.com/docs/devtools/",
        },
      ],
    },
    {
      id: "lodash",
      name: t("skillsPage.skills.lodash.name"),
      category: "devops-and-tools",
      icon: "lodash",
      proficiency: 50,
      tags: ["utility-library", "data-manipulation"],
      description: t("skillsPage.skills.lodash.description"),
      highlights: [
        t("skillsPage.skills.lodash.highlights.0"),
        t("skillsPage.skills.lodash.highlights.1"),
        t("skillsPage.skills.lodash.highlights.2"),
      ],
      links: [{ label: "Lodash Docs", href: "https://lodash.com/docs" }],
    },
    {
      id: "react-i18next",
      name: t("skillsPage.skills.react-i18next.name"),
      category: "devops-and-tools",
      icon: "i18n",
      proficiency: 30,
      tags: ["localization", "internationalization", "translation"],
      description: t("skillsPage.skills.react-i18next.description"),
      highlights: [
        t("skillsPage.skills.react-i18next.highlights.0"),
        t("skillsPage.skills.react-i18next.highlights.1"),
        t("skillsPage.skills.react-i18next.highlights.2"),
      ],
      links: [{ label: "i18next Docs", href: "https://www.i18next.com/" }],
    },
    {
      id: "jest",
      name: t("skillsPage.skills.jest.name"),
      category: "devops-and-tools",
      icon: "jest",
      proficiency: 20,
      tags: ["testing", "unit-testing", "integration"],
      description: t("skillsPage.skills.jest.description"),
      highlights: [
        t("skillsPage.skills.jest.highlights.0"),
        t("skillsPage.skills.jest.highlights.1"),
        t("skillsPage.skills.jest.highlights.2"),
      ],
      links: [
        { label: "Jest Docs", href: "https://jestjs.io/docs/getting-started" },
        {
          label: "React Testing Library",
          href: "https://testing-library.com/docs/react-testing-library/intro/",
        },
      ],
    },
    {
      id: "webpack",
      name: t("skillsPage.skills.webpack.name"),
      category: "devops-and-tools",
      icon: "webpack",
      proficiency: 45,
      tags: ["bundler", "optimization", "loaders"],
      description: t("skillsPage.skills.webpack.description"),
      highlights: [
        t("skillsPage.skills.webpack.highlights.0"),
        t("skillsPage.skills.webpack.highlights.1"),
        t("skillsPage.skills.webpack.highlights.2"),
      ],
      links: [{ label: "Webpack Docs", href: "https://webpack.js.org/" }],
    },
    {
      id: "vite",
      name: t("skillsPage.skills.vite.name"),
      category: "devops-and-tools",
      icon: "vite",
      proficiency: 25,
      tags: ["build-tool", "dev-server", "esbuild"],
      description: t("skillsPage.skills.vite.description"),
      highlights: [
        t("skillsPage.skills.vite.highlights.0"),
        t("skillsPage.skills.vite.highlights.1"),
        t("skillsPage.skills.vite.highlights.2"),
      ],
      links: [{ label: "Vite Docs", href: "https://vitejs.dev/" }],
    },
    {
      id: "electron",
      name: t("skillsPage.skills.electron.name"),
      category: "devops-and-tools",
      icon: "electron",
      proficiency: 45,
      tags: ["desktop-app", "cross-platform", "nodejs"],
      description: t("skillsPage.skills.electron.description"),
      highlights: [
        t("skillsPage.skills.electron.highlights.0"),
        t("skillsPage.skills.electron.highlights.1"),
        t("skillsPage.skills.electron.highlights.2"),
      ],
      links: [
        { label: "Electron Docs", href: "https://www.electronjs.org/docs" },
      ],
    },
    {
      id: "ci-cd",
      name: t("skillsPage.skills.ci-cd.name"),
      category: "devops-and-tools",
      icon: "ci-cd",
      proficiency: 55,
      tags: ["github-actions", "jenkins", "docker"],
      description: t("skillsPage.skills.ci-cd.description"),
      highlights: [
        t("skillsPage.skills.ci-cd.highlights.0"),
        t("skillsPage.skills.ci-cd.highlights.1"),
        t("skillsPage.skills.ci-cd.highlights.2"),
      ],
      links: [
        { label: "GitHub Actions", href: "https://docs.github.com/en/actions" },
      ],
    },
    {
      id: "monorepo",
      name: t("skillsPage.skills.monorepo.name"),
      category: "devops-and-tools",
      icon: "monorepo",
      proficiency: 30,
      tags: ["nx", "lerna", "turborepo"],
      description: t("skillsPage.skills.monorepo.description"),
      highlights: [
        t("skillsPage.skills.monorepo.highlights.0"),
        t("skillsPage.skills.monorepo.highlights.1"),
        t("skillsPage.skills.monorepo.highlights.2"),
      ],
      links: [{ label: "Nx Documentation", href: "https://nx.dev/" }],
    },
    {
      id: "docker",
      name: t("skillsPage.skills.docker.name"),
      category: "devops-and-tools",
      icon: "docker",
      proficiency: 50,
      tags: ["containerization", "dev-env", "deployment"],
      description: t("skillsPage.skills.docker.description"),
      highlights: [
        t("skillsPage.skills.docker.highlights.0"),
        t("skillsPage.skills.docker.highlights.1"),
        t("skillsPage.skills.docker.highlights.2"),
      ],
      links: [{ label: "Docker Docs", href: "https://docs.docker.com/" }],
    },

    {
      id: "dayjs",
      name: t("skillsPage.skills.dayjs.name"),
      category: "devops-and-tools",
      icon: "dayjs", // ⚠️ Make sure you add 'dayjs' to your iconMap
      proficiency: 10,
      tags: ["date-time", "lightweight", "immutable", "plugin-system"],
      description: t("skillsPage.skills.dayjs.description"),
      highlights: [
        t("skillsPage.skills.dayjs.highlights.0"),
        t("skillsPage.skills.dayjs.highlights.1"),
        t("skillsPage.skills.dayjs.highlights.2"),
      ],
      links: [
        { label: "Day.js Docs", href: "https://day.js.org/" },
        {
          label: "Plugins List",
          href: "https://day.js.org/docs/en/plugin/plugin",
        },
      ],
    },
    {
      id: "date-fns",
      name: t("skillsPage.skills.date-fns.name"),
      category: "devops-and-tools",
      icon: "date-fns",
      proficiency: 10,
      tags: ["functional", "tree-shakable", "immutable", "typescript"],
      description: t("skillsPage.skills.date-fns.description"),
      highlights: [
        t("skillsPage.skills.date-fns.highlights.0"),
        t("skillsPage.skills.date-fns.highlights.1"),
        t("skillsPage.skills.date-fns.highlights.2"),
      ],
      links: [
        { label: "date-fns Docs", href: "https://date-fns.org/" },
        {
          label: "FP Guide",
          href: "https://date-fns.org/v2.30.0/docs/FP-Guide",
        },
      ],
    },
    {
      id: "moment-js",
      name: t("skillsPage.skills.moment-js.name"),
      category: "devops-and-tools",
      icon: "moment-js", // ⚠️ Add 'moment-js' to iconMap if needed
      proficiency: 15,
      tags: ["legacy", "migration", "deprecated", "large-bundle"],
      description: t("skillsPage.skills.moment-js.description"),
      highlights: [
        t("skillsPage.skills.moment-js.highlights.0"),
        t("skillsPage.skills.moment-js.highlights.1"),
        t("skillsPage.skills.moment-js.highlights.2"),
      ],
      links: [
        {
          label: "Moment.js Project Status",
          href: "https://momentjs.com/docs/#/-project-status/",
        },
        {
          label: "Migration Guide",
          href: "https://github.com/you-dont-need/You-Dont-Need-Momentjs",
        },
      ],
    },
    {
      id: "immer",
      name: t("skillsPage.skills.immer.name"),
      category: "devops-and-tools",
      icon: "immer",
      proficiency: 10,
      tags: ["immutability", "state-updates", "drafts"],
      description: t("skillsPage.skills.immer.description"),
      highlights: [
        t("skillsPage.skills.immer.highlights.0"),
        t("skillsPage.skills.immer.highlights.1"),
        t("skillsPage.skills.immer.highlights.2"),
      ],
      links: [
        { label: "Immer Docs", href: "https://immerjs.github.io/immer/" },
      ],
    },
    {
      id: "zod",
      name: t("skillsPage.skills.zod.name"),
      category: "devops-and-tools",
      icon: "zod",
      proficiency: 10,
      tags: ["schema-validation", "runtime-validation", "typesafety"],
      description: t("skillsPage.skills.zod.description"),
      highlights: [
        t("skillsPage.skills.zod.highlights.0"),
        t("skillsPage.skills.zod.highlights.1"),
        t("skillsPage.skills.zod.highlights.2"),
      ],
      links: [{ label: "Zod Docs", href: "https://zod.dev/" }],
    },

    {
      id: "ui-library-maintenance",
      name: t("skillsPage.skills.ui-library-maintenance.name"),
      category: "devops-and-tools",
      icon: "ui-library",
      proficiency: 50,
      tags: ["design-system", "storybook", "documentation"],
      description: t("skillsPage.skills.ui-library-maintenance.description"),
      highlights: [
        t("skillsPage.skills.ui-library-maintenance.highlights.0"),
        t("skillsPage.skills.ui-library-maintenance.highlights.1"),
        t("skillsPage.skills.ui-library-maintenance.highlights.2"),
      ],
      links: [
        { label: "Storybook", href: "https://storybook.js.org/" },
        {
          label: "Design Systems Handbook",
          href: "https://www.designbetter.co/design-systems-handbook",
        },
      ],
    },
    {
      id: "accessibility",
      name: t("skillsPage.skills.accessibility.name"),
      category: "devops-and-tools",
      icon: "accessibility",
      proficiency: 15,
      tags: ["wcag", "aria", "screen-readers"],
      description: t("skillsPage.skills.accessibility.description"),
      highlights: [
        t("skillsPage.skills.accessibility.highlights.0"),
        t("skillsPage.skills.accessibility.highlights.1"),
        t("skillsPage.skills.accessibility.highlights.2"),
      ],
      links: [
        { label: "WebAIM", href: "https://webaim.org/" },
        { label: "A11y Project", href: "https://www.a11yproject.com/" },
      ],
    },
    {
      id: "story-book",
      name: t("skillsPage.skills.story-book.name"),
      category: "devops-and-tools",
      icon: "storybook",
      proficiency: 25,
      tags: ["documentation", "ui-testing", "components"],
      description: t("skillsPage.skills.story-book.description"),
      highlights: [
        t("skillsPage.skills.story-book.highlights.0"),
        t("skillsPage.skills.story-book.highlights.1"),
        t("skillsPage.skills.story-book.highlights.2"),
      ],
      links: [{ label: "Storybook Docs", href: "https://storybook.js.org/" }],
    },
  ]
}
