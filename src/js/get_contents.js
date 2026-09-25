"use strict"

$(() => {
    // 起動時のファイル内容領域のフォントサイズを変更する
    $(".source_reader .body main .scroll")[0].style.fontSize = $(".source_reader .body .font-size input").val() + "pt"
    // フォントインプットが変更された際のフォントサイズ変更
    $(".source_reader .body .font-size input").on("change", e => {
        $(".source_reader .body main .scroll")[0].style.fontSize = e.target.value + "pt"
    })

    // GETメソッド、パラメータ
    const data = {
        name: null
    }

    // ファイルを読み込む 
    $(".source_reader").on("click", "li.file", e => {
        // console.log(e)
        let filename = ""
        if (e.target.nodeName == "SPAN"){
            filename = e.target.title
        }else{
            filename = e.target.firstElementChild.title
        }
        $(".source_reader .body main nav .name").text(filename)

        data.name = filename

        getContents(data)
    })

    $(".reload").on("click", e => {
        // console.log(e.target.dataset.target)
        switch (e.target.dataset.target) {
            case 'file-contents':
                if (data.name) {
                    getContents(data)
                }
                break;
            case 'folder-tree':
                // フォルダツリーを更新する
                loadTree()
                break;
        }
    })

    // ホイールの回転に合わせてinputの値を変更する
    $(".source_reader .body .font-size input").on("wheel", e => {
        e.preventDefault()
        let input = e.target
        let value = parseInt(input.value, 10) || 10
        if (e.originalEvent.deltaY > 0) {
            value = Math.min(value + 1, input.max)
        } else {
            value = Math.max(value - 1, input.min)
        }
        input.value = value
        $(".source_reader .body main .scroll")[0].style.fontSize = value + "pt"
    })
})
