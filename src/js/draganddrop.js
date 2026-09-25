$(e=>{
    let isDragging = false;
    let startX = 0;
    let startWidth = 0;

    const $splitLine = $('.source_reader .body .split_line');
    const $tree = $('.source_reader .body .tree');
    const $main = $('.source_reader .body .main');

    $splitLine.on('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startWidth = $tree.width();
        $(document.body).addClass('resizing');
        e.preventDefault();
    });

    $(document).on('mousemove', function(e) {
        if (!isDragging) return;
        let dx = e.clientX - startX;
        let newWidth = Math.max(100, startWidth + dx); // 最小幅100px
        $tree.css('width', newWidth + 'px');
        $main.css('grid-template-columns', `${newWidth}px 5px 1fr`);
    });

    $(document).on('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            $(document.body).removeClass('resizing');
        }
    });
})