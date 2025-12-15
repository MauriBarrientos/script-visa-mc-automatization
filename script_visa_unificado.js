/* ===== CONFIG VISA ===== */
const widthsVisa = [
  1,3,3,4,4,1,10,16,8,6,6,15,2,15,15,
  1,10,3,3,3,1,2,29,2,29,16,16,6,6,2,
  49,1
];

let visaSeparated = [];
let visaFinal = [];

/* ===== BOTÓN ÚNICO VISA ===== */
document.getElementById("btnSepararVisa").onclick = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById("statusVisa").textContent =
      `Procesando: ${file.name}`;

    readVisaFile(file);
  };
  input.click();
};

/* ===== LEER TXT ===== */
function readVisaFile(file){
  const reader = new FileReader();
  reader.onload = () => separateVisa(reader.result);
  reader.readAsText(file, "utf-8");
}

/* ===== SEPARACIÓN ===== */
function separateVisa(text){
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
  if (lines.length <= 2) {
    document.getElementById("previewVisa").innerHTML =
      "Archivo inválido";
    return;
  }

  const dataLines = lines.slice(1, -1);

  visaSeparated = dataLines.map(line => {
    let pos = 0;
    return widthsVisa.map(w => {
      const part = line.slice(pos, pos + w);
      pos += w;
      return part.trim();
    });
  });

  showVisaPreview(visaSeparated);

  // 🔗 encadenado automático
  formatVisa(visaSeparated);
}

/* ===== PREVIEW ===== */
function showVisaPreview(data){
  const rows = data.slice(0, 10);
  let html = "<table>";
  rows.forEach(r => {
    html += "<tr>" + r.map(c => `<td>${c}</td>`).join("") + "</tr>";
  });
  html += "</table>";
  document.getElementById("previewVisa").innerHTML = html;
}

/* ===== FORMATEO (usa datos en memoria) ===== */
function formatVisa(rows){

  const nroEstablecimiento = "0049508740";

  const encabezado = [
    "Número de Establecimiento","Número de Tarjeta","Cupón","Fecha Origen",
    "Importe","Número de Cuenta","Estado del Movimiento",
    "Rechazo Código 1","Descripción Código 1",
    "Rechazo Código 2","Descripción Código 2",
    "Fecha Presentación"
  ];

  visaFinal = [encabezado];

  rows.forEach(r => {
    if (!r || !r[7]) return;

    visaFinal.push([
      nroEstablecimiento,
      r[7], r[8], r[9],
      parseInt(r[11]) / 100,
      r[16], r[20],
      r[21], (r[21] !== "00" ? r[22] : ""),
      r[23], r[24],
      r[27]
    ]);
  });

  downloadVisaFinal();
}

/* ===== DESCARGA FINAL ===== */
function downloadVisaFinal(){
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(visaFinal);
  XLSX.utils.book_append_sheet(wb, ws, "Informe Final VISA");

  XLSX.writeFile(wb, "Informe_Final_VISA.xlsx");
}
