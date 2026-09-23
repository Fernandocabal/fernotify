---
title: "Demo — Modales"
description: "Prueba los modales de FerNotify en tiempo real."
---

# Demo — Modales

Prueba todos los tipos de modales directamente en tu navegador. Sin instalar nada.

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
  .fn-input, .fn-select, .fn-textarea {
    width:100%; padding:.375rem .5rem; border-radius:.375rem; font-size:.8125rem;
    border:1px solid #cbd5e1; background:#fff; color:#0f172a;
    transition:border-color .15s; outline:none; box-sizing:border-box;
  }
  .fn-input:focus, .fn-select:focus, .fn-textarea:focus { border-color:#6366f1; }
  .fn-pg-code {
    background:#f8fafc; border:1px solid #e2e8f0; border-radius:.375rem;
    padding:.75rem; font-size:.75rem; white-space:pre-wrap; word-break:break-all;
    overflow:auto; margin-top:.75rem;
  }
  [data-theme="dark"] .fn-card { background:#1e293b; border-color:#334155; }
  [data-theme="dark"] .fn-card-desc { color:#94a3b8; }
  [data-theme="dark"] .fn-pre { background:#0f172a; border-color:#334155; color:#e2e8f0; }
  [data-theme="dark"] .fn-input, [data-theme="dark"] .fn-select, [data-theme="dark"] .fn-textarea {
    background:#1e293b; border-color:#475569; color:#f1f5f9;
  }
  [data-theme="dark"] .fn-pg-code { background:#0f172a; border-color:#334155; color:#e2e8f0; }
  [data-theme="dark"] .fn-label span { color:#94a3b8; }
</style>

---

## Acceso rápido

<div class="fn-demo-section">
  <div class="fn-btn-group">
    <button class="fn-btn" style="background:#22c55e;color:#fff;" onclick="notify.success('Operación completada exitosamente.','¡Éxito!')">Éxito</button>
    <button class="fn-btn" style="background:#ef4444;color:#fff;" onclick="notify.error('Ha ocurrido un error inesperado.','Error')">Error</button>
    <button class="fn-btn" style="background:#f59e0b;color:#fff;" onclick="notify.warning('Revisa los datos antes de continuar.','Advertencia')">Warning</button>
    <button class="fn-btn" style="background:#0ea5e9;color:#fff;" onclick="notify.info('Esta es una notificación informativa.','Información')">Info</button>
    <button class="fn-btn" style="background:#8b5cf6;color:#fff;" onclick="notify.question('¿Estás seguro?','Confirmar',{confirmText:'Sí',cancelText:'No',onConfirm:()=>notify.success('Confirmado'),onCancel:()=>notify.info('Cancelado'),allowOutsideClick:false})">Pregunta</button>
    <button class="fn-btn" style="background:#6366f1;color:#fff;" id="fn-btn-loading">Loading 3s</button>
    <button class="fn-btn" style="background:#d97706;color:#fff;" id="fn-btn-confirm">Confirm delete</button>
  </div>
</div>

---

## Ejemplos

<div id="fn-examples-notify" class="fn-grid-2"></div>

---

## Playground

<div class="fn-grid-2" style="margin-bottom:1rem;">
  <div>
    <label class="fn-label"><span>Tipo</span>
      <select id="fn-pg-type" class="fn-select">
        <option value="success">success</option>
        <option value="error">error</option>
        <option value="warning">warning</option>
        <option value="info">info</option>
        <option value="question">question</option>
      </select>
    </label>
    <label class="fn-label"><span>Título</span>
      <input id="fn-pg-title" class="fn-input" value="Título de prueba">
    </label>
    <label class="fn-label"><span>Mensaje</span>
      <input id="fn-pg-message" class="fn-input" value="Mensaje de ejemplo">
    </label>
    <label class="fn-label"><span>Texto del botón</span>
      <input id="fn-pg-buttonText" class="fn-input" value="Aceptar">
    </label>
    <label class="fn-label"><span>Botones JSON (opcional)</span>
      <textarea id="fn-pg-buttons" class="fn-textarea" rows="2" placeholder='[{"text":"Cancelar"},{"text":"OK","color":"#10b981"}]'></textarea>
    </label>
    <label class="fn-label"><span>Timer (ms, 0 = sin auto-cierre)</span>
      <input id="fn-pg-timer" type="number" value="0" class="fn-input">
    </label>
    <label class="fn-label"><span>Mostrar botón X</span>
      <select id="fn-pg-showCloseButton" class="fn-select">
        <option value="false">false</option>
        <option value="true">true</option>
      </select>
    </label>
  </div>
  <div>
    <label class="fn-label"><span>Overlay Opacity</span>
      <input id="fn-pg-overlayOpacity" type="number" step="0.1" min="0" max="1" value="0.85" class="fn-input">
    </label>
    <label class="fn-label"><span>Overlay Duration (ms)</span>
      <input id="fn-pg-overlayDuration" type="number" value="200" class="fn-input">
    </label>
    <label class="fn-label"><span>Box Duration (ms)</span>
      <input id="fn-pg-boxDuration" type="number" value="250" class="fn-input">
    </label>
    <label class="fn-label"><span>Box Start Scale</span>
      <input id="fn-pg-boxStartScale" type="number" step="0.1" value="0.8" class="fn-input">
    </label>
    <label class="fn-label"><span>Icon Rotate (deg)</span>
      <input id="fn-pg-iconRotate" type="number" value="0" class="fn-input">
    </label>
    <label class="fn-label"><span>Allow Outside Click</span>
      <select id="fn-pg-allowOutsideClick" class="fn-select">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </label>
    <label class="fn-label"><span>Allow Escape Key</span>
      <select id="fn-pg-allowEscapeKey" class="fn-select">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </label>
  </div>
</div>
<div class="fn-btn-group">
  <button class="fn-btn" style="background:#6366f1;color:#fff;" id="fn-pg-run">Ejecutar</button>
  <button class="fn-btn" style="background:#e2e8f0;color:#0f172a;" id="fn-pg-copy">Copiar código</button>
</div>
<pre class="fn-pg-code" id="fn-pg-code"><code></code></pre>

<template id="fn-example-template">
  <div class="fn-card">
    <div class="fn-card-title"></div>
    <div class="fn-card-desc"></div>
    <div class="fn-card-actions">
      <button class="fn-btn fn-copy-btn" style="background:#e2e8f0;color:#0f172a;">Copiar</button>
      <button class="fn-btn fn-run-btn"  style="background:#6366f1;color:#fff;">Ejecutar</button>
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
      { title:'Éxito básico', desc:'Helper rápido para success.', code:"notify.success('Operación completada.');", run:(done)=>{ notify.success('Operación completada exitosamente.',null,{onClose:done}); } },
      { title:'Error con título', desc:'Notificación de error con título.', code:"notify.error('Ha ocurrido un error.','Error de Conexión');", run:(done)=>{ notify.error('Ha ocurrido un error.','Error de Conexión',{onClose:done}); } },
      { title:'Advertencia con timer', desc:'Se cierra automáticamente a los 5 s.', code:"notify.show({\n  type:'warning',\n  title:'Advertencia',\n  message:'¿Estás seguro?',\n  buttonText:'Sí, continuar',\n  timer:5000\n});", run:(done)=>{ notify.show({type:'warning',title:'Advertencia',message:'¿Estás seguro de continuar?',buttonText:'Sí, continuar',timer:5000,onClose:done}); } },
      { title:'Pregunta (question)', desc:'Con botones confirmar / cancelar.', code:"notify.question('¿Deseas continuar?','Confirmar',{\n  confirmText:'Sí', cancelText:'No',\n  onConfirm:()=>notify.success('Confirmado'),\n  onCancel:()=>notify.info('Cancelado')\n});", run:(done)=>{ notify.question('¿Deseas continuar?','Confirmar',{confirmText:'Sí',cancelText:'No',onConfirm:()=>{notify.success('Continúa...',null,{onClose:done});},onCancel:()=>{notify.info('Cancelado',null,{onClose:done});}}); } },
      { title:'Confirmación (dos botones)', desc:'Array de botones personalizados.', code:"notify.show({\n  type:'warning',\n  title:'¿Eliminar registro?',\n  message:'Esta acción no se puede deshacer.',\n  buttons:[\n    {text:'Cancelar'},\n    {text:'Eliminar',color:'#ef4444',\n     onClick:()=>notify.success('Registro eliminado')}\n  ],\n  allowOutsideClick:false\n});", run:(done)=>{ notify.show({type:'warning',title:'¿Eliminar registro?',message:'Esta acción no se puede deshacer.',buttons:[{text:'Cancelar',color:'#6b7280',onClick:done},{text:'Eliminar',color:'#ef4444',onClick:()=>{notify.success('Eliminado',null,{onClose:done});}}],allowOutsideClick:false}); } },
      { title:'Auto-cierre (sin botón)', desc:'Se cierra sola en 3 s.', code:"notify.info('Se cierra sola.','Info',{\n  hideButton:true,\n  timer:3000\n});", run:(done)=>{ notify.info('Esta notificación se cierra sola.','Info',{hideButton:true,timer:3000,onClose:done}); } },
      { title:'Botón X (showCloseButton)', desc:'Cierre manual con botón de esquina.', code:"notify.show({\n  type:'info',\n  title:'Con botón X',\n  message:'Cierra con la X.',\n  showCloseButton:true,\n  hideButton:true\n});", run:(done)=>{ notify.show({type:'info',title:'Con botón X',message:'Puedes cerrar con el botón de la esquina.',showCloseButton:true,hideButton:true,onClose:done}); } },
      { title:'Formulario (content)', desc:'Modal con contenido DOM dinámico.', code:"const form = document.createElement('form');\nform.innerHTML = '<label>Nombre:<br><input type=\"text\"></label>';\nnotify.show({title:'Formulario',content:form,\n  allowOutsideClick:false,showCloseButton:true});", run:(done)=>{ const form=document.createElement('form'); form.innerHTML='<label>Nombre:<br><input id="fn-form-name" type="text" style="margin-top:6px"></label><div style="margin-top:12px"><button type="submit" style="padding:6px 14px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer">Enviar</button></div>'; form.addEventListener('submit',(e)=>{e.preventDefault();const v=form.querySelector('#fn-form-name').value;notify.close();notify.success('Nombre: '+(v||'(vacío)'),null,{onClose:done});});notify.show({title:'Formulario',content:form,allowOutsideClick:false,showCloseButton:true,onClose:done}); } },
      { title:'Modal fijo', desc:'Solo cierra con el botón (no ESC, no click fuera).', code:"notify.show({\n  type:'error',\n  message:'Solo cierra con el botón.',\n  allowEscapeKey:false,\n  allowOutsideClick:false,\n  buttonText:'Cerrar'\n});", run:(done)=>{ notify.show({type:'error',message:'Solo cierra con el botón.',allowEscapeKey:false,allowOutsideClick:false,buttonText:'Cerrar',onClose:done}); } },
      { title:'Quick Zoom', desc:'Animación de entrada rápida con zoom.', code:"notify.show({\n  type:'success',\n  message:'Zoom rápido',\n  anim:{boxDuration:120,overlayDuration:80,boxStartScale:0.6}\n});", run:(done)=>{ notify.show({type:'success',message:'Zoom rápido',anim:{boxDuration:120,overlayDuration:80,boxStartScale:0.6},onClose:done}); } },
      { title:'Slow Fade', desc:'Aparición lenta y suave.', code:"notify.show({\n  type:'info',\n  message:'Aparece lento',\n  anim:{overlayDuration:500,boxDuration:600,boxEasing:'easeOutQuart'}\n});", run:(done)=>{ notify.show({type:'info',message:'Aparece lento',anim:{overlayDuration:500,boxDuration:600,boxEasing:'easeOutQuart'},onClose:done}); } },
      { title:'Loading → Éxito', desc:'Spinner de carga que se cierra y muestra resultado.', code:"notify.loading('Procesando...','Espera');\nsetTimeout(()=>{\n  notify.closeLoading();\n  notify.success('Datos cargados');\n},2000);", run:(done)=>{ notify.loading('Obteniendo datos...','Cargando'); setTimeout(()=>{ notify.closeLoading(); notify.success('Datos cargados correctamente',null,{onClose:done}); },2000); } },
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

    function pgCollect() {
      let buttons = null;
      try { const raw = document.getElementById('fn-pg-buttons').value; if(raw.trim()) buttons=JSON.parse(raw); } catch(e){}
      return {
        type: document.getElementById('fn-pg-type').value,
        title: document.getElementById('fn-pg-title').value,
        message: document.getElementById('fn-pg-message').value,
        buttonText: document.getElementById('fn-pg-buttonText').value,
        buttons,
        timer: Number(document.getElementById('fn-pg-timer').value)||null,
        showCloseButton: document.getElementById('fn-pg-showCloseButton').value==='true',
        allowOutsideClick: document.getElementById('fn-pg-allowOutsideClick').value!=='false',
        allowEscapeKey: document.getElementById('fn-pg-allowEscapeKey').value!=='false',
        anim: {
          overlayOpacity: Number(document.getElementById('fn-pg-overlayOpacity').value),
          overlayDuration: Number(document.getElementById('fn-pg-overlayDuration').value),
          boxDuration: Number(document.getElementById('fn-pg-boxDuration').value),
          boxStartScale: Number(document.getElementById('fn-pg-boxStartScale').value),
          iconRotate: Number(document.getElementById('fn-pg-iconRotate').value)
        }
      };
    }

    function pgPreview() {
      const o = pgCollect();
      const btnPart = Array.isArray(o.buttons)
        ? `  buttons: ${JSON.stringify(o.buttons,null,2)},\n`
        : `  buttonText: '${o.buttonText.replace(/'/g,"\\'")}',\n`;
      const extra = [
        o.timer ? `  timer: ${o.timer},\n`:'',
        o.showCloseButton ? `  showCloseButton: true,\n`:'',
        !o.allowOutsideClick ? `  allowOutsideClick: false,\n`:'',
        !o.allowEscapeKey ? `  allowEscapeKey: false,\n`:''
      ].join('');
      document.querySelector('#fn-pg-code code').textContent =
        `notify.show({\n  type: '${o.type}',\n  title: '${o.title.replace(/'/g,"\\'")}',\n  message: '${o.message.replace(/'/g,"\\'")}',\n${btnPart}${extra}  anim: ${JSON.stringify(o.anim,null,2)}\n});`;
    }

    function init() {
      renderExamples('fn-examples-notify', examples);
      pgPreview();

      document.getElementById('fn-btn-loading').addEventListener('click', () => {
        notify.loading('Procesando solicitud...','Por favor espera');
        setTimeout(()=>notify.closeLoading(), 3000);
      });
      document.getElementById('fn-btn-confirm').addEventListener('click', () => {
        notify.show({
          type:'warning', title:'¿Eliminar elemento?', message:'Esta acción no se puede deshacer.',
          confirmText:'Sí, eliminar', cancelText:'Cancelar', allowOutsideClick:false, allowEscapeKey:false,
          onConfirm: async()=>{ await new Promise(r=>setTimeout(r,600)); notify.success('Elemento eliminado correctamente'); },
          onCancel: ()=>{ notify.info('Operación cancelada'); }
        });
      });

      ['fn-pg-type','fn-pg-title','fn-pg-message','fn-pg-buttonText','fn-pg-buttons','fn-pg-timer',
       'fn-pg-showCloseButton','fn-pg-allowOutsideClick','fn-pg-allowEscapeKey',
       'fn-pg-overlayOpacity','fn-pg-overlayDuration','fn-pg-boxDuration','fn-pg-boxStartScale','fn-pg-iconRotate'
      ].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input',pgPreview); });

      const pgRun = document.getElementById('fn-pg-run');
      pgRun.addEventListener('click', () => {
        const o = pgCollect();
        pgRun.disabled = true;
        const orig = pgRun.innerHTML;
        pgRun.innerHTML = 'Ejecutando...';
        const params = {
          type:o.type, title:o.title, message:o.message, timer:o.timer||null,
          anim:o.anim, showCloseButton:o.showCloseButton,
          allowOutsideClick:o.allowOutsideClick, allowEscapeKey:o.allowEscapeKey,
          onClose:()=>{ pgRun.disabled=false; pgRun.innerHTML=orig; }
        };
        if(Array.isArray(o.buttons)) params.buttons=o.buttons; else params.buttonText=o.buttonText;
        notify.show(params);
        setTimeout(()=>{ if(pgRun.disabled){pgRun.disabled=false;pgRun.innerHTML=orig;} },8000);
      });
      document.getElementById('fn-pg-copy').addEventListener('click', async()=>{
        try{ const c=document.querySelector('#fn-pg-code code').textContent; await navigator.clipboard.writeText(c); const b=document.getElementById('fn-pg-copy'); const o=b.innerHTML; b.innerHTML='Copiado ✓'; setTimeout(()=>b.innerHTML=o,1400); }catch(e){}
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
