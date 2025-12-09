// ===== CONFIG MC =====
const widthsMaster = [1,3,3,4,4,1,10,16,8,6,6,15,2,15,15,1,10,3,3,3,1,2,29,2,29,16,16,6,6,2,49,1];
let processedData = [];

// ===== Botón Separar =====
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
  downloadSeparated();
}

// ===== Preview =====
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

// ===== Descargar XLSX =====
function downloadSeparated(){
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(processedData);
  XLSX.utils.book_append_sheet(wb, ws, 'Rendición MC');
  XLSX.writeFile(wb, 'Rendicion_Separada_MC.xlsx');
}
