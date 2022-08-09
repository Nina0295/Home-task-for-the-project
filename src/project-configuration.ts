export type SourceFileItem = {
    file: string;
    content: string;
    entry?: boolean;
}

export type SourceFiles = {
    destination: string;
    bundleName: string;
    files: SourceFileItem[];
}
