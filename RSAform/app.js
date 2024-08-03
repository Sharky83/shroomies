// app.js

async function generateKey() {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(key, data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector

    return await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    ).then(encrypted => ({
        ciphertext: Array.from(new Uint8Array(encrypted)),
        iv: Array.from(iv),
    }));
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function displayQRCode(data) {
    QRCode.toDataURL(data, function (err, url) {
        if (err) {
            console.error('Error generating QR code:', err);
            return;
        }
        const qrCodeContainer = document.getElementById('qrCodeContainer');
        qrCodeContainer.innerHTML = `<img src="${url}" alt="QR Code">`;
        document.getElementById('copyButton').style.display = 'block';
    });
}

function copyToClipboard() {
    const qrCodeImage = document.querySelector('#qrCodeContainer img');
    const qrCodeDataUrl = qrCodeImage ? qrCodeImage.src : '';
    if (qrCodeDataUrl) {
        navigator.clipboard.writeText(qrCodeDataUrl).then(() => {
            alert('QR code data copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    } else {
        alert('No QR code to copy.');
    }
}

async function submitForm() {
    try {
        const form = document.getElementById('encryptionForm');
        const formData = new FormData(form);

        const name = formData.get('name');
        const address = formData.get('address');
        const mobile = formData.get('mobile');
        const age = formData.get('age');
        const numbers = formData.get('numbers').split(',').map(Number);

        if (numbers.length !== 5) {
            alert("Please enter exactly 5 numbers.");
            return;
        }

        // Generate AES key
        const key = await generateKey();

        // Encrypt personal information
        const encryptedName = await encryptData(key, name);
        const encryptedAddress = await encryptData(key, address);
        const encryptedMobile = await encryptData(key, mobile);
        const encryptedAge = await encryptData(key, age.toString());

        // Prepare data to be saved
        const data = {
            referrerId: numbers,
            encryptedInfo: {
                name: encryptedName,
                address: encryptedAddress,
                mobile: encryptedMobile,
                age: encryptedAge,
            }
        };

        // Generate JSON string
        const jsonData = JSON.stringify(data, null, 2);

        // Display QR code with the JSON data
        displayQRCode(jsonData);

        // Optionally, download as JSON file
        // downloadJSON(data, 'encrypted_data.json');
    } catch (error) {
        console.error('Error during form submission:', error);
    }
}
