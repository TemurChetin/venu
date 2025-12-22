// src/types/global.d.ts
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// For side-effect global imports like `import './globals.css'`
declare module "*.css";
declare module "*.scss";
