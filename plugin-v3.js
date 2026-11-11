
(function () {
    'use strict';

    var ID = 'lampa_ptbr_audio_v3';

    if (window[ID]) return;
    window[ID] = true;

    function isPortuguese(track) {
        var values = [
            track.language,
            track.lang,
            track.label,
            track.name
        ];

        for (var i = 0; i < values.length; i++) {
            var value = String(values[i] || '')
                .toLowerCase()
                .replace(/_/g, '-')
                .trim();

            if (
                /(^|[^a-z])(pt-br|por-br|pob)([^a-z]|$)/.test(value) ||
                value.indexOf('portuguese brazilian') !== -1 ||
                value.indexOf('brazilian portuguese') !== -1 ||
                value.indexOf('português brasileiro') !== -1 ||
                value.indexOf('portugues brasileiro') !== -1
            ) {
                return true;
            }
        }

        return false;
    }

    function selectAudio() {
        try {
            var video = Lampa.PlayerVideo.video();

            if (!video || !video.audioTracks) return false;

            var tracks = video.audioTracks;

            for (var i = 0; i < tracks.length; i++) {
                if (isPortuguese(tracks[i])) {
                    for (var j = 0; j < tracks.length; j++) {
                        tracks[j].enabled = (j === i);
                    }

                    console.log('[PT-BR V3] Áudio português selecionado');
                    return true;
                }
            }
        } catch (error) {
            console.log('[PT-BR V3] Erro:', error);
        }

        return false;
    }

    Lampa.Player.listener.follow('start', function () {
        var attempts = 0;

        function check() {
            attempts++;

            if (selectAudio()) return;

            if (attempts < 15) {
                setTimeout(check, 1000);
            }
        }

        check();
    });

    console.log('[PT-BR V3] Plugin carregado');

})();
