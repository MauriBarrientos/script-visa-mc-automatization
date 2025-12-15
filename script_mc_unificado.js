// ===== CONFIG MC =====
const widthsMaster = [1,3,3,4,4,1,10,16,8,6,6,15,2,15,15,1,10,3,3,3,1,2,29,2,29,16,16,6,6,2,49,1];
let processedData = [];   // datos separados
let formattedData = [];   // datos formateados

// ===== Un solo botón para iniciar flujo =====
document.getElementById('btnSeparar').onclick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    readFile(file);
  };
  input.click();
};

// ===== Leer archivo TXT =====
function readFile(file){
  const reader = new FileReader();
  reader.onload = () => processText(reader.result);
  reader.readAsText(file,'utf-8');
}

// ===== Separación MC =====
function processText(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  const dataLines = lines.slice(1, -1);

  processedData = dataLines.map(line => {
    let pos = 0;
    return widthsMaster.map(w => {
      const p = line.slice(pos, pos + w);
      pos += w;
      return p.trim();
    });
  });

  showPreview(processedData);

  // Luego de separar → formatear automáticamente
  formatSeparatedData(processedData);
}

// ===== Vista previa =====
function showPreview(data) {
  const prev = document.getElementById('preview');
  const rows = data.slice(0, 10);
  let html = '<table><tbody>';
  rows.forEach(r=>{
    html += '<tr>' + r.map(c=>`<td>${c}</td>`).join('') + '</tr>';
  });
  html += '</tbody></table>';
  prev.innerHTML = html;
}

// ===== Formateo automático (equivalente a formateo_mc.js) =====
function formatSeparatedData(rows){

  const nroEstablecimiento = "0049508740";

  const encabezado = [
    "Número de Establecimiento","Número de Tarjeta","Cupón","Fecha Origen",
    "Importe","Número de Cuenta","Estado del Movimiento",
    "Rechazo Código 1","Descripción Código 1",
    "Rechazo Código 2","Descripción Código 2",
    "Fecha Presentación"
  ];

  formattedData = [encabezado];

  rows.forEach(r=>{
    if(!r || !r[7]) return;
    formattedData.push([
      nroEstablecimiento,
      r[7], r[8], r[9],
      parseInt(r[11]) / 100,
      r[16], r[20],
      r[21], (r[21] !== "00" ? r[22] : ""),
      r[23], r[24],
      r[27]
    ]);
  });

  downloadFinalMC();
}

// ===== Descargar archivo final como XLSX =====
function downloadFinalMC(){
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(formattedData);
  XLSX.utils.book_append_sheet(wb, ws, "Informe Final");

  XLSX.writeFile(wb, "Informe_Final_MC.xlsx");
}
 