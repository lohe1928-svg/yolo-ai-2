from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model
model = YOLO("yolo11n.pt")


@app.get("/")
def root():
    return {"message": "Backend is running!"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/detect")
async def detect_image(file: UploadFile = File(...)):
    # Đọc ảnh từ frontend
    contents = await file.read()

    # Chuyển dữ liệu thành ảnh
    image = Image.open(io.BytesIO(contents))

    # Chạy YOLO
    results = model(image)

    detections = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            detections.append({
                "class": result.names[class_id],
                "confidence": confidence
            })

    # Vẽ bounding box lên ảnh
    annotated_image = results[0].plot()

    # Chuyển ảnh sang JPEG
    annotated_pil = Image.fromarray(annotated_image)
    buffer = io.BytesIO()
    annotated_pil.save(buffer, format="JPEG")

    # Chuyển ảnh thành Base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return {
        "filename": file.filename,
        "detections": detections,
        "image": image_base64
    }
