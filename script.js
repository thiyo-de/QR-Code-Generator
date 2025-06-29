        let generateBtn = document.getElementById("generateBtn");

        window.addEventListener("DOMContentLoaded", getValue);

        function getValue() {
            let qrCodeCon = document.getElementById("qrContainer");
            qrCodeCon.innerHTML = ""; // Clear previous QR codes

            let savedValue = JSON.parse(localStorage.getItem("Value")) || [];
            console.log(savedValue);

            savedValue.forEach((item, index) => {
                // Create QR Card Container
                let cardDiv = document.createElement("div");
                cardDiv.className = "qrCard";

                // Create QR Code Image
                let imgTag = document.createElement("img");
                imgTag.src = item.base64;

                // Show User Input Text
                let namePara = document.createElement("p");
                namePara.innerText = item.name;

                // Create Action Buttons Container
                let sFlecDiv = document.createElement("div");
                sFlecDiv.id = "sFlec";

                // Create Delete Button
                let deleteBtn = document.createElement("button");
                deleteBtn.innerText = "Delete";
                deleteBtn.addEventListener("click", () => {
                    deleteQR(index);
                });

                // Create Download Button
                let downloadBtn = document.createElement("button");
                downloadBtn.innerText = "Download";
                downloadBtn.addEventListener("click", () => {
                    downloadQR(item.base64, item.name);
                });

                // Append Buttons
                sFlecDiv.append(deleteBtn, downloadBtn);

                // Append all to the Card
                cardDiv.append(imgTag, namePara, sFlecDiv);

                // Append Card to Container
                qrCodeCon.append(cardDiv);
            });
        }

        generateBtn.addEventListener("click", () => {
            let UserInput = document.getElementById("userInput").value;
            let UserInputValue = UserInput.trim();

            if (UserInputValue === "") {
                alert("Please Fill The Field");
            } else {
                let tempDiv = document.createElement("div"); // Temporary QR container
                new QRCode(tempDiv, {
                    text: UserInputValue,
                    width: 200,
                    height: 200
                });

                // Delay to ensure QR code is generated
                setTimeout(() => {
                    let canvas = tempDiv.querySelector("canvas");

                    if (canvas) {
                        let originalSize = canvas.width;
                        let padding = 25;

                        // Create new canvas with padding
                        let paddedCanvas = document.createElement('canvas');
                        let newSize = originalSize + padding * 2;
                        paddedCanvas.width = newSize;
                        paddedCanvas.height = newSize;

                        let ctx = paddedCanvas.getContext('2d');

                        // Fill background with white
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, newSize, newSize);

                        // Draw QR code centered with padding
                        ctx.drawImage(canvas, padding, padding);

                        // Convert to base64 image
                        let base64 = paddedCanvas.toDataURL("image/png");
                        console.log(base64);

                        // Save to localStorage
                        saveInput(UserInputValue, base64);

                        // Refresh display
                        getValue();
                    } else {
                        alert("QR code not generated yet.");
                    }
                }, 300);
            }
        });

        function saveInput(name, base64) {
            let storedData = JSON.parse(localStorage.getItem("Value")) || [];
            storedData.push({ name: name, base64: base64 });
            localStorage.setItem("Value", JSON.stringify(storedData));
        }

        function deleteQR(index) {
            let storedData = JSON.parse(localStorage.getItem("Value")) || [];
            storedData.splice(index, 1); // Remove the QR code
            localStorage.setItem("Value", JSON.stringify(storedData));
            getValue(); // Refresh display
        }

        function downloadQR(base64, name) {
            let link = document.createElement("a");
            link.href = base64;
            link.download = `${name}-QRCode.png`;
            link.click();
        }