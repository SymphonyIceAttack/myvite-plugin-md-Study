import MarkdownIt from "markdown-it"
const md = new MarkdownIt();
export const transformMarkdown = (mdText: string): string => {
  // 加上一个 class 名为 article-content 的 wrapper，方便我们等下添加样式
  return `
    <section class='article-content'>
      ${md.render(mdText)}
    </section>
  `;
}
