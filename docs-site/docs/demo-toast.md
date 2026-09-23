---
title: "Demo — Toast"
description: "Prueba los toasts de FerNotify en tiempo real."
---

# Demo — Toast

Prueba todos los tipos de toasts directamente en tu navegador. Sin instalar nada.

<style>
  @keyframes fn-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  .fn-demo-section { margin-bottom: 2rem; }
  .fn-btn-group { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:.5rem; }
  .fn-btn {
    padding:.375rem .75rem; border-radius:.375rem; font-size:.875rem; font-weight:500;
    border:none; cursor:pointer; transition:opacity .15s;
  }
  .fn-btn:hover { opacity:.85; }
  .fn-btn:disabled { opacity:.5; cursor:not-allowed; }
  .fn-btn-outline {
    padding:.375rem .75rem; border-radius:.375rem; font-size:.875rem; font-weight:500;
    background:transparent; cursor:pointer; transition:background .15s;
    border: 1px solid currentColor;
  }
  .fn-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  @media(max-width:640px){ .fn-grid-2 { grid-template-columns:1fr; } }
  .fn-card {
    padding:1rem; border-radius:.5rem; border:1px solid #e2e8f0;
    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.06);
  }
  .fn-card-title { font-weight:600; font-size:.875rem; margin-bottom:.25rem; }
  .fn-card-desc  { font-size:.8125rem; color:#64748b; margin-bottom:.75rem; }
  .fn-card-actions { display:flex; gap:.5rem; margin-bottom:.75rem; }
  .fn-pre {
    background:#f8fafc; border:1px solid #e2e8f0; border-radius:.375rem;
    padding:.75rem; font-size:.75rem; white-space:pre-wrap; word-break:break-all;
    overflow:auto; max-height:120px; margin:0;
  }
  .fn-label { display:block; font-size:.8125rem; font-weight:500; margin-bottom:.75rem; }
  .fn-label span { display:block; margin-bottom:.25rem; color:#64748b; }
  .fn-input, .fn-select {
    width:100%; padding:.375rem .5rem; border-radius:.375rem; font-size:.8125rem;
    border:1px solid #cbd5e1; background:#fff; color:#0f172a;
    transition:border-color .15s; outline:none; box-sizing:border-box;
  }
  .fn-input:focus, .fn-select:focus { border-color:#6366f1; }
  .fn-pg-code {
    background:#f8fafc; border:1px solid #e2e8f0; border-radius:.375rem;
    padding:.75rem; font-size:.75rem; white-space:pre-wrap; word-break:break-all;
    overflow:auto; margin-top:.75rem;
  }
  [data-theme="dark"] .fn-card { background:#1e293b; border-color:#334155; }
  [data-theme="dark"] .fn-card-desc { color:#94a3b8; }
  [data-theme="dark"] .fn-pre { background:#0f172a; border-color:#334155; color:#e2e8f0; }
  [data-theme="dark"] .fn-input, [data-theme="dark"] .fn-select {
    background:#1e293b; border-color:#475569; color:#f1f5f9;
  }
  [data-theme="dark"] .fn-pg-code { background:#0f172a; border-color:#334155; color:#e2e8f0; }
  [data-theme="dark"] .fn-label span { color:#94a3b8; }
</style>

---

## Acceso rápido

<div class="fn-demo-section">
  <div class="fn-btn-group">
    <button class="fn-btn-outline" style="color:#16a34a;" onclick="notify.toastSuccess('Cambios guardados correctamente.','¡Guardado!')">Éxito</button>
    <button class="fn-btn-outline" style="color:#dc2626;" onclick="notify.toastError('No se pudo conectar al servidor.','Error')">Error</button>
    <button class="fn-btn-outline" style="color:#d97706;" onclick="notify.toastWarning('Tu sesión expirará pronto.','Advertencia')">Warning</button>
    <button class="fn-btn-outline" style="color:#0284c7;" onclick="notify.toastInfo('Hay una nueva actualización disponible.','Info')">Info</button>
    <button class="fn-btn-outline" style="color:#7c3aed;" onclick="notify.toastQuestion('Nueva solicitud pendiente.','Revisión')">Pregunta</button>
    <button class="fn-btn-outline" style="color:#4f46e5;" id="fn-btn-toast-loading">Loading → Éxito</button>
  </div>
</div>

---

## Ejemplos

<div id="fn-examples-toast" class="fn-grid-2"></div>

---

## Playground

<div class="fn-grid-2" style="margin-bottom:1rem;">
  <div>
    <label class="fn-label"><span>Tipo</span>
      <select id="fn-tpg-type" class="fn-select">
        <option value="success">success</option>
        <option value="error">error</option>
        <option value="warning">warning</option>
        <option value="info">info</option>
        <option value="question">question</option>
        <option value="loading">loading</option>
      </select>
    </label>
    <label class="fn-label"><span>Título</span>
      <input id="fn-tpg-title" class="fn-input" value="Título toast">
    </label>
    <label class="fn-label"><span>Mensaje</span>
      <input id="fn-tpg-message" class="fn-input" value="Mensaje de toast de ejemplo">
    </label>
    <label class="fn-label"><span>Duration (ms) — 0 sin auto-cierre</span>
      <input id="fn-tpg-duration" type="number" value="4000" class="fn-input">
    </label>
    <label class="fn-label"><span>ID (deduplicación)</span>
      <input id="fn-tpg-id" class="fn-input" placeholder="Vacío = sin deduplicar">
    </label>
  </div>
  <div>
    <label class="fn-label"><span>Posición</span>
      <select id="fn-tpg-position" class="fn-select">
        <option value="top-right">top-right</option>
        <option value="top-left">top-left</option>
        <option value="top-center">top-center</option>
        <option value="bottom-right">bottom-right</option>
        <option value="bottom-left">bottom-left</option>
      </select>
    </label>
    <label class="fn-label"><span>Barra de progreso</span>
      <select id="fn-tpg-showProgress" class="fn-select">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </label>
    <label class="fn-label"><span>Closeable (botón ×)</span>
      <select id="fn-tpg-closeable" class="fn-select">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </label>
    <label class="fn-label"><span>Swipe to dismiss</span>
      <select id="fn-tpg-swipe" class="fn-select">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </label>
  </div>
</div>
<div class="fn-btn-group">
  <button class="fn-btn" style="background:#7c3aed;color:#fff;" id="fn-tpg-run">Ejecutar Toast</button>
  <button class="fn-btn" style="background:#e2e8f0;color:#0f172a;" id="fn-tpg-copy">Copiar código</button>
</div>
<pre class="fn-pg-code" id="fn-tpg-code"><code></code></pre>

<template id="fn-example-template">
  <div class="fn-card">
    <div class="fn-card-title"></div>
    <div class="fn-card-desc"></div>
    <div class="fn-card-actions">
      <button class="fn-btn fn-copy-btn" style="background:#e2e8f0;color:#0f172a;">Copiar</button>
      <button class="fn-btn fn-run-btn"  style="background:#7c3aed;color:#fff;">Ejecutar</button>
    </div>
    <pre class="fn-pre"><code class="fn-code"></code></pre>
  </div>
</template>

<script>
(function () {
  function bootstrap(fn) {
    if (window.notify) { fn(); return; }
    var s = document.createElement('script');
    s.src = '/dist/notification-system.min.js';
    s.onload = fn;
    s.onerror = function () {
      var cdn = document.createElement('script');
      cdn.src = 'https://cdn.jsdelivr.net/npm/fernotify/dist/notification-system.min.js';
      cdn.onload = fn;
      document.head.appendChild(cdn);
    };
    document.head.appendChild(s);
  }

  bootstrap(function () {
    const examples = [
      { title:'Toast — Éxito', desc:'Auto-cierre en 4 s.', code:"notify.toastSuccess('Cambios guardados.','¡Guardado!');", run:(done)=>{ notify.toastSuccess('Cambios guardados correctamente.','¡Guardado!'); if(done)done(); } },
      { title:'Toast — Error', desc:'Con duración personalizada de 6 s.', code:"notify.toastError('Error de conexión.','Error',{duration:6000});", run:(done)=>{ notify.toastError('No se pudo conectar al servidor.','Error de red',{duration:6000}); if(done)done(); } },
      { title:'Toast — Acumular varios', desc:'3 toasts seguidos para ver el apilamiento.', code:"notify.toastSuccess('Archivo subido.');\nsetTimeout(()=>notify.toastInfo('Procesando...'),500);\nsetTimeout(()=>notify.toastWarning('Espacio casi agotado.'),1000);", run:(done)=>{ notify.toastSuccess('Archivo subido.'); setTimeout(()=>notify.toastInfo('Procesando...'),500); setTimeout(()=>{ notify.toastWarning('Espacio casi agotado.'); if(done)done(); },1000); } },
      { title:'Toast — Sin auto-cierre', desc:'Permanece hasta que el usuario lo cierra (duration:0).', code:"notify.toast({type:'info',title:'Persistente',message:'No se cierra sola.',duration:0});", run:(done)=>{ notify.toast({type:'info',title:'Persistente',message:'Esta notificación no se cierra sola.',duration:0}); if(done)done(); } },
      { title:'Toast — Pausa en hover', desc:'Pasa el mouse sobre el toast para detener el contador.', code:"notify.toastInfo('Pasa el mouse para pausar.','Hover',{duration:8000});", run:(done)=>{ notify.toastInfo('Pasa el mouse encima para pausar el timer.','Hover',{duration:8000}); if(done)done(); } },
      { title:'Toast — top-left', desc:'Posicionado en esquina superior izquierda.', code:"notify.toastQuestion('Nueva solicitud.','Revisión',{position:'top-left'});", run:(done)=>{ notify.toastQuestion('Nueva solicitud pendiente.','Revisión',{position:'top-left'}); if(done)done(); } },
      { title:'Toast — top-center', desc:'Centrado en la parte superior de la pantalla.', code:"notify.toastInfo('Actualización disponible.','Info',{position:'top-center'});", run:(done)=>{ notify.toastInfo('Actualización disponible.','Info',{position:'top-center'}); if(done)done(); } },
      { title:'Toast — Loading → Éxito (await)', desc:'Usa await para evitar solapamiento visual entre spinner y el siguiente toast.', code:"notify.toastLoading('Subiendo archivo...','Espera');\nsetTimeout(async()=>{\n  await notify.closeToastLoading();\n  notify.toastSuccess('Archivo subido.');\n},2500);", run:(done)=>{ notify.toastLoading('Subiendo archivo...','Espera'); setTimeout(async()=>{ await notify.closeToastLoading(); notify.toastSuccess('Archivo subido correctamente.'); if(done)done(); },2500); } },
      { title:'Toast — Replace ⚡', desc:'replaceToastLoading() sustituye el spinner al instante, sin animación de salida.', code:"notify.toastLoading('Subiendo...','Espera');\nsetTimeout(()=>{\n  notify.replaceToastLoading('Subido.',{type:'success'});\n},1500);", run:(done)=>{ notify.toastLoading('Subiendo archivo...','Espera',{position:'top-center'}); setTimeout(()=>{ notify.replaceToastLoading('Archivo subido correctamente.',{title:'Éxito',type:'success',showProgress:false,duration:0,position:'top-center'}); if(done)done(); },1500); } },
      { title:'Toast — Deduplicación por ID', desc:'Haz clic varias veces: solo existe un toast; su contador se resetea.', code:"notify.toastError('Email incorrecto.','Error',{\n  id:'login-error',\n  duration:4000\n});", run:(done)=>{ notify.toastError('Email o contraseña incorrectos.','Error',{id:'fn-login-error',duration:4000}); if(done)done(); } },
      { title:'onClick — navegar al hacer clic', desc:'Haz clic en el cuerpo del toast para ejecutar una acción. Se descarta automáticamente.', code:"notify.toast({\n  type: 'info',\n  title: 'Nuevo pedido',\n  message: 'Haz clic para ver el detalle →',\n  duration: 8000,\n  onClick: () => alert('Navegando a /pedidos/123')\n});", run:(done)=>{ notify.toast({type:'info',title:'Nuevo pedido',message:'Haz clic en el toast para ver el detalle →',duration:8000,onClick:()=>alert('Navegando a /pedidos/123'),onClosed:done}); } },
      { title:'onClick + closeOnClick:false', desc:'El clic ejecuta la acción pero el toast permanece visible.', code:"notify.toast({\n  type: 'info',\n  title: 'Copiar código',\n  message: 'Haz clic para copiar',\n  duration: 8000,\n  closeOnClick: false,\n  onClick: () => navigator.clipboard.writeText('4821')\n});", run:(done)=>{ notify.toast({type:'info',title:'Copiar código',message:'Haz clic para copiar "4821" al portapapeles',duration:8000,closeOnClick:false,onClick:()=>{ navigator.clipboard.writeText('4821').catch(()=>{}); notify.toastSuccess('Copiado al portapapeles'); },onClosed:done}); } },
      { title:'onClose — al iniciar el cierre', desc:'Se ejecuta en cuanto el toast empieza a cerrarse, sin importar la causa.', code:"notify.toast({\n  type: 'success',\n  message: 'Ciérrala de cualquier forma.',\n  onClose: () => notify.toastInfo('onClose ejecutado', 'Callback')\n});", run:(done)=>{ notify.toast({type:'success',title:'Notificación',message:'Ciérrala con la X, swipe o espera el timer.',onClose:()=>{ notify.toastInfo('onClose ejecutado','Callback'); },onClosed:done}); } },
      { title:'onClosed — al salir del DOM', desc:'Se ejecuta cuando el toast ya fue removido del DOM (tras la animación de salida).', code:"notify.toast({\n  type: 'warning',\n  message: 'Espera que desaparezca...',\n  onClosed: () => notify.toastInfo('onClosed — ya salió del DOM', 'Callback')\n});", run:(done)=>{ notify.toast({type:'warning',message:'Espera que desaparezca completamente...',onClosed:()=>{ notify.toastInfo('onClosed ejecutado — ya salió del DOM','Callback'); done && done(); }}); } },
    ];

    function renderExamples(containerId, list) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const template = document.getElementById('fn-example-template');
      container.innerHTML = '';
      list.forEach(ex => {
        const node = template.content.cloneNode(true);
        node.querySelector('.fn-card-title').textContent = ex.title;
        node.querySelector('.fn-card-desc').textContent  = ex.desc;
        node.querySelector('.fn-code').textContent = ex.code;
        const runBtn  = node.querySelector('.fn-run-btn');
        const copyBtn = node.querySelector('.fn-copy-btn');
        runBtn.addEventListener('click', () => {
          if (runBtn.disabled) return;
          const orig = runBtn.innerHTML;
          runBtn.disabled = true;
          runBtn.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' style='animation:fn-spin .8s linear infinite;vertical-align:middle;margin-right:4px'><path d='M21 12a9 9 0 1 1-6.219-8.56'/></svg>Running";
          let done = false;
          const finish = () => { if (done) return; done=true; runBtn.disabled=false; runBtn.innerHTML=orig; };
          try { const r = ex.run(finish); if (r && r.then) r.then(finish).catch(()=>finish()); } catch(e){ finish(); }
          setTimeout(finish, 9000);
        });
        copyBtn.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(ex.code); const o=copyBtn.innerHTML; copyBtn.innerHTML='Copiado ✓'; setTimeout(()=>copyBtn.innerHTML=o,1500); } catch(e){}
        });
        container.appendChild(node);
      });
    }

    function tpgCollect() {
      return {
        type: document.getElementById('fn-tpg-type').value,
        title: document.getElementById('fn-tpg-title').value,
        message: document.getElementById('fn-tpg-message').value,
        duration: Number(document.getElementById('fn-tpg-duration').value),
        position: document.getElementById('fn-tpg-position').value,
        showProgress: document.getElementById('fn-tpg-showProgress').value!=='false',
        id: document.getElementById('fn-tpg-id').value.trim()||undefined,
        closeable: document.getElementById('fn-tpg-closeable').value!=='false',
        swipeToDismiss: document.getElementById('fn-tpg-swipe').value!=='false'
      };
    }

    function tpgPreview() {
      const o = tpgCollect();
      if (o.type==='loading') {
        const t = o.title ? `, '${o.title.replace(/'/g,"\\'")}' ` : '';
        document.querySelector('#fn-tpg-code code').textContent =
          `notify.toastLoading('${o.message.replace(/'/g,"\\'")}')${t ? `\n// title: ${t}` : ''};\n// ... operación ...\nawait notify.closeToastLoading();`;
        return;
      }
      const lines = [`  type: '${o.type}',`];
      if(o.title) lines.push(`  title: '${o.title.replace(/'/g,"\\'")}',`);
      lines.push(`  message: '${o.message.replace(/'/g,"\\'")}',`);
      lines.push(`  duration: ${o.duration},`);
      lines.push(`  position: '${o.position}',`);
      if(!o.showProgress) lines.push(`  showProgress: false,`);
      if(o.id) lines.push(`  id: '${o.id.replace(/'/g,"\\'")}',`);
      if(!o.closeable) lines.push(`  closeable: false,`);
      if(!o.swipeToDismiss) lines.push(`  swipeToDismiss: false,`);
      document.querySelector('#fn-tpg-code code').textContent = `notify.toast({\n${lines.join('\n')}\n});`;
    }

    function init() {
      renderExamples('fn-examples-toast', examples);
      tpgPreview();

      document.getElementById('fn-btn-toast-loading').addEventListener('click', () => {
        notify.toastLoading('Procesando...','Espera');
        setTimeout(async()=>{ await notify.closeToastLoading(); notify.toastSuccess('Operación completada.'); }, 3000);
      });

      ['fn-tpg-type','fn-tpg-title','fn-tpg-message','fn-tpg-duration','fn-tpg-position','fn-tpg-showProgress','fn-tpg-id','fn-tpg-closeable','fn-tpg-swipe']
        .forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input',tpgPreview); });

      document.getElementById('fn-tpg-run').addEventListener('click', ()=>{
        const o = tpgCollect();
        if(o.type==='loading'){ notify.toastLoading(o.message,o.title||undefined); return; }
        notify.toast({type:o.type,title:o.title||undefined,message:o.message,duration:o.duration,position:o.position,showProgress:o.showProgress,id:o.id,closeable:o.closeable,swipeToDismiss:o.swipeToDismiss});
      });
      document.getElementById('fn-tpg-copy').addEventListener('click', async()=>{
        try{ const c=document.querySelector('#fn-tpg-code code').textContent; await navigator.clipboard.writeText(c); const b=document.getElementById('fn-tpg-copy'); const o=b.innerHTML; b.innerHTML='Copiado ✓'; setTimeout(()=>b.innerHTML=o,1400); }catch(e){}
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  });
})();
</script>
