from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
import yt_dlp

app = FastAPI()

@app.get("/download")
async def download_video(url: str = Query(..., description="YouTube video URL")):
    try:
        ydl_opts = {
            'outtmpl': 'downloads/%(title)s.%(ext)s',  # تحديد مكان حفظ الفيديو
            'format': 'best'  # تحميل أفضل جودة
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)  # تنزيل الفيديو
            filename = ydl.prepare_filename(info)  # الحصول على اسم الملف

        return FileResponse(filename, media_type='video/mp4', filename=filename)

    except Exception as e:
        return {"error": str(e)}
