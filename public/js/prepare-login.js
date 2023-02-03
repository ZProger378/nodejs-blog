// Если для страница загружена корректно
jQuery(document).ready(() => {
    // Обработчик нажатия на кнопку
    $(".login-btn").click(() => {
        // Получение данных с формы
        let login = $("#login").val()
        let pass = $("#pass").val()
        let remember_me = $("#remember").is(':checked')

        // Валидация формы
        if (!login) {
            $(".enter-login").show()
        } if (!pass) {
            $(".enter-pass").show()
        } if (login && pass) {  // Если данные корректы
            // Прячем надписи о просьбе ввести данные
            $(".enter-login").hide()
            $(".enter-pass").hide()
            // Отправка формы на сервер

            /*
                Тут будет обработчик ответа с сервера
            */
        }
        
    })
})