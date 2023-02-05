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

            jQuery.ajax({
                "url": "/login",
                "method": "post",
                "data": {
                    'login': login,
                    'pass': pass,
                    'remember_me': remember_me
                },
                "beforeSend": () => {
                    $(".login-btn").prop("disabled", true)
                },
                "success": (data) => {
                    if (data == "success")
                        window.location = "/"
                }, 
                "complete": () => {
                    $(".login-btn").prop("disabled", false)
                }
            })
        }
        
    })
})