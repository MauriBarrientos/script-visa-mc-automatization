document.getElementById("btnFormatear").onclick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx';
  input.onchange = e => formatFile(e.target.files[0]);
  input.click();
};

async function formatFile(file){
  if(!file) return;

  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

  const nroEstablecimiento = "0049508740";

  const encabezado = [
    "Número de Establecimiento","Número de Tarjeta","Cupón","Fecha Origen",
    "Importe","Número de Cuenta","Estado del Movimiento",
    "Rechazo Código 1","Descripción Código 1",
    "Rechazo Código 2","Descripción Código 2",
    "Fecha Presentación"
  ];

  const salida = [encabezado];

  rows.forEach(r=>{
    if(!r || !r[7]) return;
    salida.push([
      nroEstablecimiento,
      r[7], r[8], r[9],
      parseInt(r[11]) / 100,
      r[16], r[20],
      r[21], (r[21] !== "00" ? r[22] : ""),
      r[23], r[24],
      r[27]
    ]);
  });

  const wbFinal = XLSX.utils.book_new();
  const wsFinal = XLSX.utils.aoa_to_sheet(salida);
  XLSX.utils.book_append_sheet(wbFinal, wsFinal, "Informe Final");
  XLSX.writeFile(wbFinal, "Informe_Final_MC.xlsx");
}
