/* ==========================================================
   AGRO SUPER MOCKUP — APP.JS
   Datos hardcodeados para flujo visual de presentación
   ========================================================== */

/* ── DATOS HARDCODEADOS ────────────────────────────────── */

const RUTAS = [
  {
    id: 1,
    st: 'ST-A4F2X9',
    empresa: 'Planta Temuco',
    dir: 'Av. Alemania 4204, Temuco',
    hora: '08:30',
    patente: 'BBDX92',
    conductor: 'Juan Martínez',
    estado: 'pendiente',
  },
  {
    id: 2,
    st: 'ST-G7K1MN',
    empresa: 'Distribuidora Chillán',
    dir: 'Ruta 5 Sur km 312, Chillán',
    hora: '10:00',
    patente: 'RVHJ40',
    conductor: 'Juan Martínez',
    estado: 'pendiente',
  },
  {
    id: 3,
    st: 'ST-P3ZW88',
    empresa: 'Planta Quilicura',
    dir: 'Av. El Salto 4001, Quilicura',
    hora: '12:45',
    patente: 'LLKQ55',
    conductor: 'Juan Martínez',
    estado: 'completado',
  },
  {
    id: 4,
    st: 'ST-M9CR47',
    empresa: 'Frigorífico Coquimbo',
    dir: 'Calle Balmaceda 830, Coquimbo',
    hora: '14:20',
    patente: 'YRTV21',
    conductor: 'Juan Martínez',
    estado: 'pendiente',
  },
  {
    id: 5,
    st: 'ST-F5BJ02',
    empresa: 'Planta Maipú',
    dir: 'Av. Pajaritos 3001, Maipú',
    hora: '16:00',
    patente: 'ZXPM73',
    conductor: 'Juan Martínez',
    estado: 'pendiente',
  },
];

const VALIDACIONES = [
  { st: 'ST-P3ZW88', empresa: 'Planta Quilicura', hora: '12:52', ok: true },
  { st: 'ST-A4F2X9', empresa: 'Planta Temuco', hora: '09:05', ok: false },
  { st: 'ST-G7K1MN', empresa: 'Distribuidora Chillán', hora: '10:18', ok: true },
];

const STS_INICIALES = [
  { st: 'ST-A4F2X9', destino: 'Planta Temuco',         conductor: 'Juan Martínez',  patente: 'BBDX92', estado: 'pendiente' },
  { st: 'ST-G7K1MN', destino: 'Distribuidora Chillán', conductor: 'Juan Martínez',  patente: 'RVHJ40', estado: 'pendiente' },
  { st: 'ST-P3ZW88', destino: 'Planta Quilicura',      conductor: 'Juan Martínez',  patente: 'LLKQ55', estado: 'completado' },
  { st: 'ST-M9CR47', destino: 'Frigorífico Coquimbo',  conductor: 'Carlos Ríos',    patente: 'YRTV21', estado: 'pendiente' },
  { st: 'ST-F5BJ02', destino: 'Planta Maipú',          conductor: 'Pablo Soto',     patente: 'ZXPM73', estado: 'pendiente' },
  { st: 'ST-X2QA11', destino: 'Frigorífico Los Vilos', conductor: 'María González', patente: 'HGTR68', estado: 'completado' },
  { st: 'ST-B8WT59', destino: 'Distribuidora Norte',   conductor: 'Carlos Ríos',    patente: 'MNBV34', estado: 'completado' },
  { st: 'ST-C3DL74', destino: 'Planta San Bernardo',   conductor: 'Pablo Soto',     patente: 'OKJH12', estado: 'pendiente' },
];

/* Patentes válidas para timbrador */
const PATENTES_VALIDAS = RUTAS.map(r => r.patente);
const STS_VALIDAS      = RUTAS.map(r => r.st);

/* Estado gestor (mutable) */
let tablaSTs = [...STS_INICIALES];

/* ── NAVEGACIÓN ─────────────────────────────────────────── */

function navigate(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  window.scrollTo(0, 0);
}

/* ── RENDER LISTA RUTAS ─────────────────────────────────── */

function renderRutas() {
  const list = document.getElementById('route-list');
  list.innerHTML = RUTAS.map((r, i) => {
    const icon = r.estado === 'completado' ? '✅' : '🕒';
    return `
      <div class="route-item" onclick="verRutaDetalle(${i})">
        <div class="route-num">${i + 1}</div>
        <div class="route-info">
          <div class="route-empresa">${r.empresa}</div>
          <div class="route-dir">${r.dir}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <div class="route-hora">${r.hora}</div>
          <div class="route-status">${icon}</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ── VER DETALLE RUTA + QR ──────────────────────────────── */

let qrInstance = null;

function verRutaDetalle(idx) {
  const r = RUTAS[idx];
  document.getElementById('detalle-card').innerHTML = `
    <div class="detail-empresa">${r.empresa}</div>
    <div class="detail-dir">📍 ${r.dir}</div>
    <div class="detail-meta">
      <div class="detail-meta-item">
        <div class="label">Conductor</div>
        <div class="value">🚚 ${r.conductor}</div>
      </div>
      <div class="detail-meta-item">
        <div class="label">Hora est.</div>
        <div class="value">🕒 ${r.hora}</div>
      </div>
      <div class="detail-meta-item">
        <div class="label">Patente</div>
        <div class="value">🚗 ${r.patente}</div>
      </div>
    </div>

    <div class="st-block">
      <div class="st-label">Código ST</div>
      <div class="st-code">${r.st}</div>
    </div>

    <div class="qr-block">
      <div class="qr-label">Código QR para timbrador</div>
      <div id="qr-canvas"></div>
    </div>
  `;

  navigate('ruta-detalle');

  // Generar QR
  setTimeout(() => {
    const el = document.getElementById('qr-canvas');
    if (el) {
      el.innerHTML = '';
      new QRCode(el, {
        text: r.st + '|' + r.patente + '|' + r.empresa,
        width: 180,
        height: 180,
        colorDark: '#2a7d4f',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M,
      });
    }
  }, 100);
}

/* ── TABS TIMBRADOR ─────────────────────────────────────── */

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
  ocultarResultado();
}

/* ── SIMULAR ESCANEO QR ─────────────────────────────────── */

function simularScan() {
  const area = document.getElementById('qr-scan-area');
  area.style.background = '#e8f5ee';
  area.innerHTML = '<div style="font-size:48px">✅</div>';
  setTimeout(() => {
    mostrarResultado(true, 'ST-G7K1MN', 'Distribuidora Chillán', 'Patente: RVHJ40 · Conductor: Juan Martínez');
    // resetear área
    setTimeout(() => {
      area.style.background = '';
      area.innerHTML = `
        <span class="corner tl"></span><span class="corner tr"></span>
        <span class="corner bl"></span><span class="corner br"></span>
        <div class="scan-line"></div>
        <p class="scan-hint">Toca para simular escaneo</p>`;
    }, 2000);
  }, 800);
}

/* ── VALIDAR PATENTE ────────────────────────────────────── */

function validarPatente() {
  const val = document.getElementById('input-patente').value.trim().toUpperCase().replace(/\s/g, '');
  if (!val) return;
  if (PATENTES_VALIDAS.includes(val)) {
    const ruta = RUTAS.find(r => r.patente === val);
    mostrarResultado(true, ruta.st, ruta.empresa, 'Conductor: ' + ruta.conductor + ' · Patente: ' + ruta.patente);
  } else {
    mostrarResultado(false, val, '—', 'Patente no encontrada en el sistema');
  }
  document.getElementById('input-patente').value = '';
}

/* ── VALIDAR ST ─────────────────────────────────────────── */

function validarST() {
  const val = document.getElementById('input-st').value.trim().toUpperCase().replace(/\s/g, '');
  if (!val) return;
  const codigo = val.startsWith('ST-') ? val : 'ST-' + val;
  if (STS_VALIDAS.includes(codigo)) {
    const ruta = RUTAS.find(r => r.st === codigo);
    mostrarResultado(true, ruta.st, ruta.empresa, 'Conductor: ' + ruta.conductor + ' · Patente: ' + ruta.patente);
  } else {
    mostrarResultado(false, codigo, '—', 'ST no encontrada en el sistema');
  }
  document.getElementById('input-st').value = '';
}

/* ── RESULTADO TIMBRADOR ────────────────────────────────── */

function mostrarResultado(ok, st, empresa, detalle) {
  const el = document.getElementById('resultado-timbrador');
  el.className = 'resultado ' + (ok ? 'ok' : 'error');
  el.innerHTML = `
    <div class="resultado-icon">${ok ? '✅' : '❌'}</div>
    <div class="resultado-title">${ok ? 'Visita Registrada' : 'No Encontrado'}</div>
    <div class="resultado-sub">${st} · ${empresa}</div>
    <div class="resultado-sub" style="margin-top:4px;">${detalle}</div>
  `;
}

function ocultarResultado() {
  const el = document.getElementById('resultado-timbrador');
  el.className = 'resultado hidden';
  el.innerHTML = '';
}

/* ── HISTORIAL TIMBRADOR ────────────────────────────────── */

function renderHistorial() {
  const list = document.getElementById('historial-list');
  list.innerHTML = VALIDACIONES.map(v => `
    <div class="historial-item">
      <div class="historial-icon">${v.ok ? '✅' : '❌'}</div>
      <div class="historial-inf">
        <div class="historial-st">${v.st}</div>
        <div class="historial-det">${v.empresa}</div>
      </div>
      <div class="historial-hora">${v.hora}</div>
    </div>
  `).join('');
}

/* ── GESTOR: CREAR ST ───────────────────────────────────── */

function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'ST-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function crearST() {
  const empresa   = document.getElementById('g-empresa').value.trim();
  const dir       = document.getElementById('g-dir').value.trim();
  const conductor = document.getElementById('g-conductor').value;
  const patente   = document.getElementById('g-patente').value.trim().toUpperCase();

  if (!empresa || !conductor || !patente) {
    alert('Completa los campos: Empresa, Conductor y Patente.');
    return;
  }

  const nuevo = {
    st: generarCodigo(),
    destino: empresa + (dir ? ' · ' + dir : ''),
    conductor,
    patente,
    estado: 'pendiente',
  };

  tablaSTs.unshift(nuevo);
  renderTabla();
  actualizarStats();

  // Limpiar form
  ['g-empresa','g-dir','g-patente','g-fecha'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('g-conductor').value = '';
}

/* ── RENDER TABLA GESTOR ────────────────────────────────── */

function renderTabla() {
  const tbody = document.getElementById('tabla-sts');
  tbody.innerHTML = tablaSTs.map(s => `
    <tr>
      <td class="st-code-cell">${s.st}</td>
      <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${s.destino}">${s.destino}</td>
      <td>${s.conductor}</td>
      <td style="font-weight:600;letter-spacing:1px;">${s.patente}</td>
      <td><span class="pill ${s.estado === 'completado' ? 'pill-ok' : 'pill-pend'}">${s.estado === 'completado' ? '✓ Ok' : '⏳ Pend.'}</span></td>
    </tr>
  `).join('');
}

function actualizarStats() {
  const total = tablaSTs.length;
  const ok    = tablaSTs.filter(s => s.estado === 'completado').length;
  const pend  = total - ok;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-ok').textContent    = ok;
  document.getElementById('stat-pend').textContent  = pend;
}

/* ── TOGGLE FORM GESTOR ─────────────────────────────────── */

let formOpen = true;
function toggleForm() {
  const body = document.getElementById('form-crear-st');
  const icon = document.getElementById('form-toggle-icon');
  formOpen = !formOpen;
  body.style.display = formOpen ? '' : 'none';
  icon.textContent = formOpen ? '▾' : '▸';
}

/* ── TECLAS ENTER ───────────────────────────────────────── */

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const activePanel = document.querySelector('.tab-panel.active');
    if (!activePanel) return;
    if (activePanel.id === 'panel-patente') validarPatente();
    if (activePanel.id === 'panel-st')      validarST();
  }
});

/* ── INIT ───────────────────────────────────────────────── */

function init() {
  renderRutas();
  renderHistorial();
  renderTabla();
  actualizarStats();
}

document.addEventListener('DOMContentLoaded', init);
