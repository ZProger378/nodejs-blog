jQuery(document).ready(() => {
    $(".create_article").click(() => {
        let title = $("#article_title").val()
        let text = $("#article_text").val()
        let user = $(".username").text()
        jQuery.ajax({
            'url': 'create_article',
            'method': 'post',
            'data': {
                'title': title,
                'text': text,
                'user': user
            },
            'beforeSend': () => {
                $(".create_article").prop("disabled", true)
            },
            'success': (data) => {
                alert(data)
            },
            'complete': () => {
                $(".create_article").prop("disabled", false)
            }
        })
    })
})