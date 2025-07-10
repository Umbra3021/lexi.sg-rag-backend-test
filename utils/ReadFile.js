import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function readPdf(fp) {
    try {
        const data = fs.readFileSync(fp);
        const pdf = await pdfParse(data);
        return pdf.text;
    } catch (error) {
        console.log(error.message);
        return ' ';
    }

}

export async function readDoc(fp) {
    try {
        const data = await mammoth.extractRawText({ path: fp });
        return data.value;
    } catch (error) {
        console.log(error.message);
        return '';
    }
}

