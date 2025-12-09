/* ====== CONFIG ====== */
const widthsVisa = [
  1,3,3,4,4,1,10,16,8,6,6,15,2,15,15,
  1,10,3,3,3,1,2,29,2,29,16,16,6,6,2,
  49,1
];

let visaData = [];

/* ====== EVENTO: SUBIR RDEBLIQC ====== */
document.getElementById("btnSepararVisa").onclick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('statusVisa').textContent = `Archivo: ${file.name}`;
    readVisaFile(file);
  };
  input.click();
};

function readVisaFile(file){
  const reader = new FileReader();
  reader.onload = () => processVisaText(reader.result);
  reader.readAsText(file, 'utf-8');
}

/* ====== PROCESAR TEXTO ====== */
function processVisaText(text){
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length <= 2) {
    document.getElementById('previewVisa').innerHTML = 'Archivo vacío o inválido';
    return;
  }

  // Eliminar cabecera y trailer
  const dataLines = lines.slice(1, -1);

  visaData = dataLines.map(line => {
    let pos = 0;
    return widthsVisa.map(w => {
      const part = line.slice(pos, pos + w);
      pos += w;
      return part.trim();
    });
  });

  showVisaPreview();
  document.getElementById('downloadVisaSep').style.display = 'inline-block';
}

/* ====== PREVIEW ====== */
function showVisaPreview(){
  const rows = visaData.slice(0,10);
  let html = '<table>';
  rows.forEach(r=>{
    html += '<tr>' + r.map(c=>`<td>${c}</td>`).join('') + '</tr>';
  });
  html += '</table>';
  document.getElementById('previewVisa').innerHTML = html;
}

/* ====== DESCARGAR XLSX ====== */
document.getElementById("downloadVisaSep").onclick = () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(visaData);
  XLSX.utils.book_append_sheet(wb, ws, 'Visa Separada');
  XLSX.writeFile(wb, 'Rendicion_Separada_Visa.xlsx');
};
