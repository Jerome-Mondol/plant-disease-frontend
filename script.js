async function detectDisease() {
    document.querySelector("#loading").style.display = "block"
    document.querySelector("#preview-box").style.display = "none"

    const input = document.getElementById("dropzone-file");
    const file = input.files[0];
    const resultEl = document.getElementById("result");
    const scoreEl = document.getElementById("score");
    const resultBox = document.getElementById("result-box");
    const resultImg = document.getElementById("result-image");

    // Hide result section
    resultBox.classList.add("hidden");
    resultImg.classList.add("hidden");
    resultEl.innerText = '';
    scoreEl.innerText = '';

    if (!file) {
      alert("📸 Please upload a leaf image to continue!");
      document.querySelector("#loading").style.display = "none"
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1];

      try {
        const response = await fetch("https://plant-disease-backend-1-hxbk.onrender.com/detect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
          throw new Error("❌ Server error or fetch failed.");
        }

        const result = await response.json();
        const prediction = result?.[0];

        if (prediction?.label && prediction?.score !== undefined) {
          resultEl.innerText = `🩺 Detected Disease: ${prediction.label}`;
          scoreEl.innerText = `💯 Confidence: ${Math.round(prediction.score * 100)}%`;

          resultImg.src = reader.result;
          resultImg.classList.remove("hidden");
          resultBox.classList.remove("hidden");
        } else {
          resultEl.innerText = "⚠️ Unable to detect disease.";
          resultBox.classList.remove("hidden");
        }

      } catch (err) {
        console.error("Detection Error:", err);
        resultEl.innerText = "🚨 An error occurred while detecting disease.";
        resultBox.classList.remove("hidden");
      }

      input.value = "";
      document.querySelector("#loading").style = "display: none;";
    };

    reader.readAsDataURL(file);
  }

  async function getSuggestions(diseaseName) {
    try {
      const response = await fetch("https://plant-disease-backend-1-hxbk.onrender.com/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diseaseName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Suggestions:", data.suggestions);

    } catch (error) {
      console.error("Suggestions Error:", error);
      alert("Failed to fetch suggestions. Please try again later.");
    }
  }


  function previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      let imageSrc = URL.createObjectURL(file);
      let imageHeading = document.getElementById("preview-heading");
      let imagePreview = document.getElementById("preview");
      let imageBox = document.getElementById("preview-box");
      imageBox.style.display = "block";
      imageHeading.innerText = "📸 Preview of your image:";
      imagePreview.style.display = "block";
      imagePreview.src = imageSrc;
    }
  }
