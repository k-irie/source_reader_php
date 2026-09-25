"use strict"

const lineByLineHighilght = (language, body) => {
    let state = null
    const output = []
    const bodySplit = body.split('\n')
    let maxLength = String(bodySplit.length).length
    for (let line = 0; line < bodySplit.length; line++) {
        const row = bodySplit[line]
        const result = hljs.highlight(language, row, true, state)
        const setLineNumber = `<div style="float: left; width: ${maxLength * 0.6 + 0.5}em;"><span style="float: right; padding-right: 5px;">${line + 1}:</span></div>`
        let oneLine
        if (result.value.length === 0) {
            oneLine = "</br>"
        } else {
            oneLine = result.value
        }
        let setLine = `<div class="lineNumber">${setLineNumber}<span class="line-value">${oneLine}</span></div>`
        state = result.top
        output.push(setLine)
    }
    return output.join('')
}

const getContents = data => {
    $(".loading").removeClass("hidden")
    $(".source_reader .body main [name='preview']").attr("disabled", true)
    const jqxhr = $.ajax({
        url: "get_contents" + window.location.search,
        dataType: "json",
        data: data
    })

    jqxhr.done(result => {
        // 取得したJSONデータを処理
        console.log(result)

        let html = ''
        if (result.mime_type && result.mime_type.startsWith("image")) {
            html = `<img src="${result.source_contents}">`
        } else {
            if (result.filetype === "unknown") {
                result.filetype = "plaintext"
            }
            if (result.mime_type == 'application/json'){
                result.source_contents = decodeURIComponent(atob(result.source_contents.split(",")[1]))
            }

            switch (result.filetype) {
                case "markdown":
                    $(".source_reader .body main [name='preview']").removeAttr("disabled")
                    if ($("input[name='preview']").prop("checked")) {
                        html = marked.parse(result.source_contents)
                    } else {
                        html = lineByLineHighilght(result.filetype, result.source_contents)
                    }
                    break;
                case "Microsoft Excel":
                    html = 'not view';
                    break;
                default:
                    $("input[name='preview']").prop("checked", false)
                    // html = hljs.highlight(result.source_contents, { language: result.filetype }).value
                    html = lineByLineHighilght(result.filetype, result.source_contents)
            }
        }
        if (result['selectable'] == "text") {
            $(".line-value").addClass("selectable")
        } else {
            $(".line-value").removeClass("selectable")
        }
        $(".source_reader .body .scroll").eq(0).html(`<pre><code class="hljs">${html}</code></pre>`)
        $(".source_reader .body .filetype").eq(0).text(result.filetype + " - " + result.mime_type)
    })
    jqxhr.fail((a, b, c) => {
        console.log(a, b, c)
    })
    jqxhr.always(() => {
        $(".loading").addClass("hidden")
    })
}

const setCss = css => {
    const css_href = $("[href^='highlight']").attr("href").split("/")
    css_href.pop()
    css_href.push(css)
    $("[href^='highlight']").attr("href", css_href.join("/"))
}

const getOptions = data => {
    const dirs = []
    const files = []

    const keys = Object.keys(data)

    keys.forEach(k => {
        if (Array.isArray(data[k]) || data[k].constructor.name == 'Object') {
            dirs[k] = getOptions(data[k])
        } else {
            files.push(data[k])
        }
    })

    return { d: dirs, f: files }
}

const buildTree = (blanch, parent) => {
    const result = []

    const keys = Object.keys(blanch.d)
    keys.forEach(k => {
        const li = $("<li></li>").addClass('folder').addClass('close')
        li.append($("<span></span>").attr({
            class: "name",
            title: parent + k
        }).text(k))
        const ul = $("<ul></ul>")
        ul.html(buildTree(blanch.d[k], parent + k))
        li.append(ul)
        result.push(li[0].outerHTML)
    })

    blanch.f.forEach(f => {
        const li = $("<li></li>").addClass('file')
        li.append($("<span></span>").attr({
            class: "name",
            title: parent + f
        }).text(f))
        result.push(li[0].outerHTML)
    })
    return result.join("\n")
}

const loadTree = () => {
    // 
    $(".loading").removeClass("hidden")
    const jqxhr = $.getJSON("get_folder" + window.location.search, data => {
        $(".tree nav span.name").text(data.name)
        folderTree.data = data.folders
        folderTree.serial = data.serial

        // const dirs = getOptions(data)
        const dirs = getOptions(folderTree.data)
        // console.log(dirs)
        const tree = buildTree(dirs, "")
        // console.log(tree)
        $("#root").html(tree)

        $(".loading").addClass("hidden")
    })
    jqxhr.always(() => {
        $(".loading").addClass("hidden")
    })
}