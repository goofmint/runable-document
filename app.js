const baseHtml = `<!DOCTYPE html><html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title></title>
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="">
  <!-- %HEAD% -->
  <style>
  body {
    overflow: hidden;
  }
  </style>
  <script>
    window.onload = function() {
      let id;
      /* ID */
      const height = document.documentElement.scrollHeight;
      const body = document.querySelector('body').innerText.trim();
      console.log('height', height);
      parent.postMessage({height, id, body}, "*");
    }
  </script>
</head>
<body>
  <!-- %BODY% -->
  <!-- %SCRIPT% -->
</body>
</html>`;
let html;

$(() => {
  html = [baseHtml];
  $('button.exec').on('click', e => {
    e.preventDefault();
    const id = $(e.target).data('id');
    const dom = $(`code[data-id=${id}]`);
    const type = dom.data('type');
    const code = dom.text().trim();
    const head = code.match(/.*<link /);
    const lastHtml = html[html.length - 1].replace('/* ID */', `id = ${id};/* ID */`);
    if (type === 'html') {
      const str = head ? 'HEAD' : 'BODY';
      html.push(lastHtml.replace(`<!-- %${str}% -->`, `${code}<!-- %${str}% -->`));
    }
    if (type === 'script') {
      html.push(lastHtml.replace('<!-- %SCRIPT% -->', `<script>${code}</script><!-- %SCRIPT% -->`));
    }
    embedIframe(id, html[html.length - 1]);
  });
  $('button.remove').on('click', e => {
    html.pop();
  });
});

const embedIframe = (id, content, options = {}) => {
  const res = $(`.res[data-id=${id}]`);
  const iframe = $('<iframe />');
  iframe.attr('srcdoc', content);
  iframe.attr('sandbox', 'allow-downloads allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-popups-to-escape-sandbox');
  iframe.attr('width', 480);
  iframe.attr('height', options.height || 640);
  res.html(iframe);
}

window.addEventListener('message', function(e) {
  const {height, id, body} = e.data;
  if (body === '') {
    const res = $(`.res[data-id=${id}]`);
    res.empty();
    return embedIframe(id, '<p>実行完了しました</p>', {height: 60});
  }
  const iframe = $(`.res[data-id=${id}] iframe`);
  iframe.attr('height', height);
}, false);
