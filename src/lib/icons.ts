import { FaReact as React, FaNodeJs as NodeJs } from "react-icons/fa"
import { IoAccessibility as Accessibility } from "react-icons/io5"
import {
  SiTypescript as Typescript,
  SiRedux as Redux,
  SiReactrouter as ReactRouter,
  SiTailwindcss as TailwindCss,
  SiMui as MaterialUi,
  SiAxios as Axios,
  SiElectron as Electron,
  SiJavascript as Javascript,
  SiHtml5 as Html5,
  SiCss3 as Css3,
  SiGit as Git,
  SiGooglechrome as Chrome,
  SiJest as Jest,
  SiVite as Vite,
  SiWebpack as Webpack,
} from "react-icons/si"
import { VscTools as ReactDevTools } from "react-icons/vsc"
import {
  TbGauge as Performance,
  TbComponents as UiLibrary,
} from "react-icons/tb"
import { Grid2x2Check } from "lucide-react"

export const iconMap: Record<string, any> = {
  react: React,
  typescript: Typescript,
  redux: Redux,
  "react-router": ReactRouter,
  "tailwind-css": TailwindCss,
  "material-ui": MaterialUi,
  axios: Axios,
  electron: Electron,
  "ag-grid": Grid2x2Check,
  "react-devtools": ReactDevTools,
  performance: Performance,
  "ui-library": UiLibrary,
  nodejs: NodeJs,
  javascript: Javascript,
  html5: Html5,
  css3: Css3,
  accessibility: Accessibility,
  git: Git,
  chrome: Chrome,
  jest: Jest,
  vite: Vite,
  webpack: Webpack,
}
