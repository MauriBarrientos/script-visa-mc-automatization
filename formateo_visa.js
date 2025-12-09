// // 

// document.getElementById("btnVisaFmt").addEventListener("change", async function(e) {
//   const file = e.target.files[0];
//   if (!file) return;

//   const nroEstablecimiento = "0049508732";

//   const data = await file.arrayBuffer();
//   const wb = XLSX.read(data, { type: "array" });
//   const ws = wb.Sheets[wb.SheetNames[0]];
//   const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

//   // === ENCABEZADO FINAL ===
//   const encabezado = [
//     "Número de Establecimiento","Número de Tarjeta","Cupón","Fecha Origen",
//     "Importe","Número de Cuenta","Estado del Movimiento",
//     "Rechazo Código Motivo 1","Rechazo Descripción Motivo 1",
//     "Rechazo Código Motivo 2","Rechazo Descripción Motivo 2",
//     "Fecha Presentación (DDMMAA)"
//   ];

//   const salida = [encabezado];

//   for (let r of rows) {
//     // CLAVE REAL → tarjeta r[7]
//     if (!r || !r[7]) continue;

//     salida.push([
//       nroEstablecimiento,  // fijo
//       r[7] || "",          // tarjeta
//       r[8] || "",          // cupón
//       r[9] || "",          // fecha origen
//       (parseFloat(r[11]) / 100) || 0,   // importe
//       r[14] || "",         // número de cuenta
//       r[15] || "",         // estado movimiento
//       r[16] || "",         // cod motivo 1
//       (r[16] !== "00" ? (r[17] || "") : ""), // desc 1
//       r[18] || "",         // cod motivo 2
//       r[19] || "",         // desc 2
//       r[22] || ""          // fecha presentación
//     ]);
//   }

//   // === EXPORTAR XLS ===
//   const wbFinal = XLSX.utils.book_new();
//   const wsFinal = XLSX.utils.aoa_to_sheet(salida);

//   wsFinal["!cols"] = [
//     { wch: 22 }, { wch: 20 }, { wch: 10 }, { wch: 12 },
//     { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
//     { wch: 26 }, { wch: 14 }, { wch: 26 }, { wch: 16 }
//   ];

//   XLSX.utils.book_append_sheet(wbFinal, wsFinal, "Informe Final VISA");
//   XLSX.writeFile(wbFinal, "Informe_Final_VISA.xlsx");
// });


document.getElementById("btnFormatearVisa").onclick = () => {
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
  XLSX.writeFile(wbFinal, "Informe_Final_Visa.xlsx");
}
