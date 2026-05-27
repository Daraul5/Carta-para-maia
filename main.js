document.addEventListener("DOMContentLoaded", () => {
    const waxSeal = document.getElementById('waxSeal');
    const envelope = document.getElementById('envelope');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const closeBtn = document.getElementById('closeBtn');
    const messageText = document.getElementById('messageText');
    const signature = document.getElementById('signature');

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
                    if (isOpened) signature.classList.add('visible');
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
            
            // Limpiar texto una vez la carta está bajando para que no desaparezca bruscamente
            setTimeout(() => {
                if (!isOpened) {
                    messageText.innerHTML = '';
                }
            }, 800);
        }
    });
});
