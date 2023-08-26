import Path from 'path';

export function prettyFormat(object: Object) {
    return JSON.stringify(object, null, 2);
}

export function withBasePath(path: string) {
    const basePath = Path.resolve(__dirname + "/../../")
    if (path.at(0) === '/') return basePath + path;
    else return basePath + '/' + path;
}
