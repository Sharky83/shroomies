document.getElementById('generateBtn').addEventListener('click', generateQRCode);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

let qrData = "";

function generateQRCode() {
    // Clear any existing QR code
    document.getElementById('qrcode').innerHTML = "";

    // Example data
    let referrer = "referal_id";
    let order_no = "123456";
    let items = "Item Name";
    let qty = 10;
    let total = 100;
    let first_name = 'Fred';
    let last_name = 'Smith';
    let mobile = '9548588';
    let address = "123 Example St, City, Country";
    let usdt = "btc1245Tfdsegrgf4$$66fFDSFDc";
    let monero_address = "www33dmkndn2ncsnsjnjsn";
    let network = "erc20, tron"


    // Combine the data into a single JSON string
    qrData = JSON.stringify({referrer, order_no, items, qty, total, first_name, last_name, mobile, address, usdt, monero_address, network});

    // Generate the QR code
    new QRCode(document.getElementById('qrcode'), qrData);

    // Show the copy button
    document.getElementById('copyBtn').style.display = "block";
}

function copyToClipboard() {
    // Copy the QR code data to the clipboard
    navigator.clipboard.writeText(qrData).then(function() {
        alert("QR code information copied to clipboard!");
    }, function(err) {
        console.error("Could not copy text: ", err);
    });
}
