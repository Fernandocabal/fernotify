document.addEventListener('DOMContentLoaded', function () {
    function waitForNotify(callback, maxAttempts = 100, attempt = 0) {
        if (typeof notify !== 'undefined' && typeof notify.success === 'function') {
            callback();
        } else if (attempt < maxAttempts) {
            setTimeout(() => waitForNotify(callback, maxAttempts, attempt + 1), 50);
        } else {
            console.error('FerNotify no se pudo cargar.');
        }
    }

    waitForNotify(initDemo);

    function initDemo() {

        // — Ejemplos de NOTIFICACIONES —
        const examplesNotify = [
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
                title: 'Advertencia con timer',
                desc: 'Notificación con botón de acción y cierre automático a los 5 s.',
                code: "notify.show({\n  type: 'warning',\n  title: 'Advertencia',\n  message: '¿Estás seguro de continuar?',\n  buttonText: 'Sí, continuar',\n  timer: 5000\n});",
                run: (done) => { notify.show({ type: 'warning', title: 'Advertencia', message: '¿Estás seguro de continuar?', buttonText: 'Sí, continuar', timer: 5000, onClose: done }); }
            },
            {
                title: 'Pregunta (question)',
                desc: 'Tipo question con botones confirmar / cancelar.',
                code: "notify.question('¿Deseas continuar?', 'Confirmar', {\n  confirmText: 'Sí',\n  cancelText: 'No',\n  onConfirm: () => notify.success('Confirmado'),\n  onCancel: () => notify.info('Cancelado')\n});",
                run: (done) => {
                    notify.question('¿Deseas continuar con la operación?', 'Confirmar', {
                        confirmText: 'Sí', cancelText: 'No',
                        onConfirm: () => { notify.success('Continúa ejecutando...', null, { onClose: done }); },
                        onCancel: () => { notify.info('Operación cancelada', null, { onClose: done }); }
                    });
                }
            },
            {
                title: 'Confirmación (dos botones)',
                desc: 'Diálogo con array de botones personalizados.',
                code: "notify.show({\n  type: 'warning',\n  title: '¿Eliminar registro?',\n  message: 'Esta acción no se puede deshacer.',\n  buttons: [\n    { text: 'Cancelar', color: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' },\n    { text: 'Eliminar', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', onClick: () => console.log('eliminado') }\n  ],\n  allowOutsideClick: false\n});",
                run: (done) => {
                    notify.show({
                        type: 'warning', title: '¿Eliminar registro?', message: 'Esta acción no se puede deshacer.',
                        buttons: [
                            { text: 'Cancelar', color: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)', onClick: done },
                            { text: 'Eliminar', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', onClick: () => { notify.success('Eliminado', null, { onClose: done }); } }
                        ],
                        allowOutsideClick: false
                    });
                }
            },
            {
                title: 'onConfirm / onCancel',
                desc: 'Atajo práctico con spinner durante la operación asíncrona.',
                code: "notify.show({\n  type: 'info',\n  title: '¿Eliminar elemento?',\n  message: 'Esta acción no se puede deshacer.',\n  confirmText: 'Sí, eliminar',\n  cancelText: 'Cancelar',\n  onConfirm: async () => {\n    notify.loading('Eliminando...', 'Espera');\n    await new Promise(r => setTimeout(r, 1200));\n    notify.closeLoading();\n    notify.success('Eliminado');\n  },\n  onCancel: () => notify.info('Cancelado'),\n  allowOutsideClick: false,\n  allowEscapeKey: false\n});",
                run: (done) => {
                    notify.show({
                        type: 'info', title: '¿Eliminar elemento?', message: 'Esta acción no se puede deshacer.',
                        confirmText: 'Sí, eliminar', cancelText: 'Cancelar', allowOutsideClick: false, allowEscapeKey: false,
                        onConfirm: async () => {
                            notify.loading('Eliminando...', 'Espera');
                            await new Promise(r => setTimeout(r, 1200));
                            notify.closeLoading();
                            notify.success('Eliminado', null, { onClose: done });
                        },
                        onCancel: () => { notify.info('Cancelado', null, { onClose: done }); }
                    });
                }
            },
            {
                title: 'Auto-cierre (sin botón)',
                desc: 'Notificación que se cierra sola en 3 s, sin botón de acción.',
                code: "notify.info('Esta notificación se cierra sola.', 'Info', {\n  hideButton: true,\n  timer: 3000\n});",
                run: (done) => { notify.info('Esta notificación se cierra sola.', 'Info', { hideButton: true, timer: 3000, onClose: done }); }
            },
            {
                title: 'Botón cerrar (X)',
                desc: 'Modal con botón X en la esquina para cerrar manualmente.',
                code: "notify.show({\n  type: 'info',\n  title: 'Con botón X',\n  message: 'Puedes cerrar con el botón de la esquina.',\n  showCloseButton: true,\n  hideButton: true\n});",
                run: (done) => { notify.show({ type: 'info', title: 'Con botón X', message: 'Puedes cerrar con el botón de la esquina.', showCloseButton: true, hideButton: true, onClose: done }); }
            },
            {
                title: 'Formulario (content)',
                desc: 'Modal con formulario dinámico pasado como content.',
                code: "const form = document.createElement('form');\nform.innerHTML = `<label>Nombre:<br><input id='name' type='text'></label>`;\nform.addEventListener('submit', e => { e.preventDefault(); notify.close(); });\nnotify.show({ title: 'Formulario', content: form, allowOutsideClick: false, showCloseButton: true });",
                run: (done) => {
                    const form = document.createElement('form');
                    form.innerHTML = '<label>Nombre:<br><input id="form-name" type="text" style="margin-top:6px"></label><div style="margin-top:12px"><button type="submit" style="padding:6px 14px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer">Enviar</button></div>';
                    form.addEventListener('submit', (e) => { e.preventDefault(); const v = form.querySelector('#form-name').value; notify.close(); notify.success('Nombre: ' + (v || '(vacío)'), null, { onClose: done }); });
                    notify.show({ title: 'Formulario', content: form, allowOutsideClick: false, showCloseButton: true, onClose: done });
                }
            },
            {
                title: 'Modal fijo (no ESC / no click fuera)',
                desc: 'Solo se puede cerrar con el botón.',
                code: "notify.show({\n  type: 'error',\n  message: 'Solo cierra con el botón.',\n  allowEscapeKey: false,\n  allowOutsideClick: false,\n  buttonText: 'Cerrar'\n});",
                run: (done) => { notify.show({ type: 'error', message: 'Este diálogo solo cierra con el botón.', allowEscapeKey: false, allowOutsideClick: false, buttonText: 'Cerrar', onClose: done }); }
            },
            {
                title: 'Quick Zoom',
                desc: 'Entrada rápida con zoom (anim overrides).',
                code: "notify.show({\n  type: 'success',\n  message: 'Zoom rápido',\n  anim: { boxDuration: 120, overlayDuration: 80, boxStartScale: 0.6 }\n});",
                run: (done) => { notify.show({ type: 'success', message: 'Zoom rápido', anim: { boxDuration: 120, overlayDuration: 80, boxStartScale: 0.6 }, onClose: done }); }
            },
            {
                title: 'Slow Fade',
                desc: 'Aparición lenta y suave.',
                code: "notify.show({\n  type: 'info',\n  message: 'Aparece lento',\n  anim: { overlayDuration: 500, boxDuration: 600, boxEasing: 'easeOutQuart' }\n});",
                run: (done) => { notify.show({ type: 'info', message: 'Aparece lento', anim: { overlayDuration: 500, boxDuration: 600, boxEasing: 'easeOutQuart' }, onClose: done }); }
            },
            {
                title: 'Carga básica',
                desc: 'Spinner de carga con cierre manual tras 3 s.',
                code: "notify.loading('Procesando solicitud...', 'Espera');\nsetTimeout(() => notify.closeLoading(), 3000);",
                run: (done) => {
                    notify.loading('Procesando solicitud...', 'Espera');
                    setTimeout(() => { notify.closeLoading(); if (done) done(); }, 3000);
                }
            },
            {
                title: 'Carga con cierre automático',
                desc: 'Spinner que se cierra solo con timer.',
                code: "notify.loading('Conectando...', 'Por favor espera', { timer: 2500 })\n  .then(() => console.log('Carga completada'));",
                run: (done) => { notify.loading('Conectando al servidor...', 'Por favor espera', { timer: 2500 }).then(() => { if (done) done(); }); }
            },
            {
                title: 'Simular respuesta backend',
                desc: 'Mostrar carga, luego cerrar y mostrar resultado.',
                code: "notify.loading('Obteniendo datos...', 'Cargando');\nsetTimeout(() => {\n  notify.closeLoading();\n  notify.success('Datos cargados correctamente');\n}, 2000);",
                run: (done) => {
                    notify.loading('Obteniendo datos...', 'Cargando');
                    setTimeout(() => { notify.closeLoading(); notify.success('Datos cargados correctamente', null, { onClose: done }); }, 2000);
                }
            },
            {
                title: 'Carga con error',
                desc: 'Simular un error después de la carga.',
                code: "notify.loading('Subiendo archivo...', 'Espera');\nsetTimeout(() => {\n  notify.closeLoading();\n  notify.error('Archivo demasiado grande');\n}, 2500);",
                run: (done) => {
                    notify.loading('Subiendo archivo...', 'Espera');
                    setTimeout(() => { notify.closeLoading(); notify.error('Archivo demasiado grande', null, { onClose: done }); }, 2500);
                }
            }
        ];

        const exampleToast = [
            {
                title: 'Toast — Éxito',
                desc: 'Toast no bloqueante de tipo success con auto-cierre en 4 s.',
                code: "notify.toastSuccess('Cambios guardados correctamente.', '¡Guardado!');",
                run: (done) => { notify.toastSuccess('Cambios guardados correctamente.', '¡Guardado!'); if (done) done(); }
            },
            {
                title: 'Toast — Error',
                desc: 'Toast de error con duración personalizada de 6 s.',
                code: "notify.toastError('No se pudo conectar al servidor.', 'Error de red', { duration: 6000 });",
                run: (done) => { notify.toastError('No se pudo conectar al servidor.', 'Error de red', { duration: 6000 }); if (done) done(); }
            },
            {
                title: 'Toast — Advertencia',
                desc: 'Toast de advertencia posicionado abajo a la derecha.',
                code: "notify.toastWarning('Tu sesión expirará en 5 minutos.', 'Advertencia', { position: 'bottom-right' });",
                run: (done) => { notify.toastWarning('Tu sesión expirará en 5 minutos.', 'Advertencia', { position: 'bottom-right' }); if (done) done(); }
            },
            {
                title: 'Toast — Acumular varios',
                desc: 'Muestra 3 toasts seguidos para ver el apilamiento.',
                code: "notify.toastSuccess('Archivo subido.');\nsetTimeout(() => notify.toastInfo('Procesando...'), 500);\nsetTimeout(() => notify.toastWarning('Espacio casi agotado.'), 1000);",
                run: (done) => {
                    notify.toastSuccess('Archivo subido.');
                    setTimeout(() => notify.toastInfo('Procesando...'), 500);
                    setTimeout(() => { notify.toastWarning('Espacio casi agotado.'); if (done) done(); }, 1000);
                }
            },
            {
                title: 'Toast — Sin auto-cierre',
                desc: 'Permanece hasta que el usuario lo cierra manualmente. (duration: 0)',
                code: "notify.toast({ type: 'info', title: 'Persistente', message: 'Esta notificación no se cierra sola.', duration: 0 });",
                run: (done) => { notify.toast({ type: 'info', title: 'Persistente', message: 'Esta notificación no se cierra sola.', duration: 0 }); if (done) done(); }
            },
            {
                title: 'Toast — Sin barra de progreso',
                desc: 'Toast con progress bar oculta (showProgress: false).',
                code: "notify.toastSuccess('Guardado sin barra.', '¡Listo!', { showProgress: false });",
                run: (done) => { notify.toastSuccess('Guardado sin barra.', '¡Listo!', { showProgress: false }); if (done) done(); }
            },
            {
                title: 'Toast — Pausa en hover',
                desc: 'Pasa el mouse sobre el toast para detener el contador.',
                code: "notify.toastInfo('Pasa el mouse para pausar el timer.', 'Hover', { duration: 8000 });",
                run: (done) => { notify.toastInfo('Pasa el mouse encima para pausar el timer.', 'Hover', { duration: 8000 }); if (done) done(); }
            },
            {
                title: 'Toast — Posición top-left',
                desc: 'Toast en la esquina superior izquierda.',
                code: "notify.toastQuestion('Nueva solicitud pendiente.', 'Revisión', { position: 'top-left' });",
                run: (done) => { notify.toastQuestion('Nueva solicitud pendiente de revisión.', 'Revisión', { position: 'top-left' }); if (done) done(); }
            },
            {
                title: 'Toast — Posición top-center',
                desc: 'Toast centrado en la parte superior de la pantalla.',
                code: "notify.toastInfo('Actualización disponible.', 'Info', { position: 'top-center' });",
                run: (done) => { notify.toastInfo('Actualización disponible.', 'Info', { position: 'top-center' }); if (done) done(); }
            }
        ];

        function renderExamples(containerId, list) {
            const container = document.getElementById(containerId);
            const template = document.getElementById('example-template');
            container.innerHTML = '';
            list.forEach((ex) => {
                function unescapeForDisplay(s) {
                    if (!s) return s;
                    return s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\'/g, "'").replace(/\"/g, '"');
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
                    const done = () => { if (finished) return; finished = true; runBtn.disabled = false; runBtn.innerHTML = original; };
                    try {
                        const res = ex.run(done);
                        if (res && typeof res.then === 'function') res.then(done).catch((e) => { console.error(e); done(); });
                    } catch (e) { console.error(e); done(); }
                    setTimeout(() => { if (!finished) done(); }, 8000);
                });
                copyBtn.addEventListener('click', async () => {
                    try { await navigator.clipboard.writeText(codeText); const prev = copyBtn.innerHTML; copyBtn.innerHTML = "<i class='bx bx-check'></i><span> Copied</span>"; setTimeout(() => copyBtn.innerHTML = prev, 1500); } catch (e) { console.warn('Clipboard failed', e); }
                });
                container.appendChild(node);
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => { renderExamples('examples-notify', examplesNotify); renderExamples('examples-toast', exampleToast); });
        } else {
            renderExamples('examples-notify', examplesNotify);
            renderExamples('examples-toast', exampleToast);
        }

        function pgCollect() {
            let buttons = null;
            try {
                const raw = document.getElementById('pg-buttons').value;
                if (raw && raw.trim()) buttons = JSON.parse(raw);
            } catch (e) { console.warn('pgCollect: invalid buttons JSON', e); buttons = null; }
            return {
                type: document.getElementById('pg-type').value,
                title: document.getElementById('pg-title').value,
                message: document.getElementById('pg-message').value,
                buttonText: document.getElementById('pg-buttonText').value,
                buttons,
                timer: Number(document.getElementById('pg-timer').value) || null,
                showCloseButton: document.getElementById('pg-showCloseButton').value === 'true',
                allowOutsideClick: document.getElementById('pg-allowOutsideClick').value !== 'false',
                allowEscapeKey: document.getElementById('pg-allowEscapeKey').value !== 'false',
                anim: {
                    overlayOpacity: Number(document.getElementById('pg-overlayOpacity').value),
                    overlayDuration: Number(document.getElementById('pg-overlayDuration').value),
                    boxDuration: Number(document.getElementById('pg-boxDuration').value),
                    boxStartScale: Number(document.getElementById('pg-boxStartScale').value),
                    iconRotate: Number(document.getElementById('pg-iconRotate').value)
                }
            };
        }

        const pgRunBtn = document.getElementById('pg-run');
        const pgCopyBtn = document.getElementById('pg-copy');
        const pgCodeEl = document.getElementById('pg-code').querySelector('code');

        function updatePlaygroundPreview() {
            const opts = pgCollect();
            const animStr = JSON.stringify(opts.anim, null, 2);
            const btnPart = Array.isArray(opts.buttons)
                ? `  buttons: ${JSON.stringify(opts.buttons, null, 2)},\n`
                : `  buttonText: '${opts.buttonText.replace(/'/g, "\\'")}',\n`;
            const extra = [
                opts.timer ? `  timer: ${opts.timer},\n` : '',
                opts.showCloseButton ? `  showCloseButton: true,\n` : '',
                !opts.allowOutsideClick ? `  allowOutsideClick: false,\n` : '',
                !opts.allowEscapeKey ? `  allowEscapeKey: false,\n` : ''
            ].join('');
            pgCodeEl.textContent =
                `notify.show({\n  type: '${opts.type}',\n  title: '${opts.title.replace(/'/g, "\\'")}',\n  message: '${opts.message.replace(/'/g, "\\'")}',\n${btnPart}${extra}  anim: ${animStr}\n});`;
        }

        ['pg-type', 'pg-title', 'pg-message', 'pg-buttonText', 'pg-buttons', 'pg-timer',
            'pg-showCloseButton', 'pg-allowOutsideClick', 'pg-allowEscapeKey',
            'pg-overlayOpacity', 'pg-overlayDuration', 'pg-boxDuration', 'pg-boxStartScale', 'pg-iconRotate'
        ].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', updatePlaygroundPreview); });

        pgRunBtn.addEventListener('click', () => {
            const opts = pgCollect();
            pgRunBtn.disabled = true;
            const prev = pgRunBtn.innerHTML;
            pgRunBtn.innerHTML = "<i class='bx bx-loader animate-spin'></i> Running";
            const params = {
                type: opts.type, title: opts.title, message: opts.message, timer: opts.timer || null,
                anim: opts.anim, showCloseButton: opts.showCloseButton,
                allowOutsideClick: opts.allowOutsideClick, allowEscapeKey: opts.allowEscapeKey,
                onClose: () => { pgRunBtn.disabled = false; pgRunBtn.innerHTML = prev; }
            };
            if (Array.isArray(opts.buttons)) { params.buttons = opts.buttons; } else { params.buttonText = opts.buttonText; }
            notify.show(params).then(() => { if (pgRunBtn.disabled) { pgRunBtn.disabled = false; pgRunBtn.innerHTML = prev; } });
            setTimeout(() => { if (pgRunBtn.disabled) { pgRunBtn.disabled = false; pgRunBtn.innerHTML = prev; } }, 6000);
        });

        pgCopyBtn.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(pgCodeEl.textContent); const prev = pgCopyBtn.innerHTML; pgCopyBtn.innerHTML = 'Copied'; setTimeout(() => pgCopyBtn.innerHTML = prev, 1200); } catch (e) { console.warn('Clipboard failed', e); }
        });

        updatePlaygroundPreview();

        // — Playground TOAST —
        const tpgRunBtn = document.getElementById('tpg-run');
        const tpgCopyBtn = document.getElementById('tpg-copy');
        const tpgCodeEl = document.getElementById('tpg-code').querySelector('code');

        function tpgCollect() {
            return {
                type: document.getElementById('tpg-type').value,
                title: document.getElementById('tpg-title').value,
                message: document.getElementById('tpg-message').value,
                duration: Number(document.getElementById('tpg-duration').value),
                position: document.getElementById('tpg-position').value,
                showProgress: document.getElementById('tpg-showProgress').value !== 'false'
            };
        }

        function updateToastPlaygroundPreview() {
            const o = tpgCollect();
            const lines = [
                `  type: '${o.type}',`
            ];
            if (o.title) lines.push(`  title: '${o.title.replace(/'/g, "\\'")}',`);
            lines.push(`  message: '${o.message.replace(/'/g, "\\'")}',`);
            lines.push(`  duration: ${o.duration},`);
            lines.push(`  position: '${o.position}',`);
            if (!o.showProgress) lines.push(`  showProgress: false,`);
            tpgCodeEl.textContent = `notify.toast({\n${lines.join('\n')}\n});`;
        }

        ['tpg-type', 'tpg-title', 'tpg-message', 'tpg-duration', 'tpg-position', 'tpg-showProgress']
            .forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', updateToastPlaygroundPreview); });

        tpgRunBtn.addEventListener('click', () => {
            const o = tpgCollect();
            notify.toast({ type: o.type, title: o.title || undefined, message: o.message, duration: o.duration, position: o.position, showProgress: o.showProgress });
        });

        tpgCopyBtn.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(tpgCodeEl.textContent); const prev = tpgCopyBtn.innerHTML; tpgCopyBtn.innerHTML = 'Copied'; setTimeout(() => tpgCopyBtn.innerHTML = prev, 1200); } catch (e) { console.warn('Clipboard failed', e); }
        });

        updateToastPlaygroundPreview();

        document.getElementById('btn-success').addEventListener('click', () => { notify.success('Operación completada exitosamente.', '¡Éxito!'); });
        document.getElementById('btn-error').addEventListener('click', () => { notify.error('Ha ocurrido un error inesperado.', 'Error'); });
        document.getElementById('btn-warning').addEventListener('click', () => { notify.warning('Revisa los datos antes de continuar.', 'Advertencia'); });
        document.getElementById('btn-info').addEventListener('click', () => { notify.info('Esta es una notificación informativa.', 'Información'); });
        document.getElementById('btn-question').addEventListener('click', () => {
            notify.question('¿Estás seguro que quieres ejecutar esta acción?', 'Confirmar', {
                confirmText: 'Sí', cancelText: 'No',
                onConfirm: () => notify.success('Acción confirmada'),
                onCancel: () => notify.info('Acción cancelada'),
                allowOutsideClick: false, allowEscapeKey: false
            });
        });
        document.getElementById('btn-loading').addEventListener('click', () => {
            notify.loading('Procesando solicitud...', 'Por favor espera');
            setTimeout(() => { notify.closeLoading(); }, 3000);
        });
        document.getElementById('btn-custom').addEventListener('click', () => { notify.show({ type: 'info', title: 'Notificación Personalizada', message: 'Esta notificación se cierra automáticamente en 3 segundos.', buttonText: 'Entendido', timer: 3000 }); });
        document.getElementById('btn-confirm').addEventListener('click', () => {
            notify.show({
                type: 'warning', title: '¿Eliminar elemento?', message: 'Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar', cancelText: 'Cancelar',
                onConfirm: async () => { await new Promise((r) => setTimeout(r, 600)); notify.success('Elemento eliminado correctamente'); },
                onCancel: () => { notify.info('Operación cancelada'); },
                allowOutsideClick: false, allowEscapeKey: false
            });
        });

        document.getElementById('btn-toast-success').addEventListener('click', () => { notify.toastSuccess('Cambios guardados correctamente.', '¡Guardado!'); });
        document.getElementById('btn-toast-error').addEventListener('click', () => { notify.toastError('No se pudo conectar al servidor.', 'Error'); });
        document.getElementById('btn-toast-warning').addEventListener('click', () => { notify.toastWarning('Tu sesión expirará pronto.', 'Advertencia'); });
        document.getElementById('btn-toast-info').addEventListener('click', () => { notify.toastInfo('Hay una nueva actualización disponible.', 'Info'); });
        document.getElementById('btn-toast-question').addEventListener('click', () => { notify.toastQuestion('Nueva solicitud pendiente de revisión.', 'Revisión'); });

    } // FIN initDemo
});
