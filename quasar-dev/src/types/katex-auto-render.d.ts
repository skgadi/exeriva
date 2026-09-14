declare module "katex/contrib/auto-render" {
  interface Delimiter {
    left: string;
    right: string;
    display: boolean;
  }

  interface AutoRenderOptions {
    delimiters?: Delimiter[];
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
    trust?: boolean | ((context: unknown) => boolean);
    strict?: boolean | string | ((errorCode: string, errorMsg: string) => void);
  }

  function renderMathInElement(
    element: HTMLElement,
    options?: AutoRenderOptions
  ): void;

  export default renderMathInElement;
}
