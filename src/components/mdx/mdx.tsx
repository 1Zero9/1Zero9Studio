import { MDXContent } from "@content-collections/mdx/react";

const components = {
  a: (props: React.ComponentProps<"a">) => (
    <a
      {...props}
      className="underline decoration-faint underline-offset-4 transition-colors hover:decoration-fg"
    />
  ),
};

export function Mdx({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}
