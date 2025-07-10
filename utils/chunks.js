export function chuckText(txt, chunkSize) {
    const words = txt.split(/\s+/);
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
        const temp = words.slice(i, i + chunkSize).join(' ');
        chunks.push(temp);
    }

    return chunks;
}

