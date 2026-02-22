document.addEventListener('DOMContentLoaded', function () {
    function waitForNotify(callback, maxAttempts = 100, attempt = 0) {
        if (typeof notify !== 'undefined' && typeof notify.success === 'function') {
            callback();
        } else if (attempt < maxAttempts) {
            setTimeout(() => waitForNotify(callback, maxAttempts, attempt + 1), 50);
        } else {
            console.error('⚠️ Error: notify no se cargó correctamente. Verifica la consola para más detalles.');
        }
    }

    waitForNotify(initDemo);

    function initDemo() {
        // --- Helpers y ejemplos ---
        const examples = [
            {
                title: 'Éxito básico',
                desc: 'Usa el helper rápido para mostrar una notificación de éxito.',
                code: "notify.success('Operación completada exitosamente.');",
                run: (done) => { notify.success('Operación completada exitosamente.', null, { onClose: done }); }
            },
            {
                title: 'Error con título',
                desc: 'Notificación de error con título personalizado.',
                code: "notify.error('Ha ocurrido un error.', 'Error de Conexión');",
                run: (done) => { notify.error('Ha ocurrido un error.', 'Error de Conexión', { onClose: done }); }
            },
            {
                title: 'Advertencia con acción',
                desc: 'Notificación con botón de acción y callback al cerrar.',
                code: "notify.show({\\n  type: 'warning',\\n  title: 'Advertencia',\\n  message: '¿Estás seguro de continuar?',\\n  buttonText: 'Sí, continuar',\\n  timer: 5000,\\n  onClose: () => console.log('Notificación cerrada')\\n});",
                run: (done) => { notify.show({ type: 'warning', title: 'Advertencia', message: '¿Estás seguro de continuar?', buttonText: 'Sí, continuar', timer: 5000, onClose: () => { console.log('Notificación cerrada'); if (done) done(); } }); }
            },
            {
                title: 'Auto-cierre (sin botón)',
                desc: 'Notificación que se cierra sola, sin botón de acción.',
                code: "notify.info('Esta notificación se cierra sola.', 'Info', {\\n  hideButton: true,\\n  timer: 3000\\n});",
                run: (done) => { notify.info('Esta notificación se cierra sola.', 'Info', { hideButton: true, timer: 3000, onClose: done }); }
            },
            {
                title: 'Formulario (inputs)',
                desc: 'Modal con un formulario simple (ejemplo de `options.content`).',
                code: "// Crear form dinámicamente y pasar como content:\nconst form = document.createElement('form');\nform.innerHTML = `\n  <label>Nombre:<br><input id=\"name\" type=\"text\" />\n  </label>\n  <div style=\"margin-top:12px\">\n    <button type=\"submit\">Enviar</button>\n  </div>`;\nform.addEventListener('submit', (e) => { e.preventDefault(); const v = form.querySelector('#name').value; console.log('Nombre:', v); notify.close(); });\nnotify.show({ title: 'Formulario', content: form, allowOutsideClick: false, showCloseButton: true });",
                run: (done) => {
                    const form = document.createElement('form');
                    form.innerHTML = `
          <label>Nombre:<br><input id="name" type="text" class="px-2 py-1 border rounded" />
          </label>
          <div style="margin-top:12px">
            <button type="submit" class="px-3 py-1 rounded bg-indigo-600 text-white">Enviar</button>
          </div>`;
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const v = form.querySelector('#name').value;
                        console.log('Nombre enviado:', v);
                        notify.close();
                        if (done) done();
                    });
                    notify.show({ title: 'Formulario', content: form, allowOutsideClick: false, showCloseButton: true }).then(() => { if (done) done(); });
                }
            },
            {
                title: 'Quick Zoom',
                desc: 'Entrada rápida y con zoom (anim overrides).',
                code: "notify.show({\\n  type: 'success',\\n  message: 'Zoom rápido',\\n  anim: { boxDuration: 120, overlayDuration: 80, boxStartScale: 0.6 }\\n});",
                run: (done) => { notify.show({ type: 'success', message: 'Zoom rápido', anim: { boxDuration: 120, overlayDuration: 80, boxStartScale: 0.6 } }).then(() => { if (done) done(); }); }
            },
            {
                title: 'Slow Fade',
                desc: 'Aparición lenta y suave (fade lento).',
                code: "notify.show({\\n  type: 'info',\\n  message: 'Aparece lento',\\n  anim: { overlayDuration: 500, boxDuration: 600, boxEasing: 'easeOutQuart' }\\n});",
                run: (done) => { notify.show({ type: 'info', message: 'Aparece lento', anim: { overlayDuration: 500, boxDuration: 600, boxEasing: 'easeOutQuart' } }).then(() => { if (done) done(); }); }
            },
            {
                title: 'Icon Spin',
                desc: 'Rotación destacada del icono.',
                code: "notify.show({\\n  type: 'success',\\n  message: 'Icono gira',\\n  anim: { iconRotate: 360, iconDuration: 700 }\\n});",
                run: (done) => { notify.show({ type: 'success', message: 'Icono gira', anim: { iconRotate: 360, iconDuration: 700 } }).then(() => { if (done) done(); }); }
            },
            {
                title: 'Subtle Overlay',
                desc: 'Overlay más sutil (opacidad).',
                code: "notify.show({\\n  type: 'error',\\n  message: 'Overlay suave',\\n  anim: { overlayOpacity: 0.6 }\\n});",
                run: (done) => { notify.show({ type: 'error', message: 'Overlay suave', anim: { overlayOpacity: 0.6 } }).then(() => { if (done) done(); }); }
            },
            {
                title: 'Modal fijo (no ESC / no click fuera)',
                desc: 'Notificación que solo se puede cerrar con el botón (fija).',
                code: "notify.show({\\n  type: 'error',\\n  message: 'Este diálogo solo cierra con el botón.',\\n  allowEscapeKey: false,\\n  allowOutsideClick: false,\\n  buttonText: 'Cerrar'\\n}).then(() => console.log('cerrada'));",
                run: (done) => { notify.show({ type: 'error', message: 'Este diálogo solo cierra con el botón.', allowEscapeKey: false, allowOutsideClick: false, buttonText: 'Cerrar' }).then(() => { if (done) done(); }); }
            },
            {
                title: 'Carga básica',
                desc: 'Spinner de carga con mensaje personalizado.',
                code: "notify.loading('Procesando solicitud...', 'Espera');",
                run: (done) => {
                    notify.loading('Procesando solicitud...', 'Espera');
                    setTimeout(() => { notify.closeLoading(); if (done) done(); }, 3000);
                }
            },
            {
                title: 'Carga con cierre automático',
                desc: 'Notificación de carga que se cierra automáticamente.',
                code: "notify.loading('Conectando al servidor...', 'Por favor espera', {\\n  timer: 2500\\n}).then(() => console.log('Carga completada'));",
                run: (done) => {
                    notify.loading('Conectando al servidor...', 'Por favor espera', { timer: 2500 }).then(() => {
                        console.log('Carga completada');
                        if (done) done();
                    });
                }
            },
            {
                title: 'Simular respuesta backend',
                desc: 'Mostrar carga, luego cerrar y mostrar resultado.',
                code: "notify.loading('Obteniendo datos...', 'Cargando');\nsetTimeout(() => {\n  notify.closeLoading();\n  notify.success('Datos cargados correctamente');\n}, 2000);",
                run: (done) => {
                    notify.loading('Obteniendo datos...', 'Cargando');
                    setTimeout(() => {
                        notify.closeLoading();
                        notify.success('Datos cargados correctamente', null, { onClose: done });
                    }, 2000);
                }
            },
            {
                title: 'Carga con error',
                desc: 'Simular un error después de la carga.',
                code: "notify.loading('Subiendo archivo...', 'Espera');\nsetTimeout(() => {\n  notify.closeLoading();\n  notify.error('Archivo demasiado grande');\n}, 2500);",
                run: (done) => {
                    notify.loading('Subiendo archivo...', 'Espera');
                    setTimeout(() => {
                        notify.closeLoading();
                        notify.error('Archivo demasiado grande', null, { onClose: done });
                    }, 2500);
                }
            }
        ];

        function renderExamples() {
            const container = document.getElementById('examples');
            const template = document.getElementById('example-template');
            container.innerHTML = '';
            examples.forEach((ex) => {
                // convert escaped sequences like "\\n" into real newlines for display
                function unescapeForDisplay(s) {
                    if (!s) return s;
                    return s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\'/g, "'").replace(/\\\"/g, '"');
                }

                const node = template.content.cloneNode(true);
                node.querySelector('.example-title').textContent = ex.title;
                node.querySelector('.example-desc').textContent = ex.desc;
                const codeText = unescapeForDisplay(ex.code);
                node.querySelector('.example-code code').textContent = codeText;
                const runBtn = node.querySelector('.run-btn');
                const copyBtn = node.querySelector('.copy-btn');
                runBtn.addEventListener('click', () => {
                    const original = runBtn.innerHTML;
                    runBtn.disabled = true;
                    runBtn.innerHTML = "<i class='bx bx-loader animate-spin'></i><span> Running</span>";
                    let finished = false;
                    const done = () => {
                        if (finished) return;
                        finished = true;
                        runBtn.disabled = false;
                        runBtn.innerHTML = original;
                    };
                    try {
                        const res = ex.run(done);
                        if (res && typeof res.then === 'function') res.then(done).catch((e) => { console.error(e); done(); });
                    } catch (e) { console.error(e); done(); }
                    setTimeout(() => { if (!finished) done(); }, 5000);
                });
                copyBtn.addEventListener('click', async () => {
                    try { await navigator.clipboard.writeText(codeText); const prev = copyBtn.innerHTML; copyBtn.innerHTML = "<i class='bx bx-check'></i><span> Copied</span>"; setTimeout(() => copyBtn.innerHTML = prev, 1500); } catch (e) { console.warn('Clipboard failed', e); }
                });
                container.appendChild(node);
            });
        }

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderExamples); else renderExamples();

        function pgCollect() {
            return {
                type: document.getElementById('pg-type').value,
                title: document.getElementById('pg-title').value,
                message: document.getElementById('pg-message').value,
                buttonText: document.getElementById('pg-buttonText').value,
                timer: Number(document.getElementById('pg-timer').value) || null,
                anim: {
                    overlayOpacity: Number(document.getElementById('pg-overlayOpacity').value),
                    overlayDuration: Number(document.getElementById('pg-overlayDuration').value),
                    boxDuration: Number(document.getElementById('pg-boxDuration').value),
                    boxStartScale: Number(document.getElementById('pg-boxStartScale').value),
                    iconRotate: Number(document.getElementById('pg-iconRotate').value)
                }
            };
        }

        function pgGenerateCode(opts) {
            const anim = JSON.stringify(opts.anim, null, 2);
            return `notify.show({\\n  type: '${opts.type}',\\n  title: '${opts.title.replace(/'/g, "\\\\'")}',\\n  message: '${opts.message.replace(/'/g, "\\\\'")}',\\n  buttonText: '${opts.buttonText}',\\n  timer: ${opts.timer || 'null'},\\n  anim: ${anim}\\n});`;
        }

        const pgRunBtn = document.getElementById('pg-run');
        const pgCopyBtn = document.getElementById('pg-copy');
        const pgCodeEl = document.getElementById('pg-code').querySelector('code');

        function updatePlaygroundPreview() {
            const opts = pgCollect();
            const raw = pgGenerateCode(opts);
            const preview = raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\'/g, "'").replace(/\\\"/g, '"');
            pgCodeEl.textContent = preview;
        }

        ['pg-type', 'pg-title', 'pg-message', 'pg-buttonText', 'pg-timer', 'pg-overlayOpacity', 'pg-overlayDuration', 'pg-boxDuration', 'pg-boxStartScale', 'pg-iconRotate'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', updatePlaygroundPreview);
        });

        pgRunBtn.addEventListener('click', () => {
            const opts = pgCollect();
            pgRunBtn.disabled = true;
            const prev = pgRunBtn.innerHTML;
            pgRunBtn.innerHTML = "<i class='bx bx-loader animate-spin'></i> Running";
            notify.show({
                type: opts.type,
                title: opts.title,
                message: opts.message,
                buttonText: opts.buttonText,
                timer: opts.timer || null,
                anim: opts.anim,
                onClose: () => { pgRunBtn.disabled = false; pgRunBtn.innerHTML = prev; }
            }).then(() => { if (pgRunBtn.disabled) { pgRunBtn.disabled = false; pgRunBtn.innerHTML = prev; } });
            setTimeout(() => { if (pgRunBtn.disabled) { pgRunBtn.disabled = false; pgRunBtn.innerHTML = prev; } }, 6000);
        });

        pgCopyBtn.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(pgCodeEl.textContent); const prev = pgCopyBtn.innerHTML; pgCopyBtn.innerHTML = "Copied"; setTimeout(() => pgCopyBtn.innerHTML = prev, 1200); } catch (e) { console.warn('Clipboard failed', e); }
        });

        updatePlaygroundPreview();

        document.getElementById('btn-success').addEventListener('click', () => { notify.success('Operación completada exitosamente.', '¡Éxito!'); });
        document.getElementById('btn-error').addEventListener('click', () => { notify.error('Ha ocurrido un error inesperado.', 'Error'); });
        document.getElementById('btn-warning').addEventListener('click', () => { notify.warning('Revisa los datos antes de continuar.', 'Advertencia'); });
        document.getElementById('btn-info').addEventListener('click', () => { notify.info('Esta es una notificación informativa.', 'Información'); });
        document.getElementById('btn-loading').addEventListener('click', () => {
            notify.loading('Procesando solicitud...', 'Por favor espera');
            setTimeout(() => { notify.closeLoading(); }, 3000);
        });
        document.getElementById('btn-custom').addEventListener('click', () => { notify.show({ type: 'info', title: 'Notificación Personalizada', message: 'Esta notificación se cierra automáticamente en 3 segundos.', buttonText: 'Entendido', timer: 3000 }); });

    } // FIN initDemo
});
