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
    res.send('Hello to this site check the documentation for more info <a href="/documentation">Documentation</a>');
})


app.get('/documentation', (req, res) => {
    const readmePath = path.join(__dirname, 'README.md');

    fs.readFile(readmePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading documentation.');
        }

        const htmlContent = marked(data);
        const styledHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Documentation - Markdown to HTML Converter</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
                <style>
                    body {
                        box-sizing: border-box;
                        min-width: 200px;
                        max-width: 980px;
                        margin: 0 auto;
                        padding: 45px;
                    }
                    .markdown-body {
                        background-color: white;
                        padding: 45px;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
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


app.get('/gui', (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown to HTML Converter</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .container {
                    background-color: #f6f8fa;
                    border-radius: 6px;
                    padding: 2rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .result {
                    margin-top: 2rem;
                    padding: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Markdown to HTML Converter</h1>
                <form id="uploadForm">
                    <div>
                        <label for="markdownFile">Select a Markdown file:</label>
                        <input type="file" id="markdownFile" name="markdownFile" accept=".md" required>
                    </div>
                    <button type="submit">Convert to HTML</button>
                </form>
                <div id="result" class="result"></div>
            </div>

            <script>
                document.getElementById('uploadForm').addEventListener('submit', async (event) => {
                    event.preventDefault();
                    
                    const fileInput = document.getElementById('markdownFile');
                    const resultDiv = document.getElementById('result');
                    
                    if (!fileInput.files[0]) {
                        alert('Please select a file');
                        return;
                    }

                    const formData = new FormData();
                    formData.append('markdownFile', fileInput.files[0]);

                    try {
                        const response = await fetch('/convert', {
                            method: 'POST',
                            body: formData
                        });

                        if (!response.ok) {
                            throw new Error('Conversion failed');
                        }

                        const result = await response.text();
                        resultDiv.style.display = 'block';
                        resultDiv.innerHTML = result;
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Error converting file: ' + error.message);
                    }
                });
            </script>
        </body>
        </html>
    `;
    res.send(html);
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
                    .download-button {
                        display: block;
                        margin: 20px auto;
                        padding: 10px 20px;
                        background-color: #2ea44f;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .download-button:hover {
                        background-color: #2c974b;
                    }
                </style>
            </head>
            <body>
                <article class="markdown-body">
                    ${htmlContent}
                </article>
                <button class="download-button" onclick="downloadHTML()">Download HTML</button>
                <script>
                    function downloadHTML() {
                        const htmlContent = document.documentElement.outerHTML;
                        const blob = new Blob([htmlContent], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'converted.html';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }
                </script>
            </body>
            </html>
        `;
        
        // Delete the file after reading
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
            }
        });

        res.send(styledHtmlContent);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});