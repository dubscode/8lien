export async function GET(request: Request) {
  return new Response('Hello world', {
    headers: {
      'content-type': 'text/plain'
    }
  });
}
