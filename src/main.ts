import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const indexHtml = await Deno.readFile("../public/index.html");

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (pathname == "/") {
    return new Response(indexHtml, {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  } else {
    const filePath = "../public" + pathname;
    const content = await Deno.readFile(filePath);
    return new Response(content, {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }
}

serve(handleRequest, { port: 8088 });
