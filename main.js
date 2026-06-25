document.addEventListener("DOMContentLoaded", () => {
    const waxSeal = document.getElementById('waxSeal');
    const envelope = document.getElementById('envelope');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const closeBtn = document.getElementById('closeBtn');
    const messageText = document.getElementById('messageText');
    const signature = document.getElementById('signature');
    const downloadBtns = document.getElementById('downloadBtns');
    const btnPdf = document.getElementById('btnPdf');
    const btnEpub = document.getElementById('btnEpub');

    // El mensaje dedicado a MAIA
    const textToType = `Desde que llegaste a mi vida, todo se esclareció. Salvaste a este corazón de una sumisión de tristeza; salvaste a este chico de una forma tan heroica que de verdad quiero hacértelo saber, mi amor, el porqué te admiro tanto. 

Siempre he sido alguien muy reservado, tranquilo y, como has visto, alguien muy sencillo; aficionado a conocer y explorar muchas cosas, pero siempre dentro de mí. Sin embargo, cuando te conocí, temía arruinarlo, pero confié en mí. Mi curiosidad me había hecho poner mi atención en ti. Cada día que pasaba, cada instante de interés y de notoriedad, comenzó fuerte, de una manera que solo yo conocía. 

Sin cuestionármelo, sin preguntarlo, simplemente decidí hablarte. Fue un trance, un sueño comenzar a hacerlo, y fue mucho más hermoso de lo que me imaginaba. Me encontré con un mundo nuevo, un mundo al que quise pertenecer. Tu precaución, pero al mismo tiempo tu consideración por mí, hizo que quisiera desnudar completamente mis intenciones por ti. Lo hice desde un inicio porque no quería que pasara lo que pasara, y que no supieras lo que quería. Un gesto quizás inocente fue bien recibido; una chica que se preguntaba por mí, se interesó también por ese gesto que simplemente le cautivó.

Admitiré, como he dicho, que desde antes quería, desde antes me parecías hermosa. Pero en esos instantes, lo que me cautivó fuiste tú: tu delicadeza, tu forma de ser y de serme sincera, de protegerte a ti. De verdad que me fascinó. Yo bajé toda mi guardia y decidí que tenía que ser ahí. 

Me mostré yo, el Raúl que siempre he sido, un chico al que fascinaste desde el primer momento y que no pudo evitar amarte; un Raúl que, ante todo, tomó valor para sentirlo y decirlo. Un Raúl que veía cómo la chica con la que tanto soñaba, en la que tanto había pensado y notado aun sin habernos cruzado antes, aceptaba felizmente ese sentimiento. 

Me hiciste sentir amado, me hiciste sentir en el lugar donde pertenezco. Me hiciste sentir todo en esta vida por primera vez y, de mi corazón, apartaste cualquier rastro de tristeza o de soledad. Entendí que ese día, una chica tan espectacular, tan noble, tierna y, sobre todo, llena de ilusión y de un amor que correspondía al mío, me acompañaría siempre. 

Ese día toda mi vida tuvo sentido. Ese día me salvaste, porque me demostraste valentía, una decisión y determinación que me hizo querer pertenecerte desde ese instante.

Te amo y te amaré toda mi vida, Maia, mi amor.`;
    let typingTimeout;
    let isTyping = false;
    let isOpened = false;

    function typeText() {
        messageText.innerHTML = '';
        signature.classList.remove('visible');
        isTyping = true;
        
        let i = 0;
        
        function addNextChar() {
            if (!isOpened) return; 
            
            if (i < textToType.length) {
                const char = textToType.charAt(i);
                
                if (char === '\n') {
                    messageText.innerHTML += '<br>';
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'typing-char';
                    messageText.appendChild(span);
                    
                    // Retraso minúsculo para la transición de opacidad
                    setTimeout(() => {
                        span.classList.add('visible');
                    }, 10);
                }
                
                i++;
                // Pausas más largas en comas y puntos para darle naturalidad
                // Escritura rápida (pausa de 100ms en puntuación y de 5ms a 15ms en letras)
                const speed = (char === ',' || char === '.') ? 50 : (Math.random() * 10 + 5);
                typingTimeout = setTimeout(addNextChar, speed);
            } else {
                isTyping = false;
                setTimeout(() => {
                    if (isOpened) {
                        signature.classList.add('visible');
                        downloadBtns.style.opacity = '1';
                        downloadBtns.style.pointerEvents = 'auto';
                    }
                }, 800);
            }
        }
        
        // Empieza a escribir 1.5s después del clic (tiempo suficiente para que la carta suba)
        typingTimeout = setTimeout(addNextChar, 1500);
    }

    waxSeal.addEventListener('click', () => {
        if (!isOpened) {
            isOpened = true;
            envelope.classList.add('is-open');
            envelopeWrapper.classList.add('is-open');
            typeText();
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOpened) {
            isOpened = false;
            
            clearTimeout(typingTimeout);
            
            envelope.classList.remove('is-open');
            envelopeWrapper.classList.remove('is-open');
            
            signature.classList.remove('visible');
            downloadBtns.style.opacity = '0';
            downloadBtns.style.pointerEvents = 'none';
            
            // Limpiar texto una vez la carta está bajando para que no desaparezca bruscamente
            setTimeout(() => {
                if (!isOpened) {
                    messageText.innerHTML = '';
                }
            }, 800);
        }
    });

    btnPdf.addEventListener('click', async (e) => {
        e.stopPropagation();
        const originalText = btnPdf.innerText;
        btnPdf.innerText = "Generando...";
        btnPdf.disabled = true;

        try {
            const { jsPDF } = window.jspdf;
            
            const letterContent = document.querySelector('.letter-content');
            const clone = letterContent.cloneNode(true);
            
            const cloneBtns = clone.querySelector('#downloadBtns');
            if (cloneBtns) cloneBtns.style.display = 'none';
            const cloneClose = clone.querySelector('#closeBtn');
            if (cloneClose) cloneClose.style.display = 'none';
            
            clone.style.position = 'absolute';
            clone.style.top = '-10000px';
            clone.style.left = '0';
            clone.style.height = 'auto'; 
            clone.style.width = '600px'; 
            clone.style.overflow = 'visible';
            clone.style.backgroundColor = '#fdfaf6'; 
            clone.style.padding = '50px';
            clone.style.boxSizing = 'border-box';
            clone.style.color = '#2c2420'; 
            clone.style.opacity = '1'; // IMPORTANTE: forzar visibilidad porque el CSS original requiere que esté dentro de envelope-wrapper 
            
            document.body.appendChild(clone);
            
            const canvas = await html2canvas(clone, { 
                scale: 2,
                backgroundColor: '#fdfaf6',
                useCORS: true
            });
            
            document.body.removeChild(clone);
            
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = canvas.width * 0.264583 / 2; 
            const pdfHeight = canvas.height * 0.264583 / 2;
            
            const pdf = new jsPDF({
                orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            const blob = pdf.output('blob');
            const file = new File([blob], "Carta_Para_Maia.pdf", { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            
            // Para iOS: Reemplazamos el botón con un enlace real para evitar problemas de "user gesture" expirado por el async
            const a = document.createElement('a');
            a.href = url;
            a.download = "Carta_Para_Maia.pdf";
            a.className = btnPdf.className;
            a.innerText = "¡Listo! Guardar PDF";
            a.id = "btnPdf";
            
            a.addEventListener('click', async (ev) => {
                ev.stopPropagation();
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    ev.preventDefault(); // Prevenir descarga si podemos usar el Share nativo
                    try {
                        await navigator.share({ title: 'Carta para Maia', files: [file] });
                    } catch (shareErr) {
                        // Fallback si cancela o falla el share
                        const fallback = document.createElement('a');
                        fallback.href = url;
                        fallback.download = "Carta_Para_Maia.pdf";
                        document.body.appendChild(fallback);
                        fallback.click();
                        document.body.removeChild(fallback);
                    }
                }
            });

            btnPdf.parentNode.replaceChild(a, btnPdf);

        } catch (err) {
            console.error(err);
            alert("Error al generar PDF: " + err.message);
            btnPdf.innerText = originalText;
            btnPdf.disabled = false;
        }
    });

    btnEpub.addEventListener('click', async (e) => {
        e.stopPropagation();
        const originalText = btnEpub.innerText;
        btnEpub.innerText = "Generando...";
        btnEpub.disabled = true;

        try {
            const zip = new JSZip();
            zip.file("mimetype", "application/epub+zip");
            
            const metaInf = zip.folder("META-INF");
            metaInf.file("container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`);

            const oebps = zip.folder("OEBPS");
            
            const paragraphs = textToType.split('\n\n').map(p => `<p>${p}</p>`).join('');
            
            const htmlContent = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Para Maia</title>
    <style>
        body { font-family: serif; text-align: left; padding: 20px; line-height: 1.6; color: #2c2420; background-color: #fdfaf6; }
        h1 { font-family: cursive; text-align: left; color: #720b29; font-size: 2em; margin-bottom: 30px; }
        p { font-size: 1.1em; }
        .signature { text-align: right; font-style: italic; font-family: cursive; margin-top: 40px; font-size: 1.5em; }
    </style>
</head>
<body>
    <h1>Maia amada mía,</h1>
    ${paragraphs}
    <p class="signature">Con todo mi amor, de parte de Raúl.</p>
</body>
</html>`;

            oebps.file("content.html", htmlContent);
            
            oebps.file("content.opf", `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:title>Para Maia</dc:title>
        <dc:language>es</dc:language>
        <dc:creator>Raúl</dc:creator>
        <dc:identifier id="pub-id">urn:uuid:maia-letter-1</dc:identifier>
    </metadata>
    <manifest>
        <item id="html" href="content.html" media-type="application/xhtml+xml"/>
    </manifest>
    <spine>
        <itemref idref="html"/>
    </spine>
</package>`);

            const blob = await zip.generateAsync({type: "blob", mimeType: "application/epub+zip"});
            const file = new File([blob], "Carta_Para_Maia.epub", { type: "application/epub+zip" });
            const url = URL.createObjectURL(blob);
            
            // Para iOS: Enlace real
            const a = document.createElement('a');
            a.href = url;
            a.download = "Carta_Para_Maia.epub";
            a.className = btnEpub.className;
            a.innerText = "¡Listo! Guardar EPUB";
            a.id = "btnEpub";
            
            a.addEventListener('click', async (ev) => {
                ev.stopPropagation();
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    ev.preventDefault();
                    try {
                        await navigator.share({ title: 'Carta para Maia', files: [file] });
                    } catch (shareErr) {
                        const fallback = document.createElement('a');
                        fallback.href = url;
                        fallback.download = "Carta_Para_Maia.epub";
                        document.body.appendChild(fallback);
                        fallback.click();
                        document.body.removeChild(fallback);
                    }
                }
            });

            btnEpub.parentNode.replaceChild(a, btnEpub);

        } catch (err) {
            console.error(err);
            alert("Error al generar EPUB: " + err.message);
            btnEpub.innerText = originalText;
            btnEpub.disabled = false;
        }
    });
});
