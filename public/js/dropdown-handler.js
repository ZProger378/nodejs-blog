jQuery(document).ready(() => {
    $(".dropdown-toggle").click(() => {
        $(".dropdown-menu").show()
    })
    $(".dropdown-menu").mouseleave(() => {
        $(".dropdown-menu").hide()
    })
})