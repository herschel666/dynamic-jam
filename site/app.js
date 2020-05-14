const NOT_FOUND = 'Not found.';

const CSS_LINK = 'text-green-200 hover:text-pink-400 focus:text-pink-400';

const CSS_HEADLINE = 'mb-12 font-bold text-4xl text-pink-400';

const getContentHome = () =>
  /* html */ `
<h1 class="${CSS_HEADLINE}">This is a dynamic Jamstack site.</h1>
<p class="mb-4">Just kidding. It's an HTML page delivered by Netlify Functions. 🤩</p>
<p>
  Visit the GitHub repo &quot;<a
    href="https://github.com/herschel666/dynamic-jam"
    class="font-mono ${CSS_LINK}">herschel666/dynamic-jam</a>&quot;
  to see how it works.
</p>
`.trim();

const jam = 'jam'
  .split('')
  .map((letter) =>
    /* html */ `
<a href="?letter=${letter}" class="${CSS_LINK}">${letter.toUpperCase()}</a>
`.trim()
  )
  .join(' &bull; ');

const getContentAbout = (letter) =>
  /* html */ `
<h1 class="${CSS_HEADLINE}">What is the ${jam}&nbsp;stack?</h1>
<p>${(() => {
    switch (letter) {
      case 'j':
        return 'The letter "J" is for JavaScript.';
      case 'a':
        return 'The letter "A" is for APIs.';
      case 'm':
        return 'The letter "M" is for Markup.';
      default:
        return 'Click on one of the letters above to learn more about the JAMStack.';
    }
  })()}</p>
`.trim();

const template = (content) =>
  /* html */ `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.4.6/tailwind.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <title>Dynamic Jamstack</title>
  </head>
  <body class="font-sans text-center text-2xl tracking-wide text-white bg-purple-900">
    <div class="w-100 max-w-2xl mx-auto p-8">
      <nav>
        <span class="nav">
          <a class="${CSS_LINK}" href="/">Home</a>
        </span>
        <span class="nav">
          <a class="${CSS_LINK}" href="/about/">About</a>
        </span>
        <span class="nav">
          <a class="${CSS_LINK}" href="/static/">Static</a>
        </span>
      <nav>
      <hr class="my-8" />
      <main>
      ${content}
      </main>
      <hr class="my-8" />
      <footer class="text-sm">
        &copy; ${new Date().getFullYear()} &bull;
        <a href="https://twitter.com/herschel_r" class="${CSS_LINK}">Emanuel Kluge</a>
      </footer>
    </div>
  </body>
</html>
`.trim();

exports.handler = async ({ path, httpMethod, queryStringParameters }) => {
  if (httpMethod !== 'GET') {
    return { statusCode: 403, body: 'Forbidden' };
  }

  const { letter } = queryStringParameters;
  const content = (() => {
    switch (true) {
      case !!path.match(/^\/(index.html)?$/):
        return getContentHome();
      case !!path.match(/^\/about\/?$/):
        return getContentAbout(letter);
      default:
        return NOT_FOUND;
    }
  })();
  const statusCode = content === NOT_FOUND ? 404 : 200;

  return {
    statusCode,
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
    body: template(content),
  };
};
