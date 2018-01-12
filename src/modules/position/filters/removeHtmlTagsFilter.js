export function removeHtmlTagsFilter() {
    return function(text) {
        var temp =   text ? String(text).replace(/<[^>]+>/gm, '') : '';
        return temp ? String(temp).replace(/&#65279;/g, '') : '';
      };
}