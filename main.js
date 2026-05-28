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
    const textToType = `Desde el momento en que entraste a mi vida me he sentido en un mundo tan maravilloso que añoro, con cada fibra de mi ser, pertenecer el resto de mi vida.\n\nAmor mío, te escribo esto para hacerte notar lo mucho que te amo. Que me encantas y fascinas cada parte de mi ser, mi alma, mi cuerpo y mi corazón.\n\nTú eres una chica tan magnífica que de verdad has hecho que mi mundo se vuelva lleno de color. Me encontraba desamparado, perdido y sin rumbo, y tú me devolviste las ganas de vivir y de esforzarme. En ti encontré la pieza más importante a mi maquinaria; contigo encontré la fuerza para esforzarme más allá de mis límites.\n\nEres el amor de mi vida, a quien admiro y amo con todo mi corazón. Te escribo esto para así dejarte en claro lo mucho que te amo, que te pienso y que te siento.\n\nComo había dicho antes, mis días se dividen así: 9 horas soñándote y 15 pensándote. Horas donde soy feliz y me hallo alegre y entusiasmado a cada momento en los que tú y yo estamos juntos.\n\nTe quiero por siempre en mi vida, te necesito por siempre en mi corazón. Tú que has devuelto a mi rostro una sonrisa tan dulce y llena de amor, tú que me haces respirar y latir mi corazón de maneras tan descontroladas, tú que me tienes en tus manos y a tus pies, que eres dueña de mi destino...\n\nTe amo tanto que aun así me quedo corto para describirlo, porque trasciende más de las palabras. Eres mi mundo, mi paz y mi mujer, eres mi todo y sin ti nada tendría sentido.`;

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
                const speed = (char === ',' || char === '.') ? 300 : (Math.random() * 20 + 30);
                typingTimeout = setTimeout(addNextChar, speed);
            } else {
                isTyping = false;
                setTimeout(() => {
                    if (isOpened) {
                        signature.classList.add('visible');
                        downloadBtns.classList.add('visible');
                    }
                }, 800);
            }
        }
        
        // Empieza a escribir 2.4s después del clic (tiempo suficiente para que la carta suba)
        typingTimeout = setTimeout(addNextChar, 2400);
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
            downloadBtns.classList.remove('visible');
            
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
            pdf.save("Carta_Para_Maia.pdf");
        } catch (err) {
            console.error(err);
            alert("Error al generar PDF.");
        } finally {
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
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Carta_Para_Maia.epub";
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Error al generar EPUB.");
        } finally {
            btnEpub.innerText = originalText;
            btnEpub.disabled = false;
        }
    });
});
