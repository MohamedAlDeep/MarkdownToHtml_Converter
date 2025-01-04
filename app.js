const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 30221;

const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const readmePath = path.join(__dirname, 'uploads', 'readme.md');

    fs.readFile(readmePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading README.md file.');
        }

        const htmlContent = marked(data);
        const styledHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Markdown to HTML</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
                
                
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

                <!-- and it's easy to individually load additional languages -->
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js"></script>

                <script>hljs.highlightAll();</script>
                
                <style>
                    body {
                        box-sizing: border-box;
                        min-width: 200px;
                        max-width: 980px;
                        margin: 0 auto;
                        padding: 45px;
                    }
                </style>
            </head>
            <body>
                <article class="markdown-body">
                    ${htmlContent}
                </article>
            </body>
            </html>
        `;

        res.send(styledHtmlContent);
    });
});

app.post('/convert', upload.single('markdownFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, req.file.path);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file.');
        }

        const htmlContent = marked(data);
        const styledHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Markdown to HTML</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
                <style>
                    body {
                        box-sizing: border-box;
                        min-width: 200px;
                        max-width: 980px;
                        margin: 0 auto;
                        padding: 45px;
                    }
                </style>
            </head>
            <body>
                <article class="markdown-body">
                    ${htmlContent}
                </article>
            </body>
            </html>
        `;

        res.send(styledHtmlContent);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});