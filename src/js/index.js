"use strict"

const config = {
    env: null
}

// 
const scheduler = new Scheduler()

scheduler.start()


let folderTree = {
    data: null,
    serial: ''
}

$(e => {
    // 実行環境データ読み取り
    $.getJSON("get_env" + window.location.search, data => {
        data.css_files.forEach(e => {
            console.log(e)
            $(".source_reader select[name='cssfile']").append($(`<option value='${e}'>${e}</option>`))
        })
        setCss($("select[name='cssfile']").val())
    })

    // フォルダツリーを更新する
    loadTree()

    // CSSファイルを選択する
    $("select[name='cssfile']").on("change", e => {
        setCss(e.target.value)
    })

    $("select[name='font-family']").on("change", e => {
        document.documentElement.style.fontFamily = e.target.value
        $(".source_reader .body main code")[0].style.fontFamily = e.target.value
    })

    $("input[name='preview']").on("change", e => {
        // console.log(e)
        const filename = $(".source_reader main nav .name").text()

        if (filename) {
            $(".source_reader .body main nav .name").text(filename)

            getContents({ name: filename })
        }
    })

    // フォルダオープン・クローズ
    $(".source_reader").on("click", "li.folder", e => {
        // console.log("click")
        let elem
        if (e.target.localName == 'span') {
            elem = e.target.parentElement
        } else {
            elem = e.target
        }
        $(elem).toggleClass('close')

        return false
    })
})