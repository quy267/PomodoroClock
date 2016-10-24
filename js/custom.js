/**
 * Created by MyPC on 19/10/2016.
 */
$(document).ready(function () {

    var pauseMode = false;
    var initSuccess = false;
    var sessionTime = new Date();
    var breakTime = new Date();
    var sessionTotal, breakTotal;
    var sessionInterval, breakInterval;

    var setClock = function (timeObj) {
        var clockMins = timeObj.getMinutes();
        var clockSeconds = timeObj.getSeconds();

        if (clockMins.toString().length == 1) {
            clockMins = "0" + clockMins;
        }

        if (clockSeconds.toString().length == 1) {
            clockSeconds = "0" + clockSeconds;
        }
        $('.minutes').text(clockMins);
        $('.seconds').text(clockSeconds);
    };

    var innit = function () {
        $('.type').text("SESSION");
        $('.clock').css('background', 'linear-gradient(0deg, #1de9b6 0%, #1de9b6 100%, #004d40 100%)');
        pauseMode = false;
        var sessionInput = $('#session');
        var breakInput = $('#break');
        if (!sessionInput.hasClass('invalid') && !breakInput.hasClass('invalid')) {
            initSuccess = true;
            sessionTime.setMinutes(sessionInput.val());
            sessionTime.setSeconds(0);
            sessionTotal = sessionTime.getMinutes() * 60 + sessionTime.getSeconds();
            breakTime.setMinutes(breakInput.val());
            breakTime.setSeconds(0);
            breakTotal = breakTime.getMinutes() * 60 + breakTime.getSeconds();
            setClock(sessionTime);
            $('#session,#break').prop('disabled', false);
        }
        else {
            initSuccess = false;
        }
    };

    var pause = function () {
        clearInterval(sessionInterval);
        clearInterval(breakInterval);
        $('#pause').addClass('hide');
        $('#play').removeClass('hide');
    }

    $('#pause').on('click', function () {
        pause();
    });

    $('#stop').on('click', function () {
        pause();
        innit();
    });

    function playBreak() {
        $('.type').text('BREAK');
        breakInterval = setInterval(function () {
            if (breakTime.getMinutes() == 0 && breakTime.getSeconds() == 0) {
                clearInterval(breakInterval);
                pause();
                innit();
            }
            else if (sessionTime.getMinutes() == 0 && sessionTime.getSeconds() == 0) {
                breakTime.setSeconds(breakTime.getSeconds() - 1);
                let total = breakTime.getMinutes() * 60 + breakTime.getSeconds();
                let percent = 100 - (total / breakTotal) * 100;
                $('.clock').css('background', ' linear-gradient(0deg, #1de9b6 0%, #1de9b6 ' + percent + '%, #004d40 ' + percent + '%)');
                setClock(breakTime);
            }
        }, 1000);
    }

    var playSession = function () {
        $('.type').text('SESSION');
        sessionInterval = setInterval(function () {
            if (sessionTime.getMinutes() == 0 && sessionTime.getSeconds() == 0) {
                clearInterval(sessionInterval);
                setClock(breakTime);
                playBreak();
            } else {
                sessionTime.setSeconds(sessionTime.getSeconds() - 1);
                let total = sessionTime.getMinutes() * 60 + sessionTime.getSeconds();
                let percent = (total / sessionTotal) * 100;
                $('.clock').css('background', ' linear-gradient(0deg, #1de9b6 0%, #1de9b6 ' + percent + '%, #004d40 ' + percent + '%)');
                setClock(sessionTime);
            }
        }, 1000);
    }

    $('#play').on('click', function () {
        if (!pauseMode) {
            innit();
        }
        if (initSuccess) {
            if (sessionTime.getMinutes() == 0 && sessionTime.getSeconds() == 0) {
                playBreak();
            }
            else {
                playSession();
            }
            pauseMode = true;
            $('#play').addClass('hide');
            $('#pause').removeClass('hide');
            $('#session,#break').prop('disabled', true);
        }
    })

});