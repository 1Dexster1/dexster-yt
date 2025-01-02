const express = require('express');
const ytdl = require('@distube/ytdl-core');
const youtubedl = require('youtube-dl-exec');

const app = express();



// الصفحة الرئيسية
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>YouTube Downloader</title>

        <style>

body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f9;
    margin: 0;
}
.container {
    text-align: center;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
input, button {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
}
button {
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
}
button:hover {
    background-color: #0056b3;


h2 {
      font-family: 'Amiri', serif;

}


.card-title {
  color: #262626;
  font-size: 1.5em;
  line-height: normal;
  font-weight: 700;
  margin-bottom: 0.5em;
}

.small-desc {
  font-size: 1em;
  font-weight: 400;
  line-height: 1.5em;
  color: #452c2c;
}

.small-desc {
  font-size: 1em;
}

.go-corner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 2em;
  height: 2em;
  overflow: hidden;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #6293c8, #384c6c);
  border-radius: 0 4px 0 32px;
}

.go-arrow {
  margin-top: -4px;
  margin-right: -4px;
  color: white;
  font-family: courier, sans;
}

.card {
  display: block;
  position: relative;
  max-width: 300px;
  max-height: 320px;
  background-color: #f2f8f9;
  border-radius: 10px;
  padding: 2em 1.2em;
  margin: 12px;
  text-decoration: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(to bottom, #c3e6ec, #a7d1d9);
  font-family: 'Amiri', serif;
}

.card:before {
  content: '';
  position: absolute;
  z-index: -1;
  top: -16px;
  right: -16px;
  background: linear-gradient(135deg, #364a60, #384c6c);
  height: 32px;
  width: 32px;
  border-radius: 32px;
  transform: scale(1);
  transform-origin: 50% 50%;
  transition: transform 0.35s ease-out;
}

.card:hover:before {
  transform: scale(28);
}

.card:hover .small-desc {
  transition: all 0.5s ease-out;
  color: rgba(255, 255, 255, 0.8);
}

.card:hover .card-title {
  transition: all 0.5s ease-out;
  color: #ffffff;
}




</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet">
        <script>
            function downloadContent(type) {
                const url = document.getElementById('url').value;
                if (!url) {
                    alert('Please enter a valid YouTube URL!');
                    return;
                }
                // إعادة التوجيه إلى التنزيل
                window.location.href = \`/download?url=\${encodeURIComponent(url)}&type=\${type}\`;
            }
        </script>
    </head>
    <body>
        <div class="container">
            <h2>Dexster-yt Downloader</h2>
            <form>
                <input type="url" id="url" name="url" placeholder="Enter YouTube Video URL" required>
                <button type="button" onclick="downloadContent('audio')">Download Audio</button>
                <button type="button" onclick="downloadContent('video')">Download Video</button>
            </form>
        </div>


     </body>

    </html>`;
    res.send(html);
});
app.get('/download', async (req, res) => {
    const encodedURL = req.query.url;
    const type = req.query.type;

    if (!encodedURL || !type || !['audio', 'video'].includes(type)) {
        return res.status(400).send(`
            <div style="text-align: center; padding: 20px;">
                <h1>Error: Invalid parameters</h1>
                <p>الرابط بايظ يخويا , روح لـ https://dexster-yt.pages.dev واعمل بحث عن الفيديو ودوس ع زرار الشير ووجرب تاني .</p>
                <a href="/" style="text-decoration: none; color: #007bff; font-weight: bold;">Go back to the home page</a>
            </div>
        `);
    }

    try {
        // فك الترميز
        const decodedURL = decodeURIComponent(encodedURL);
        console.log('Decoded URL:', decodedURL);

        // التعبير العادي للتحقق من الصيغة الجديدة
        const validURLPattern = /^https:\/\/dexster-yt\.pages\.dev\/\?video=https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)\?autoplay=1$/;

        // التحقق من صحة الرابط واستخراج VideoID
        const match = decodedURL.match(validURLPattern);
        if (!match) {
            console.log('URL does not match the expected format.');
            return res.status(400).send(`
                <div style="text-align: center; padding: 20px;">
                    <h1>Error: Invalid URL Format</h1>
                    <p>The URL does not match the expected format. Please provide a valid URL.</p>
                    <a href="/" style="text-decoration: none; color: #007bff; font-weight: bold;">Go back to the home page</a>
                </div>
            `);
        }

        const videoID = match[1]; // استخراج VideoID
        const youtubeURL = `https://www.youtube.com/watch?v=${videoID}`; // رابط التنزيل
        console.log('YouTube URL:', youtubeURL);

        // إعداد التنزيل
        if (type === 'audio') {
            res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
            const audioStream = ytdl(youtubeURL, { filter: 'audioonly', quality: 'highestaudio' });
            audioStream.pipe(res);
        } else if (type === 'video') {
            res.header('Content-Disposition', 'attachment; filename="video.mp4"');
            const videoStream = ytdl(youtubeURL, { filter: 'videoandaudio', quality: 'highest' });
            videoStream.pipe(res);
        }
    } catch (error) {
        console.error('Download Error:', error.message);
        res.status(500).send(`
            <div style="text-align: center; padding: 20px;">
                <h1>Error: Download Failed</h1>
                <p>There was an error processing the download. Please try again later.</p>
                <a href="/" style="text-decoration: none; color: #007bff; font-weight: bold;">Go back to the home page</a>
            </div>
        `);
    }
});

app.use(express.static(__dirname));

