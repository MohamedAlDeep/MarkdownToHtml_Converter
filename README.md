# Markdown To Html Converte0

This is an API that converts a markdown file into HTML.

## Usage

### Prerequisites

- Node.js installed on your machine
- npm (Node Package Manager)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/MarkdownToHtmlConverter.git
    cd MarkdownToHtmlConverter
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

### Running the Server

Start the server by running:
```sh
node app.js
```

### Send a request 
The server will start on the `port` specified in the PORT environment variable or default to `30221`

API Endpoint
POST /convert
This endpoint accepts a markdown file and returns the converted HTML content.

- URL: /convert
- Method: POST
- Form Data:
  - `markdownFile`: The     markdown file to be converted (type: `file`)

### Example Request using curl

```sh
curl -X POST https://markdown-converter.aldeep.hackclub.app/convert -F "markdownFile=@example.md"
```

### Example Request using JavaScript fetch

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Markdown File</title>
</head>
<body>
    <form id="uploadForm">
        <input type="file" id="markdownFile" name="markdownFile" accept=".md">
        <button type="submit">Upload</button>
    </form>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async (event) => {
            event.preventDefault();

            const fileInput = document.getElementById('markdownFile');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select a file.');
                return;
            }

            const formData = new FormData();
            formData.append('markdownFile', file);

            try {
                const response = await fetch('/convert', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.text();
                alert(result);
            } catch (error) {
                console.error('Error:', error);
                alert('Error uploading file.');
            }
        });
    </script>
</body>
</html>
```

### Example Request using Postman

1. Open Postman.
2. Select `POST` from the dropdown menu.
3. Enter the URL: `http://localhost:30221/convert`.
4. Go to the `Body` tab.
5. Select `form-data`.
6. Add a key named `markdownFile` and set its type to File.
7. Choose a markdown file to upload.
8. Click `Send`.

