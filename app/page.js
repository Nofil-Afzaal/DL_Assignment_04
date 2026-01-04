"use client";

import { useMemo, useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef(null);

  const [stage, setStage] = useState("landing"); // landing | try
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [action, setAction] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canPredict = useMemo(() => Boolean(image) && !loading, [image, loading]);

  const fileLabel = useMemo(() => {
    if (!image) return "No image selected";
    return `${image.name} • ${Math.max(1, Math.round(image.size / 1024))} KB`;
  }, [image]);

  const openFilePicker = () => {
    setError("");
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAction("");
    setCaption("");
    setError("");
  };

  const sendImage = async () => {
    if (!image) {
      setError("Please upload a test image first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Prediction failed.");
        setAction("");
        setCaption("");
        return;
      }

      setAction(data.action);
      setCaption(data.caption);
    } catch (error) {
      setError(
        "Backend not responding. Make sure the Flask server is running on http://127.0.0.1:5000."
      );
    }

    setLoading(false);
  };

  const startTryNow = () => {
    setStage("try");
    setError("");
  };

  return (
    <main className="appShell">
      <div className="bgGlow" aria-hidden="true" />
      <div className="bgGrid" aria-hidden="true" />

      <header className="topBar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandText">
            <div className="brandTitle">Action Caption</div>
            <div className="brandSub">Action recognition + captioning</div>
          </div>
        </div>

        <div className="topBarActions">
          <button
            className="btn btnSecondary"
            type="button"
            onClick={startTryNow}
          >
            Try Now
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="heroInner">
          <div className="heroBadgeRow">
            <span className="badge">Stanford40</span>
            <span className="badge badgeSoft">Image → Action → Caption</span>
          </div>

          <h1 className="heroTitle">Recognize actions, then caption them.</h1>

          <p className="heroBody">
            Use a single test image to predict the most likely action and get a
            clean caption generated from the predicted class.
          </p>

          <div className="heroActions">
            <button
              className="btn btnPrimary"
              type="button"
              onClick={startTryNow}
            >
              Try Now
            </button>
          </div>
        </div>
      </section>

      {stage === "try" && (
        <section className="panel">
          <div className="panelHeader">
            <div className="panelHeaderTop">
              <h2 className="panelTitle">Test Image</h2>

              <div className="steps" aria-label="Steps">
                <span className="step stepDone">Try Now</span>
                <span className={`step ${image ? "stepDone" : "stepActive"}`}>
                  Upload
                </span>
                <span className={`step ${action ? "stepDone" : ""}`}>
                  Result
                </span>
              </div>
            </div>

            <p className="panelSub">Test image → Predict → Action + caption</p>
          </div>

          <div className="panelBody">
            <input
              ref={fileInputRef}
              className="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="controlsRow">
              <button
                className="btn btnSecondary"
                type="button"
                onClick={openFilePicker}
                disabled={loading}
              >
                Test image
              </button>

              <button
                className="btn btnPrimary"
                type="button"
                onClick={sendImage}
                disabled={!canPredict}
              >
                {loading ? "Predicting..." : "Predict"}
              </button>

              <div className="filePill" title={image?.name || ""}>
                {fileLabel}
              </div>
            </div>

            {error && <div className="alert">{error}</div>}

            {preview && (
              <div className="previewGrid">
                <div className="previewCard">
                  <div className="previewLabel">Preview</div>
                  <img
                    src={preview}
                    className="previewImage"
                    alt="Uploaded test"
                  />
                </div>

                <div className="resultCard">
                  <div className="previewLabel">Result</div>
                  <div className="resultLine">
                    <span className="resultKey">Action</span>
                    <span className={`resultVal ${action ? "" : "resultEmpty"}`}>
                      {action || "Run prediction to see output"}
                    </span>
                  </div>
                  <div className="resultLine">
                    <span className="resultKey">Caption</span>
                    <span className={`resultVal ${caption ? "" : "resultEmpty"}`}>
                      {caption || "Caption will appear here"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="footer">
        <span className="footerText">
          Backend must be running on http://127.0.0.1:5000
        </span>
      </footer>
    </main>
  );
}
