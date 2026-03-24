import printJS from "print-js";

const getExportableColumns = (columns) =>
    columns.filter((column) => !column.disableExport && column.field !== "actions");

const getCellValue = (row, column) => {
    if (typeof column.exportValue === "function") {
        return column.exportValue(row);
    }

    const value = row?.[column.field];

    if (value === null || value === undefined) {
        return "";
    }

    if (Array.isArray(value)) {
        return value.join(", ");
    }

    return String(value);
};

const escapeHtml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const buildTableMarkup = ({ title, columns, rows }) => {
    const exportableColumns = getExportableColumns(columns);
    const headerRow = exportableColumns
        .map((column) => `<th>${escapeHtml(column.headerName || column.field)}</th>`)
        .join("");
    const bodyRows = rows
        .map((row) => {
            const cells = exportableColumns
                .map((column) => `<td>${escapeHtml(getCellValue(row, column))}</td>`)
                .join("");

            return `<tr>${cells}</tr>`;
        })
        .join("");

    return `
        <table>
            <caption>${escapeHtml(title)}</caption>
            <thead>
                <tr>${headerRow}</tr>
            </thead>
            <tbody>${bodyRows}</tbody>
        </table>
    `;
};

const buildDocumentMarkup = ({ title, columns, rows }) => `
    <html>
        <head>
            <meta charset="UTF-8" />
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 24px;
                    color: #1f2937;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                }
                caption {
                    caption-side: top;
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 16px;
                    text-align: left;
                }
                th, td {
                    border: 1px solid #d1d5db;
                    padding: 8px;
                    text-align: left;
                    font-size: 12px;
                }
                th {
                    background-color: #0f375a;
                    color: #ffffff;
                }
                tr:nth-child(even) {
                    background-color: #f8fafc;
                }
            </style>
        </head>
        <body>
            ${buildTableMarkup({ title, columns, rows })}
        </body>
    </html>
`;

const downloadFile = ({ content, fileName, type }) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
};

export const exportDataGridToExcel = ({ fileName, title, columns, rows }) => {
    const documentMarkup = buildDocumentMarkup({ title, columns, rows });

    downloadFile({
        content: `\ufeff${documentMarkup}`,
        fileName,
        type: "application/vnd.ms-excel;charset=utf-8;",
    });
};

export const exportDataGridToPdf = ({ documentTitle, title, columns, rows }) => {
    const documentMarkup = buildDocumentMarkup({ title, columns, rows });

    printJS({
        printable: documentMarkup,
        type: "raw-html",
        documentTitle,
    });
};
