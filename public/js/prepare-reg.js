jQuery(document).ready(() => {
    $(".reg-btn").click(() => {
        let login = $("#login").val()
        let pass = $("#pass").val()
        let pass_reply = $("#pass-reply").val()
        let auto_auth = $("#auto_auth").is(":checked")

        if (!login) {
            $(".enter-login").show()
        } if (!pass) {
            $(".enter-pass").show()
        } if (!pass_reply) {
            $(".reply-pass").show()
        } if (pass != pass_reply) {
            $(".enter-pass").hide()
            $(".reply-pass").hide()
            $(".invalid-pass").show()
        } if (login && pass && pass_reply && pass == pass_reply) {
            $(".enter-login").hide()
            $(".enter-pass").hide()
            $(".reply-pass").hide()
            $(".invalid-pass").hide()

            jQuery.ajax({
                'url': '/reg',
                'method': 'post',
                'data': {
                    'login': login,
                    'pass': pass,
                    'auto_auth': auto_auth
                },
                'breforeSend': () => {
                    $(".reg-btn").prop("disabled", true)
                },
                'success': (data) => {
                    window.location = "/"
                },
                'complete': () => {
                    $(".reg-btn").prop("disabled", false)
                }
            })
        }
    })
})