import { useRef } from "react";
import Barcode from "react-barcode";

function BarcodePrintButton({ item }) {
    const barcodeRef = useRef(null);

    const handlePrint = () => {
        const barcodeSvg = barcodeRef.current?.querySelector("svg");

        if (!barcodeSvg) {
            alert("Barcode could not be prepared for printing.");
            return;
        }

        const printWindow = window.open(
            "",
            "_blank",
            "width=500,height=500"
        );

        if (!printWindow) {
            alert("Please allow pop-ups to print the barcode.");
            return;
        }

        const productName =
            item.products?.name || "Unknown Product";

        const barcodeNumber = String(item.barcode);

        const escapedProductName = productName
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Print Barcode - ${escapedProductName}</title>

                    <style>
                        @page {
                            size: 50mm 30mm;
                            margin: 0;
                        }

                        html,
                        body {
                            margin: 0;
                            padding: 0;
                            width: 50mm;
                            height: 30mm;
                            background: white;
                        }

                        body {
                            font-family: Arial, sans-serif;
                        }

                        .label {
                            width: 50mm;
                            height: 30mm;
                            box-sizing: border-box;

                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;

                            padding: 2mm;
                            text-align: center;
                        }

                        .product-name {
                            max-width: 46mm;
                            margin-bottom: 1.5mm;

                            font-size: 11px;
                            font-weight: 700;

                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .barcode {
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            width: 46mm;
                        }

                        .barcode svg {
                            display: block;
                            max-width: 46mm;
                            height: auto;
                        }

                        .barcode-number {
                            margin-top: 1mm;

                            font-size: 9px;
                            font-weight: 600;
                            letter-spacing: 0.5px;
                        }
                    </style>
                </head>

                <body>
                    <div class="label">

                        <div class="product-name">
                            ${escapedProductName}
                        </div>

                        <div class="barcode">
                            ${barcodeSvg.outerHTML}
                        </div>

                        <div class="barcode-number">
                            ${barcodeNumber}
                        </div>

                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();

        printWindow.focus();

        setTimeout(() => {
            printWindow.print();

            setTimeout(() => {
                printWindow.close();
            }, 500);
        }, 500);
    };

    return (
        <>
            {/* Print Button */}
            <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
                Print
            </button>

            {/* Hidden React Barcode used for printing */}
            <div
                ref={barcodeRef}
                className="pointer-events-none absolute -left-[9999px] top-0"
                aria-hidden="true"
            >
                <Barcode
                    value={String(item.barcode)}
                    format="CODE128"
                    width={1.2}
                    height={45}
                    displayValue={true}
                    fontSize={12}
                    margin={0}
                />
            </div>
        </>
    );
}

export default BarcodePrintButton;