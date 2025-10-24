export default function TestLigatures() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Fira Code Ligatures Test</h1>

      <div className="prose prose-lg dark:prose-invert">
        <h2>Inline code test</h2>
        <p>
          Inline: <code>{`=> !== >= <= === && || -> <- ++ -- /* */ /** */ ?. ??`}</code>
        </p>

        <h2>Code block test</h2>
        <pre><code>{`// JavaScript ligatures test
const arrow = () => console.log('arrow');
const notEqual = (a !== b);
const strictEqual = (a === b);
const greaterEqual = (x >= 10);
const lessEqual = (x <= 100);
const logicalAnd = (true && false);
const logicalOr = (true || false);
const nullish = value ?? defaultValue;
const optional = obj?.property;

/* Multi-line comment */
/** JSDoc comment */

// More ligatures
x++ --y
a -> b
b <- a
<= >= != == === !==`}</code></pre>

        <h2>Without Fira Code (comparison)</h2>
        <pre style={{ fontFamily: 'Courier, monospace' }}><code>{`// Same code without Fira Code
const arrow = () => console.log('arrow');
const notEqual = (a !== b);
const strictEqual = (a === b);
=> !== >= <= === && ||`}</code></pre>
      </div>

      <div className="mt-8 rounded-lg bg-zinc-100 p-6 dark:bg-zinc-800">
        <h3 className="mb-4 text-xl font-bold">如何確認 ligatures 是否生效：</h3>
        <ol className="list-decimal space-y-2 pl-6">
          <li>比較上面兩個程式碼區塊</li>
          <li>第一個區塊（Fira Code）的符號應該連在一起形成美觀的圖示</li>
          <li>第二個區塊（Courier）的符號應該是分開的</li>
          <li>特別注意箭頭 <code>=&gt;</code>、不等於 <code>!==</code>、大於等於 <code>&gt;=</code></li>
        </ol>
      </div>
    </div>
  );
}
