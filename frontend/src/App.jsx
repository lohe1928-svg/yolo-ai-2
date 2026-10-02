import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null);
  };

  const handleDetect = async () => {
    if (!file) {
      alert("Hãy chọn một ảnh trước!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Không kết nối được backend!");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>YOLO AI</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button onClick={handleDetect}>
        {loading ? "Đang xử lý..." : "Detect"}
      </button>

      {result && (
        <div>
          <h2>Kết quả:</h2>

          <img
            src={`data:image/jpeg;base64,${result.image}`}
            alt="YOLO detection"
            style={{ maxWidth: "800px", marginTop: "20px" }}
          />

          <h3>Vật thể phát hiện:</h3>

          {result.detections.length === 0 ? (
            <p>Không phát hiện vật thể.</p>
          ) : (
            result.detections.map((item, index) => (
              <p key={index}>
                {item.class} - {(item.confidence * 100).toFixed(1)}%
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
