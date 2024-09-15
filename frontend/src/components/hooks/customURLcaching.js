// interface CacheKeyWillBeUsedOptions {
//   request: Request;
//   mode: string; // mode could be 'read' or 'write', or other specific string values depending on usage
// }

export const ignoreUrlParametersMatchingPlugin = {
  // This hook is called whenever Workbox is about to use a URL as a cache key.
  cacheKeyWillBeUsed: async ({ request, mode }) => {
    // The URL we might modify to create a custom cache key.
    const url = new URL(request.url);

    // Example: Remove specific search parameters like '_rsc'.
    // You can extend this logic to ignore other parameters or modify the URL as needed.
    url.searchParams.delete("_rsc");

    // Return the modified URL as a string to be used as the cache key.
    return url.toString();
  },
};
